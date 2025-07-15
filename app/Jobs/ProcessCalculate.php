<?php

namespace App\Jobs;

use App\Models\Rtm;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessCalculate implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    protected $rtmId;

    /**
     * Create a new job instance.
     */
    public function __construct($rtmId)
    {
        $this->rtmId = $rtmId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $rtm = $query = Rtm::withAllCriteria()->findOrFail($this->rtmId);

        $scales = collect([
            $rtm->penghasilanCriteria->scale ?? 0,
            $rtm->pengeluaranCriteria->scale ?? 0,
            $rtm->tempatTinggalCriteria->scale ?? 0,
            $rtm->statusKepemilikanRumahCriteria->scale ?? 0,
            $rtm->kondisiRumahCriteria->scale ?? 0,
            $rtm->asetYangDimilikiCriteria->scale ?? 0,
            $rtm->transportasiCriteria->scale ?? 0,
            $rtm->peneranganRumahCriteria->scale ?? 0,
        ]);
        
        $maxScale = $scales->max();
    }
}
