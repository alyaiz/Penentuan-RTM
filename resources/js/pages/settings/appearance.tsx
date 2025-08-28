import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pengaturan Tampilan', href: '/pengaturan/tampilan' }];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Tampilan" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl">
                <SettingsLayout>
                    <div className="space-y-6">
                        <HeadingSmall title="Pengaturan Tampilan" description="Perbarui pengaturan tampilan akun Anda" />

                        <AppearanceTabs />
                    </div>
                </SettingsLayout>
            </div>
        </AppLayout>
    );
}
