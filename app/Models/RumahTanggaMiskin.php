<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RumahTanggaMiskin extends Model
{
    protected $guarded = [];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function saw()
    {
        return $this->hasOne(SAW::class, 'rtm_id');
    }

    public function wp()
    {
        return $this->hasOne(WP::class, 'rtm_id');
    }
}
