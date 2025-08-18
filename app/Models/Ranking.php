<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ranking extends Model
{
    protected $fillable = ['method','rank','score','alternative_id'];
    public function alternative(){ return $this->belongsTo(Alternative::class); }
}
