{{-- resources/views/layouts/public.blade.php --}}
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>@yield('title','DesaPeduli')</title>
  @vite(['resources/css/app.css','resources/js/app.js'])
</head>
<body class="min-h-screen bg-[#0f1115] text-gray-100">
  @php
    $isHasil = request()->routeIs('public.hasil*');
  @endphp

  <header class="relative border-b border-neutral-800 bg-[#0b0d11]/90 backdrop-blur">
    <div class="max-w-6xl mx-auto flex items-center gap-6 h-16 px-4">
      <a href="{{ route('home') }}" class="flex items-center gap-3">
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-amber-500 text-black font-extrabold text-sm">DP</span>
        <span class="text-[15px] md:text-[16px] font-semibold tracking-tight">DesaPeduli</span>
      </a>

      <nav class="ml-auto flex items-center gap-2">
        {{-- Data Penduduk Miskin: underline menggantung (tidak nempel garis header) --}}
        <a href="{{ route('public.hasil') }}"
           class="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] md:text-[14px] font-medium transition
                  {{ $isHasil
                      ? 'bg-amber-500 text-black border-amber-500'
                      : 'border-neutral-800 bg-[#0b0d11] text-neutral-300 hover:text-amber-400' }}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
          </svg>
          <span>Data Penduduk Miskin</span>
          @if($isHasil)
            {{-- garis putih 3px, posisinya ~10px di bawah pill --}}
            <span class="pointer-events-none absolute left-2 right-2 -bottom-[10px] h-[3px] rounded-full bg-white/90"></span>
          @endif
        </a>

        @guest
          <a href="{{ route('login') }}"
             class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-[#0b0d11] text-neutral-300 hover:text-amber-400 transition text-[13px] md:text-[14px] font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5.121 17.804A9 9 0 1118.88 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>Login</span>
          </a>
        @else
          <a href="{{ route('dashboard') }}"
             class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-[#0b0d11] text-neutral-300 hover:text-amber-400 transition text-[13px] md:text-[14px] font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1"></rect>
              <rect x="14" y="3" width="7" height="7" rx="1"></rect>
              <rect x="14" y="14" width="7" height="7" rx="1"></rect>
              <rect x="3" y="14" width="7" height="7" rx="1"></rect>
            </svg>
            <span>Dashboard</span>
          </a>
        @endguest
      </nav>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 py-8">
    @yield('content')
  </main>

  <footer class="py-8 text-center text-sm text-neutral-500 border-t border-neutral-800">
    © {{ date('Y') }} xyz.com
  </footer>
</body>
</html>
