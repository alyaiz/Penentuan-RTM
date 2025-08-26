import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Users, Home, AlertTriangle } from 'lucide-react';
import Heading from '@/components/heading';
import type { BreadcrumbItem } from '@/types';

// type Stats = { admins:number; kk:number; kk_miskin:number };
// type PageProps = { stats: Stats };

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard() {
    // const { stats } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Dashboard" description="Jumlah admin, jumlah KK, dan jumlah KK miskin." />
                {/* <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.admins ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jumlah KK</CardTitle>
              <Home className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.kk ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">KK Miskin</CardTitle>
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.kk_miskin ?? 0}</div>
            </CardContent>
          </Card>
        </div> */}
            </div>
        </AppLayout>
    );
}
