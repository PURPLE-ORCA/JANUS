import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useOffers } from '@/hooks/use-mock-data';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, WorkMode } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    Edit2,
    Eye,
    Flame,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Offers', href: '/admin/offers' },
];

const workModeLabels: Record<string, string> = {
    onsite: 'On-site',
    remote: 'Remote',
    hybrid: 'Hybrid',
};

export default function AdminOffers() {
    const [search, setSearch] = useState('');
    const [workModeFilter, setWorkModeFilter] = useState('all');
    const [urgentFilter, setUrgentFilter] = useState('all');

    const allOffers = useOffers({
        search,
        workMode:
            workModeFilter === 'all' ? undefined : (workModeFilter as WorkMode),
        isUrgent: urgentFilter === 'urgent' ? true : undefined,
    });

    // Stats
    const totalOffers = allOffers.length;
    const activeOffers = allOffers.filter((o) => o.is_active).length;
    const urgentOffers = allOffers.filter((o) => o.is_urgent).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offers Management" />

            <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Offers Management
                        </h1>
                        <p className="text-muted-foreground">
                            Create, edit, and manage job offers.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{totalOffers} total</Badge>
                            <Badge
                                variant="outline"
                                className="border-green-500/50 bg-green-500/10 text-green-600"
                            >
                                {activeOffers} active
                            </Badge>
                            {urgentOffers > 0 && (
                                <Badge
                                    variant="outline"
                                    className="border-red-500/50 bg-red-500/10 text-red-600"
                                >
                                    <Flame className="mr-1 h-3 w-3" />
                                    {urgentOffers} urgent
                                </Badge>
                            )}
                        </div>
                        <Link href="/admin/offers/create">
                            <Button variant="purple">
                                <Plus className="mr-2 size-4" />
                                New Offer
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Search offers..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={workModeFilter}
                        onValueChange={setWorkModeFilter}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Work Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Modes</SelectItem>
                            <SelectItem value="onsite">On-site</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={urgentFilter}
                        onValueChange={setUrgentFilter}
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Offers</SelectItem>
                            <SelectItem value="urgent">Urgent Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Title / Company
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Type
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Work Mode
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Stats
                                    </th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {allOffers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-4 text-center text-muted-foreground"
                                        >
                                            No offers found.
                                        </td>
                                    </tr>
                                ) : (
                                    allOffers.map((offer) => (
                                        <tr
                                            key={offer.id}
                                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                        >
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                                        <Building2 className="h-5 w-5 text-neutral-500" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 font-medium">
                                                            {offer.title}
                                                            {offer.is_urgent && (
                                                                <Flame className="h-4 w-4 text-red-500" />
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {offer.company
                                                                ?.name ||
                                                                'No company'}{' '}
                                                            • {offer.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground capitalize">
                                                {offer.type}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        offer.work_mode ===
                                                        'remote'
                                                            ? 'border-emerald-500/50 text-emerald-600'
                                                            : offer.work_mode ===
                                                                'hybrid'
                                                              ? 'border-blue-500/50 text-blue-600'
                                                              : ''
                                                    }
                                                >
                                                    {workModeLabels[
                                                        offer.work_mode
                                                    ] || offer.work_mode}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge
                                                    variant={
                                                        offer.is_active
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                    className={
                                                        offer.is_active
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-100/80 dark:bg-green-400/10 dark:text-green-400'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-300'
                                                    }
                                                >
                                                    {offer.is_active
                                                        ? 'Active'
                                                        : 'Draft'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span
                                                        className="flex items-center gap-1"
                                                        title="Views"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        {offer.views_count || 0}
                                                    </span>
                                                    <span
                                                        className="flex items-center gap-1"
                                                        title="Positions"
                                                    >
                                                        <Users className="h-4 w-4" />
                                                        {offer.positions_count ||
                                                            1}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right align-middle">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="size-8 p-0"
                                                        >
                                                            <span className="sr-only">
                                                                Open menu
                                                            </span>
                                                            <MoreHorizontal className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            Actions
                                                        </DropdownMenuLabel>
                                                        <Link
                                                            href={`/offers/${offer.slug}`}
                                                        >
                                                            <DropdownMenuItem>
                                                                <Eye className="mr-2 size-4" />
                                                                View
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <Link
                                                            href={`/admin/offers/${offer.slug}/edit`}
                                                        >
                                                            <DropdownMenuItem>
                                                                <Edit2 className="mr-2 size-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-900/50">
                                                            <Trash2 className="mr-2 size-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
