import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Criteria {
    id: number;
    name: string;
    type: string;
    weight: number;
    scale: number;
}

export interface Rtm {
    id: number;
    user_id: number;
    nik: string;
    name: string;
    address?: string;
    penghasilan_id: number;
    pengeluaran_id: number;
    tempat_tinggal_id: number;
    status_kepemilikan_rumah_id: number;
    kondisi_rumah_id: number;
    aset_yang_dimiliki_id: number;
    transportasi_id: number;
    penerangan_rumah_id: number;
    created_at: string;
    updated_at: string;
    penghasilan_criteria?: Criteria;
    pengeluaran_criteria?: Criteria;
    tempat_tinggal_criteria?: Criteria;
    status_kepemilikan_rumah_criteria?: Criteria;
    kondisi_rumah_criteria?: Criteria;
    aset_yang_dimiliki_criteria?: Criteria;
    transportasi_criteria?: Criteria;
    penerangan_rumah_criteria?: Criteria;
}

export interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    path: string;
    first_page_url: string;
    last_page_url: string;
}
