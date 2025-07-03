<!DOCTYPE html>
<html>
<head>
    <title>Welcome</title>
    <style>
        /* Sederhana */
        table, th, td { border: 1px solid black; border-collapse: collapse; }
        th, td { padding: 8px; }
    </style>
</head>
<body>
    <header>
        <div>
            <strong>LOGO</strong>
            <a href="/">Data Penduduk Miskin</a>
            <a href="/login">Login</a>
        </div>
    </header>

    <h2>Data Penduduk Miskin</h2>
    <form method="GET">
        <select name="metode" onchange="this.form.submit()">
            <option value="saw" {{ $method == 'saw' ? 'selected' : '' }}>SAW</option>
            <option value="wp" {{ $method == 'wp' ? 'selected' : '' }}>WP</option>
        </select>
    </form>

    <button onclick="window.print()">Unduh PDF</button>

    <table>
        <thead>
            <tr><th>No</th><th>Nama</th><th>Skor</th></tr>
        </thead>
        <tbody>
            @foreach($data as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->rtm->nama ?? '-' }}</td>
                    <td>{{ $item->score }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
