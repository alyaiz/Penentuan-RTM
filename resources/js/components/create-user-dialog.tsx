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
import { useForm } from '@inertiajs/react';
import { Loader2, PlusIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

export default function CreateUserDialog() {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        name: '',
        email: '',
        role: '',
        status: '',
        password: '',
        password_confirmation: '',
    });

    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();

        post('/admin', {
            onSuccess: () => {
                toast.success('Berhasil Disimpan', {
                    description: 'Data admin baru berhasil disimpan.',
                });
                setOpen(false);
            },
            onError: () => {
                toast.error('Gagal Disimpan', {
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
                <Button variant="outline" className="w-full">
                    <PlusIcon />
                    <span className="hidden lg:inline">Tambah Admin</span>
                    <span className="lg:hidden">Admin</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreate}>
                    <DialogHeader>
                        <DialogTitle>Tambah Admin</DialogTitle>
                        <DialogDescription>Tambah data admin disini. Klik simpan ketika selesai.</DialogDescription>
                    </DialogHeader>
                    <div className="my-4 grid min-h-[50vh] gap-4 overflow-y-auto md:h-[40vh] lg:h-[45vh] xl:max-h-[65vh] xl:min-h-[55vh]">
                        {renderInputField('Nama', 'name', 'Masukkan nama lengkap')}
                        {renderInputField('Email', 'email', 'Masukkan email admin', 'email')}

                        {renderSelectField('Peran', 'role', [
                            { value: 'super_admin', label: 'Super Admin' },
                            { value: 'admin', label: 'Admin' },
                        ])}

                        {renderSelectField('Status', 'status', [
                            { value: 'aktif', label: 'Aktif' },
                            { value: 'nonaktif', label: 'Nonaktif' },
                        ])}

                        {renderInputField('Password Baru', 'password', 'Masukkan password baru', 'password')}
                        {renderInputField('Konfirmasi Password', 'password_confirmation', 'Ulangi password baru', 'password')}
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
