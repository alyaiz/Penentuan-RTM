import DataTableCriterias from '@/components/datatable-criterias';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Criteria, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Kriteria',
        href: '/kriteria',
    },
];

export default function Criterias() {
    const { criterias } = usePage<{ criterias: Criteria[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kriteria" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Manajemen Kriteria" description="Perbarui informasi kriteria sesuai data terbaru." />
                <DataTableCriterias data={criterias} totalItems={criterias.length} />
            </div>
        </AppLayout>
    );
}
