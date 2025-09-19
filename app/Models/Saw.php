<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Saw extends Model
{
    use HasFactory;

    protected $fillable = [
        'rtm_id',
        'score',
    ];

    protected $casts = [
        'score' => 'decimal:3',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function rtm()
    {
        return $this->belongsTo(Rtm::class);
    }
}
