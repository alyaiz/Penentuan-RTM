import HeroCarousel from '@/components/hero-carousel';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Beranda', href: '/' }];

export default function Welcome() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Beranda" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl">
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                    <HeroCarousel />
                </div>
            </div>
        </AppLayout>
    );
}
