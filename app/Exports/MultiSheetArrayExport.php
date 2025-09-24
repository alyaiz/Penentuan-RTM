<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class MultiSheetArrayExport implements WithMultipleSheets
{
  protected $sheetsData;

  public function __construct(array $sheetsData)
  {
    $this->sheetsData = $sheetsData;
  }

  public function sheets(): array
  {
    $sheets = [];

    foreach ($this->sheetsData as $sheetName => $sheetData) {
      $sheets[] = new SingleSheetExport(
        $sheetName,
        $sheetData['headers'],
        $sheetData['data'],
        $sheetData['info'] ?? []
      );
    }

    return $sheets;
  }
}

class SingleSheetExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths, WithTitle
{
  protected $title;
  protected $headers;
  protected $data;
  protected $info;

  public function __construct($title, $headers, $data, $info = [])
  {
    $this->title = $title;
    $this->headers = $headers;
    $this->data = $data;
    $this->info = $info;
  }

  public function title(): string
  {
    return $this->title;
  }

  public function headings(): array
  {
    $headings = [];

    if (!empty($this->info)) {
      $headings[] = ['Analisis Sensitivitas (MCR) — SAW & WP'];
      $headings[] = ['Dicetak: ' . now()->format('d/m/Y H:i:s')];
      $headings[] = [''];

      foreach ($this->info as $infoLine) {
        $headings[] = [$infoLine];
      }

      $headings[] = [''];
    }

    $headings[] = $this->headers;

    return $headings;
  }

  public function array(): array
  {
    return $this->data;
  }

  public function columnWidths(): array
  {
    return [
      'A' => 35,  // Kriteria
      'B' => 10,  // Δ Bobot
      'C' => 18,  // Δ% SAW
      'D' => 18,  // Δ% WP
    ];
  }

  public function styles(Worksheet $sheet)
  {
    $infoRowCount = count($this->info) + 3;
    $headerRow = $infoRowCount + 2;
    $dataStartRow = $headerRow + 1;
    $totalRows = $dataStartRow + count($this->data) - 1;

    $sheet->mergeCells('A1:' . chr(64 + count($this->headers)) . '1');
    $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
    $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    for ($i = 2; $i <= $infoRowCount + 1; $i++) {
      $cellValue = $sheet->getCell('A' . $i)->getValue();
      if (!empty($cellValue)) {
        $sheet->getStyle('A' . $i)->getFont()->setSize(10);
        if (
          strpos($cellValue, ':') !== false ||
          strpos($cellValue, 'Informasi') !== false ||
          strpos($cellValue, 'Detail') !== false ||
          strpos($cellValue, 'Kesimpulan') !== false
        ) {
          $sheet->getStyle('A' . $i)->getFont()->setBold(true);
        }
      }
    }

    $headerRange = 'A' . $headerRow . ':' . chr(64 + count($this->headers)) . $headerRow;
    $sheet->getStyle($headerRange)->applyFromArray([
      'font' => ['bold' => true, 'color' => ['rgb' => '000000']],
      'fill' => [
        'fillType' => Fill::FILL_SOLID,
        'startColor' => ['rgb' => 'E9ECEF']
      ],
      'alignment' => [
        'horizontal' => Alignment::HORIZONTAL_CENTER,
        'vertical' => Alignment::VERTICAL_CENTER
      ],
      'borders' => [
        'allBorders' => ['borderStyle' => Border::BORDER_THIN]
      ]
    ]);

    if (count($this->data) > 0) {
      $dataRange = 'A' . $dataStartRow . ':' . chr(64 + count($this->headers)) . $totalRows;
      $sheet->getStyle($dataRange)->applyFromArray([
        'borders' => [
          'allBorders' => ['borderStyle' => Border::BORDER_THIN]
        ],
        'alignment' => [
          'vertical' => Alignment::VERTICAL_CENTER
        ]
      ]);

      $sheet->getStyle('B' . $dataStartRow . ':B' . $totalRows)
        ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

      $sheet->getStyle('C' . $dataStartRow . ':D' . $totalRows)
        ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

      $sheet->getStyle('A' . $totalRows . ':D' . $totalRows)
        ->getFont()->setBold(true);

      $sheet->getStyle('A' . $totalRows . ':D' . $totalRows)->applyFromArray([
        'fill' => [
          'fillType' => Fill::FILL_SOLID,
          'startColor' => ['rgb' => 'F8F9FA']
        ]
      ]);

      $sheet->mergeCells("A{$totalRows}:B{$totalRows}");
    }

    return [];
  }
}
