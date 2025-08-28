import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pengaturan Perhitungan', href: '/settings/calculate' }];

type PageProps = {
    mcr_delta: number;
    threshold_saw: number;
    threshold_wp: number;
    flash?: { success?: string };
};

type CalculateForm = {
    mcr_delta: string;
    threshold_saw: string;
    threshold_wp: string;
};

export default function Calculate() {
    const { mcr_delta, threshold_saw, threshold_wp, flash } = usePage<PageProps>().props;

    const { data, setData, put, errors, processing, recentlySuccessful } = useForm<CalculateForm>({
        mcr_delta: String(mcr_delta ?? 0.05),
        threshold_saw: String(threshold_saw ?? 0.6),
        threshold_wp: String(threshold_wp ?? 0.7),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put('/settings/calculate');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Perhitungan" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl">
                <SettingsLayout>
                    <div className="space-y-6">
                        <HeadingSmall title="Variabel Perhitungan" description="Atur ambang klasifikasi, delta MCR, dan threshold metode SAW & WP." />

                        {flash?.success && (
                            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600">
                                {flash.success}
                            </div>
                        )}

                        <form onSubmit={submit} className="grid max-w-xl gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="mcr_delta">Delta MCR (±)</Label>
                                <Input
                                    id="mcr_delta"
                                    type="number"
                                    step="any"
                                    min={0}
                                    max={0.5}
                                    value={data.mcr_delta}
                                    onChange={(e) => setData('mcr_delta', e.target.value)}
                                    placeholder="0.05"
                                />
                                <InputError message={errors.mcr_delta} />
                                <p className="text-muted-foreground text-xs">Misal 0.05 berarti uji sensitivitas di ±5%.</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="threshold_saw">Threshold SAW</Label>
                                <Input
                                    id="threshold_saw"
                                    type="number"
                                    step="any"
                                    min={0}
                                    max={1}
                                    value={data.threshold_saw}
                                    onChange={(e) => setData('threshold_saw', e.target.value)}
                                    placeholder="0.60"
                                />
                                <InputError message={errors.threshold_saw} />
                                <p className="text-muted-foreground text-xs">Ambang batas untuk metode Simple Additive Weighting (SAW).</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="threshold_wp">Threshold WP</Label>
                                <Input
                                    id="threshold_wp"
                                    type="number"
                                    step="any"
                                    min={0}
                                    max={1}
                                    value={data.threshold_wp}
                                    onChange={(e) => setData('threshold_wp', e.target.value)}
                                    placeholder="0.70"
                                />
                                <InputError message={errors.threshold_wp} />
                                <p className="text-muted-foreground text-xs">Ambang batas untuk metode Weighted Product (WP).</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Simpan
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">Tersimpan</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </SettingsLayout>
            </div>
        </AppLayout>
    );
}
