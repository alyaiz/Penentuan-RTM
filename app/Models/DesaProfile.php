<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DesaProfile extends Model
{
    // tabel default: desa_profiles
    protected $fillable = [
        'nama_desa',
        'deskripsi',
        'jumlah_kk',
        'jumlah_kk_miskin',
        'alamat',
        'hero_image',
    ];
}
