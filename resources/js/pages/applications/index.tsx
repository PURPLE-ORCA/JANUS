import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useApplications } from '@/hooks/use-mock-data';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    CalendarCheck,
    Filter,
    Search,
} from 'lucide-react';
import { useState } from 'react';

export default function ApplicationsIndex() {
    const { auth } = usePage<SharedData>().props;
    const allApplications = useApplications(auth.user.id);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter logic
    const filteredApplications = allApplications.filter((app) => {
        const matchesSearch =
            app.offer?.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            app.offer?.company?.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' &&
                ['new', 'viewed', 'shortlisted', 'interview'].includes(
                    app.status,
                )) ||
            (statusFilter === 'archived' &&
                ['rejected', 'hired', 'withdrawn', 'offered'].includes(
                    app.status,
                )) ||
            app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

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
            case 'withdrawn':
                return 'bg-neutral-400 hover:bg-neutral-500';
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
                return 'Interview Scheduled';
            default:
                return status;
        }
    };

    // Calculate stats
    const interviewScheduled = allApplications.filter(
        (a) => a.status === 'interview' || a.interview_at,
    ).length;
    const offersReceived = allApplications.filter(
        (a) => a.status === 'offered' || a.status === 'hired',
    ).length;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'My Applications', href: '/my-applications' },
            ]}
        >
            <Head title="My Applications" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            My Applications
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and track your job applications.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="px-3 py-1">
                            Total: {allApplications.length}
                        </Badge>
                        <Badge
                            variant="outline"
                            className="border-indigo-500/50 bg-indigo-500/10 px-3 py-1 text-indigo-600"
                        >
                            <CalendarCheck className="mr-1 h-3 w-3" />
                            Interviews: {interviewScheduled}
                        </Badge>
                        <Badge
                            variant="outline"
                            className="border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-emerald-600"
                        >
                            Offers: {offersReceived}
                        </Badge>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 rounded-lg border border-sidebar-border/70 bg-white p-4 md:flex-row md:items-center dark:border-sidebar-border dark:bg-zinc-900/50">
                    <div className="relative flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by job title or company..."
                            className="bg-white pl-9 dark:bg-zinc-900"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full items-center gap-2 md:w-auto">
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-180px bg-white dark:bg-zinc-900">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value="active">
                                    Active (In Progress)
                                </SelectItem>
                                <SelectItem value="archived">
                                    Archived (Closed)
                                </SelectItem>
                                <SelectItem value="shortlisted">
                                    Shortlisted
                                </SelectItem>
                                <SelectItem value="interview">
                                    Interview Scheduled
                                </SelectItem>
                                <SelectItem value="offered">
                                    Offer Received
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Applications List */}
                <div className="grid gap-4">
                    {filteredApplications.length > 0 ? (
                        filteredApplications.map((app) => (
                            <div
                                key={app.id}
                                className="group flex flex-col justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-violet-500/50 hover:shadow-md md:flex-row md:items-center dark:border-zinc-800 dark:bg-zinc-900/50"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Company Logo Placeholder */}
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 font-bold text-neutral-600 dark:bg-zinc-800 dark:text-neutral-400">
                                        {app.offer?.company ? (
                                            <Building2 className="h-5 w-5" />
                                        ) : (
                                            app.offer?.title
                                                .substring(0, 2)
                                                .toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400">
                                            {app.offer?.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                            {app.offer?.company && (
                                                <>
                                                    <span className="font-medium text-foreground/70">
                                                        {app.offer.company.name}
                                                    </span>
                                                    <span>•</span>
                                                </>
                                            )}
                                            <span>{app.offer?.location}</span>
                                            <span>•</span>
                                            <span className="capitalize">
                                                {app.offer?.work_mode ||
                                                    'onsite'}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Applied{' '}
                                            {new Date(
                                                app.created_at,
                                            ).toLocaleDateString()}
                                            {app.interview_at && (
                                                <span className="ml-2 text-indigo-600 dark:text-indigo-400">
                                                    <Calendar className="mr-1 inline h-3 w-3" />
                                                    Interview:{' '}
                                                    {new Date(
                                                        app.interview_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 md:justify-end">
                                    <Badge
                                        className={`${getStatusColor(app.status)} capitalize`}
                                    >
                                        {getStatusLabel(app.status)}
                                    </Badge>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm"
                                        className="h-9"
                                    >
                                        <Link
                                            href={`/offers/${app.offer?.slug || app.offer_id}`}
                                        >
                                            View Details
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-900/30">
                            <p className="text-muted-foreground">
                                No applications found matching your criteria.
                            </p>
                            <Button
                                variant="link"
                                onClick={() => {
                                    setSearchQuery('');
                                    setStatusFilter('all');
                                }}
                            >
                                Clear filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
