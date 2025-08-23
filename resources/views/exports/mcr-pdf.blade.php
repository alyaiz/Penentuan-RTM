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
            {{ $delta * 100 }}%{{ !$loop->last ? ', ' : '' }}
          @endforeach
        </div>
      </div>
      <div class="info-item">
        <h3>Metode:</h3>
        <div class="info-value">SAW & WP</div>
      </div>
    </div>
  </div>

  <h2>Ringkasan Sensitivitas Kriteria (MCR - Mean Change Rate)</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 40%;">Kriteria</th>
        <th style="width: 25%;">MCR SAW (%)</th>
        <th style="width: 25%;">MCR WP (%)</th>
        <th style="width: 10%;">Level</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($summary as $s)
        @php
          $wpMcr = abs($s['mcr_wp']);
          $levelClass = '';
          $levelText = '';
          if ($wpMcr >= 1.0) {
              $levelClass = 'high-sensitivity';
              $levelText = 'Tinggi';
          } elseif ($wpMcr >= 0.3) {
              $levelClass = 'medium-sensitivity';
              $levelText = 'Sedang';
          } else {
              $levelClass = 'low-sensitivity';
              $levelText = 'Rendah';
          }
        @endphp
        <tr>
          <td>{{ $s['kriteria'] }}</td>
          <td class="{{ $s['mcr_saw'] >= 0 ? 'positive' : 'negative' }}">
            {{ number_format(abs($s['mcr_saw']), 6, '.', '') }}
          </td>
          <td class="{{ $s['mcr_wp'] >= 0 ? 'positive' : 'negative' }}">
            {{ number_format(abs($s['mcr_wp']), 6, '.', '') }}
          </td>
          <td class="{{ $levelClass }}">{{ $levelText }}</td>
        </tr>
      @endforeach
    </tbody>
  </table>

  <div class="summary-note">
    <h3 style="margin-top: 0">Interpretasi MCR:</h3>
    <div class="info-value">MCR (Mean Change Rate) menunjukkan rata-rata perubahan persentase skor maksimum ketika bobot
      kriteria diubah.
      Nilai yang lebih tinggi menunjukkan kriteria tersebut lebih sensitif terhadap perubahan bobot.
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
        <th style="width: 10%;">Dominan</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($rows as $r)
        @php
          $sawAbs = abs($r['avg_change_saw']);
          $wpAbs = abs($r['avg_change_wp']);
          $dominant = $wpAbs > $sawAbs ? 'WP' : 'SAW';
          $dominantClass = $wpAbs > $sawAbs ? 'text-primary' : 'text-secondary';
        @endphp
        <tr>
          <td>{{ $r['kriteria'] }}</td>
          <td>{{ $r['delta'] }}</td>
          <td class="{{ $r['avg_change_saw'] >= 0 ? 'positive' : 'negative' }}">
            {{ number_format($r['avg_change_saw'], 6, '.', '') }}%
          </td>
          <td class="{{ $r['avg_change_wp'] >= 0 ? 'positive' : 'negative' }}">
            {{ number_format($r['avg_change_wp'], 6, '.', '') }}%
          </td>
          <td>
            {{ $dominant }}
          </td>
        </tr>
      @endforeach
    </tbody>
  </table>

  <h2>Perbandingan Metode SAW vs WP</h2>
  <div class="info-box">
    <div class="info-grid">
      <div class="info-item">
        <h3>Rata-rata Sensitivitas SAW:</h3>
        <div class="info-value">
          {{ number_format($analysis_info['method_comparison']['saw_average_sensitivity'], 4, '.', '') }}%</div>
      </div>
      <div class="info-item">
        <h3>Rata-rata Sensitivitas WP:</h3>
        <div class="info-value">
          {{ number_format($analysis_info['method_comparison']['wp_average_sensitivity'], 4, '.', '') }}%</div>
      </div>
      <div class="info-item">
        <h3>Rasio Sensitivitas (WP/SAW):</h3>
        <div class="info-value">
          {{ number_format($analysis_info['method_comparison']['sensitivity_ratio'], 1, '.', '') }}x</div>
      </div>
    </div>

    <div class="info-grid" style="margin-top: 12px;">
      <div class="info-item">
        <h3>Kriteria Paling Sensitif:</h3>
        <div class="info-value">{{ $analysis_info['method_comparison']['most_sensitive_criteria'] }}</div>
      </div>
      <div class="info-item">
        <h3>Kriteria Paling Stabil:</h3>
        <div class="info-value">{{ $analysis_info['method_comparison']['least_sensitive_criteria'] }}</div>
      </div>
      <div class="info-item">
        <h3>Metode Lebih Stabil:</h3>
        <div class="info-value">
          {{ $analysis_info['method_comparison']['saw_average_sensitivity'] < $analysis_info['method_comparison']['wp_average_sensitivity'] ? 'SAW' : 'WP' }}
        </div>
      </div>
    </div>
  </div>

  <div class="summary-note">
    <h3 style="margin-top: 0">Kesimpulan Analisis:</h3>
    <ul class="conclusion-list">
      <li>
        Stabilitas: Metode
        {{ $analysis_info['method_comparison']['saw_average_sensitivity'] < $analysis_info['method_comparison']['wp_average_sensitivity'] ? 'SAW lebih stabil' : 'WP lebih stabil' }}
        dengan sensitivitas rata-rata lebih rendah
      </li>
      <li>
        Responsivitas: Metode
        {{ $analysis_info['method_comparison']['saw_average_sensitivity'] > $analysis_info['method_comparison']['wp_average_sensitivity'] ? 'SAW lebih responsif' : 'WP lebih responsif' }}
        terhadap perubahan bobot kriteria
      </li>
      <li>
        Kriteria Kritis:
        {{ $analysis_info['method_comparison']['most_sensitive_criteria'] }} memerlukan perhatian khusus dalam
        penentuan bobot
      </li>
      <li>
        Validasi Model: Rasio sensitivitas
        {{ number_format($analysis_info['method_comparison']['sensitivity_ratio'], 1) }}x menunjukkan
        {{ $analysis_info['method_comparison']['sensitivity_ratio'] > 10 ? 'perbedaan signifikan' : 'perbedaan wajar' }}
        antar metode
      </li>
    </ul>
  </div>

  <div style="margin-top: 24px; font-size: 10px; color: #495057; text-align: center;">
    <p>Laporan ini dihasilkan secara otomatis oleh sistem Decision Support System</p>
    <p>Analisis sensitivitas menggunakan Mean Change Rate (MCR) dengan multiple delta levels</p>
  </div>
</body>

</html>
