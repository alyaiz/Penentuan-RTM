/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { CheckCircle2, Loader2, Upload, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function ExportDialog() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [importResult, setImportResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleExport = async () => {
        if (!selectedFile) {
            setError('Pilih file Excel terlebih dahulu!');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('excel_file', selectedFile);

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch('/rumah-tangga-miskin/import', {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(true);
                setSuccessMessage(data.message || 'Data berhasil diimpor!');
                setImportResult(data.result);
                setIsLoading(false);
            } else {
                const errorMessage = data.errors?.excel_file?.[0] || data.message || 'Terjadi kesalahan saat mengimpor file';
                setError(errorMessage);
                setIsLoading(false);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setError('Terjadi kesalahan saat menghubungi server');
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        setSuccess(false);
        setSuccessMessage('');
        setImportResult(null);
        setIsLoading(false);
        setSelectedFile(null);
    };

    const handleRefreshPage = () => {
        window.location.reload();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data RTM
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tambah Data Rumah Tangga</DialogTitle>
                    <DialogDescription>Unggah file Excel untuk menambahkan data rumah tangga miskin ke sistem.</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <Loader2 className="text-primary h-8 w-8 animate-spin" />
                        <div className="space-y-1 text-center">
                            <p className="text-primary text-sm font-semibold">Sedang memproses unggahan...</p>
                            <span className="text-muted-foreground text-sm">Mohon tunggu, file sedang diunggah dan diproses.</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <XCircle className="text-primary h-8 w-8" />
                        <div className="space-y-1 text-center">
                            <p className="text-primary text-sm font-semibold">Gagal Mengunggah Data</p>
                            <span className="text-muted-foreground text-sm">{error}</span>
                        </div>
                        <Button onClick={handleRetry} className="w-full">
                            Coba Lagi
                        </Button>
                    </div>
                ) : success ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <CheckCircle2 className="text-primary h-8 w-8" />
                        <div className="space-y-3 text-center">
                            <p className="text-primary text-sm font-semibold">Data berhasil diimpor!</p>
                            <span className="text-muted-foreground text-sm">{successMessage}</span>

                            {importResult && (
                                <div className="bg-muted/50 mt-3 rounded-md p-3 text-left">
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span>Data baru:</span>
                                            <span className="font-medium text-green-500">{importResult.created}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Data diperbarui:</span>
                                            <span className="text-primary font-medium">{importResult.updated}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Gagal:</span>
                                            <span className="font-medium text-red-500">{importResult.failed}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Dilewati:</span>
                                            <span className="text-muted-foreground font-medium">{importResult.skipped}</span>
                                        </div>
                                    </div>

                                    {/* {importResult.errors && importResult.errors.length > 0 && (
                                        <div className="mt-3 border-t pt-2">
                                            <p className="mb-2 text-xs font-medium">Detail:</p>
                                            <div className="max-h-32 space-y-1 overflow-y-auto text-xs">
                                                {importResult.errors.slice(0, 5).map((err: string, i: number) => (
                                                    <div key={i} className="text-muted-foreground">
                                                        {err}
                                                    </div>
                                                ))}
                                                {importResult.errors.length > 5 && (
                                                    <div className="text-muted-foreground italic">
                                                        ... dan {importResult.errors.length - 5} pesan lainnya
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )} */}

                                    {importResult.errors && importResult.failed > 0 && (
                                        <div className="mt-3 border-t pt-2">
                                            <p className="mb-2 text-xs font-medium">Error yang terjadi:</p>
                                            <div className="border0 max-h-24 space-y-1 overflow-y-auto rounded text-xs">
                                                {importResult.errors
                                                    .filter((err: string) => !err.includes('berhasil diperbarui'))
                                                    .map((err: string, i: number) => (
                                                        <div key={i} className="">
                                                            {err}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex w-full gap-2">
                            <Button onClick={handleRetry} className="w-full">
                                Unggah File Lagi
                            </Button>
                            <Button onClick={handleRefreshPage} variant="secondary" className="w-full">
                                Muat Ulang
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 space-y-4">
                        <div className="grid gap-3">
                            <Label htmlFor="excel">Pilih File Excel</Label>
                            <input
                                id="excel"
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <span className="text-muted-foreground text-xs">Format yang didukung: .xlsx, .xls</span>
                        </div>
                    </div>
                )}

                <DialogFooter className="pt-2">
                    <div className="flex w-full gap-2">
                        <Button
                            disabled={isLoading || !!error || success || !selectedFile}
                            onClick={handleExport}
                            className="flex flex-1 items-center gap-2"
                        >
                            Unggah
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
