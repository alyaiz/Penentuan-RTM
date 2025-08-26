<?php

namespace App\Http\Controllers;

use App\Models\Rtm;
use App\Models\Criteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;

class RtmImportController extends Controller
{
  private $criteriaMapping;

  public function __construct()
  {
    $this->loadCriteriaMapping();
  }

  private function loadCriteriaMapping()
  {
    $criterias = Criteria::all()->keyBy(function ($item) {
      return $item->type . '|' . $item->name;
    });

    $this->criteriaMapping = $criterias;
  }

  public function import(Request $request)
  {
    try {
      $validator = Validator::make($request->all(), [
        'excel_file' => 'required|file|mimes:xlsx,xls|max:10240',
      ]);

      if ($validator->fails()) {
        return response()->json([
          'success' => false,
          'message' => 'File tidak valid: ' . $validator->errors()->first()
        ], 422);
      }

      $file = $request->file('excel_file');

      $spreadsheet = IOFactory::load($file->getPathname());
      $worksheet = $spreadsheet->getActiveSheet();
      $rows = $worksheet->toArray();

      if (!empty($rows)) {
        array_shift($rows);
      }

      $result = [
        'created' => 0,
        'updated' => 0,
        'failed' => 0,
        'skipped' => 0,
        'errors' => []
      ];

      DB::beginTransaction();

      foreach ($rows as $index => $row) {
        $excelRowNumber = $index + 2;

        try {
          if ($this->isEmptyRow($row)) {
            $result['skipped']++;
            continue;
          }

          $processedData = $this->processRow($row, $excelRowNumber);

          if ($processedData === null) {
            $result['skipped']++;
            continue;
          }

          $processedData['user_id'] = Auth::id();

          $rtm = Rtm::updateOrCreate(
            ['nik' => $processedData['nik']],
            $processedData
          );

          if ($rtm->wasRecentlyCreated) {
            $result['created']++;
          } else {
            $result['updated']++;
            $result['errors'][] = "Baris {$excelRowNumber}: Data dengan NIK {$processedData['nik']} - {$processedData['name']} berhasil diperbarui";
          }
        } catch (\Exception $e) {
          $result['failed']++;
          $nik = trim($row[1] ?? '');
          $name = trim($row[2] ?? '');

          $nikInfo = '';
          if (!empty($nik) && !empty($name)) {
            $nikInfo = " (NIK: {$nik} - {$name})";
          }

          $result['errors'][] = "Baris {$excelRowNumber}{$nikInfo}: " . $e->getMessage();

          Log::error("Import error at row {$excelRowNumber}: " . $e->getMessage(), [
            'row_data' => $row,
            'raw_nik' => $row[1] ?? null,
            'raw_name' => $row[2] ?? null,
            'nik' => $nik,
            'name' => $name,
            'excel_row_number' => $excelRowNumber,
            'array_index' => $index,
            'total_columns' => count($row),
            'user_id' => Auth::id()
          ]);
        }
      }

      DB::commit();

      $message = sprintf(
        'Import berhasil diselesaikan. %d data baru, %d data diperbarui, %d gagal, %d dilewati',
        $result['created'],
        $result['updated'],
        $result['failed'],
        $result['skipped']
      );

      return response()->json([
        'success' => true,
        'message' => $message,
        'result' => $result
      ]);
    } catch (\Exception $e) {
      DB::rollback();
      Log::error('Excel import failed: ' . $e->getMessage(), [
        'user_id' => Auth::id(),
        'file_name' => $request->file('excel_file')->getClientOriginalName() ?? 'unknown'
      ]);

      return response()->json([
        'success' => false,
        'message' => 'Terjadi kesalahan saat memproses file: ' . $e->getMessage()
      ], 500);
    }
  }

  private function isEmptyRow($row)
  {
    return empty(array_filter($row, function ($cell) {
      return !empty(trim($cell));
    }));
  }

