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
import { useOffers } from '@/hooks/use-mock-data';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Briefcase,
    Edit2,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Offers', href: '/admin/offers' },
];

export default function AdminOffers() {
    const allOffers = useOffers();
    const [search, setSearch] = useState('');

    const filteredOffers = allOffers.filter((offer) =>
        offer.title.toLowerCase().includes(search.toLowerCase()),
    );

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
                    <Link href="/admin/offers/create">
                        <Button variant="purple">
                            <Plus className="mr-2 size-4" />
                            New Offer
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Search offers..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Title
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Type
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Location
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Posted
                                    </th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredOffers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-4 text-center text-muted-foreground"
                                        >
                                            No offers found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOffers.map((offer) => (
                                        <tr
                                            key={offer.id}
                                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                        >
                                            <td className="p-4 align-middle font-medium">
                                                <div className="flex items-center gap-3">
                                                    <span>{offer.title}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground capitalize">
                                                {offer.type}
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {offer.location}
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
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(
                                                    offer.created_at,
                                                ).toLocaleDateString()}
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
