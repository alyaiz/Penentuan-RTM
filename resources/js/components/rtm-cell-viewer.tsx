import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Rtm } from '@/types';

export function RtmCellViewer({ item }: { item: Rtm }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="link" className="text-foreground h-auto cursor-pointer px-0 text-left leading-snug break-words whitespace-normal">
                    {item.name}
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="flex max-h-[90vh] flex-col overflow-y-auto [&>button.absolute]:hidden">
                <SheetHeader className="mx-auto w-full max-w-7xl">
                    <SheetTitle>{item.name}</SheetTitle>
                    <SheetDescription>Detail data rumah tangga miskin berdasarkan input kriteria.</SheetDescription>
                </SheetHeader>

                <div className="mx-auto w-full max-w-7xl flex-1 space-y-4 px-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="NIK" value={item.nik} />
                        <Field label="Alamat" value={item.address || '-'} />
                        <Field label="Penghasilan" value={item.penghasilan_criteria?.name ?? '-'} />
                        <Field label="Pengeluaran" value={item.pengeluaran_criteria?.name ?? '-'} />
                        <Field label="Tempat Tinggal" value={item.tempat_tinggal_criteria?.name ?? '-'} />
                        <Field label="Status Kepemilikan Rumah" value={item.status_kepemilikan_rumah_criteria?.name ?? '-'} />
                        <Field label="Kondisi Rumah" value={item.kondisi_rumah_criteria?.name ?? '-'} />
                        <Field label="Aset yang Dimiliki" value={item.aset_yang_dimiliki_criteria?.name ?? '-'} />
                        <Field label="Transportasi" value={item.transportasi_criteria?.name ?? '-'} />
                        <Field label="Penerangan Rumah" value={item.penerangan_rumah_criteria?.name ?? '-'} />
                        <Field label="Created At" value={item.created_at} />
                        <Field label="Updated At" value={item.updated_at} />
                    </div>
                </div>

                <SheetFooter className="mx-auto mt-auto flex w-full max-w-7xl gap-2 sm:flex-col">
                    <SheetClose asChild>
                        <Button className="w-full">Tutup</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-sm font-medium">{label}</Label>
            <Input value={value} disabled />
        </div>
    );
}
