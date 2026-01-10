import { StatCard } from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    useAdminStats,
    useCompanies,
    usePendingUsers,
} from '@/hooks/use-mock-data';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    CalendarCheck,
    CheckCircle,
    Clock,
    FileText,
    Flame,
    Users,
    XCircle,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Dashboard', href: '/admin' },
];

export default function AdminDashboard() {
    const stats = useAdminStats();
    const pendingUsers = usePendingUsers();
    const companies = useCompanies();

    // Additional stats
    const verifiedCompanies = companies.filter((c) => c.is_verified).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Manage users, companies, offers, and applications from
                        here.
                    </p>
                </div>

                {/* Primary Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Pending Approvals"
                        value={stats.pendingApprovals}
                        icon="solar:hourglass-bold"
                        trend={
                            stats.pendingApprovals > 0
                                ? `${stats.pendingApprovals} awaiting review`
                                : undefined
                        }
                    />
                    <StatCard
                        label="Active Offers"
                        value={stats.activeOffers}
                        icon="solar:case-minimalistic-bold"
                    />
                    <StatCard
                        label="New Applications"
                        value={stats.newApplications}
                        icon="solar:document-add-bold"
                        trend="+3 this week"
                    />
                    <StatCard
                        label="Total Candidates"
                        value={stats.totalUsers}
                        icon="solar:users-group-rounded-bold"
                    />
                </div>

                {/* Secondary Stats Grid - v0.2 */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total Companies"
                        value={stats.totalCompanies}
                        icon="solar:buildings-bold"
                    />
                    <StatCard
                        label="Verified Companies"
                        value={verifiedCompanies}
                        icon="solar:verified-check-bold"
                    />
                    <StatCard
                        label="Urgent Offers"
                        value={stats.urgentOffers}
                        icon="solar:fire-bold"
                        trend={
                            stats.urgentOffers > 0
                                ? 'Requires immediate attention'
                                : undefined
                        }
                    />
                    <StatCard
                        label="Interviews Scheduled"
                        value={stats.interviewsScheduled}
                        icon="solar:calendar-bold"
                    />
                </div>

                {/* Quick Actions & Pending Users */}
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Quick Actions */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 lg:col-span-3 dark:border-sidebar-border">
                        <h3 className="mb-4 font-semibold text-foreground">
                            Quick Actions
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Link href="/admin/users">
                                <Button
                                    variant="outline"
                                    className="h-auto w-full justify-start gap-3 px-4 py-3"
                                >
                                    <Users className="size-5 text-purple-600" />
                                    <div className="text-left">
                                        <div className="font-medium">
                                            User Management
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Approve or reject users
                                        </div>
                                    </div>
                                </Button>
                            </Link>
                            <Link href="/admin/offers">
                                <Button
                                    variant="outline"
                                    className="h-auto w-full justify-start gap-3 px-4 py-3"
                                >
                                    <Briefcase className="size-5 text-purple-600" />
                                    <div className="text-left">
                                        <div className="font-medium">
                                            Manage Offers
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Create, edit, archive
                                        </div>
                                    </div>
                                </Button>
                            </Link>
                            <Link href="/admin/applications">
                                <Button
                                    variant="outline"
                                    className="h-auto w-full justify-start gap-3 px-4 py-3"
                                >
                                    <FileText className="size-5 text-purple-600" />
                                    <div className="text-left">
                                        <div className="font-medium">
                                            Review Applications
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {stats.newApplications} new pending
                                        </div>
                                    </div>
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="h-auto w-full justify-start gap-3 px-4 py-3"
                                disabled
                            >
                                <Building2 className="size-5 text-purple-600" />
                                <div className="text-left">
                                    <div className="font-medium">
                                        Manage Companies
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Coming soon
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </div>

                    {/* Pending Users */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 lg:col-span-4 dark:border-sidebar-border">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">
                                Pending Approvals
                            </h3>
                            <Link
                                href="/admin/users?status=pending"
                                className="text-sm text-purple-600 hover:underline"
                            >
                                View all
                            </Link>
                        </div>

                        {pendingUsers.length > 0 ? (
                            <div className="space-y-3">
                                {pendingUsers.slice(0, 5).map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                                    {user.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')
                                                        .slice(0, 2)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600"
                                            >
                                                <Clock className="mr-1 size-3" />
                                                Pending
                                            </Badge>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="size-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                >
                                                    <CheckCircle className="size-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <XCircle className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center rounded-lg border border-dashed border-neutral-200 py-12 dark:border-neutral-800">
                                <div className="text-center">
                                    <CheckCircle className="mx-auto mb-2 size-8 text-green-500 opacity-50" />
                                    <p className="text-sm font-medium text-neutral-500">
                                        All caught up!
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        No pending approvals
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Urgent Offers & Scheduled Interviews */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Urgent Offers Alert */}
                    {stats.urgentOffers > 0 && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-red-500/20">
                                    <Flame className="size-5 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        {stats.urgentOffers} Urgent Offer
                                        {stats.urgentOffers > 1 ? 's' : ''}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        These positions require immediate
                                        attention
                                    </p>
                                </div>
                            </div>
                            <Link href="/admin/offers?urgent=true">
                                <Button
                                    variant="outline"
                                    className="mt-4 border-red-500/30 text-red-600 hover:bg-red-500/10"
                                >
                                    View Urgent Offers
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Interviews Today */}
                    {stats.interviewsScheduled > 0 && (
                        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-indigo-500/20">
                                    <CalendarCheck className="size-5 text-indigo-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        {stats.interviewsScheduled} Interview
                                        {stats.interviewsScheduled > 1
                                            ? 's'
                                            : ''}{' '}
                                        Scheduled
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Candidates awaiting interviews
                                    </p>
                                </div>
                            </div>
                            <Link href="/admin/applications?status=interview">
                                <Button
                                    variant="outline"
                                    className="mt-4 border-indigo-500/30 text-indigo-600 hover:bg-indigo-500/10"
                                >
                                    View Scheduled Interviews
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
