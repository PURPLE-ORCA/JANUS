import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

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
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    role: UserRole;
    status: UserStatus;
    created_at: string;
    updated_at: string;
    profile?: Profile;
}

// ─────────────────────────────────────────────────────────────
// Domain Types
// ─────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'candidate';
export type UserStatus = 'pending' | 'active' | 'rejected';
export type OfferType = 'full-time' | 'part-time' | 'freelance';
export type ApplicationStatus =
    | 'new'
    | 'viewed'
    | 'shortlisted'
    | 'interview'
    | 'rejected'
    | 'hired'
    | 'withdrawn';

export interface Profile {
    id: number;
    user_id: number;
    headline: string;
    resume_path: string | null;
    phone: string;
    skills: string[];
    linkedin_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Offer {
    id: number;
    slug: string;
    title: string;
    description: string;
    location: string;
    salary_range: string | null;
    type: OfferType;
    is_active: boolean;
    deadline: string;
    created_at: string;
    updated_at: string;
}

export interface Application {
    id: number;
    user_id: number;
    offer_id: number;
    status: ApplicationStatus;
    cover_note: string | null;
    created_at: string;
    updated_at: string;
    // Populated relations (optional)
    user?: User;
    offer?: Offer;
}
