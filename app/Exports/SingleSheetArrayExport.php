<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class SingleSheetArrayExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths
{
  protected $headers;
  protected $data;
  protected $method;
  protected $filters;

  public function __construct($headers, $data, $method = 'SAW & WP', $filters = [])
  {
    $this->headers = $headers;
    $this->data = $data;
    $this->method = strtoupper($method);
    $this->filters = $filters;
  }

  public function headings(): array
  {
    $headings = [];
    $headings[] = ['HASIL PERHITUNGAN (' . $this->method . ')'];
    $headings[] = ['Dicetak: ' . now()->format('d/m/Y H:i:s')];
    $headings[] = [''];

    if (!empty($this->filters['status'])) {
      $headings[] = ['Filter Status: ' . ucfirst($this->filters['status'])];
    } else {
      $headings[] = ['Filter Status: Semua'];
    }

    $headings[] = ['Total Data: ' . count($this->data)];
    $headings[] = [''];
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
      'A' => 8,   // No
      'B' => 20,  // NIK
      'C' => 30,  // Nama
      'D' => 25,  // Alamat
      'E' => 12,  // SAW
      'F' => 18,  // Status SAW
      'G' => 12,  // WP
      'H' => 18,  // Status WP
    ];
  }

  public function styles(Worksheet $sheet)
  {
    $headerRow = 7;
    $dataStartRow = 8;
    $dataEndRow = $dataStartRow + count($this->data) - 1;

    $sheet->mergeCells('A1:H1');
    $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
    $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    for ($i = 2; $i <= 6; $i++) {
      $cellValue = $sheet->getCell('A' . $i)->getValue();
      if (!empty($cellValue)) {
        $sheet->getStyle('A' . $i)->getFont()->setSize(10);
        if (strpos($cellValue, ':') !== false) {
          $sheet->getStyle('A' . $i)->getFont()->setBold(true);
        }
      }
    }

    $headerRange = 'A' . $headerRow . ':H' . $headerRow;
    $sheet->getStyle($headerRange)->applyFromArray([
      'font' => ['bold' => true, 'color' => ['rgb' => '000000']],
      'fill' => [
        'fillType' => Fill::FILL_SOLID,
        'startColor' => ['rgb' => 'F9FAFB']
      ],
      'alignment' => [
        'horizontal' => Alignment::HORIZONTAL_CENTER,
        'vertical' => Alignment::VERTICAL_CENTER
      ]
    ]);

    if (count($this->data) > 0) {
      $fullTableRange = 'A' . $headerRow . ':H' . $dataEndRow;
      $sheet->getStyle($fullTableRange)->applyFromArray([
        'borders' => [
          'allBorders' => [
            'borderStyle' => Border::BORDER_THIN,
            'color' => ['rgb' => '000000']
          ]
        ]
      ]);

      $dataRange = 'A' . $dataStartRow . ':H' . $dataEndRow;
      $sheet->getStyle($dataRange)->applyFromArray([
        'alignment' => [
          'vertical' => Alignment::VERTICAL_CENTER
        ]
      ]);

      $sheet->getStyle('A' . $dataStartRow . ':A' . $dataEndRow)
        ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

      $sheet->getStyle('E' . $dataStartRow . ':E' . $dataEndRow)
        ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
      $sheet->getStyle('G' . $dataStartRow . ':G' . $dataEndRow)
        ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

      for ($row = $dataStartRow; $row <= $dataEndRow; $row++) {
        // Status SAW (kolom F)
        $statusSaw = $sheet->getCell('F' . $row)->getValue();
        if ($statusSaw === 'Miskin') {
          $sheet->getStyle('F' . $row)->applyFromArray([
            'fill' => [
              'fillType' => Fill::FILL_SOLID,
              'startColor' => ['rgb' => 'FFDF20']
            ]
          ]);
        } elseif ($statusSaw === 'Tidak Miskin') {
          $sheet->getStyle('F' . $row)->applyFromArray([
            'fill' => [
              'fillType' => Fill::FILL_SOLID,
              'startColor' => ['rgb' => '05DF72']
            ]
          ]);
        }

        // Status WP (kolom H)
        $statusWp = $sheet->getCell('H' . $row)->getValue();
        if ($statusWp === 'Miskin') {
          $sheet->getStyle('H' . $row)->applyFromArray([
            'fill' => [
              'fillType' => Fill::FILL_SOLID,
              'startColor' => ['rgb' => 'FFDF20']
            ]
          ]);
        } elseif ($statusWp === 'Tidak Miskin') {
          $sheet->getStyle('H' . $row)->applyFromArray([
            'fill' => [
              'fillType' => Fill::FILL_SOLID,
              'startColor' => ['rgb' => '05DF72']
            ]
          ]);
        }
      }
    }

    return [];
  }
}
