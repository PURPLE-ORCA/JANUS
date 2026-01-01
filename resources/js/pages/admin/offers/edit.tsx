import { useOffer } from '@/hooks/use-mock-data';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { OfferForm } from './partials/offer-form';

// In a real app, 'offer' would be passed as a prop from the controller
// For now, we'll fetch it from mock data using the slug/id

export default function EditOffer({ slug }: { slug?: string }) {
    // Mock fetching logic - normally this is handled via Inertia props
    // We'll hardcode a slug if none provided for testing 'edit' mode visually,
    // or assume the route param gives us the slug.
    const offer = useOffer(slug || 'senior-react-developer');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Offers', href: '/admin/offers' },
        { title: 'Edit Offer', href: `/admin/offers/${slug}/edit` },
    ];

    if (!offer && slug) {
        return <div>Offer not found</div>;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${offer?.title || 'Offer'}`} />

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
                    {offer ? (
                        <OfferForm mode="edit" offer={offer} />
                    ) : (
                        <div className="text-red-500">
                            Error: Could not load mock offer.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
