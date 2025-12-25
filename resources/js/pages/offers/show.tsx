import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOffer } from '@/hooks/use-mock-data';
import GuestLayout from '@/layouts/guest-layout';
import { register } from '@/routes';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    MapPin,
} from 'lucide-react';

import { useState } from 'react';
import ApplicationModal from './partials/application-modal';

interface Props {
    slug: string;
}

export default function OfferShow({ slug }: Props) {
    const offer = useOffer(slug);
    const { auth } = usePage<any>().props;
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

    if (!offer) {
        return (
            <GuestLayout>
                <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                    <h1 className="text-4xl font-bold text-white">404</h1>
                    <p className="mt-2 text-neutral-400">
                        Transmission not found.
                    </p>
                    <Link
                        href="/offers"
                        className="mt-6 text-[#5617c2] hover:underline"
                    >
                        Return to open frequencies
                    </Link>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title={offer.title} />

            <div className="pt-32 pb-20">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Back Link */}
                    <div className="mb-8">
                        <Link
                            href="/offers"
                            className="group inline-flex items-center text-sm font-medium text-neutral-500 hover:text-white"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Return to Transmissions
                        </Link>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                <div className="mb-4 flex flex-wrap gap-3">
                                    <Badge
                                        variant="outline"
                                        className="border-[#5617c2] text-[#a374ff]"
                                    >
                                        {offer.type}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="border-white/20 text-neutral-400"
                                    >
                                        Active Requisition
                                    </Badge>
                                </div>
                                <h1 className="mb-4 text-4xl font-black tracking-tighter text-white md:text-5xl">
                                    {offer.title}
                                </h1>
                                <div className="flex flex-wrap gap-6 text-neutral-400">
                                    <div className="flex items-center">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        {offer.location}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4" />
                                        Posted{' '}
                                        {new Date(
                                            offer.created_at,
                                        ).toLocaleDateString()}
                                    </div>
                                </div>
                            </motion.div>

                            <Separator className="my-8 bg-white/10" />

                            {/* Description (Rich Text) */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="prose max-w-none prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-p:text-neutral-400 prose-strong:text-white prose-li:text-neutral-400"
                                dangerouslySetInnerHTML={{
                                    __html: offer.description,
                                }}
                            />
                        </div>

                        {/* Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                        >
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardContent className="space-y-6 p-6">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium tracking-widest text-neutral-500 uppercase">
                                            Compensation
                                        </h3>
                                        <div className="flex items-center text-2xl font-bold text-white">
                                            <DollarSign className="mr-1 h-5 w-5 text-[#5617c2]" />
                                            {offer.salary_range || 'Negotiable'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium tracking-widest text-neutral-500 uppercase">
                                            Deadline
                                        </h3>
                                        <div className="flex items-center text-lg text-white">
                                            <Calendar className="mr-2 h-4 w-4 text-neutral-400" />
                                            {new Date(
                                                offer.deadline,
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        {auth.user ? (
                                            <>
                                                <Button
                                                    onClick={() =>
                                                        setIsApplicationModalOpen(
                                                            true,
                                                        )
                                                    }
                                                    className="h-12 w-full bg-[#5617c2] text-lg font-bold hover:bg-[#4512a0]"
                                                >
                                                    Apply Now
                                                </Button>
                                                <ApplicationModal
                                                    offer={offer}
                                                    user={auth.user}
                                                    isOpen={
                                                        isApplicationModalOpen
                                                    }
                                                    onClose={() =>
                                                        setIsApplicationModalOpen(
                                                            false,
                                                        )
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <Link
                                                href={register()}
                                                className="w-full"
                                            >
                                                <Button className="h-12 w-full bg-white text-lg font-bold text-black hover:bg-neutral-200">
                                                    Initialize Application
                                                </Button>
                                            </Link>
                                        )}
                                        <p className="mt-3 text-center text-xs text-neutral-500">
                                            {auth.user
                                                ? 'Your dossier is ready for submission.'
                                                : 'Authentication required to proceed.'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-white/10 bg-transparent">
                                <CardContent className="p-6">
                                    <h3 className="mb-4 text-lg font-bold text-white">
                                        The JANUS Guarantee
                                    </h3>
                                    <ul className="space-y-3 text-sm text-neutral-400">
                                        <li className="flex items-start">
                                            <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-[#5617c2]" />
                                            <span>
                                                Direct line to hiring managers
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-[#5617c2]" />
                                            <span>
                                                Salary transparency verified
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-[#5617c2]" />
                                            <span>
                                                24/7 Application tracking
                                            </span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
