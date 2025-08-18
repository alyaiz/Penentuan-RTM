import { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { useDebouncedCallback } from 'use-debounce';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import {
  FileDown,
  FileText,
  RefreshCw,
  FlaskConical,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft as ChevronsLeftIcon,
  ChevronsRight as ChevronsRightIcon,
} from 'lucide-react';

type Row = {
  id: number;
  nama: string;
  nik: string;
  saw: number;
  wp: number;
  status_saw: string;
  status_wp: string;
};

type Pagination = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  links: { prev: string | null; next: string | null };
};

type Filters = {
  q?: string;
  status?: 'miskin' | 'tidak' | null;
  method: 'SAW' | 'WP';
};

type Props = {
  rows: Row[];
  pagination: Pagination;
  filters: Filters;
};

export default function DataTableHasil({ rows, pagination, filters }: Props) {
  const [q, setQ] = useState(filters.q ?? '');
  const [status, setStatus] = useState<'' | 'miskin' | 'tidak'>(filters.status ?? '');
  const [method, setMethod] = useState<'SAW' | 'WP'>(filters.method ?? 'SAW');
  const [perPage, setPerPage] = useState<number>(pagination.per_page ?? 20);

  useEffect(() => {
    setQ(filters.q ?? '');
    setStatus(filters.status ?? '');
    setMethod(filters.method ?? 'SAW');
    setPerPage(pagination.per_page ?? 20);
  }, [filters, pagination.per_page]);

  const totalItems = pagination.total ?? 0;
  const pageIndex = Math.max(0, (pagination.current_page ?? 1) - 1); // 0-based
  const totalPages = Math.max(1, pagination.last_page ?? 1);
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex + 1 < totalPages;

  const apply = (args?: Partial<{ page: number; perPage: number; q?: string; status?: '' | 'miskin' | 'tidak'; method?: 'SAW' | 'WP' }>) => {
    const nextQ = args?.q ?? q;
    const nextStatus = args?.status ?? status;
    const nextMethod = args?.method ?? method;
    const nextPerPage = args?.perPage ?? perPage;
    const nextPage = args?.page ?? pageIndex + 1;

    router.get(
      '/hasil',
      {
        q: nextQ || undefined,
        status: nextStatus || undefined,
        method: nextMethod,
        perPage: nextPerPage,
        page: nextPage,
      },
      {
        only: ['rows', 'pagination', 'filters'],
        preserveState: true,
        preserveScroll: true,
        replace: true,
      },
    );
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    apply({ q: value, page: 1 });
  }, 450);

  const recalc = () => apply({ page: pageIndex + 1 });

  const gotoFirst = () => apply({ page: 1 });
  const gotoPrev = () => apply({ page: Math.max(1, pageIndex) });
  const gotoNext = () => apply({ page: Math.min(totalPages, pageIndex + 2) });
  const gotoLast = () => apply({ page: totalPages });

  const changePageSize = (n: number) => {
    setPerPage(n);
    apply({ perPage: n, page: 1 });
  };

  const goToPage = (idx: number) => {
    const clamped = Math.min(Math.max(idx, 0), totalPages - 1);
    apply({ page: clamped + 1 });
  };

  const buildExportUrl = (base: string) => {
    const u = new URL(base, window.location.origin);
    if (q) u.searchParams.set('q', q);
    if (status) u.searchParams.set('status', status);
    if (method) u.searchParams.set('method', method);
    if (perPage) u.searchParams.set('perPage', String(perPage));
    u.searchParams.set('page', String(pageIndex + 1));
    return u.toString();
  };

  const topBar = useMemo(
    () => (
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-1 flex-wrap items-end gap-3">
          <Input
            placeholder="Masukkan nama RTM"
            defaultValue={q}
            onChange={(e) => {
              const v = e.target.value;
              setQ(v);
              debouncedSearch(v);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') apply({ q, page: 1 });
            }}
            className="max-w-xs"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm">Status</span>
            <select
              value={status}
              onChange={(e) => {
                const v = e.target.value as '' | 'miskin' | 'tidak';
                setStatus(v);
                apply({ status: v, page: 1 });
              }}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="">Semua</option>
              <option value="miskin">Miskin</option>
              <option value="tidak">Tidak Miskin</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Urut</span>
            <select
              value={method}
              onChange={(e) => {
                const m = e.target.value as 'SAW' | 'WP';
                setMethod(m);
                apply({ method: m, page: 1 });
              }}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="SAW">SAW</option>
              <option value="WP">WP</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" className="gap-2" onClick={recalc}>
            <RefreshCw className="h-4 w-4" /> Hitung Ulang
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <a href={buildExportUrl('/hasil/pdf')} target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4" /> Cetak PDF
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <a href={buildExportUrl('/hasil/excel')}>
              <FileDown className="h-4 w-4" /> Unduh Excel
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <a href={buildExportUrl('/hasil/mcr/pdf')} target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4" /> MCR PDF
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <a href={buildExportUrl('/hasil/mcr/excel')}>
              <FileDown className="h-4 w-4" /> MCR Excel
            </a>
          </Button>
          <Button className="gap-2" onClick={() => router.reload({ only: ['rows'] })}>
            <FlaskConical className="h-4 w-4" /> Uji Sensitivitas
          </Button>
        </div>
      </div>
    ),
    [q, status, method, perPage, pageIndex, totalPages],
  );

  return (
    <div className="flex w-full flex-col gap-4">
      {topBar}

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[64px]">No</TableHead>
              <TableHead>Keluarga / Nama</TableHead>
              <TableHead className="w-[220px]">NIK</TableHead>
              <TableHead className="w-[120px] text-right">SAW</TableHead>
              <TableHead className="w-[120px] text-right">WP</TableHead>
              <TableHead className="w-[140px]">Status SAW</TableHead>
              <TableHead className="w-[140px]">Status WP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows?.length ? (
              rows.map((r, i) => (
                <TableRow key={r.id}>
                  <TableCell>{pageIndex * perPage + i + 1}</TableCell>
                  <TableCell className="font-medium">{r.nama}</TableCell>
                  <TableCell>{r.nik}</TableCell>
                  <TableCell className="text-right font-normal">{r.saw.toFixed(3)}</TableCell>
                  <TableCell className="text-right font-normal">{r.wp.toFixed(3)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={r.status_saw === 'Miskin' ? 'bg-amber-500/20 text-amber-600' : 'bg-emerald-500/20 text-emerald-600'}
                    >
                      {r.status_saw}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={r.status_wp === 'Miskin' ? 'bg-amber-500/20 text-amber-600' : 'bg-emerald-500/20 text-emerald-600'}
                    >
                      {r.status_wp}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-20 text-center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          Menampilkan {Math.min(pageIndex * perPage + 1, totalItems)} sampai {Math.min((pageIndex + 1) * perPage, totalItems)} dari {totalItems} hasil
          {q && <span className="ml-1">untuk "{q}"</span>}
        </div>

        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Baris per halaman
            </Label>
            <Select value={`${perPage}`} onValueChange={(value) => changePageSize(Number(value))}>
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue placeholder={perPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {[20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Halaman {pageIndex + 1} dari {totalPages}
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => goToPage(0)}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => goToPage(pageIndex - 1)}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => goToPage(pageIndex + 1)}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => goToPage(totalPages - 1)}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
