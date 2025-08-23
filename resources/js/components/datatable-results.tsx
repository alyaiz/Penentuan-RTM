import DialogCalculate from '@/components/dialog-calculate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RtmResult, RtmStats, RtmTresholds } from '@/types';
import { router } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, RefreshCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type DataTableProps = {
    data: RtmResult[];
    pageIndex: number;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    totalItems: number;
    perPage: number;
    stats: RtmStats;
    tresholds: RtmTresholds;
    initialFilters?: {
        search?: string;
    };
};

export default function DataTableResults({
    data,
    pageIndex,
    setPageIndex,
    totalPages,
    totalItems,
    perPage,
    stats,
    tresholds,
    initialFilters = {},
}: DataTableProps) {
    const getSearchFromUrl = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('search') || '';
        }
        return '';
    };

    const [searchValue, setSearchValue] = useState(() => {
        const urlSearch = getSearchFromUrl();
        return urlSearch || initialFilters.search || '';
    });

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [openDialogCalculate, setOpenDialogCalculate] = useState(false);

    useEffect(() => {
        const urlSearch = getSearchFromUrl();
        const newSearchValue = urlSearch || initialFilters.search || '';
        setSearchValue(newSearchValue);
    }, [initialFilters.search]);

    useEffect(() => {
        if (stats.saw > 0 || stats.wp > 0) {
            setOpenDialogCalculate(true);
        }
    }, [stats]);

    const columns: ColumnDef<RtmResult>[] = useMemo(
        () => [
            {
                id: 'rowNumber',
                header: 'No',
                cell: ({ row }) => <div className="text-foreground text-left">{row.index + 1}</div>,
                enableHiding: false,
            },
            {
                accessorKey: 'nama',
                header: 'Nama',
                cell: ({ row }) => {
                    return <div className="text-foreground text-left">{row.original.name ? row.original.name : '-'}</div>;
                },
            },
            {
                accessorKey: 'alamat',
                header: 'Alamat',
                cell: ({ row }) => {
                    return <div className="text-foreground text-left">{row.original.address ? row.original.address : '-'}</div>;
                },
            },
            {
                accessorKey: 'SAW',
                header: 'SAW',
                cell: ({ row }) => {
                    return <div className="text-foreground text-left">{row.original.saw.score ? row.original.saw.score : '-'}</div>;
                },
            },
            {
                accessorKey: 'status_saw',
                header: 'Status SAW',
                cell: ({ row }) => {
                    const score = row.original.saw?.score;

                    if (score === null || score === undefined) {
                        return '-';
                    }

                    return (
                        <Badge
                            className="flex gap-1 px-1.5 text-white [&_svg]:size-3"
                            style={{
                                backgroundColor: score >= tresholds.saw ? 'var(--chart-3)' : score < tresholds.saw ? 'var(--chart-1)' : undefined,
                            }}
                        >
                            {score < tresholds.saw ? 'Miskin' : 'Tidak Miskin'}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'WP',
                header: 'WP',
                cell: ({ row }) => {
                    return <div className="text-foreground text-left">{row.original.wp?.score ? row.original.wp?.score : '-'}</div>;
                },
            },
            {
                accessorKey: 'status wp',
                header: 'Status WP',
                cell: ({ row }) => {
                    const score = row.original.wp?.score;

                    if (score === null || score === undefined) {
                        return '-';
                    }

                    return (
                        <Badge
                            className={`flex gap-1 px-1.5 text-white [&_svg]:size-3`}
                            style={{
                                backgroundColor: score >= tresholds.wp ? 'var(--chart-3)' : score < tresholds.wp ? 'var(--chart-1)' : undefined,
                            }}
                        >
                            {score < tresholds.wp ? 'Miskin' : 'Tidak Miskin'}{' '}
                        </Badge>
                    );
                },
            },
        ],
        [],
    );

    const buildUrlWithParams = (params: Record<string, string | number | undefined>) => {
        const currentUrl = new URL(window.location.href);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                currentUrl.searchParams.set(key, value.toString());
            } else {
                currentUrl.searchParams.delete(key);
            }
        });

        return currentUrl.toString();
    };

    const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
        const url = buildUrlWithParams({
            search: searchTerm || undefined,
            page: 1,
        });

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            only: ['rtms'],
        });
    }, 500);

    const goToPage = (page: number) => {
        const newPage = Math.max(0, Math.min(page, totalPages - 1));
        setPageIndex(newPage);

        const url = buildUrlWithParams({
            page: newPage + 1,
            search: getSearchFromUrl(),
        });
        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            only: ['rtms'],
        });
    };

    const changePageSize = (newPerPage: number) => {
        const currentSearch = getSearchFromUrl();
        const url = buildUrlWithParams({
            per_page: newPerPage,
            page: 1,
            search: currentSearch || undefined,
        });

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            only: ['rtms'],
        });
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
        debouncedSearch(value);
    };

    const handleRetryCalculate = () => {
        setOpenDialogCalculate(true);
    };

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            pagination: {
                pageIndex,
                pageSize: perPage,
            },
        },
        pageCount: totalPages,
        manualPagination: true,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < totalPages - 1;

    return (
        <>
            <div className="flex w-full flex-col justify-start gap-4">
                <div className="relative flex flex-col gap-4 overflow-auto">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex w-full justify-center gap-2 md:order-2 md:justify-end">
                            <div className="flex-1 md:flex-none">
                                <Button variant="outline" className="w-full" onClick={handleRetryCalculate}>
                                    <RefreshCcw />
                                    <span className="lg:inline">Hitung Ulang</span>
                                </Button>
                            </div>
                        </div>

                        <Input
                            placeholder="Cari nama atau alamat..."
                            value={searchValue}
                            onChange={handleSearchChange}
                            className="max-w-sm md:order-1"
                        />
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan}>
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            {searchValue ? 'Tidak ada hasil yang ditemukan.' : 'Tidak ada data.'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between px-4">
                        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                            Menampilkan {Math.min(pageIndex * perPage + 1, totalItems)} sampai {Math.min((pageIndex + 1) * perPage, totalItems)} dari{' '}
                            {totalItems} hasil
                            {searchValue && <span className="ml-1">untuk "{searchValue}"</span>}
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
            </div>

            <DialogCalculate open={openDialogCalculate} onOpenChange={setOpenDialogCalculate} stats={stats} />
        </>
    );
}
