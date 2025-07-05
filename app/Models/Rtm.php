<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rtm extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'nik',
        'alamat',
        'penghasilan_id',
        'pengeluaran_id',
        'tempat_tinggal_id',
        'status_kepemilikan_rumah_id',
        'kondisi_rumah_id',
        'aset_yang_dimiliki_id',
        'transportasi_id',
        'penerangan_rumah_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationship ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationships ke Criteria untuk setiap kriteria
    public function penghasilanCriteria()
    {
        return $this->belongsTo(Criteria::class, 'penghasilan_id');
    }

    public function pengeluaranCriteria()
    {
        return $this->belongsTo(Criteria::class, 'pengeluaran_id');
    }

    public function tempatTinggalCriteria()
    {
        return $this->belongsTo(Criteria::class, 'tempat_tinggal_id');
    }

    public function statusKepemilikanRumahCriteria()
    {
        return $this->belongsTo(Criteria::class, 'status_kepemilikan_rumah_id');
    }

    public function kondisiRumahCriteria()
    {
        return $this->belongsTo(Criteria::class, 'kondisi_rumah_id');
    }

    public function asetYangDimilikiCriteria()
    {
        return $this->belongsTo(Criteria::class, 'aset_yang_dimiliki_id');
    }

    public function transportasiCriteria()
    {
        return $this->belongsTo(Criteria::class, 'transportasi_id');
    }

    public function peneranganRumahCriteria()
    {
        return $this->belongsTo(Criteria::class, 'penerangan_rumah_id');
    }

    // Scope untuk mengambil data dengan semua kriteria
    public function scopeWithAllCriteria($query)
    {
        return $query->with([
            'penghasilanCriteria',
            'pengeluaranCriteria',
            'tempatTinggalCriteria',
            'statusKepemilikanRumahCriteria',
            'kondisiRumahCriteria',
            'asetYangDimilikiCriteria',
            'transportasiCriteria',
            'peneranganRumahCriteria'
        ]);
    }

    // Scope untuk query dengan join semua kriteria
    public function scopeWithCriteriaDetails($query)
    {
        return $query->select([
            'rtms.*',
            'k1.name as penghasilan_name',
            'k1.weight as penghasilan_weight',
            'k2.name as pengeluaran_name',
            'k2.weight as pengeluaran_weight',
            'k3.name as tempat_tinggal_name',
            'k3.weight as tempat_tinggal_weight',
            'k4.name as status_kepemilikan_rumah_name',
            'k4.weight as status_kepemilikan_rumah_weight',
            'k5.name as kondisi_rumah_name',
            'k5.weight as kondisi_rumah_weight',
            'k6.name as aset_yang_dimiliki_name',
            'k6.weight as aset_yang_dimiliki_weight',
            'k7.name as transportasi_name',
            'k7.weight as transportasi_weight',
            'k8.name as penerangan_rumah_name',
            'k8.weight as penerangan_rumah_weight'
        ])
            ->join('criterias as k1', 'rtms.penghasilan_id', '=', 'k1.id')
            ->join('criterias as k2', 'rtms.pengeluaran_id', '=', 'k2.id')
            ->join('criterias as k3', 'rtms.tempat_tinggal_id', '=', 'k3.id')
            ->join('criterias as k4', 'rtms.status_kepemilikan_rumah_id', '=', 'k4.id')
            ->join('criterias as k5', 'rtms.kondisi_rumah_id', '=', 'k5.id')
            ->join('criterias as k6', 'rtms.aset_yang_dimiliki_id', '=', 'k6.id')
            ->join('criterias as k7', 'rtms.transportasi_id', '=', 'k7.id')
            ->join('criterias as k8', 'rtms.penerangan_rumah_id', '=', 'k8.id');
    }

    // Method untuk mengambil semua kriteria dalam array
    public function getAllCriteriaDetails()
    {
        return [
            'penghasilan' => [
                'name' => $this->penghasilanCriteria->name ?? null,
                'weight' => $this->penghasilanCriteria->weight ?? 0,
                'scale' => $this->penghasilanCriteria->scale ?? 0,
                'type' => 'penghasilan'
            ],
            'pengeluaran' => [
                'name' => $this->pengeluaranCriteria->name ?? null,
                'weight' => $this->pengeluaranCriteria->weight ?? 0,
                'scale' => $this->pengeluaranCriteria->scale ?? 0,
                'type' => 'pengeluaran'
            ],
            'tempat_tinggal' => [
                'name' => $this->tempatTinggalCriteria->name ?? null,
                'weight' => $this->tempatTinggalCriteria->weight ?? 0,
                'scale' => $this->tempatTinggalCriteria->scale ?? 0,
                'type' => 'tempat_tinggal'
            ],
            'status_kepemilikan_rumah' => [
                'name' => $this->statusKepemilikanRumahCriteria->name ?? null,
                'weight' => $this->statusKepemilikanRumahCriteria->weight ?? 0,
                'scale' => $this->statusKepemilikanRumahCriteria->scale ?? 0,
                'type' => 'status_kepemilikan_rumah'
            ],
            'kondisi_rumah' => [
                'name' => $this->kondisiRumahCriteria->name ?? null,
                'weight' => $this->kondisiRumahCriteria->weight ?? 0,
                'scale' => $this->kondisiRumahCriteria->scale ?? 0,
                'type' => 'kondisi_rumah'
            ],
            'aset_yang_dimiliki' => [
                'name' => $this->asetYangDimilikiCriteria->name ?? null,
                'weight' => $this->asetYangDimilikiCriteria->weight ?? 0,
                'scale' => $this->asetYangDimilikiCriteria->scale ?? 0,
                'type' => 'aset_yang_dimiliki'
            ],
            'transportasi' => [
                'name' => $this->transportasiCriteria->name ?? null,
                'weight' => $this->transportasiCriteria->weight ?? 0,
                'scale' => $this->transportasiCriteria->scale ?? 0,
                'type' => 'transportasi'
            ],
            'penerangan_rumah' => [
                'name' => $this->peneranganRumahCriteria->name ?? null,
                'weight' => $this->peneranganRumahCriteria->weight ?? 0,
                'scale' => $this->peneranganRumahCriteria->scale ?? 0,
                'type' => 'penerangan_rumah'
            ]
        ];
    }

    // Method untuk menghitung SAW Score
    public function calculateSAWScore()
    {
        $criteriaDetails = $this->getAllCriteriaDetails();
        $totalScore = 0;

        foreach ($criteriaDetails as $criteria) {
            $totalScore += $criteria['weight'];
        }

        return round($totalScore, 4);
    }

    // Method untuk mendapatkan ranking berdasarkan SAW Score
    public static function getRankingWithSAWScore()
    {
        return static::withAllCriteria()
            ->get()
            ->map(function ($rtm) {
                $rtm->saw_score = $rtm->calculateSAWScore();
                return $rtm;
            })
            ->sortByDesc('saw_score')
            ->values();
    }

    // Accessor untuk SAW Score
    public function getSawScoreAttribute()
    {
        return $this->calculateSAWScore();
    }

    // Method untuk validasi kriteria
    public function hasCompleteData()
    {
        return $this->penghasilan_id &&
            $this->pengeluaran_id &&
            $this->tempat_tinggal_id &&
            $this->status_kepemilikan_rumah_id &&
            $this->kondisi_rumah_id &&
            $this->aset_yang_dimiliki_id &&
            $this->transportasi_id &&
            $this->penerangan_rumah_id;
    }
}
