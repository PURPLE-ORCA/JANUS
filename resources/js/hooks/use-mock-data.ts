import { useMemo, useState } from 'react';

import applicationsData from '@/data/applications.json';
import companiesData from '@/data/companies.json';
import offersData from '@/data/offers.json';
import profilesData from '@/data/profiles.json';
import usersData from '@/data/users.json';
import type {
    Application,
    ApplicationStatus,
    Company,
    CompanySector,
    ExperienceLevel,
    Offer,
    OfferType,
    Profile,
    User,
    UserRole,
    UserStatus,
    WorkMode,
} from '@/types';

// ─────────────────────────────────────────────────────────────
// Mock Role Toggle (for development)
// ─────────────────────────────────────────────────────────────

const MOCK_ROLE_KEY = 'janus_mock_role';

export function useMockRole() {
    const [role, setRoleState] = useState<UserRole>(() => {
        if (typeof window === 'undefined') return 'candidate';
        return (localStorage.getItem(MOCK_ROLE_KEY) as UserRole) || 'candidate';
    });

    const setRole = (newRole: UserRole) => {
        localStorage.setItem(MOCK_ROLE_KEY, newRole);
        setRoleState(newRole);
    };

    const toggleRole = () => setRole(role === 'admin' ? 'candidate' : 'admin');

    return { role, setRole, toggleRole, isAdmin: role === 'admin' };
}

// ─────────────────────────────────────────────────────────────
// Companies
// ─────────────────────────────────────────────────────────────

export function useCompanies(sectorFilter?: CompanySector) {
    const companies = companiesData as Company[];

    return useMemo(() => {
        if (!sectorFilter) return companies;
        return companies.filter((c) => c.sector === sectorFilter);
    }, [companies, sectorFilter]);
}

export function useCompany(id: number) {
    const companies = companiesData as Company[];

    return useMemo(() => {
        return companies.find((c) => c.id === id) || null;
    }, [companies, id]);
}

export function useVerifiedCompanies() {
    const companies = companiesData as Company[];

    return useMemo(() => {
        return companies.filter((c) => c.is_verified);
    }, [companies]);
}

// ─────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────

export function useUsers(statusFilter?: UserStatus) {
    const users = usersData as User[];

    return useMemo(() => {
        if (!statusFilter) return users;
        return users.filter((u) => u.status === statusFilter);
    }, [users, statusFilter]);
}

export function useUser(id: number) {
    const users = usersData as User[];
    const profiles = profilesData as Profile[];

    return useMemo(() => {
        const user = users.find((u) => u.id === id);
        if (!user) return null;

        const profile = profiles.find((p) => p.user_id === id);
        return { ...user, profile } as User;
    }, [users, profiles, id]);
}

export function usePendingUsers() {
    return useUsers('pending');
}

// ─────────────────────────────────────────────────────────────
// Profiles
// ─────────────────────────────────────────────────────────────

export function useProfile(userId: number) {
    const profiles = profilesData as Profile[];

    return useMemo(() => {
        return profiles.find((p) => p.user_id === userId) || null;
    }, [profiles, userId]);
}

// ─────────────────────────────────────────────────────────────
// Offers
// ─────────────────────────────────────────────────────────────

interface OfferFilters {
    search?: string;
    type?: OfferType;
    location?: string;
    activeOnly?: boolean;
    // New v0.2 filters
    companyId?: number;
    sector?: CompanySector;
    workMode?: WorkMode;
    experienceLevel?: ExperienceLevel;
    isUrgent?: boolean;
}

