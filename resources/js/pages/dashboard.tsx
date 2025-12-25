import { StatCard } from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'; // Keep for now as filler
import {
    useApplications,
    useCandidateStats,
    useMockRole,
} from '@/hooks/use-mock-data';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const { role, toggleRole } = useMockRole();

    // In a real app, this would be determined by auth.user.role
    // But for dev, we allow toggling to see both views
    const isCandidate = role === 'candidate';

    const stats = useCandidateStats(auth.user.id);
    const applications = useApplications(auth.user.id);
    const recentApplications = applications.slice(0, 5);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'hired':
                return 'bg-green-500 hover:bg-green-600';
            case 'shortlisted':
                return 'bg-violet-500 hover:bg-violet-600';
            case 'rejected':
                return 'bg-red-500 hover:bg-red-600';
            case 'viewed':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'new':
            default:
                return 'bg-yellow-500 hover:bg-yellow-600';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Welcome back, {auth.user.name.split(' ')[0]}
                        </h1>
                        <p className="text-muted-foreground">
                            Here's what's happening with your applications
                            today.
                        </p>
                    </div>

                    {/* Role Toggle for Dev */}
                    <button
                        onClick={toggleRole}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                    >
                        View as {role === 'admin' ? 'Candidate' : 'Admin'}
                    </button>
                </div>

                {/* Candidate Dashboard */}
                {isCandidate ? (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                label="Total Applications"
                                value={stats.totalApplications}
                                icon="solar:document-bold"
                            />
                            <StatCard
                                label="In Review"
                                value={stats.pending}
                                icon="solar:hourglass-bold"
                                trend="+1 this week"
                            />
                            <StatCard
                                label="Shortlisted"
                                value={stats.shortlisted}
                                icon="solar:star-bold"
                            />
                            <StatCard
                                label="Rejected"
                                value={stats.rejected}
                                icon="solar:close-circle-bold"
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
                            {/* Recent Activity / Applications List */}
                            <div className="col-span-4 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="font-semibold text-foreground">
                                        Recent Applications
                                    </h3>
                                    <span className="text-sm text-muted-foreground">
                                        Last 30 days
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {recentApplications.length > 0 ? (
                                        <div className="space-y-2">
                                            {recentApplications.map((app) => (
                                                <div
                                                    key={app.id}
                                                    className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white p-3 shadow-sm transition-colors hover:border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                                                {app.offer?.title
                                                                    .substring(
                                                                        0,
                                                                        2,
                                                                    )
                                                                    .toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-foreground">
                                                                {
                                                                    app.offer
                                                                        ?.title
                                                                }
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    app.offer
                                                                        ?.location
                                                                }{' '}
                                                                •{' '}
                                                                {
                                                                    app.offer
                                                                        ?.type
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            className={getStatusColor(
                                                                app.status,
                                                            )}
                                                        >
                                                            {app.status}
                                                        </Badge>
                                                        <span className="hidden text-xs text-muted-foreground sm:inline-block">
                                                            {new Date(
                                                                app.created_at,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center rounded-lg border border-dashed border-neutral-200 py-12 dark:border-neutral-800">
                                            <div className="text-center">
                                                <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
                                                    <PlaceholderPattern className="size-5 opacity-50" />
                                                </div>
                                                <p className="text-sm font-medium text-neutral-500">
                                                    No recent activity
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Profile Strength / Recommendations */}
                            <div className="col-span-3 space-y-6">
                                <div className="rounded-xl border border-sidebar-border/70 bg-neutral-50 p-6 dark:border-sidebar-border dark:bg-neutral-900/50">
                                    <h3 className="mb-2 font-semibold text-foreground">
                                        Profile Strength
                                    </h3>
                                    <div className="mb-4 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800">
                                        <div className="h-2 w-[70%] rounded-full bg-violet-600"></div>
                                    </div>
                                    <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                                        Your profile is 70% complete. Add your
                                        LinkedIn URL to reach 100%.
                                    </p>
                                    <Link
                                        href="/candidate-profile"
                                        className="block w-full rounded-lg bg-white py-2 text-center text-sm font-medium shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-50 dark:bg-neutral-800 dark:ring-neutral-700 dark:hover:bg-neutral-700"
                                    >
                                        Complete Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Admin Dashboard Placeholder */
                    <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
                        <p className="text-muted-foreground">
                            Admin Dashboard (Coming Soon)
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
