<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Hasil SAW & WP</title>
  <style>
    * { font-family: DejaVu Sans, Arial, Helvetica, sans-serif; font-size: 12px; }
    h1 { font-size: 16px; margin: 0 0 6px 0; }
    .muted { color: #666; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; }
    th { background: #f2f2f2; text-align: left; }
    td.num { text-align: right; }
    .chip-ok { background:#e7f6ef; color:#12805a; padding:2px 6px; border-radius:4px; }
    .chip-warn { background:#fff3cd; color:#8a6d3b; padding:2px 6px; border-radius:4px; }
  </style>
</head>
<body>
  <h1>Hasil Perhitungan ({{ $method }})</h1>
  <div class="muted">
    Dicetak: {{ $printed_at }}
    • Ambang: {{ number_format(\App\Models\Setting::get('sawwp_threshold', config('sawwp.threshold', 0.5)), 2) }}
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:40px;">No</th>
        <th style="width:150px;">NIK</th>
        <th>Nama</th>
        <th style="width:80px;">SAW</th>
        <th style="width:80px;">WP</th>
        <th style="width:110px;">Status SAW</th>
        <th style="width:110px;">Status WP</th>
      </tr>
    </thead>
    <tbody>
      @foreach($rows as $i => $r)
      <tr>
        <td>{{ ($i+1) }}</td>
        <td>{{ $r['nik'] }}</td>
        <td>{{ $r['nama'] }}</td>
        <td class="num">{{ number_format($r['saw'], 3, '.', '') }}</td>
        <td class="num">{{ number_format($r['wp'], 3, '.', '') }}</td>
        <td>
          <span class="{{ $r['status_saw']==='Miskin' ? 'chip-warn' : 'chip-ok' }}">
            {{ $r['status_saw'] }}
          </span>
        </td>
        <td>
          <span class="{{ $r['status_wp']==='Miskin' ? 'chip-warn' : 'chip-ok' }}">
            {{ $r['status_wp'] }}
          </span>
        </td>
      </tr>
      @endforeach
    </tbody>
  </table>
</body>
</html>