export function useOffers(filters?: OfferFilters) {
    const offers = offersData as Offer[];
    const companies = companiesData as Company[];

    return useMemo(() => {
        let result = [...offers];

        if (filters?.activeOnly !== false) {
            result = result.filter((o) => o.is_active);
        }

        if (filters?.search) {
            const query = filters.search.toLowerCase();
            result = result.filter(
                (o) =>
                    o.title.toLowerCase().includes(query) ||
                    o.description.toLowerCase().includes(query),
            );
        }

        if (filters?.type) {
            result = result.filter((o) => o.type === filters.type);
        }

        if (filters?.location) {
            result = result.filter((o) =>
                o.location
                    .toLowerCase()
                    .includes(filters.location!.toLowerCase()),
            );
        }

        // New v0.2 filters
        if (filters?.companyId) {
            result = result.filter((o) => o.company_id === filters.companyId);
        }

        if (filters?.sector) {
            const companyIds = companies
                .filter((c) => c.sector === filters.sector)
                .map((c) => c.id);
            result = result.filter((o) => companyIds.includes(o.company_id));
        }

        if (filters?.workMode) {
            result = result.filter((o) => o.work_mode === filters.workMode);
        }

        if (filters?.experienceLevel) {
            result = result.filter(
                (o) => o.experience_level === filters.experienceLevel,
            );
        }

        if (filters?.isUrgent) {
            result = result.filter((o) => o.is_urgent);
        }

        // Populate company relation
        return result.map((offer) => ({
            ...offer,
            company: companies.find((c) => c.id === offer.company_id),
        }));
    }, [offers, companies, filters]);
}

export function useOffer(slug: string) {
    const offers = offersData as Offer[];
    const companies = companiesData as Company[];

    return useMemo(() => {
        const offer = offers.find((o) => o.slug === slug);
        if (!offer) return null;

        const company = companies.find((c) => c.id === offer.company_id);
        return { ...offer, company } as Offer;
    }, [offers, companies, slug]);
}

export function useUrgentOffers() {
    return useOffers({ isUrgent: true, activeOnly: true });
}

// ─────────────────────────────────────────────────────────────
// Applications
// ─────────────────────────────────────────────────────────────

export function useApplications(userId?: number, offerId?: number) {
    const applications = applicationsData as Application[];
    const users = usersData as User[];
    const offers = offersData as Offer[];
    const companies = companiesData as Company[];

    return useMemo(() => {
        let result = [...applications];

        if (userId) {
            result = result.filter((a) => a.user_id === userId);
        }

        if (offerId) {
            result = result.filter((a) => a.offer_id === offerId);
        }

        // Populate relations
        return result.map((app) => {
            const offer = offers.find((o) => o.id === app.offer_id);
            const company = offer
                ? companies.find((c) => c.id === offer.company_id)
                : undefined;

            return {
                ...app,
                user: users.find((u) => u.id === app.user_id),
                offer: offer ? { ...offer, company } : undefined,
            };
        });
    }, [applications, users, offers, companies, userId, offerId]);
}

export function useApplicationsByStatus(status: ApplicationStatus) {
    const applications = useApplications();

    return useMemo(() => {
        return applications.filter((a) => a.status === status);
    }, [applications, status]);
}

// ─────────────────────────────────────────────────────────────
// Stats (for dashboards)
// ─────────────────────────────────────────────────────────────

export function useAdminStats() {
    const users = usersData as User[];
    const offers = offersData as Offer[];
    const applications = applicationsData as Application[];
    const companies = companiesData as Company[];

    return useMemo(
        () => ({
            totalUsers: users.filter((u) => u.role === 'candidate').length,
            pendingApprovals: users.filter((u) => u.status === 'pending')
                .length,
            activeOffers: offers.filter((o) => o.is_active).length,
            totalApplications: applications.length,
            newApplications: applications.filter((a) => a.status === 'new')
                .length,
            // New v0.2 stats
            totalCompanies: companies.length,
            verifiedCompanies: companies.filter((c) => c.is_verified).length,
            urgentOffers: offers.filter((o) => o.is_urgent && o.is_active)
                .length,
            interviewsScheduled: applications.filter(
                (a) => a.status === 'interview',
            ).length,
        }),
        [users, offers, applications, companies],
    );
}

export function useCandidateStats(userId: number) {
    const applications = useApplications(userId);

    return useMemo(
        () => ({
            totalApplications: applications.length,
            shortlisted: applications.filter((a) => a.status === 'shortlisted')
                .length,
            pending: applications.filter(
                (a) => a.status === 'new' || a.status === 'viewed',
            ).length,
            rejected: applications.filter((a) => a.status === 'rejected')
                .length,
            // New v0.2 stats
            interviews: applications.filter((a) => a.status === 'interview')
                .length,
            offered: applications.filter((a) => a.status === 'offered').length,
            hired: applications.filter((a) => a.status === 'hired').length,
        }),
        [applications],
    );
}
