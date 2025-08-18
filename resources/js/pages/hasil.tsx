import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Head, usePage } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import DataTableHasil from '@/components/datatable-hasil';

type Row = { id:number; nama:string; nik:string; saw:number; wp:number; status_saw:string; status_wp:string };
type Pagination = { current_page:number; per_page:number; total:number; last_page:number; links:{prev:string|null; next:string|null} };
type Filters = { q?:string; status?:'miskin'|'tidak'|null; method:'SAW'|'WP' };

type PageProps = {
  rows: Row[];
  pagination: Pagination;
  filters: Filters;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Hasil', href: '/hasil' }];

export default function Hasil() {
  const { rows, pagination, filters } = usePage<PageProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Hasil" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <Heading title="Manajemen Hasil" description="Informasi hasil sesuai data terbaru." />
        <DataTableHasil rows={rows} pagination={pagination} filters={filters} />
      </div>
    </AppLayout>
  );
}
