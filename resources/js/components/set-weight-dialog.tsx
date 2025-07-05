import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { AlertCircleIcon, Loader2, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const criteriaTypes = [
    'penghasilan',
    'pengeluaran',
    'tempat_tinggal',
    'status_kepemilikan_rumah',
    'kondisi_rumah',
    'aset_yang_dimiliki',
    'transportasi',
    'penerangan_rumah',
];

export default function SetWeightDialog() {
    const [weights, setWeights] = useState<Record<string, string>>(() => Object.fromEntries(criteriaTypes.map((type) => [type, ''])));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const fetchWeights = async () => {
        setIsLoading(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch('/kriteria/ambil-bobot', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                const errorResponse = await response.json().catch(() => ({}));
                throw new Error(errorResponse.message || `HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data.weights || Object.keys(data.weights).length === 0) {
                setOpen(false);
                throw new Error('emptyWeights');
            }

            setWeights((prev) => ({
                ...prev,
                ...Object.fromEntries(Object.entries(data.weights).map(([type, weight]) => [type, String(weight)])),
            }));
        } catch (err: unknown) {
            console.error(err);
            let message = 'Terjadi kesalahan yang tidak diketahui.';

            if (err instanceof Error) {
                message = err.message;
            }

            if (message === 'emptyWeights') {
                toast.warning('Belum Ada Data Kriteria', {
                    description: 'Data kriteria belum tersedia. Silakan tambahkan terlebih dahulu.',
                });
            } else {
                toast.error('Gagal Memuat Bobot', {
                    description: 'Terjadi kesalahan saat mengambil data bobot kriteria. Silakan coba lagi nanti.',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (type: string, value: string) => {
        setWeights((prev) => ({ ...prev, [type]: value }));
    };

    const handleEdit = () => {
        setIsSubmitting(true);

        router.put('/kriteria/update-bobot', weights, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Berhasil Diperbarui', {
                    description: 'Data bobot telah berhasil diperbarui.',
                });
                setErrors({});
                setOpen(false);
            },
            onError: (err) => {
                const formattedErrors: Record<string, string[]> = {};

                Object.entries(err).forEach(([key, message]) => {
                    if (typeof message === 'string') {
                        formattedErrors[key] = [message];
                    } else if (Array.isArray(message)) {
                        formattedErrors[key] = message;
                    }
                });

                setErrors(formattedErrors);

                if (Object.keys(formattedErrors).length === 0) {
                    toast.error('Gagal Diperbarui', {
                        description: 'Terjadi kesalahan saat memperbarui data bobot.',
                    });
                }
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleClose = () => {
        setErrors({});
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (isOpen) fetchWeights();
                if (!isOpen) handleClose();
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4" />
                    Atur Bobot Kriteria
                </Button>
            </DialogTrigger>

            <DialogContent className="flex flex-col sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Atur Bobot Kriteria</DialogTitle>
                    <DialogDescription>Masukkan bobot baru untuk masing-masing tipe kriteria.</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center overflow-hidden md:h-[40vh] lg:h-[45vh] xl:max-h-[65vh] xl:min-h-[50vh]">
                        <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
                        <p className="text-center font-medium">Mengambil data bobot...</p>
                        <p className="text-muted-foreground mt-1 text-center text-sm">Mohon tunggu, proses ini mungkin memerlukan beberapa saat.</p>
                    </div>
                ) : (
                    <div className="grid min-h-[50vh] gap-4 overflow-y-scroll py-4 md:h-[40vh] lg:h-[45vh] xl:max-h-[65vh] xl:min-h-[50vh]">
                        {Object.keys(errors).length > 0 && (
                            <Alert variant="destructive" role="alert">
                                <AlertCircleIcon className="h-4 w-4" />
                                <AlertTitle>Gagal menyimpan data pengguna</AlertTitle>
                                <AlertDescription>
                                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                                        {Object.entries(errors).map(([field, messages]) =>
                                            messages.map((message, idx) => <li key={`${field}-${idx}`}>{message}</li>),
                                        )}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {criteriaTypes.map((type) => (
                            <div key={type} className="grid gap-2">
                                <Label htmlFor={type} className="capitalize">
                                    {type.replaceAll('_', ' ')}
                                </Label>
                                <Input
                                    id={type}
                                    value={weights[type]}
                                    onChange={(e) => handleChange(type, e.target.value)}
                                    placeholder="Masukkan bobot"
                                    type="number"
                                    step="0.01"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                )}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Batal
                        </Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleEdit} disabled={isSubmitting || isLoading}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            'Simpan'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
