import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Rumah Tangga Miskin',
        href: '/rumah-tangga-miskin',
    },
    {
        title: 'Tambah',
        href: '/create',
    },
];

export default function Rtm() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rumah Tangga Miskin" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    title="Tambah Data Rumah Tangga Miskin"
                    description="Lengkapi formulir berikut untuk menambahkan data rumah tangga miskin."
                />
            </div>
        </AppLayout>
    );
}
