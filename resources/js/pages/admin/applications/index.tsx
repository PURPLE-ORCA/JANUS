import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { Application, BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChevronDown, Eye, MapPin, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ApplicationDetailsDrawer } from './partials/application-details-drawer';

interface PaginatedApplications {
    data: Application[];
    current_page: number;
    last_page: number;
    total: number;
}

interface PageProps {
    applications: PaginatedApplications;
    filters: {
        status?: string;
        offer_id?: string;
        search?: string;
    };
    stats: {
        total: number;
        new: number;
        shortlisted: number;
        interview: number;
        offered: number;
        rejected: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Applications', href: '/admin/applications' },
];

export default function AdminApplications({
    applications,
    filters,
    stats,
}: PageProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleSearch = () => {
        router.get(
            '/admin/applications',
            {
                search: search || undefined,
                status: filters?.status,
            },
            { preserveState: true },
        );
    };

    const handleStatusFilter = (status: string) => {
        router.get(
            '/admin/applications',
            {
                search: filters?.search,
                status: status === 'all' ? undefined : status,
            },
            { preserveState: true },
        );
    };

    const handleUpdateStatus = (applicationId: number, newStatus: string) => {
        router.patch(
            `/admin/applications/${applicationId}/status`,
            {
                status: newStatus,
            },
            { preserveScroll: true },
        );
    };

    // Group applications by offer
    const applicationsByOffer = useMemo(() => {
        const groups: Record<number, { offerStub: any; apps: Application[] }> =
            {};

        applications.data.forEach((app: Application) => {
            const offerId = app.offer?.id || 0;
            if (!groups[offerId]) {
                groups[offerId] = {
                    offerStub: app.offer,
                    apps: [],
                };
            }
            groups[offerId].apps.push(app);
        });

        return Object.values(groups).sort((a, b) => {
            return b.apps.length - a.apps.length;
        });
    }, [applications.data]);

    const handleViewApplication = (application: Application) => {
        setSelectedApplication(application);
        setIsDrawerOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-400/10 dark:text-blue-400';
            case 'viewed':
                return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 dark:bg-yellow-400/10 dark:text-yellow-400';
            case 'shortlisted':
                return 'bg-green-100 text-green-700 hover:bg-green-100/80 dark:bg-green-400/10 dark:text-green-400';
            case 'rejected':
                return 'bg-red-100 text-red-700 hover:bg-red-100/80 dark:bg-red-400/10 dark:text-red-400';
            case 'hired':
                return 'bg-purple-100 text-purple-700 hover:bg-purple-100/80 dark:bg-purple-400/10 dark:text-purple-400';
            default:
                return 'bg-gray-100 text-gray-700 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Applications Review" />

            <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Applications Review
                    </h1>
                    <p className="text-muted-foreground">
                        Manage candidate pipelines by job offer.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Search candidates or jobs..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grouped Lists (Accordions) */}
                <div className="flex flex-col gap-4">
                    {applicationsByOffer.length === 0 ? (
                        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
                            No applications found.
                        </div>
                    ) : (
                        applicationsByOffer.map((group) => (
                            <Collapsible
                                key={group.offerStub?.id || 'unknown'}
                                defaultOpen
                                className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm"
                            >
                                <CollapsibleTrigger className="group flex w-full items-center justify-between bg-muted/30 p-4 transition-colors hover:bg-muted/50 data-[state=open]:border-b">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                                            <span className="text-lg font-semibold">
                                                {group.apps.length}
                                            </span>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-foreground">
                                                {group.offerStub?.title ||
                                                    'Unassigned Application'}
                                            </h3>
                                            <p className="flex items-center text-sm text-muted-foreground">
                                                <MapPin className="mr-1 size-3" />
                                                {group.offerStub?.location ||
                                                    'Unknown Location'}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronDown className="size-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <div className="relative w-full overflow-auto">
                                        <table className="w-full caption-bottom text-sm">
                                            <thead className="[&_tr]:border-b">
                                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                                                        Candidate
                                                    </th>
                                                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                                                        Applied Date
                                                    </th>
                                                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                                                        Status
                                                    </th>
                                                    <th className="h-10 px-4 align-middle font-medium text-muted-foreground">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="[&_tr:last-child]:border-0">
                                                {group.apps.map((app) => (
                                                    <tr
                                                        key={app.id}
                                                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                                    >
                                                        <td className="p-4 align-middle font-medium">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage
                                                                        src={
                                                                            app
                                                                                .user
                                                                                ?.avatar ||
                                                                            undefined
                                                                        }
                                                                        alt={
                                                                            app
                                                                                .user
                                                                                ?.name
                                                                        }
                                                                    />
                                                                    <AvatarFallback>
                                                                        {app.user?.name.charAt(
                                                                            0,
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">
                                                                        {
                                                                            app
                                                                                .user
                                                                                ?.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {
                                                                            app
                                                                                .user
                                                                                ?.email
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-muted-foreground">
                                                            {new Date(
                                                                app.created_at,
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <Badge
                                                                variant="secondary"
                                                                className={getStatusColor(
                                                                    app.status,
                                                                )}
                                                            >
                                                                {app.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4 text-right align-middle">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleViewApplication(
                                                                        app,
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="mr-2 size-4" />
                                                                View
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))
                    )}
                </div>
            </div>

            <ApplicationDetailsDrawer
                application={selectedApplication}
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
            />
        </AppLayout>
    );
}
