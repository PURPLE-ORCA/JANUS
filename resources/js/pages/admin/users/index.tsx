import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUsers } from '@/hooks/use-mock-data';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    MoreHorizontal,
    Search,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'User Management', href: '/admin/users' },
];

function getStatusBadge(status: User['status']) {
    switch (status) {
        case 'pending':
            return (
                <Badge
                    variant="outline"
                    className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600"
                >
                    <Clock className="mr-1 size-3" />
                    Pending
                </Badge>
            );
        case 'active':
            return (
                <Badge
                    variant="outline"
                    className="border-green-500/50 bg-green-500/10 text-green-600"
                >
                    <CheckCircle className="mr-1 size-3" />
                    Active
                </Badge>
            );
        case 'rejected':
            return (
                <Badge
                    variant="outline"
                    className="border-red-500/50 bg-red-500/10 text-red-600"
                >
                    <XCircle className="mr-1 size-3" />
                    Rejected
                </Badge>
            );
    }
}

export default function AdminUsers() {
    const allUsers = useUsers();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'pending' | 'active' | 'rejected'
    >('all');

    // Filter users (candidates only, not admins)
    const users = allUsers
        .filter((u) => u.role === 'candidate')
        .filter((u) => statusFilter === 'all' || u.status === statusFilter)
        .filter(
            (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()),
        );

    const counts = {
        all: allUsers.filter((u) => u.role === 'candidate').length,
        pending: allUsers.filter(
            (u) => u.role === 'candidate' && u.status === 'pending',
        ).length,
        active: allUsers.filter(
            (u) => u.role === 'candidate' && u.status === 'active',
        ).length,
        rejected: allUsers.filter(
            (u) => u.role === 'candidate' && u.status === 'rejected',
        ).length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        User Management
                    </h1>
                    <p className="text-muted-foreground">
                        Approve, reject, or manage candidate accounts.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex gap-2">
                        {(
                            ['all', 'pending', 'active', 'rejected'] as const
                        ).map((status) => (
                            <Button
                                key={status}
                                variant={
                                    statusFilter === status
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() => setStatusFilter(status)}
                                className="capitalize"
                            >
                                {status}{' '}
                                <span className="ml-1 text-xs opacity-70">
                                    ({counts[status]})
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Users Table */}
                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-sidebar-border/50 bg-neutral-50/50 text-left text-sm font-medium text-muted-foreground dark:bg-neutral-900/50">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50">
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30"
                                    >
                                        <td className="px-6 py-4">
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
                                                <span className="font-medium text-foreground">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(user.status)}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                {user.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                                        >
                                                            <CheckCircle className="mr-1 size-4" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            <XCircle className="mr-1 size-4" />
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="size-8"
                                                >
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <p className="font-medium text-muted-foreground">
                                    No users found
                                </p>
                                <p className="text-sm text-neutral-400">
                                    Try adjusting your search or filter
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
