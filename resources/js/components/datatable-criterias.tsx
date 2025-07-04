import CreateUserDialog from '@/components/create-user-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Criteria } from '@/types';
import { router, usePage } from '@inertiajs/react';
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
import { ChevronDownIcon, ColumnsIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type DataTableProps = {
    data: Criteria[];
    totalItems: number;
    initialFilters?: {
        search?: string;
    };
};

export default function DataTableCriterias({ data, totalItems, initialFilters = {} }: DataTableProps) {
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
    const { url } = usePage();

    useEffect(() => {
        const urlSearch = getSearchFromUrl();
        const newSearchValue = urlSearch || initialFilters.search || '';
        setSearchValue(newSearchValue);
    }, [initialFilters.search]);

    const columns: ColumnDef<Criteria>[] = useMemo(
        () => [
            {
                id: 'rowNumber',
                header: 'No',
                cell: ({ row }) => {
                    return <div className="text-foreground text-left">{row.index + 1}</div>;
                },
                enableHiding: false,
            },
            {
                accessorKey: 'kualifikasi',
                header: 'Kualifikasi',
                cell: ({ row }) => {
                    return <div className="text-foreground text-left">{row.original.name}</div>;
                },
                enableHiding: false,
            },
            {
                accessorKey: 'kriteria',
                header: 'Kriteria',
                cell: ({ row }) => {
                    const typeMap: Record<string, string> = {
                        penghasilan: 'Penghasilan',
                        pengeluaran: 'Pengeluaran',
                        tempat_tinggal: 'Tempat Tinggal',
                        status_kepemilikan_rumah: 'Status Kepemilikan Rumah',
                        kondisi_rumah: 'Kondisi Rumah',
                        aset_yang_dimiliki: 'Aset yang Dimiliki',
                        transportasi: 'Transportasi',
                        penerangan_rumah: 'Penerangan Rumah',
                    };

                    const colorMap: Record<string, string> = {
                        penghasilan: 'var(--chart-1)',
                        pengeluaran: 'var(--chart-2)',
                        tempat_tinggal: 'var(--chart-3)',
                        status_kepemilikan_rumah: 'var(--chart-4)',
                        kondisi_rumah: 'var(--chart-5)',
                        aset_yang_dimiliki: 'var(--chart-1)',
                        transportasi: 'var(--chart-2)',
                        penerangan_rumah: 'var(--chart-3)',
                    };

                    const type = row.original.type;

                    return (
                        <Badge className="flex gap-1 px-1.5 text-white [&_svg]:size-3" style={{ backgroundColor: colorMap[type] || 'gray' }}>
                            {typeMap[type] || type}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'bobot',
                header: 'Bobot',
                cell: ({ row }) => {
                    return <div className="text-foreground text-left">{row.original.weight}</div>;
                },
            },
            {
                accessorKey: 'skala',
                header: 'Skala',
                cell: ({ row }) => {
                    return <div className="text-foreground text-left">{row.original.scale}</div>;
                },
            },
        ],
        [url],
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
        });

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            only: ['criterias'],
        });
    }, 500);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
        debouncedSearch(value);
    };

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    return (
        <>
            <div className="flex w-full flex-col justify-start gap-4">
                <div className="relative flex flex-col gap-4 overflow-auto">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex w-full justify-center gap-2 md:order-2 md:justify-end">
                            <div className="flex-1 md:flex-none">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full md:w-auto">
                                            <ColumnsIcon />
                                            <span className="hidden lg:inline">Sesuaikan Kolom</span>
                                            <span className="lg:hidden">Kolom</span>
                                            <ChevronDownIcon />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        {table
                                            .getAllColumns()
                                            .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                                            .map((column) => (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                >
                                                    {column.id}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex-1 md:flex-none">
                                <CreateUserDialog />
                            </div>
                        </div>

                        <Input
                            placeholder="Cari kualifikasi atau kriteria..."
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
                            Menampilkan {totalItems} hasil
                            {searchValue && <span className="ml-1">untuk "{searchValue}"</span>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
