@extends('layouts.public')

@section('title','Pengenalan Desa')

@section('content')
  <section class="mb-10">
    <div class="w-full aspect-[16/7] rounded-xl border border-neutral-800 bg-neutral-900 grid place-items-center">
      <span class="text-neutral-500">IMAGE</span>
    </div>
  </section>

  <section class="grid md:grid-cols-2 gap-8">
    <div>
      <h1 class="text-2xl font-semibold mb-3 text-gray-100">Desa Prunggahan Kulon</h1>
      <p class="leading-relaxed text-neutral-300">
        {{ $desa->deskripsi }}
      </p>
  </section>
@endsection
