import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { CheckCircle2, Download, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function DownloadDialog() {
    const [selectedFileType, setSelectedFileType] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDownload = async () => {
        if (!selectedFileType) {
            setError('Pilih tipe file terlebih dahulu!');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            if (selectedFileType === 'pdf') {
                const url = `/publik/hasil/pdf?${params.toString()}`;

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
                    const link = document.createElement('a');
                    link.href = data.path;
                    link.setAttribute('download', 'hasil-saw-wp.pdf');
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    setSuccess(true);
                } else {
                    throw new Error(data.message || 'Gagal membuat file PDF');
                }
            } else {
                const url = `/publik/hasil/excel?${params.toString()}`;
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
                    <Download />
                    Unduh
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Unduh Data</DialogTitle>
                    <DialogDescription>Pilih tipe file sebelum mengunduh data.</DialogDescription>
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
                    <Button disabled={isLoading || !!error || success} onClick={handleDownload} className="flex w-full items-center gap-2">
                        Unduh
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
