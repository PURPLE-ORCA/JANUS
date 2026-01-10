import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Company, Offer } from '@/types';
import { Head } from '@inertiajs/react';
import { OfferForm } from './partials/offer-form';

interface PageProps {
    offer: Offer;
    companies: Company[];
}

export default function EditOffer({ offer, companies }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Offers', href: '/admin/offers' },
        { title: 'Edit Offer', href: `/admin/offers/${offer.slug}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${offer.title}`} />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 p-4 md:p-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Edit Offer
                    </h1>
                    <p className="text-muted-foreground">
                        Update job details and requirements.
                    </p>
                </div>

                <div className="p-6">
                    <OfferForm
                        mode="edit"
                        offer={offer}
                        companies={companies}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
