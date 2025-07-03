<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WP extends Model
{
    protected $guarded = [];

    public function rtm()
    {
        return $this->belongsTo(RumahTanggaMiskin::class, 'rtm_id');
    }
}
