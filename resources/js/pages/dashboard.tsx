import { StatCard } from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { Application, BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, Calendar, ExternalLink } from 'lucide-react';

interface ProfileStrength {
    percentage: number;
    sections: Record<
        string,
        { label: string; complete: boolean; percentage: number; weight: number }
    >;
}

interface PageProps {
    stats: {
        totalApplications: number;
        shortlisted: number;
        interviews: number;
        offered: number;
    };
    recentApplications: Application[];
    upcomingInterviews: Application[];
    profileStrength: ProfileStrength;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    stats,
    recentApplications,
    upcomingInterviews,
    profileStrength,
}: PageProps) {
    const { auth } = usePage<SharedData>().props;

    // Calculate pending from stats
    const pending =
        stats.totalApplications -
        stats.shortlisted -
        stats.interviews -
        stats.offered;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'hired':
                return 'bg-green-500 hover:bg-green-600';
            case 'offered':
                return 'bg-emerald-500 hover:bg-emerald-600';
            case 'shortlisted':
                return 'bg-violet-500 hover:bg-violet-600';
            case 'interview':
                return 'bg-indigo-500 hover:bg-indigo-600';
            case 'rejected':
                return 'bg-red-500 hover:bg-red-600';
            case 'viewed':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'new':
            default:
                return 'bg-yellow-500 hover:bg-yellow-600';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'offered':
                return 'Offer Received';
            case 'interview':
                return 'Interview';
            default:
                return status;
        }
    };

    // Get first upcoming interview from props
    const upcomingInterview = upcomingInterviews?.[0];

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
                </div>

                {/* Candidate Dashboard */}
                <>
                    {/* Stats Grid - Extended for v0.2 */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <StatCard
                            label="Total Applications"
                            value={stats.totalApplications}
                            icon="solar:document-bold"
                        />
                        <StatCard
                            label="In Review"
                            value={pending}
                            icon="solar:hourglass-bold"
                        />
                        <StatCard
                            label="Shortlisted"
                            value={stats.shortlisted}
                            icon="solar:star-bold"
                        />
                        <StatCard
                            label="Interviews"
                            value={stats.interviews}
                            icon="solar:calendar-bold"
                        />
                        <StatCard
                            label="Offers"
                            value={stats.offered}
                            icon="solar:diploma-bold"
                        />
                    </div>

                    {/* Upcoming Interview Alert */}
                    {upcomingInterview && (
                        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-indigo-500/20">
                                        <Calendar className="size-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            Upcoming Interview
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {upcomingInterview.offer?.title} at{' '}
                                            {
                                                upcomingInterview.offer?.company
                                                    ?.name
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-indigo-500">
                                        {new Date(
                                            upcomingInterview.interview_at!,
                                        ).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </Badge>
                                    <Link
                                        href={`/offers/${upcomingInterview.offer?.slug}`}
                                    >
                                        <Button variant="outline" size="sm">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
                        {/* Recent Activity / Applications List */}
                        <div className="col-span-4 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-semibold text-foreground">
                                    Recent Applications
                                </h3>
                                <Link
                                    href="/my-applications"
                                    className="text-sm text-violet-600 hover:underline"
                                >
                                    View all
                                </Link>
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
                                                        {app.offer?.company ? (
                                                            <Building2 className="size-4 text-neutral-600 dark:text-neutral-400" />
                                                        ) : (
                                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                                                {app.offer?.title
                                                                    .substring(
                                                                        0,
                                                                        2,
                                                                    )
                                                                    .toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-foreground">
                                                            {app.offer?.title}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            {app.offer?.company
                                                                ?.name && (
                                                                <>
                                                                    {
                                                                        app
                                                                            .offer
                                                                            .company
                                                                            .name
                                                                    }{' '}
                                                                    •{' '}
                                                                </>
                                                            )}
                                                            {
                                                                app.offer
                                                                    ?.location
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
                                                        {getStatusLabel(
                                                            app.status,
                                                        )}
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
                                    <div
                                        className="h-2 rounded-full bg-violet-600 transition-all duration-1000"
                                        style={{
                                            width: `${profileStrength.percentage}%`,
                                        }}
                                    ></div>
                                </div>
                                <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                                    Your profile is {profileStrength.percentage}
                                    % complete.
                                    {profileStrength.percentage < 100 &&
                                        ' Add your work experience and education to reach 100%.'}
                                </p>
                                <Link
                                    href="/profile"
                                    className="block w-full rounded-lg bg-white py-2 text-center text-sm font-medium shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-50 dark:bg-neutral-800 dark:ring-neutral-700 dark:hover:bg-neutral-700"
                                >
                                    Complete Profile
                                </Link>
                            </div>

                            {/* Quick Tips */}
                            <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                                <h3 className="mb-4 font-semibold text-foreground">
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <Link href="/offers">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Browse Open Positions
                                        </Button>
                                    </Link>
                                    <Link href="/my-applications">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            View All Applications
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </AppLayout>
    );
}
