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
import { useForm } from '@inertiajs/react';
import { Loader2, SlidersHorizontal } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
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
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, put, processing, errors, clearErrors, reset } = useForm<Record<string, string>>(
        Object.fromEntries(criteriaTypes.map((type) => [type, ''])),
    );

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

            const result = await response.json();

            if (!result.weights || Object.keys(result.weights).length === 0) {
                setOpen(false);
                throw new Error('emptyWeights');
            }

            for (const [type, weight] of Object.entries(result.weights)) {
                setData(type, String(weight));
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.';

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

    const handleEdit: FormEventHandler = (e) => {
        e.preventDefault();
        put('/kriteria/update-bobot', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Berhasil Diperbarui', {
                    description: 'Data bobot telah berhasil diperbarui.',
                });
                setOpen(false);
            },
            onError: () => {
                toast.error('Gagal Diperbarui', {
                    description: 'Mohon periksa kembali data yang dimasukkan.',
                });
            },
        });
    };

    const handleClose = () => {
        reset();
        clearErrors();
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
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleEdit}>
                    <DialogHeader>
                        <DialogTitle>Atur Bobot Kriteria</DialogTitle>
                        <DialogDescription>Masukkan bobot baru untuk masing-masing tipe kriteria.</DialogDescription>
                    </DialogHeader>
                    {isLoading ? (
                        <div className="flex min-h-[50vh] w-full flex-col items-center justify-center">
                            <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
                            <p className="text-center font-medium">Mengambil Data Bobot...</p>
                            <p className="text-muted-foreground mt-1 text-center text-sm">Mohon tunggu sebentar.</p>
                        </div>
                    ) : (
                        <div className="my-4 grid min-h-[50vh] gap-4 overflow-y-auto md:h-[40vh] lg:h-[45vh] xl:max-h-[65vh] xl:min-h-[55vh]">
                            {criteriaTypes.map((type) => (
                                <div key={type} className="grid gap-2">
                                    <Label htmlFor={type} className="capitalize">
                                        {type.replaceAll('_', ' ')}
                                    </Label>
                                    <Input
                                        id={type}
                                        value={data[type]}
                                        onChange={(e) => setData(type, e.target.value)}
                                        placeholder="Masukkan bobot"
                                        type="number"
                                        step="0.01"
                                    />
                                    {errors[type] && <p className="text-destructive text-sm">{errors[type]}</p>}
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
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
