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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { AlertCircleIcon, Loader2, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateUserDialog() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const [form, setForm] = useState({
        name: '',
        email: '',
        role: '',
        status: '',
        password: '',
        password_confirmation: '',
    });

    const handleCreate = () => {
        setIsSubmitting(true);

        router.post('/pengguna', form, {
            onSuccess: () => {
                toast.success('Berhasil Ditambahkan', {
                    description: 'Data pengguna baru berhasil disimpan.',
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
                        description: 'Terjadi kesalahan saat menyimpan data pengguna.',
                    });
                }
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleClose = () => {
        setErrors({});
        setOpen(false);
        setForm({
            name: '',
            email: '',
            role: '',
            status: '',
            password: '',
            password_confirmation: '',
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) handleClose();
            }}
        >
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        <PlusIcon />
                        <span className="hidden lg:inline">Tambah Pengguna</span>
                        <span className="lg:hidden">Pengguna</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Tambah Pengguna</DialogTitle>
                        <DialogDescription>Tambah data pengguna disini. Klik simpan ketika selesai.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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

                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Masukkan nama pengguna"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="Masukkan email pengguna"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Peran</Label>
                            <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
                                <SelectTrigger id="role" className="w-full">
                                    <SelectValue placeholder="Pilih peran pengguna" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="super admin">Super Admin</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            {/* <select
                                id="role"
                                name="role"
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                className={cn(
                                    "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                                )}
                            >
                                <option value="">Pilih peran pengguna</option>
                                <option value="super admin">Super Admin</option>
                                <option value="admin">Admin</option>
                            </select> */}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                                <SelectTrigger id="status" className="w-full">
                                    <SelectValue placeholder="Pilih status pengguna" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* <div className="grid gap-2">
                            <Label htmlFor="role">Peran</Label>
                            <select
                                id="role"
                                name="role"
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Pilih peran pengguna</option>
                                <option value="super admin">Super Admin</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div> */}

                        {/* <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Pilih status pengguna</option>
                                <option value="aktif">Aktif</option>
                                <option value="nonaktif">Nonaktif</option>
                            </select>
                        </div> */}

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password Baru</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Masukkan password baru"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={form.password_confirmation}
                                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                placeholder="Ulangi password baru"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleCreate} disabled={isSubmitting}>
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
            </form>
        </Dialog>
    );
}
