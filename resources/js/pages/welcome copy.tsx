import Heading from '@/components/heading';
import HeroCarousel from '@/components/hero-carousel';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BarChart3, Calculator, FileDown, FileText, FlaskConical, Globe2, Home, RefreshCw, Settings2, Users } from 'lucide-react';

type PageProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    auth?: { user?: any };
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Beranda', href: '/' }];

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;

    const features = [
        { icon: Calculator, title: 'Kalkulasi SAW', desc: 'Perhitungan Simple Additive Weighting untuk pemeringkatan RTM.' },
        { icon: BarChart3, title: 'Kalkulasi WP', desc: 'Weighted Product untuk pembobotan multiplikatif & ranking RTM.' },
        { icon: FlaskConical, title: 'MCR (Uji Sensitivitas)', desc: 'Analisis pengaruh perubahan bobot kriteria terhadap hasil.' },
        { icon: RefreshCw, title: 'Kalkulasi Ulang', desc: 'Hitung ulang hasil setelah pembaruan data RTM atau bobot.' },
        { icon: FileText, title: 'Cetak PDF', desc: 'Ekspor ringkasan hasil dan MCR ke format PDF.' },
        { icon: FileDown, title: 'Unduh Excel', desc: 'Unduh data hasil dan MCR untuk analisis lanjutan.' },
        { icon: Globe2, title: 'Router Bahasa Indonesia', desc: 'Navigasi dan rute aplikasi berbahasa Indonesia.' },
    ];

    const shortcuts = [
        { href: '/dashboard', title: 'Dashboard', icon: Home },
        { href: '/rumah-tangga-miskin', title: 'Data RTM', icon: Users },
        { href: '/kriteria', title: 'Kriteria & Bobot', icon: Settings2 },
        { href: '/hasil', title: 'Hasil Perhitungan', icon: BarChart3 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Beranda" />

            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl">
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                    <HeroCarousel />

                    {/* <div className="bg-card rounded-xl p-6">
                        <Heading
                            title="Sistem Pendukung Keputusan — Penentuan Keluarga Miskin"
                            description="Gunakan metode SAW & WP untuk pemeringkatan RTM, dilengkapi uji sensitivitas (MCR) serta ekspor PDF/Excel."
                        />
                    </div> */}

                    {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((f, i) => (
                            <Card key={i}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{f.title}</CardTitle>
                                    <f.icon className="text-muted-foreground h-5 w-5" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">{f.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {auth?.user && (
                        <div className="mt-2">
                            <h3 className="text-muted-foreground mb-3 text-sm font-semibold">Akses Cepat</h3>
                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                                {shortcuts.map((s) => (
                                    <Card key={s.href} className="transition hover:shadow-sm">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                                            <s.icon className="text-muted-foreground h-5 w-5" />
                                        </CardHeader>
                                        <CardContent>
                                            <Button asChild variant="outline" className="w-full">
                                                <Link href={s.href}>Buka</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="rounded-lg border p-4">
                        <h3 className="text-base font-semibold">Cara Memulai</h3>
                        <ol className="text-muted-foreground mt-2 list-decimal pl-5 text-sm">
                            <li>Masuk atau daftar akun.</li>
                            <li>Input atau impor data Rumah Tangga Miskin (RTM).</li>
                            <li>Atur bobot kriteria pada halaman Kriteria.</li>
                            <li>Buka halaman Hasil untuk melihat peringkat, MCR, dan unduh laporan.</li>
                        </ol>
                    </div> */}
                </div>
            </div>
        </AppLayout>
    );
}
