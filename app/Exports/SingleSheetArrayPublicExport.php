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

class SingleSheetArrayPublicExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths
{
  protected $headers;
  protected $data;
  protected $method;
  protected $filters;

  public function __construct($headers, $data, $method, $filters = [])
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
      'B' => 30,  // Nama
      'C' => 30,  // Alamat
    ];
  }

  public function styles(Worksheet $sheet)
  {
    $headerRow = 6;
    $dataStartRow = 7;
    $dataEndRow = $dataStartRow + count($this->data) - 1;

    $sheet->mergeCells('A1:C1');
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

    $headerRange = 'A' . $headerRow . ':C' . $headerRow;
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
      $fullTableRange = 'A' . $headerRow . ':C' . $dataEndRow;
      $sheet->getStyle($fullTableRange)->applyFromArray([
        'borders' => [
          'allBorders' => [
            'borderStyle' => Border::BORDER_THIN,
            'color' => ['rgb' => '000000']
          ]
        ]
      ]);

      $dataRange = 'A' . $dataStartRow . ':C' . $dataEndRow;
      $sheet->getStyle($dataRange)->applyFromArray([
        'alignment' => [
          'vertical' => Alignment::VERTICAL_CENTER
        ]
      ]);

      $sheet->getStyle('A' . $dataStartRow . ':A' . $dataEndRow)
        ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    }

    return [];
  }
}
