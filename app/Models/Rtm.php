<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rtm extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
