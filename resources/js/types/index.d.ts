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
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────
// Enums & Types
// ─────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'candidate';
export type UserStatus = 'pending' | 'active' | 'rejected';

export type CompanySector =
    | 'tech'
    | 'finance'
    | 'healthcare'
    | 'retail'
    | 'services'
    | 'education'
    | 'other';

export type Availability = 'immediate' | '1_week' | '1_month' | 'negotiable';

export type EducationLevel = 'bac' | 'bac+2' | 'bac+3' | 'bac+5' | 'phd';

export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead';

export type WorkMode = 'onsite' | 'remote' | 'hybrid';

export type OfferType = 'full-time' | 'part-time' | 'freelance' | 'internship';

export type LanguageProficiency =
    | 'basic'
    | 'intermediate'
    | 'fluent'
    | 'native';

export type QuestionType = 'yes_no' | 'text' | 'number' | 'select';

export type ApplicationStatus =
    | 'new'
    | 'viewed'
    | 'shortlisted'
    | 'interview'
    | 'offered'
    | 'rejected'
    | 'hired'
    | 'withdrawn';

// ─────────────────────────────────────────────────────────────
// User
// ─────────────────────────────────────────────────────────────

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    avatar_path?: string | null;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    role: UserRole;
    status: UserStatus;
    created_at: string;
    updated_at: string;
    // Relations
    profile?: Profile;
}

// ─────────────────────────────────────────────────────────────
// Company
// ─────────────────────────────────────────────────────────────

export interface Company {
    id: number;
    name: string;
    logo_path: string | null;
    website_url: string | null;
    sector: CompanySector;
    description: string | null;
    city: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
    // Relations
    offers?: Offer[];
}

// ─────────────────────────────────────────────────────────────
// Profile & Related
// ─────────────────────────────────────────────────────────────

export interface Profile {
    id: number;
    user_id: number;
    headline: string;
    resume_path: string | null;
    phone: string;
    skills: string[];
    linkedin_url: string | null;
    portfolio_url: string | null;
    // Location
    city: string | null;
    country: string;
    // Personal
    date_of_birth: string | null;
    nationality: string | null;
    // Professional
    years_of_experience: number | null;
    expected_salary: string | null;
    availability: Availability | null;
    education_level: EducationLevel | null;
    // Morocco-specific
    has_driving_license: boolean;
    created_at: string;
    updated_at: string;
    // Relations
    education?: ProfileEducation[];
    experience?: ProfileExperience[];
    languages?: ProfileLanguage[];
}

export interface ProfileEducation {
    id: number;
    profile_id: number;
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProfileExperience {
    id: number;
    profile_id: number;
    company: string;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProfileLanguage {
    id: number;
    profile_id: number;
    language: string;
    proficiency: LanguageProficiency;
    created_at: string;
    updated_at: string;
}

// ─────────────────────────────────────────────────────────────
// Offer & Related
// ─────────────────────────────────────────────────────────────

export interface Offer {
    id: number;
    company_id: number;
    slug: string;
    title: string;
    description: string;
    location: string;
    work_mode: WorkMode;
    salary_range: string | null;
    type: OfferType;
    experience_level: ExperienceLevel;
    education_required: EducationLevel | 'none' | null;
    languages_required: string[] | null;
    benefits: string[] | null;
    positions_count: number;
    views_count: number;
    is_urgent: boolean;
    is_active: boolean;
    deadline: string;
    created_at: string;
    updated_at: string;
    // Relations
    company?: Company;
    screener_questions?: OfferScreenerQuestion[];
}

export interface OfferScreenerQuestion {
    id: number;
    offer_id: number;
    question: string;
    type: QuestionType;
    options: string[] | null;
    is_required: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

// ─────────────────────────────────────────────────────────────
// Application & Related
// ─────────────────────────────────────────────────────────────

export interface Application {
    id: number;
    user_id: number;
    offer_id: number;
    status: ApplicationStatus;
    cover_note: string | null;
    screener_responses: Record<string, string | number | boolean> | null;
    rejection_reason: string | null;
    interview_at: string | null;
    created_at: string;
    updated_at: string;
    // Relations
    user?: User;
    offer?: Offer;
    notes?: ApplicationNote[];
}

export interface ApplicationNote {
    id: number;
    application_id: number;
    user_id: number;
    note: string;
    created_at: string;
    updated_at: string;
    // Relations
    author?: User;
}
