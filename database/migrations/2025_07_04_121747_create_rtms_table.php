<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rtms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('nik')->unique();
            $table->string('nama');
            $table->text('string')->nullable();
            $table->foreignId('penghasilan_id')->references('id')->on('criterias');
            $table->foreignId('pengeluaran_id')->references('id')->on('criterias');
            $table->foreignId('tempat_tinggal_id')->references('id')->on('criterias');
            $table->foreignId('status_kepemilikan_rumah_id')->references('id')->on('criterias');
            $table->foreignId('kondisi_rumah_id')->references('id')->on('criterias');
            $table->foreignId('aset_yang_dimiliki_id')->references('id')->on('criterias');
            $table->foreignId('transportasi_id')->references('id')->on('criterias');
            $table->foreignId('penerangan_rumah_id')->references('id')->on('criterias');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rtms');
    }
};
