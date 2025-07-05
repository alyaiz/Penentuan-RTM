import DataTableUsers from '@/components/datatable-users';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Paginator, User, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pengguna', href: '/users' }];

export default function Users() {
    const { props } = usePage<{ users: Paginator<User> }>();
    const { data, current_page, last_page, per_page, total } = props.users;
    const [pageIndex, setPageIndex] = useState(current_page - 1);

    useEffect(() => {
        setPageIndex(current_page - 1);
    }, [current_page]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengguna" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Manajemen Pengguna" description="Kelola data pengguna, ubah informasi akun, atau tambahkan pengguna baru." />
                <DataTableUsers
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
