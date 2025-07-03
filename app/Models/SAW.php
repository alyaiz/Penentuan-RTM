<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SAW extends Model
{
    protected $guarded = [];

    protected $casts = [
        'norm_score' => 'array',
    ];

    public function rtm()
    {
        return $this->belongsTo(RumahTanggaMiskin::class, 'rtm_id');
    }
}
