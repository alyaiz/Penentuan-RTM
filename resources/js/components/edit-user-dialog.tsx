import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { AlertCircleIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditUserDialog({ open, onOpenChange, user }: { open: boolean; onOpenChange: (val: boolean) => void; user: any }) {
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

    const handleSubmit = () => {
        setIsSubmitting(true);

        const { password, password_confirmation, ...rest } = form;
        const payload = editPassword ? { ...rest, password, password_confirmation } : rest;

        router.put(`/users/${user.id}`, payload, {
            onSuccess: () => {
                toast.success('Berhasil Diperbarui', {
                    description: 'Data pengguna telah berhasil diperbarui.',
                });

                setErrors({});
                onOpenChange(false);
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

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                onOpenChange(isOpen);
                if (!isOpen) {
                    setErrors({});
                }
            }}
        >
            <DialogContent className="flex flex-col justify-between sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>

                <div className="flex h-[40vh] flex-col gap-4 overflow-y-auto md:h-[35vh] lg:h-[30vh] xl:max-h-[65vh] xl:min-h-[55vh]">
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertCircleIcon className="h-5 w-5" />
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
                    <div>
                        <Label className="mb-2 block">Nama</Label>
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Masukkan nama pengguna" />
                    </div>

                    <div>
                        <Label className="mb-2 block">Email</Label>
                        <Input
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="Masukkan email pengguna"
                        />
                    </div>

                    <div>
                        <Label className="mb-2 block">Peran</Label>
                        <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih peran pengguna" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="super admin">Super Admin</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="mb-2 block">Status</Label>
                        <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih status pengguna" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="aktif">Aktif</SelectItem>
                                <SelectItem value="nonaktif">Nonaktif</SelectItem>
                            </SelectContent>
                        </Select>
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
                            <div>
                                <Label className="mb-2 block">Password Baru</Label>
                                <Input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="Masukkan password baru"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Konfirmasi Password</Label>
                                <Input
                                    type="password"
                                    value={form.password_confirmation}
                                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                    placeholder="Ulangi password baru"
                                />
                            </div>
                        </>
                    )}
                </div>

                <Button className="mt-4 w-full" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Menyimpan
                        </>
                    ) : (
                        'Simpan'
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
