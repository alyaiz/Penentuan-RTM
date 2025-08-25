import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { router } from '@inertiajs/react';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { CheckCircle2, Loader2, SlidersHorizontal, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function FilterDialog() {
    const [selectedMetode, setSelectedMetode] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedFileType, setSelectedFileType] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFilter = () => {
        const filters: Record<string, string> = {};

        if (selectedMetode) {
            filters.metode = selectedMetode;
        }

        if (selectedStatus) {
            filters.status = selectedStatus;
        }

        router.get(window.location.pathname, filters, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
            },
        });
    };

    const handleDownload = async () => {
        if (!selectedFileType) {
            setError('Pilih tipe file terlebih dahulu!');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (selectedMetode) params.append('metode', selectedMetode);
            if (selectedStatus) params.append('status', selectedStatus);

            if (selectedFileType === 'pdf') {
                const url = `/hasil/pdf?${params.toString()}`;

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
                const url = `/hasil/excel?${params.toString()}`;
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

    const handleDownloadAgain = () => {
        setSuccess(false);
        handleDownload();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <SlidersHorizontal />
                    Filter atau Unduh
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Filter & Unduh Data</DialogTitle>
                    <DialogDescription>
                        Pilih metode atau status data sebelum melakukan filter dan pilih tipe file sebelum mengunduh data.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <Loader2 className="text-primary h-8 w-8 animate-spin" />
                        <div className="space-y-1 text-center">
                            <p className="text-primary text-sm font-semibold">Sedang memproses unduhan!</p>
                            <span className="text-muted-foreground text-sm">Mohon tunggu dan jangan tutup dialog ini.</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <XCircle className="text-primary h-8 w-8" />
                        <div className="space-y-1 text-center">
                            <p className="text-primary text-sm font-semibold">Unduhan Gagal</p>
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
                            <p className="text-primary text-sm font-semibold">File berhasil diunduh!</p>
                            <span className="text-muted-foreground text-sm">File telah dibuka di tab baru atau diunduh.</span>
                        </div>
                        <div className="flex w-full gap-2">
                            <Button onClick={handleDownloadAgain} className="w-full">
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
                            <Label className="font-semibold">Metode</Label>
                            <RadioGroup value={selectedMetode} onValueChange={setSelectedMetode} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="saw" id="saw" />
                                    <Label htmlFor="saw" className="font-normal">
                                        SAW
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="wp" id="wp" />
                                    <Label htmlFor="wp" className="font-normal">
                                        WP
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="grid gap-3">
                            <Label className="font-semibold">Status</Label>
                            <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="miskin" id="miskin" />
                                    <Label htmlFor="miskin" className="font-normal">
                                        Miskin
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tidak_miskin" id="tidak_miskin" />
                                    <Label htmlFor="tidak_miskin" className="font-normal">
                                        Tidak Miskin
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="grid gap-3">
                            <Label className="font-semibold">Tipe File</Label>
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
                        <Button disabled={isLoading || !!error || success} onClick={handleFilter} className="flex flex-1 items-center gap-2">
                            Filter
                        </Button>

                        <Button
                            disabled={isLoading || !!error || success}
                            onClick={handleDownload}
                            variant="secondary"
                            className="flex flex-1 items-center gap-2"
                        >
                            Unduh
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
