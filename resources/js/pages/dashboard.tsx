import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AlertTriangle, Home, Users } from 'lucide-react';

type StatsProps = {
    user: number;
    kk: number;
    kk_miskin_saw: number;
    kk_miskin_wp: number;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard() {
    const { props } = usePage<{ stats: StatsProps }>();
    const { stats } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {' '}
            <Head title="Dashboard" />
            <div className="mx-auto mt-6 flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl">
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="bg-card rounded-xl p-4 lg:p-6">
                        <Heading
                            title="Sistem Pendukung Keputusan — Penentuan Keluarga Miskin"
                            description="Gunakan metode SAW & WP untuk pemeringkatan RTM, dilengkapi uji sensitivitas (MCR) serta ekspor PDF/Excel."
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Admin</CardTitle>
                                <Users className="text-muted-foreground h-5 w-5" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats?.user ?? 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Jumlah KK</CardTitle>
                                <Home className="text-muted-foreground h-5 w-5" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats?.kk ?? 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">KK Miskin (SAW)</CardTitle>
                                <AlertTriangle className="text-muted-foreground h-5 w-5" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats?.kk_miskin_saw ?? 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">KK Miskin (WP)</CardTitle>
                                <AlertTriangle className="text-muted-foreground h-5 w-5" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats?.kk_miskin_wp ?? 0}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
