<?php

namespace Database\Seeders;

use App\Models\Criteria;
use Illuminate\Database\Seeder;

class CriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $criterias = [
            // Penghasilan
            ['name' => 'Rp. 0 - Rp. 1.000.000', 'type' => 'penghasilan', 'scale' => 0.05, 'weight' => 0.125],
            ['name' => 'Rp. 1.000.001 - Rp. 1.500.000', 'type' => 'penghasilan', 'scale' => 0.25, 'weight' => 0.125],
            ['name' => 'Rp. 1.500.001 - Rp. 2.000.000', 'type' => 'penghasilan', 'scale' => 0.5, 'weight' => 0.125],
            ['name' => 'Rp. 2.000.001 - Rp. 2.500.000', 'type' => 'penghasilan', 'scale' => 0.75, 'weight' => 0.125],
            ['name' => '> Rp. 2.500.000', 'type' => 'penghasilan', 'scale' => 1, 'weight' => 0.125],

            // Pengeluaran
            ['name' => 'Rp. 0 - Rp. 1.000.000', 'type' => 'pengeluaran', 'scale' => 0.05, 'weight' => 0.125],
            ['name' => 'Rp. 1.000.001 - Rp. 1.500.000', 'type' => 'pengeluaran', 'scale' => 0.25, 'weight' => 0.125],
            ['name' => 'Rp. 1.500.001 - Rp. 2.000.000', 'type' => 'pengeluaran', 'scale' => 0.5, 'weight' => 0.125],
            ['name' => 'Rp. 2.000.001 - Rp. 2.500.000', 'type' => 'pengeluaran', 'scale' => 0.75, 'weight' => 0.125],
            ['name' => '> Rp. 2.500.000', 'type' => 'pengeluaran', 'scale' => 1, 'weight' => 0.125],

            // Tempat Tinggal
            ['name' => 'Tidak punya tempat tinggal', 'type' => 'tempat_tinggal', 'scale' => 0.05, 'weight' => 0.125],
            ['name' => 'Menumpang', 'type' => 'tempat_tinggal', 'scale' => 0.25, 'weight' => 0.125],
            ['name' => 'Mengontrak', 'type' => 'tempat_tinggal', 'scale' => 0.5, 'weight' => 0.125],
            ['name' => 'Rumah orang tua', 'type' => 'tempat_tinggal', 'scale' => 0.75, 'weight' => 0.125],
            ['name' => 'Milik sendiri', 'type' => 'tempat_tinggal', 'scale' => 1, 'weight' => 0.125],

            // Status Kepemilikan Rumah
            ['name' => 'Pakai Gratis', 'type' => 'status_kepemilikan_rumah', 'scale' => 0.25, 'weight' => 0.125],
            ['name' => 'Sewa < 1 juta', 'type' => 'status_kepemilikan_rumah', 'scale' => 0.5, 'weight' => 0.125],
            ['name' => 'Milik Orang Tua/Warisan', 'type' => 'status_kepemilikan_rumah', 'scale' => 0.75, 'weight' => 0.125],
            ['name' => 'Milik Sendiri/Sewa', 'type' => 'status_kepemilikan_rumah', 'scale' => 1, 'weight' => 0.125],

            // Kondisi Rumah
            ['name' => 'Dinding kayu & lantai ubin', 'type' => 'kondisi_rumah', 'scale' => 0.25, 'weight' => 0.125],
            ['name' => 'Dinding tembok & lantai tanah', 'type' => 'kondisi_rumah', 'scale' => 0.5, 'weight' => 0.125],
            ['name' => 'Dinding tembok & lantai ubin', 'type' => 'kondisi_rumah', 'scale' => 0.75, 'weight' => 0.125],
            ['name' => 'Dinding tembok & lantai keramik', 'type' => 'kondisi_rumah', 'scale' => 1, 'weight' => 0.125],

            // Aset yang Dimiliki
            ['name' => 'Sepeda', 'type' => 'aset_yang_dimiliki', 'scale' => 0.25, 'weight' => 0.125],
            ['name' => 'Motor', 'type' => 'aset_yang_dimiliki', 'scale' => 0.5, 'weight' => 0.125],
            ['name' => 'Mobil', 'type' => 'aset_yang_dimiliki', 'scale' => 0.75, 'weight' => 0.125],
            ['name' => 'Tanah / Bangunan', 'type' => 'aset_yang_dimiliki', 'scale' => 1, 'weight' => 0.125],

            // Transportasi
            ['name' => 'Jalan Kaki/Sepeda/Sepada Motor Seadanya', 'type' => 'transportasi', 'scale' => 0.25, 'weight' => 0.125],
            ['name' => 'Sepeda Motor 1 Buah, dalam Kondisi Baik', 'type' => 'transportasi', 'scale' => 0.5, 'weight' => 0.125],
            ['name' => 'Sepeda Motor > 1 Buah, dalam Kondisi Baik', 'type' => 'transportasi', 'scale' => 0.75, 'weight' => 0.125],
            ['name' => 'Mobil', 'type' => 'transportasi', 'scale' => 1, 'weight' => 0.125],

            // Penerangan Rumah
            ['name' => 'Listrik Numpang', 'type' => 'penerangan_rumah', 'scale' => 0.25, 'weight' => 0.125],
            ['name' => 'Listrik 450 watt', 'type' => 'penerangan_rumah', 'scale' => 0.5, 'weight' => 0.125],
            ['name' => 'Listrik 900 watt', 'type' => 'penerangan_rumah', 'scale' => 0.75, 'weight' => 0.125],
            ['name' => 'Listrik > 900 watt', 'type' => 'penerangan_rumah', 'scale' => 1, 'weight' => 0.125],
        ];

        foreach ($criterias as $criteria) {
            Criteria::create($criteria);
        }
    }
}
