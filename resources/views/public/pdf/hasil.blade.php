<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Hasil {{ $method }}</title>
  <style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
    table { width:100%; border-collapse: collapse; }
    th, td { border:1px solid #ccc; padding:6px 8px; text-align:left; }
    th { background:#f3f3f3; }
  </style>
</head>
<body>
  <h2>Data Penduduk Miskin – Metode {{ $method }}</h2>
  <table>
    <thead><tr><th>No</th><th>Nama</th></tr></thead>
    <tbody>
    @foreach($items as $i => $row)
      <tr>
        <td>{{ $i+1 }}</td>
        <td>{{ is_array($row) ? $row['nama'] : ($row->nama ?? '') }}</td>
      </tr>
    @endforeach
    </tbody>
  </table>
</body>
</html>
