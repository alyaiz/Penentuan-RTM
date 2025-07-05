import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Criteria, Rtm } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

type EditRtmProps = {
    criterias: Record<string, Criteria[]>;
    rtm: Rtm;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rumah Tangga Miskin', href: '/rumah-tangga-miskin' },
    { title: 'Edit', href: '/rumah-tangga-miskin/edit' },
];

export default function EditRtm({ criterias, rtm }: EditRtmProps) {
    const { data, setData, put, processing, errors, clearErrors } = useForm({
        nik: rtm.nik ?? '',
        name: rtm.name ?? '',
        address: rtm.address ?? '',
        penghasilan_id: String(rtm.penghasilan_id ?? ''),
        pengeluaran_id: String(rtm.pengeluaran_id ?? ''),
        tempat_tinggal_id: String(rtm.tempat_tinggal_id ?? ''),
        status_kepemilikan_rumah_id: String(rtm.status_kepemilikan_rumah_id ?? ''),
        kondisi_rumah_id: String(rtm.kondisi_rumah_id ?? ''),
        aset_yang_dimiliki_id: String(rtm.aset_yang_dimiliki_id ?? ''),
        transportasi_id: String(rtm.transportasi_id ?? ''),
        penerangan_rumah_id: String(rtm.penerangan_rumah_id ?? ''),
    });

    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();

        put(`/rumah-tangga-miskin/${rtm.id}`, {
            onSuccess: () => {
                clearErrors();
                toast.success('Berhasil Diperbarui', {
                    description: 'Data rumah tangga miskin berhasil diperbarui.',
                });
            },
            onError: () => {
                toast.error('Gagal Diperbarui', {
                    description: 'Mohon periksa kembali data yang dimasukkan.',
                });
            },
        });
    };

    const renderInputField = (label: string, field: keyof typeof data, placeholder: string, type: 'text' | 'number' = 'text') => (
        <div className="grid gap-2">
            <Label htmlFor={field}>
                {label}
                <span className="text-primary"> *</span>
            </Label>
            <Input id={field} type={type} placeholder={placeholder} value={data[field] as string} onChange={(e) => setData(field, e.target.value)} />
            {errors[field] && <p className="text-destructive text-sm">{errors[field]}</p>}
        </div>
    );

    const renderCriteriaSelect = (label: string, field: keyof typeof data, options: Criteria[]) => (
        <div className="grid gap-2">
            <Label>
                {label}
                <span className="text-primary"> *</span>
            </Label>
            <Select value={data[field]} onValueChange={(value) => setData(field, value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Pilih ${label}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors[field] && <p className="text-destructive text-sm">{errors[field]}</p>}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Data Rumah Tangga Miskin" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Tambah Data Rumah Tangga Miskin" description="Lengkapi formulir berikut untuk menambahkan data." />

                <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-2">
                    {renderInputField('Nama', 'name', 'Masukkan nama lengkap')}
                    {renderInputField('NIK', 'nik', 'Masukkan Nomor Induk Kependudukan')}

                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="address">Alamat</Label>
                        <Textarea
                            id="address"
                            placeholder="Masukkan alamat lengkap sesuai domisili"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                        {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
                    </div>

                    {renderCriteriaSelect('Penghasilan', 'penghasilan_id', criterias.penghasilan)}
                    {renderCriteriaSelect('Pengeluaran', 'pengeluaran_id', criterias.pengeluaran)}
                    {renderCriteriaSelect('Tempat Tinggal', 'tempat_tinggal_id', criterias.tempat_tinggal)}
                    {renderCriteriaSelect('Status Kepemilikan Rumah', 'status_kepemilikan_rumah_id', criterias.status_kepemilikan_rumah)}
                    {renderCriteriaSelect('Kondisi Rumah', 'kondisi_rumah_id', criterias.kondisi_rumah)}
                    {renderCriteriaSelect('Aset yang Dimiliki', 'aset_yang_dimiliki_id', criterias.aset_yang_dimiliki)}
                    {renderCriteriaSelect('Transportasi', 'transportasi_id', criterias.transportasi)}
                    {renderCriteriaSelect('Penerangan Rumah', 'penerangan_rumah_id', criterias.penerangan_rumah)}

                    <div className="flex justify-end pt-2 md:col-span-2">
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
