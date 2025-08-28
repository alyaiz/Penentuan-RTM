<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <title>Hasil SAW & WP</title>
  <style>
    * {
      font-family: DejaVu Sans, Arial, Helvetica, sans-serif;
      font-size: 12px;
      line-height: 1.4;
    }

    h1 {
      font-size: 18px;
      margin: 0 0 8px 0;
      text-align: center;
      color: #333;
      border-bottom: 2px solid #333;
      padding-bottom: 8px;
    }

    .muted {
      color: #666;
      margin-bottom: 16px;
      text-align: center;
      font-style: italic;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
    }

    th,
    td {
      border: 1px solid rgb(229, 231, 235);
      padding: 8px 10px;
      text-align: left;
    }

    th {
      background: rgb(249, 250, 251);
      font-weight: bold;
      color: #333;
    }

    td.num {
      font-variant-numeric: tabular-nums;
    }

    .chip-ok {
      background: #05df72;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .chip-warn {
      background: #ffdf20;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .no-data {
      text-align: center;
      color: #999;
      padding: 14px;
      font-style: italic;
    }
  </style>
</head>

<body>
  <h1>Hasil Perhitungan ({{ strtoupper($metode ?? '-') }})</h1>
  <div class="muted">
    Dicetak: {{ $printed_at ?? '-' }}
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 10%;">No</th>
        <th style="width: 40%;">Nama</th>
        <th style="width: 50%;">Alamat</th>
      </tr>
    </thead>
    <tbody>
      @forelse ($rows as $index => $row)
        <tr>
          <td>{{ $index + 1 }}</td>
          <td>{{ $row['nama'] ?? '-' }}</td>
          <td>{{ $row['alamat'] ?? '-' }}</td>
        </tr>
      @empty
        <tr>
          <td colspan="7" class="no-data">
            Tidak ada data untuk ditampilkan.
          </td>
        </tr>
      @endforelse
    </tbody>
  </table>

  <div style="margin-top: 24px; font-size: 10px; color: #495057; text-align: center;">
    <p>Laporan ini dihasilkan secara otomatis oleh sistem Decision Support System</p>
  </div>
</body>

</html>