  private function processRow($row, $rowNumber)
  {
    if (count($row) < 12) {
      throw new \Exception("Data tidak lengkap - diperlukan minimal 12 kolom");
    }

    $nik = trim($row[1] ?? '');
    $name = trim($row[2] ?? '');
    $address = trim($row[3] ?? '');

    if (empty($nik)) {
      throw new \Exception("NIK tidak boleh kosong");
    }

    if (strlen($nik) !== 16 || !is_numeric($nik)) {
      throw new \Exception("NIK harus 16 digit angka");
    }

    if (empty($name)) {
      throw new \Exception("Nama tidak boleh kosong");
    }

    $criteriaTypes = [
      'penghasilan' => trim($row[4] ?? ''),
      'pengeluaran' => trim($row[5] ?? ''),
      'tempat_tinggal' => trim($row[6] ?? ''),
      'status_kepemilikan_rumah' => trim($row[7] ?? ''),
      'kondisi_rumah' => trim($row[8] ?? ''),
      'aset_yang_dimiliki' => trim($row[9] ?? ''),
      'transportasi' => trim($row[10] ?? ''),
      'penerangan_rumah' => trim($row[11] ?? '')
    ];

    $processedData = [
      'nik' => $nik,
      'name' => $name,
      'address' => $address
    ];

    foreach ($criteriaTypes as $type => $value) {
      if (empty($value)) {
        throw new \Exception("Kriteria {$type} tidak boleh kosong");
      }

      $criteriaKey = $type . '|' . $value;
      $criteria = $this->criteriaMapping->get($criteriaKey);

      if (!$criteria) {
        throw new \Exception("Kriteria {$type} dengan nilai '{$value}' tidak ditemukan");
      }

      $processedData[$type . '_id'] = $criteria->id;
    }

    return $processedData;
  }

  public function downloadTemplate()
  {
    try {
      $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
      $worksheet = $spreadsheet->getActiveSheet();

      $headers = [
        'No',
        'NIK',
        'Nama',
        'Alamat',
        'Penghasilan Perbulan',
        'Pengeluaran Perbulan',
        'Tempat Tinggal',
        'Status Kepemilikan Rumah',
        'Kondisi Rumah',
        'Aset Yang Dimiliki',
        'Transportasi',
        'Penerangan Rumah'
      ];

      foreach ($headers as $col => $header) {
        $worksheet->setCellValueByColumnAndRow($col + 1, 1, $header);
      }

      $sampleData = [
        [1, '3523155058100003', 'SRIYATUN', 'DSN JARUM RT 1 RW 16', '> Rp. 2.500.000', 'Rp. 2.000.001 - Rp. 2.500.000', 'Milik sendiri', 'Milik Sendiri/Sewa', 'Dinding tembok & lantai keramik', 'Motor', 'Motor > 1 buah kondisi baik', 'Listrik > 900 watt'],
        [2, '3523155511820002', 'SITI MUNAWAROH', 'DSN JARUM RT 1 RW 16', 'Rp. 2.000.001 - Rp. 2.500.000', 'Rp. 1.500.001 - Rp. 2.000.000', 'Mengontrak', 'Milik Orang Tua/Warisan', 'Dinding tembok & lantai ubin', 'Sepeda', 'Jalan kaki / sepeda / motor seadanya', 'Listrik 900 watt']
      ];

      foreach ($sampleData as $rowIndex => $rowData) {
        foreach ($rowData as $col => $value) {
          $worksheet->setCellValueByColumnAndRow($col + 1, $rowIndex + 2, $value);
        }
      }

      $headerStyle = [
        'font' => ['bold' => true],
        'fill' => [
          'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
          'startColor' => ['rgb' => 'E2EFDA']
        ]
      ];

      $worksheet->getStyle('A1:L1')->applyFromArray($headerStyle);

      foreach (range('A', 'L') as $col) {
        $worksheet->getColumnDimension($col)->setAutoSize(true);
      }

      $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
      $fileName = 'template_import_rtm.xlsx';
      $tempFile = tempnam(sys_get_temp_dir(), $fileName);
      $writer->save($tempFile);

      return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    } catch (\Exception $e) {
      Log::error('Template download failed: ' . $e->getMessage());
      return response()->json([
        'success' => false,
        'message' => 'Gagal membuat template: ' . $e->getMessage()
      ], 500);
    }
  }
}
