<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'weight',
        'scale',
    ];

    protected $casts = [
        'weight' => 'float',
        'scale' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Enum untuk type
    public const TYPES = [
        'penghasilan',
        'pengeluaran',
        'tempat_tinggal',
        'status_kepemilikan_rumah',
        'kondisi_rumah',
        'aset_yang_dimiliki',
        'transportasi',
        'penerangan_rumah'
    ];

    // Scope untuk filter berdasarkan type
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Static method untuk mendapatkan criteria berdasarkan type
    public static function getCriteriaByType($type)
    {
        return static::byType($type)->orderBy('id')->get();
    }

    // Static method untuk mendapatkan semua criteria yang dikelompokkan
    public static function getAllGroupedByType()
    {
        $grouped = [];
        foreach (self::TYPES as $type) {
            $grouped[$type] = self::getCriteriaByType($type);
        }
        return $grouped;
    }

    // Relationship ke RTM (inverse relationships)
    public function rtmsPenghasilan()
    {
        return $this->hasMany(Rtm::class, 'penghasilan_id');
    }

    public function rtmsPengeluaran()
    {
        return $this->hasMany(Rtm::class, 'pengeluaran_id');
    }

    public function rtmsTempatTinggal()
    {
        return $this->hasMany(Rtm::class, 'tempat_tinggal_id');
    }

    public function rtmsStatusKepemilikanRumah()
    {
        return $this->hasMany(Rtm::class, 'status_kepemilikan_rumah_id');
    }

    public function rtmsKondisiRumah()
    {
        return $this->hasMany(Rtm::class, 'kondisi_rumah_id');
    }

    public function rtmsAsetYangDimiliki()
    {
        return $this->hasMany(Rtm::class, 'aset_yang_dimiliki_id');
    }

    public function rtmsTransportasi()
    {
        return $this->hasMany(Rtm::class, 'transportasi_id');
    }

    public function rtmsPeneranganRumah()
    {
        return $this->hasMany(Rtm::class, 'penerangan_rumah_id');
    }

    // Method untuk mendapatkan semua RTM yang menggunakan criteria ini
    public function getAllRelatedRtms()
    {
        $rtms = collect();

        switch ($this->type) {
            case 'penghasilan':
                $rtms = $this->rtmsPenghasilan;
                break;
            case 'pengeluaran':
                $rtms = $this->rtmsPengeluaran;
                break;
            case 'tempat_tinggal':
                $rtms = $this->rtmsTempatTinggal;
                break;
            case 'status_kepemilikan_rumah':
                $rtms = $this->rtmsStatusKepemilikanRumah;
                break;
            case 'kondisi_rumah':
                $rtms = $this->rtmsKondisiRumah;
                break;
            case 'aset_yang_dimiliki':
                $rtms = $this->rtmsAsetYangDimiliki;
                break;
            case 'transportasi':
                $rtms = $this->rtmsTransportasi;
                break;
            case 'penerangan_rumah':
                $rtms = $this->rtmsPeneranganRumah;
                break;
        }

        return $rtms;
    }

    // Method untuk validasi type
    public function isValidType()
    {
        return in_array($this->type, self::TYPES);
    }

    // Accessor untuk nama type yang lebih readable
    public function getTypeNameAttribute()
    {
        $typeNames = [
            'penghasilan' => 'Penghasilan',
            'pengeluaran' => 'Pengeluaran',
            'tempat_tinggal' => 'Tempat Tinggal',
            'status_kepemilikan_rumah' => 'Status Kepemilikan Rumah',
            'kondisi_rumah' => 'Kondisi Rumah',
            'aset_yang_dimiliki' => 'Aset Yang Dimiliki',
            'transportasi' => 'Transportasi',
            'penerangan_rumah' => 'Penerangan Rumah'
        ];

        return $typeNames[$this->type] ?? $this->type;
    }
}
