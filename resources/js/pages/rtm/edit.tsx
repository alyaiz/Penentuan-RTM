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
        title: 'Edit',
        href: '/edit',
    },
];

export default function Rtm() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rumah Tangga Miskin" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Edit Data Rumah Tangga Miskin" description="Perbarui informasi rumah tangga miskin sesuai data terbaru." />
            </div>
        </AppLayout>
    );
}
