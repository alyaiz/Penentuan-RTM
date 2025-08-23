<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>MCR SAW & WP</title>
  <style>
    * { font-family: DejaVu Sans, Arial, Helvetica, sans-serif; font-size: 12px; }
    h1 { font-size: 16px; margin: 0 0 6px 0; }
    h2 { font-size: 14px; margin: 14px 0 6px 0; }
    .muted { color: #666; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; }
    th { background: #f2f2f2; text-align: left; }
    td.num { text-align: right; }
  </style>
</head>
<body>
  <h1>Uji Sensitivitas (MCR) — SAW & WP</h1>
  <div class="muted">Dicetak: {{ $printed_at }}</div>

  <h2>Ringkasan MCR (rata-rata % perubahan)</h2>
  <table>
    <thead>
      <tr>
        <th>Kriteria</th>
        <th style="width:100px;">MCR SAW (%)</th>
        <th style="width:100px;">MCR WP (%)</th>
      </tr>
    </thead>
    <tbody>
      @foreach($summary as $s)
      <tr>
        <td>{{ $s['kriteria'] }}</td>
        <td class="num">{{ number_format($s['mcr_saw'],3,'.','') }}</td>
        <td class="num">{{ number_format($s['mcr_wp'],3,'.','') }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>

  <h2>Detail Uji Sensitivitas</h2>
  <table>
    <thead>
      <tr>
        <th>Kriteria</th>
        <th style="width:90px;">Δ Bobot</th>
        <th style="width:120px;">Δ% SAW (avg)</th>
        <th style="width:120px;">Δ% WP (avg)</th>
      </tr>
    </thead>
    <tbody>
      @foreach($rows as $r)
      <tr>
        <td>{{ $r['kriteria'] }}</td>
        <td class="num">{{ $r['delta'] }}</td>
        <td class="num">{{ number_format($r['avg_change_saw'],3,'.','') }}</td>
        <td class="num">{{ number_format($r['avg_change_wp'],3,'.','') }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>
</body>
</html>
