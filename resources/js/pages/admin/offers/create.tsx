import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { OfferForm } from './partials/offer-form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Offers', href: '/admin/offers' },
    { title: 'New Offer', href: '/admin/offers/create' },
];

export default function CreateOffer() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Offer" />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 p-4 md:p-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Create New Offer
                    </h1>
                    <p className="text-muted-foreground">
                        Post a new job opening to the board.
                    </p>
                </div>

                <div className="p-6">
                    <OfferForm mode="create" />
                </div>
            </div>
        </AppLayout>
    );
}
