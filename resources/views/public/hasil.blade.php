{{-- resources/views/public/hasil.blade.php --}}
@extends('layouts.public')

@section('title','Data Penduduk Miskin')

@section('content')
  @php
    $m = $method;
    $pageIndex       = $results->currentPage() - 1;
    $perPage         = $results->perPage();
    $totalItems      = $results->total();
    $totalPages      = max(1, $results->lastPage());
    $canPreviousPage = $results->currentPage() > 1;
    $canNextPage     = $results->currentPage() < $totalPages;
    $qs              = request()->except('page');
    $firstUrl        = route('public.hasil', array_merge($qs, ['page' => 1]));
    $prevUrl         = route('public.hasil', array_merge($qs, ['page' => max(1, $results->currentPage()-1)]));
    $nextUrl         = route('public.hasil', array_merge($qs, ['page' => min($totalPages, $results->currentPage()+1)]));
    $lastUrl         = route('public.hasil', array_merge($qs, ['page' => $totalPages]));
  @endphp

  <div class="flex items-start justify-between mb-5">
    <div>
      <div class="-mt-1 mb-2">
        <a href="{{ route('home') }}"
           class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-700 bg-[#0b0d11] text-neutral-300 hover:text-amber-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Kembali
        </a>
      </div>
      <h1 class="text-xl font-semibold">Data Penduduk Miskin</h1>
      <p class="text-sm text-neutral-400">Hasil Perankingan Penduduk Miskin</p>
    </div>
  </div>

  <div class="flex items-center justify-between gap-3 mb-4 w-full">
    <form method="GET" action="{{ route('public.hasil') }}" class="flex items-center gap-2 w-full sm:w-auto">
      <input type="hidden" name="m" value="{{ $m }}">
      <input type="hidden" name="per_page" value="{{ request('per_page', $perPage) }}">
      <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari..."
             class="border border-neutral-700 bg-[#0b0d11] rounded-md px-3 py-1.5 w-full sm:w-72 text-neutral-200">
      <button type="submit"
              class="px-3 py-1.5 rounded-md border border-neutral-700 bg-[#0b0d11] text-neutral-300">
        Cari
      </button>
    </form>

    <div class="ml-0 sm:ml-auto flex items-center gap-2">
      <a href="{{ route('public.hasil', array_merge(request()->except('page'), ['m'=>'saw'])) }}"
         class="px-3 py-1.5 rounded-md border border-neutral-700 {{ $m==='saw' ? 'bg-amber-500 text-black' : 'bg-[#0b0d11] text-neutral-300' }}">SAW</a>
      <a href="{{ route('public.hasil', array_merge(request()->except('page'), ['m'=>'wp']))  }}"
         class="px-3 py-1.5 rounded-md border border-neutral-700 {{ $m==='wp' ? 'bg-amber-500 text-black' : 'bg-[#0b0d11] text-neutral-300' }}">WP</a>

      <form method="GET" action="{{ route('public.hasil.pdf') }}" class="ml-2">
        <input type="hidden" name="m" value="{{ $m }}">
        <input type="hidden" name="q" value="{{ request('q') }}">
        <input type="hidden" name="per_page" value="{{ request('per_page', $perPage) }}">
        <button type="submit"
                class="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black">
          Unduh PDF
        </button>
      </form>
    </div>
  </div>

  <div class="bg-[#0b0d11] rounded-xl border border-neutral-800 overflow-hidden">
    <table class="w-full">
      <thead class="bg-neutral-900 text-left">
        <tr>
          <th class="px-4 py-2 w-20">No</th>
          <th class="px-4 py-2">Nama</th>
        </tr>
      </thead>
      <tbody>
        @forelse($results as $i => $row)
          <tr class="border-t border-neutral-800">
            <td class="px-4 py-2">{{ ($results->currentPage()-1)*$results->perPage() + $i + 1 }}</td>
            <td class="px-4 py-2">{{ is_array($row) ? $row['nama'] : ($row->nama ?? '') }}</td>
          </tr>
        @empty
          <tr><td colspan="2" class="px-4 py-6 text-center text-neutral-400">Tidak ada data</td></tr>
        @endforelse
      </tbody>
    </table>
  </div>

  <div class="mt-4 flex items-center justify-between px-0">
    <div class="text-neutral-400 hidden lg:flex flex-1 text-sm">
      Menampilkan {{ min($pageIndex * $perPage + 1, $totalItems) }}
      sampai {{ min(($pageIndex + 1) * $perPage, $totalItems) }}
      dari {{ $totalItems }} hasil
      @if(request('q')) <span class="ml-1">untuk "{{ request('q') }}"</span> @endif
    </div>

    <div class="flex w-full items-center gap-8 lg:w-fit">
      <div class="hidden lg:flex items-center gap-2">
        <label for="rows-per-page" class="text-sm font-medium">Baris per halaman</label>
        <form method="GET" action="{{ route('public.hasil') }}" id="perPageFormBottom" class="contents">
          <input type="hidden" name="m" value="{{ $method }}">
          <input type="hidden" name="q" value="{{ request('q') }}">
          <select name="per_page" id="rows-per-page"
                  onchange="document.getElementById('perPageFormBottom').submit()"
                  class="w-20 border border-neutral-700 bg-[#0b0d11] rounded-md px-2 py-1 text-neutral-200">
            @foreach([20,30,40,50] as $n)
              <option value="{{ $n }}" {{ request('per_page', $perPage)==$n?'selected':'' }}>{{ $n }}</option>
            @endforeach
          </select>
        </form>
      </div>

      <div class="flex w-fit items-center justify-center text-sm font-medium">
        Halaman {{ $pageIndex + 1 }} dari {{ $totalPages }}
      </div>

      <div class="ml-auto lg:ml-0 flex items-center gap-2">
        @if($canPreviousPage)
          <a href="{{ $firstUrl }}" class="hidden lg:flex h-8 w-8 p-0 items-center justify-center rounded-md border border-neutral-700 bg-[#0b0d11] text-neutral-300 hover:text-amber-400">
            <span class="sr-only">Go to first page</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M20 19l-7-7 7-7"/></svg>
          </a>
        @else
          <span class="hidden lg:flex h-8 w-8 p-0 items-center justify-center rounded-md border border-neutral-800 text-neutral-600 cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M20 19l-7-7 7-7"/></svg>
          </span>
        @endif

        @if($canPreviousPage)
          <a href="{{ $prevUrl }}" class="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md border border-neutral-700 bg-[#0b0d11] text-neutral-300 hover:text-amber-400">
            <span class="sr-only">Go to previous page</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </a>
        @else
          <span class="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md border border-neutral-800 text-neutral-600 cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </span>
        @endif

        @if($canNextPage)
          <a href="{{ $nextUrl }}" class="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md border border-neutral-700 bg-[#0b0d11] text-neutral-300 hover:text-amber-400">
            <span class="sr-only">Go to next page</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </a>
        @else
          <span class="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md border border-neutral-800 text-neutral-600 cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </span>
        @endif

        @if($canNextPage)
          <a href="{{ $lastUrl }}" class="hidden lg:flex h-8 w-8 p-0 items-center justify-center rounded-md border border-neutral-700 bg-[#0b0d11] text-neutral-300 hover:text-amber-400">
            <span class="sr-only">Go to last page</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 19l7-7-7-7M13 19l7-7-7-7"/></svg>
          </a>
        @else
          <span class="hidden lg:flex h-8 w-8 p-0 items-center justify-center rounded-md border border-neutral-800 text-neutral-600 cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 19l7-7-7-7M13 19l7-7-7-7"/></svg>
          </span>
        @endif
      </div>
    </div>
  </div>
@endsection
