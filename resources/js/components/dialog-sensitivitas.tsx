import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Calculator, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function SensitivitasDialog() {
    const [selectedFileType, setSelectedFileType] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSensitivitas = async () => {
        if (!selectedFileType) {
            setError('Pilih tipe file terlebih dahulu!');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            if (selectedFileType === 'pdf') {
                const url = `/hasil/sensitivitas/pdf?${params.toString()}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success && data.path) {
                    window.open(data.path, '_blank');
                    setSuccess(true);
                } else {
                    throw new Error(data.message || 'Gagal membuat file PDF');
                }
            } else {
                const url = `/hasil/sensitivitas/excel?${params.toString()}`;
                window.location.href = url;
                setSuccess(true);
            }
        } catch (err) {
            console.error('Download error:', err);
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunduh file');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        setSuccess(false);
        setIsLoading(false);
    };

    const handleSensitivitasAgain = () => {
        setSuccess(false);
        handleSensitivitas();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Calculator />
                    Uji Sensitivitas
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Uji Sensitivitas</DialogTitle>
                    <DialogDescription>Pilih format file untuk menyimpan hasil analisis uji sensitivitas metode SAW dan WP.</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <Loader2 className="text-primary h-8 w-8 animate-spin" />
                        <div className="space-y-1 text-center">
                            <p className="text-primary text-sm font-semibold">Sedang memproses hasil uji sensitivitas...</p>
                            <span className="text-muted-foreground text-sm">Mohon tunggu, file sedang dibuat.</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <XCircle className="text-primary h-8 w-8" />
                        <div className="space-y-1 text-center">
                            <p className="text-primary text-sm font-semibold">Gagal Mengunduh Hasil</p>
                            <span className="text-muted-foreground text-sm">{error}</span>
                        </div>
                        <Button onClick={handleRetry} className="w-full">
                            Coba Lagi
                        </Button>
                    </div>
                ) : success ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <CheckCircle2 className="text-primary h-8 w-8" />
                        <div className="space-y-1 text-center">
                            <p className="text-primary text-sm font-semibold">Hasil uji sensitivitas berhasil diunduh!</p>
                            <span className="text-muted-foreground text-sm">File telah terbuka di tab baru atau tersimpan di perangkat Anda.</span>
                        </div>
                        <div className="flex w-full gap-2">
                            <Button onClick={handleSensitivitasAgain} className="w-full">
                                Unduh Lagi
                            </Button>
                            <Button onClick={handleRetry} variant="secondary" className="w-full">
                                Reset
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 space-y-4">
                        <div className="grid gap-3">
                            <Label className="font-semibold">Format File</Label>
                            <RadioGroup
                                value={selectedFileType}
                                onValueChange={setSelectedFileType}
                                className="grid grid-cols-1 gap-3 md:grid-cols-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="pdf" id="pdf" />
                                    <Label htmlFor="pdf" className="font-normal">
                                        PDF
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="excel" id="excel" />
                                    <Label htmlFor="excel" className="font-normal">
                                        Excel
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                )}

                <DialogFooter className="pt-2">
                    <div className="flex w-full gap-2">
                        <Button disabled={isLoading || !!error || success} onClick={handleSensitivitas} className="flex flex-1 items-center gap-2">
                            Unduh
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
