import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import { useEffect } from 'react';

type PageProps = {
  threshold: number;
  mcr_delta: number;
  flash?: { success?: string };
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pengaturan', href: '/pengaturan' }];

export default function Pengaturan() {
  const { threshold, mcr_delta, flash } = usePage<PageProps>().props;
  const form = useForm({
    threshold: String(threshold ?? 0.5),
    mcr_delta: String(mcr_delta ?? 0.05),
  });

  useEffect(() => {
    form.setData({
      threshold: String(threshold ?? 0.5),
      mcr_delta: String(mcr_delta ?? 0.05),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, mcr_delta]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    form.put('/pengaturan');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pengaturan" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <Heading title="Pengaturan Perhitungan" description="Atur ambang klasifikasi dan delta MCR." />

        {flash?.success && (
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600">
            {flash.success}
          </div>
        )}

        <form onSubmit={submit} className="grid max-w-xl gap-4">
          <div className="grid gap-2">
            <label className="text-sm">Ambang (Threshold)</label>
            <Input
              type="number"
              step="0.01"
              min={0}
              max={1}
              value={form.data.threshold}
              onChange={(e) => form.setData('threshold', e.target.value)}
            />
            {form.errors.threshold && <p className="text-sm text-red-500">{form.errors.threshold}</p>}
            <p className="text-xs text-muted-foreground">Gunakan nilai 0—1. Contoh umum: 0.50</p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Delta MCR (±)</label>
            <Input
              type="number"
              step="0.01"
              min={0}
              max={0.5}
              value={form.data.mcr_delta}
              onChange={(e) => form.setData('mcr_delta', e.target.value)}
            />
            {form.errors.mcr_delta && <p className="text-sm text-red-500">{form.errors.mcr_delta}</p>}
            <p className="text-xs text-muted-foreground">Misal 0.05 berarti uji sensitivitas di ±5%.</p>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={form.processing}>Simpan</Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
