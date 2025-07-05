import DataTableRtms from '@/components/datatable-rtms';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Paginator, Rtm, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Rumah Tangga Miskin',
        href: '/rumah-tangga-miskin',
    },
];

export default function Rtms() {
    const { props } = usePage<{ rtms: Paginator<Rtm> }>();
    const { data, current_page, last_page, per_page, total } = props.rtms;
    const [pageIndex, setPageIndex] = useState(current_page - 1);

    useEffect(() => {
        setPageIndex(current_page - 1);
    }, [current_page]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rumah Tangga Miskin" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    title="Manajemen Rumah Tangga Miskin"
                    description="Kelola data rumah tangga miskin, ubah informasi, atau tambahkan data baru."
                />
                <DataTableRtms
                    data={data}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    totalPages={last_page}
                    totalItems={total}
                    perPage={per_page}
                />
            </div>
        </AppLayout>
    );
}
