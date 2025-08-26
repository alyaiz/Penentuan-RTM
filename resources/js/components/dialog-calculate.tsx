import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RtmStats } from '@/types';
import { useForm } from '@inertiajs/react';
import { CheckCircle2, Loader2, TriangleAlert, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type CalculationDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    stats: RtmStats;
};

export default function CalculationDialog({ open, onOpenChange, stats }: CalculationDialogProps) {
    const [status, setStatus] = useState<'idle' | 'calculating' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { post, processing } = useForm({});

    useEffect(() => {
        if (open) {
            setStatus('idle');
            setErrorMessage('');
        }
    }, [open]);

    const handleCalculate = () => {
        setStatus('calculating');
        setErrorMessage('');

        post('/hasil/hitung', {
            preserveScroll: true,
            onSuccess: () => {
                setStatus('success');
            },
            onError: (errors) => {
                setStatus('error');
                const errorMsg = errors.message || Object.values(errors)[0] || 'Terjadi kesalahan saat menghitung nilai.';
                setErrorMessage(errorMsg);
            },
        });
    };

    const handleRetryCalculate = () => {
        handleCalculate();
    };

    const handleCloseDialog = () => {
        if (status !== 'calculating') {
            onOpenChange(false);
            setStatus('idle');
            setErrorMessage('');
        }
    };

    const handleRefreshPage = () => {
        // onOpenChange(false);
        // setStatus('idle');
        // setErrorMessage('');
        window.location.reload();
    };

    const renderDialogContent = () => {
        switch (status) {
            case 'calculating':
                return (
                    <>
                        <Loader2 className="text-primary h-8 w-8 animate-spin" />
                        <div className="space-y-1 text-center">
                            <p className="text-primary text-sm font-semibold">Sedang menghitung nilai SAW dan WP!</p>
                            <span className="text-muted-foreground text-sm">Mohon tunggu dan jangan tutup dialog ini.</span>
                        </div>
                        <Button disabled className="w-full">
                            Menghitung
                        </Button>
                    </>
                );

            case 'success':
                return (
                    <>
                        <CheckCircle2 className="text-primary h-8 w-8" />
                        <div className="space-y-1 text-center">
                            <p className="text-primary text-sm font-semibold">Perhitungan berhasil disimpan!</p>
                            <span className="text-muted-foreground text-sm">Silahkan muat ulang halaman.</span>
                        </div>
                        <Button onClick={handleRefreshPage} className="w-full">
                            Muat Ulang
                        </Button>
                    </>
                );

            case 'error':
                return (
                    <>
                        <XCircle className="text-primary h-8 w-8" />
                        <div className="space-y-1 text-center">
                            <p className="text-primary text-sm font-semibold">Perhitungan Gagal</p>
                            {errorMessage && <span className="text-muted-foreground text-sm">{errorMessage}</span>}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Button onClick={handleRetryCalculate} disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Mencoba
                                    </>
                                ) : (
                                    'Coba Lagi'
                                )}
                            </Button>
                            <Button onClick={handleCloseDialog} variant="outline">
                                Tutup
                            </Button>
                        </div>
                    </>
                );

            default:
                return (
                    <>
                        <TriangleAlert className="text-primary h-8 w-8" />
                        <div className="space-y-1 text-center">
                            <p className="text-primary text-sm font-semibold">
                                {stats.saw > 0 || stats.wp > 0
                                    ? stats.saw > 0 && stats.wp > 0
                                        ? 'Hitung Nilai SAW dan WP'
                                        : stats.saw > 0
                                          ? 'Hitung Nilai SAW'
                                          : 'Hitung Nilai WP'
                                    : 'Hitung Ulang Nilai SAW dan WP'}
                            </p>
                            <span className="text-muted-foreground text-sm">
                                {stats.saw > 0 || stats.wp > 0
                                    ? stats.saw > 0 && stats.wp > 0
                                        ? `${stats.saw} data belum memiliki nilai SAW dan ${stats.wp} data belum memiliki nilai WP.`
                                        : stats.saw > 0
                                          ? `${stats.saw} data belum memiliki nilai SAW.`
                                          : `${stats.wp} data belum memiliki nilai WP.`
                                    : 'Klik tombol di bawah untuk menghitung ulang semua nilai SAW dan WP.'}
                            </span>
                        </div>
                        <Button onClick={handleCalculate} disabled={processing} className="w-full">
                            {processing ? 'Menghitung' : 'Hitung Nilai'}
                        </Button>
                    </>
                );
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleCloseDialog}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{status === 'success' ? 'Perhitungan Berhasil' : 'Perhitungan SAW dan WP'}</DialogTitle>
                    <DialogDescription>
                        {status === 'success'
                            ? 'Semua nilai telah berhasil dihitung dan disimpan.'
                            : status === 'error'
                              ? 'Terjadi kesalahan saat melakukan perhitungan.'
                              : stats.saw > 0 || stats.wp > 0
                                ? 'Sistem mendeteksi adanya data yang perlu dihitung ulang untuk memperbarui hasil.'
                                : 'Hitung ulang semua data untuk memastikan perhitungan terbaru tersimpan.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center gap-4 text-center">{renderDialogContent()}</div>
            </DialogContent>
        </Dialog>
    );
}
