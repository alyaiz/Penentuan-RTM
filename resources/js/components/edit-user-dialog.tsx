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
import { User } from '@/types';
import { router } from '@inertiajs/react';
import { AlertCircleIcon, Loader2, Pen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EditUserDialogProps {
    user: User;
}

export function EditUserDialog({ user }: EditUserDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const [form, setForm] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                password: '',
                password_confirmation: '',
            });
        }
    }, [user]);

    const handleEdit = () => {
        setIsSubmitting(true);

        const { password, password_confirmation, ...rest } = form;
        const payload = editPassword ? { ...rest, password, password_confirmation } : rest;

        router.put(`/users/${user.id}`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Berhasil Diperbarui', {
                    description: 'Data pengguna telah berhasil diperbarui.',
                });

                setErrors({});
                setEditPassword(false);
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
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleClose = () => {
        setErrors({});
        setEditPassword(false);
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) handleClose();
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-7 w-7 rounded-md">
                    <Pen className="size-3" />
                    <span className="sr-only">Tombol edit pengguna</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form>
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                        <DialogDescription>Edit data pengguna disini. Klik simpan ketika selesai.</DialogDescription>
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
                        </div>

                        <div className="grid gap-2">
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
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="edit-password"
                                className="accent-primary"
                                checked={editPassword}
                                onChange={(e) => setEditPassword(e.target.checked)}
                            />
                            <Label htmlFor="edit-password">Edit Password</Label>
                        </div>

                        {editPassword && (
                            <>
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
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleEdit} disabled={isSubmitting}>
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
                </form>
            </DialogContent>
        </Dialog>
    );
}
