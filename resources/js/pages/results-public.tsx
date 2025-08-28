import DataTableResultsPublic from '@/components/datatable-results-public';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Paginator, RtmResult, RtmStats, RtmTresholds, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Hasil', href: '/hasil' }];

export default function ResultsPublic() {
    const { props } = usePage<{ rtms: Paginator<RtmResult>; stats: RtmStats; tresholds: RtmTresholds }>();
    const { data, current_page, last_page, per_page, total } = props.rtms;
    const { tresholds } = props;

    const [pageIndex, setPageIndex] = useState(current_page - 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Penduduk Miskin" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl">
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <Heading title="Data Penduduk Miskin" description="Daftar peringkat rumah tangga miskin hasil analisis sistem." />
                    <DataTableResultsPublic
                        data={data}
                        pageIndex={pageIndex}
                        setPageIndex={setPageIndex}
                        totalPages={last_page}
                        totalItems={total}
                        perPage={per_page}
                        tresholds={tresholds}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
