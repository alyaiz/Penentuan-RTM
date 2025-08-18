<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alternative extends Model
{
    protected $fillable = ['nama']; // kolom lain non-publik simpan di tabel lain
}
