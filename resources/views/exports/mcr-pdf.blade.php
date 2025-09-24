<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <title>Analisis Sensitivitas - MCR SAW & WP</title>
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

    h2 {
      font-size: 14px;
      margin: 20px 0 8px 0;
      color: #333;
      border-left: 4px solid #333;
      padding-left: 8px;
    }

    h3 {
      font-size: 12px;
      font-weight: bold;
      color: #333;
    }

    .muted {
      color: #666;
      margin-bottom: 16px;
      text-align: center;
      font-style: italic;
    }

    .info-box {
      background: rgb(249, 250, 251);
      border: 1px solid rgb(229, 231, 235);
      padding: 12px;
      margin: 16px 0;
    }

    .info-box h3 {
      margin: 0 0 8px 0;
      font-size: 12px;
      font-weight: bold;
      color: #333;
    }

    .info-grid {
      display: table;
      width: 100%;
    }

    .info-item {
      display: table-cell;
      width: 33.33%;
      padding: 4px 8px;
    }

    .info-value {
      color: #495057;
      font-size: 12px;
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

    .positive {
      color: rgb(5, 223, 114);
    }

    .negative {
      color: rgb(251, 44, 54);
    }

    .high-sensitivity {
      background-color: rgb(251, 44, 54);
    }

    .medium-sensitivity {
      background-color: rgb(255, 223, 32);
    }

    .low-sensitivity {
      background-color: rgb(5, 223, 114);
    }

    .summary-note {
      margin-top: 8px;
      padding: 8px;
      border-left: 3px solid #333;
      background: rgb(249, 250, 251);
    }

    ul.conclusion-list li {
      margin-bottom: 6px;
      color: #495057;
      font-size: 12px;
    }
  </style>
</head>

<body>
  <h1>Analisis Sensitivitas (MCR) — SAW & WP</h1>
  <div class="muted">Dicetak: {{ $printed_at }}</div>

  <h2>Informasi Analisis</h2>
  <div class="info-box">
    <div class="info-grid">
      <div class="info-item">
        <h3>Total RTM:</h3>
        <div class="info-value">{{ number_format($analysis_info['total_rtm']) }}</div>
      </div>
      <div class="info-item">
        <h3>Level Delta:</h3>
        <div class="info-value">
          @foreach ($analysis_info['delta_levels'] as $delta)
            {{ $delta }}{{ !$loop->last ? ', ' : '' }}
          @endforeach
        </div>
      </div>
      <div class="info-item">
        <h3>Metode:</h3>
        <div class="info-value">SAW & WP</div>
      </div>
    </div>
  </div>

  <h2>Detail Analisis Sensitivitas per Delta</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 35%;">Kriteria</th>
        <th style="width: 15%;">Δ Bobot</th>
        <th style="width: 20%;">Δ% SAW</th>
        <th style="width: 20%;">Δ% WP</th>
      </tr>
    </thead>
    <tbody>
      @php
        $totalSaw = 0;
        $totalWp = 0;
      @endphp

      @foreach ($rows as $r)
        @php
          $totalSaw += $r['saw_difference'];
          $totalWp += $r['wp_difference'];
        @endphp
        <tr>
          <td>{{ $r['kriteria'] }}</td>
          <td>{{ $r['delta'] }}</td>
          <td class="{{ $r['saw_difference'] >= 0 ? 'positive' : 'negative' }}">
            {{ number_format($r['saw_difference'], 3, '.', '') }}%
          </td>
          <td class="{{ $r['wp_difference'] >= 0 ? 'positive' : 'negative' }}">
            {{ number_format($r['wp_difference'], 3, '.', '') }}%
          </td>
        </tr>
      @endforeach

      <tr style="font-weight: bold; background: #f9fafb;">
        <td colspan="2">Total</td>
        <td>{{ number_format($totalSaw, 3, '.', '') }}%</td>
        <td>{{ number_format($totalWp, 3, '.', '') }}%</td>
      </tr>
    </tbody>
  </table>

  <div class="summary-note">
    <h3 style="margin-top: 0">Kesimpulan Analisis:</h3>
    <div class="info-value">
      Metode paling sensitif berdasarkan total perubahan:
      {{ abs($totalSaw) > abs($totalWp) ? 'SAW' : 'WP' }}
      dengan total perubahan
      {{ abs($totalSaw) > abs($totalWp) ? number_format($totalSaw, 3, '.', '') . '%' : number_format($totalWp, 3, '.', '') . '%' }}
    </div>

  </div>

  <div style="margin-top: 24px; font-size: 10px; color: #495057; text-align: center;">
    <p>Laporan ini dihasilkan secara otomatis oleh sistem Decision Support System</p>
    <p>Analisis sensitivitas menggunakan Mean Change Rate (MCR) dengan multiple delta levels</p>
  </div>
</body>

</html>
