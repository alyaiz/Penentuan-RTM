import DataTableResults from '@/components/datatable-results';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Paginator, RtmResult, RtmStats, RtmTresholds, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Hasil', href: '/hasil' }];

export default function Results() {
    const { props } = usePage<{ rtms: Paginator<RtmResult>; stats: RtmStats; tresholds: RtmTresholds }>();
    const { data, current_page, last_page, per_page, total } = props.rtms;
    const { stats } = props;
    const { tresholds } = props;

    const [pageIndex, setPageIndex] = useState(current_page - 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hasil" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Hasil Perhitungan" description="Menampilkan hasil akhir perhitungan SAW dan WP untuk semua data rumah tangga." />
                <DataTableResults
                    data={data}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    totalPages={last_page}
                    totalItems={total}
                    perPage={per_page}
                    stats={stats}
                    tresholds={tresholds}
                />
            </div>
        </AppLayout>
    );
}
