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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types';
import { useForm } from '@inertiajs/react';
import { Loader2, Pen } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

interface EditUserDialogProps {
    user: User;
}

export default function EditUserDialog({ user }: EditUserDialogProps) {
    const [open, setOpen] = useState(false);
    const [editPassword, setEditPassword] = useState(false);

    const { data, setData, put, processing, errors, clearErrors, reset } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: '',
        password_confirmation: '',
    });

    const handleEdit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!editPassword) {
            setData('password', '');
            setData('password_confirmation', '');
        }

        put(`/pengguna/${user.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Berhasil Diperbarui', {
                    description: 'Data pengguna telah berhasil diperbarui.',
                });
                setOpen(false);
                setEditPassword(false);
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
        setEditPassword(false);
        setOpen(false);
    };

    const renderInputField = (label: string, field: keyof typeof data, placeholder: string, type: string = 'text') => (
        <div className="grid gap-2">
            <Label htmlFor={field}>
                {label}
                <span className="text-primary"> *</span>
            </Label>
            <Input id={field} type={type} placeholder={placeholder} value={data[field] as string} onChange={(e) => setData(field, e.target.value)} />
            {errors[field] && <p className="text-destructive text-sm">{errors[field]}</p>}
        </div>
    );

    const renderSelectField = (
        label: string,
        field: keyof typeof data,
        options: { value: string; label: string }[],
        placeholder = `Pilih ${label}`,
    ) => (
        <div className="grid gap-2">
            <Label htmlFor={field}>
                {label}
                <span className="text-primary"> *</span>
            </Label>
            <Select value={data[field]} onValueChange={(value) => setData(field, value)}>
                <SelectTrigger className="w-full" id={field}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {errors[field] && <p className="text-destructive text-sm">{errors[field]}</p>}
        </div>
    );

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
                <form onSubmit={handleEdit}>
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                        <DialogDescription>Edit data pengguna di sini. Klik simpan ketika selesai.</DialogDescription>
                    </DialogHeader>

                    <div className="my-4 grid min-h-[50vh] gap-4 overflow-y-auto md:h-[40vh] lg:h-[45vh] xl:max-h-[65vh] xl:min-h-[55vh]">
                        {renderInputField('Nama', 'name', 'Masukkan nama lengkap')}
                        {renderInputField('Email', 'email', 'Masukkan email pengguna', 'email')}

                        {renderSelectField('Peran', 'role', [
                            { value: 'super_admin', label: 'Super Admin' },
                            { value: 'admin', label: 'Admin' },
                        ])}

                        {renderSelectField('Status', 'status', [
                            { value: 'aktif', label: 'Aktif' },
                            { value: 'nonaktif', label: 'Nonaktif' },
                        ])}

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
                                {renderInputField('Password Baru', 'password', 'Masukkan password baru', 'password')}
                                {renderInputField('Konfirmasi Password', 'password_confirmation', 'Ulangi password baru', 'password')}
                            </>
                        )}
                    </div>

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
