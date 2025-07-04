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
        Schema::create('criterias', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['penghasilan', 'pengeluaran', 'tempat_tinggal', 'status_kepemilikan_rumah', 'kondisi_rumah', 'aset_yang_dimiliki', 'transportasi', 'penerangan_rumah']);
            $table->float('weight');
            $table->float('scale');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('criterias');
    }
};
