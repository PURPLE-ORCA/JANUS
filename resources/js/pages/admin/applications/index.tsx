import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Applications', href: '/admin/applications' },
];

export default function AdminApplications() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Applications Review" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Applications Review
                    </h1>
                    <p className="text-muted-foreground">
                        Review and manage candidate applications.
                    </p>
                </div>

                {/* Coming Soon Placeholder */}
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                            <FileText className="size-8 text-purple-600" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">
                            Applications Review Coming Soon
                        </h3>
                        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                            This page will display all applications with a
                            drawer for viewing candidate details and changing
                            status.
                        </p>
                        <Link href="/admin">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 size-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
