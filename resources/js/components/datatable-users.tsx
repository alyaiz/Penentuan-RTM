// import { TableCellViewer } from '@/components/table-cell-viewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/types';
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
import {
    CheckCircle2,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    CircleX,
    ColumnsIcon,
    UserRoundCheck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { AddUserDialog } from './add-user-dialog';
import DeleteUserDialog from './delete-user-dialog';
import { EditUserDialog } from './edit-user-dialog';
// import DialogPublicVideo from './dialog/dialog-public-video';
// import DialogYourVideo from './dialog/dialog-your-video';

type DataTableProps = {
    data: User[];
    pageIndex: number;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    totalItems: number;
    perPage: number;
    initialFilters?: {
        search?: string;
    };
};

export default function DataTableUsers({ data, pageIndex, setPageIndex, totalPages, totalItems, perPage, initialFilters = {} }: DataTableProps) {
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
    // const [editingUser, setEditingUser] = useState<User | null>(null);
    // const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        const urlSearch = getSearchFromUrl();
        const newSearchValue = urlSearch || initialFilters.search || '';
        setSearchValue(newSearchValue);
    }, [initialFilters.search]);

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Nama',
                cell: ({ row }) => {
                    return <div className="text-foreground text-left">{row.original.name}</div>;
                },
                enableHiding: false,
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: ({ row }) => {
                    return <div className="text-foreground text-left">{row.original.email}</div>;
                },
            },
            {
                accessorKey: 'role',
                header: 'Peran',
                cell: ({ row }) => (
                    <Badge
                        className={`flex gap-1 px-1.5 [&_svg]:size-3 ${
                            ['super admin', 'admin'].includes(row.original.role) ? 'text-black' : 'text-white'
                        }`}
                        style={{
                            backgroundColor:
                                row.original.role === 'super admin' ? 'var(--chart-1)' : row.original.role === 'admin' ? 'var(--chart-3)' : undefined,
                        }}
                    >
                        {row.original.role === 'super admin' && <UserRoundCheck className="text-black" />}
                        {row.original.role === 'admin' && <UserRoundCheck className="text-black" />}
                        {
                            {
                                'super admin': 'Super Admin',
                                admin: 'Admin',
                            }[row.original.role]
                        }
                    </Badge>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => (
                    <Badge
                        className={`flex gap-1 px-1.5 [&_svg]:size-3 ${
                            ['aktif', 'nonaktif'].includes(row.original.status) ? 'text-black' : 'text-white'
                        }`}
                        style={{
                            backgroundColor:
                                row.original.status === 'aktif'
                                    ? 'var(--chart-1)'
                                    : row.original.status === 'nonaktif'
                                      ? 'var(--chart-3)'
                                      : undefined,
                        }}
                    >
                        {row.original.status === 'aktif' && <CheckCircle2 className="text-black" />}
                        {row.original.status === 'nonaktif' && <CircleX className="text-black" />}
                        {
                            {
                                aktif: 'Aktif',
                                nonaktif: 'Nonaktif',
                            }[row.original.status]
                        }
                    </Badge>
                ),
            },
            {
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <EditUserDialog user={row.original} />
                        <DeleteUserDialog user={row.original} />
                    </div>
                    // <DropdownMenu>
                    //     <DropdownMenuTrigger asChild>
                    //         <Button variant="ghost" className="text-muted-foreground data-[state=open]:bg-muted flex size-8" size="icon">
                    //             <MoreVerticalIcon />
                    //             <span className="sr-only">Open menu</span>
                    //         </Button>
                    //     </DropdownMenuTrigger>
                    //     <DropdownMenuContent align="end" className="w-32">
                    //         <DropdownMenuItem
                    //         // onClick={() => {
                    //         //     setEditingUser(row.original);
                    //         //     setIsDialogOpen(true);
                    //         // }}
                    //         >
                    //             <EditUserDialog />
                    //         </DropdownMenuItem>
                    //         <DropdownMenuItem>Hapus</DropdownMenuItem>
                    //     </DropdownMenuContent>
                    // </DropdownMenu>
                ),
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
            page: 1,
        });

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            only: ['users'],
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
            only: ['users'],
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
            only: ['users'],
        });
    };

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
                                <AddUserDialog />
                            </div>
                        </div>

                        <Input
                            placeholder="Cari judul, channel, atau status..."
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
                                        {[10, 20, 30, 40, 50].map((pageSize) => (
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

            {/* {editingUser && <EditUserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} user={editingUser} />} */}
        </>
    );
}
