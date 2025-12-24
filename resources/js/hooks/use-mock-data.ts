import { useMemo, useState } from 'react';

import applicationsData from '@/data/applications.json';
import offersData from '@/data/offers.json';
import profilesData from '@/data/profiles.json';
import usersData from '@/data/users.json';
import type {
    Application,
    ApplicationStatus,
    Offer,
    OfferType,
    Profile,
    User,
    UserRole,
    UserStatus,
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
}

export function useOffers(filters?: OfferFilters) {
    const offers = offersData as Offer[];

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

        return result;
    }, [offers, filters]);
}

export function useOffer(slug: string) {
    const offers = offersData as Offer[];

    return useMemo(() => {
        return offers.find((o) => o.slug === slug) || null;
    }, [offers, slug]);
}

// ─────────────────────────────────────────────────────────────
// Applications
// ─────────────────────────────────────────────────────────────

export function useApplications(userId?: number, offerId?: number) {
    const applications = applicationsData as Application[];
    const users = usersData as User[];
    const offers = offersData as Offer[];

    return useMemo(() => {
        let result = [...applications];

        if (userId) {
            result = result.filter((a) => a.user_id === userId);
        }

        if (offerId) {
            result = result.filter((a) => a.offer_id === offerId);
        }

        // Populate relations
        return result.map((app) => ({
            ...app,
            user: users.find((u) => u.id === app.user_id),
            offer: offers.find((o) => o.id === app.offer_id),
        }));
    }, [applications, users, offers, userId, offerId]);
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

    return useMemo(
        () => ({
            totalUsers: users.filter((u) => u.role === 'candidate').length,
            pendingApprovals: users.filter((u) => u.status === 'pending')
                .length,
            activeOffers: offers.filter((o) => o.is_active).length,
            totalApplications: applications.length,
            newApplications: applications.filter((a) => a.status === 'new')
                .length,
        }),
        [users, offers, applications],
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
        }),
        [applications],
    );
}
