import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import {
  Calculator,
  BarChart3,
  FlaskConical,
  RefreshCw,
  FileText,
  FileDown,
  Globe2,
  Users,
  Home,
  Settings2,
} from 'lucide-react';

type PageProps = {
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
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
        <div className="rounded-xl bg-gradient-to-br from-muted/40 to-muted p-6">
          <Heading
            title="Sistem Pendukung Keputusan — Penentuan Keluarga Miskin"
            description="Gunakan metode SAW & WP untuk pemeringkatan RTM, dilengkapi uji sensitivitas (MCR) serta ekspor PDF/Excel."
          />
          <div className="mt-4 flex flex-wrap gap-3">
            {!auth?.user ? (
              <>
                <Button asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/register">Daftar</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/hasil">Lihat Hasil</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/hasil">Lihat Hasil</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/kriteria">Atur Bobot</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/rumah-tangga-miskin">Kelola RTM</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{f.title}</CardTitle>
                <f.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {auth?.user && (
          <div className="mt-2">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Akses Cepat</h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {shortcuts.map((s) => (
                <Card key={s.href} className="transition hover:shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                    <s.icon className="h-5 w-5 text-muted-foreground" />
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
          <ol className="mt-2 list-decimal pl-5 text-sm text-muted-foreground">
            <li>Masuk atau daftar akun.</li>
            <li>Input atau impor data Rumah Tangga Miskin (RTM).</li>
            <li>Atur bobot kriteria pada halaman Kriteria.</li>
            <li>Buka halaman Hasil untuk melihat peringkat, MCR, dan unduh laporan.</li>
          </ol>
        </div>
      </div>
    </AppLayout>
  );
}
