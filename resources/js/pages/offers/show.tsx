import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GuestLayout from '@/layouts/guest-layout';
import { register } from '@/routes';
import type { Offer, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    ExternalLink,
    Flame,
    Globe,
    GraduationCap,
    Languages,
    MapPin,
    Star,
    Users,
} from 'lucide-react';

import { useState } from 'react';
import ApplicationModal from './partials/application-modal';

interface PageProps {
    offer: Offer;
    hasApplied: boolean;
    canApply: boolean;
    auth: {
        user: User | null;
    };
}

const workModeLabels = {
    onsite: 'On-site',
    remote: 'Remote',
    hybrid: 'Hybrid',
};

const experienceLevelLabels = {
    junior: 'Junior (0-2 years)',
    mid: 'Mid-level (2-5 years)',
    senior: 'Senior (5+ years)',
    lead: 'Lead / Principal',
};

const educationLabels: Record<string, string> = {
    bac: 'Bac',
    'bac+2': 'Bac+2 (DEUG/DUT)',
    'bac+3': 'Bac+3 (Licence)',
    'bac+5': 'Bac+5 (Master/Ingénieur)',
    phd: 'PhD / Doctorat',
    none: 'Not required',
};

export default function OfferShow({ offer, hasApplied, canApply }: PageProps) {
    const { auth } = usePage<PageProps>().props;
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
                                {/* Company Info */}
                                {offer.company && (
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                                            <Building2 className="h-6 w-6 text-[#a374ff]" />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-white">
                                                {offer.company.name}
                                            </h2>
                                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                                <span className="capitalize">
                                                    {offer.company.sector}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {offer.company.city}
                                                </span>
                                                {offer.company.is_verified && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="flex items-center text-emerald-400">
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Verified
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Badges Row */}
                                <div className="mb-4 flex flex-wrap gap-3">
                                    {offer.is_urgent && (
                                        <Badge className="border-red-500/30 bg-red-500/20 text-red-400">
                                            <Flame className="mr-1 h-3 w-3" />
                                            Urgent Hiring
                                        </Badge>
                                    )}
                                    <Badge
                                        variant="outline"
                                        className="border-[#5617c2] text-[#a374ff]"
                                    >
                                        {offer.type}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="border-emerald-500/30 text-emerald-400"
                                    >
                                        {workModeLabels[offer.work_mode] ||
                                            offer.work_mode}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="border-white/20 text-neutral-400"
                                    >
                                        {experienceLevelLabels[
                                            offer.experience_level
                                        ] || offer.experience_level}
                                    </Badge>
                                </div>

                                {/* Title */}
                                <h1 className="mb-4 text-4xl font-black tracking-tighter text-white md:text-5xl">
                                    {offer.title}
                                </h1>

                                {/* Meta Info */}
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
                                    {offer.positions_count > 1 && (
                                        <div className="flex items-center">
                                            <Users className="mr-2 h-4 w-4" />
                                            {offer.positions_count} positions
                                        </div>
                                    )}
                                    {offer.views_count > 0 && (
                                        <div className="flex items-center text-neutral-500">
                                            <span className="text-sm">
                                                {offer.views_count} views
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            <Separator className="my-8 bg-white/10" />

                            {/* Requirements Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="mb-8 grid gap-4 md:grid-cols-2"
                            >
                                {/* Education Required */}
                                {offer.education_required && (
                                    <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                                        <GraduationCap className="h-5 w-5 shrink-0 text-[#a374ff]" />
                                        <div>
                                            <h4 className="text-sm font-medium text-neutral-400">
                                                Education Required
                                            </h4>
                                            <p className="text-white">
                                                {educationLabels[
                                                    offer.education_required
                                                ] || offer.education_required}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Experience Level */}
                                <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                                    <Briefcase className="h-5 w-5 shrink-0 text-[#a374ff]" />
                                    <div>
                                        <h4 className="text-sm font-medium text-neutral-400">
                                            Experience Level
                                        </h4>
                                        <p className="text-white">
                                            {experienceLevelLabels[
                                                offer.experience_level
                                            ] || offer.experience_level}
                                        </p>
                                    </div>
                                </div>

                                {/* Languages Required */}
                                {offer.languages_required &&
                                    offer.languages_required.length > 0 && (
                                        <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                                            <Languages className="h-5 w-5 shrink-0 text-[#a374ff]" />
                                            <div>
                                                <h4 className="text-sm font-medium text-neutral-400">
                                                    Languages Required
                                                </h4>
                                                <div className="mt-1 flex flex-wrap gap-2">
                                                    {offer.languages_required.map(
                                                        (lang) => (
                                                            <span
                                                                key={lang}
                                                                className="rounded-full bg-white/10 px-2 py-0.5 text-sm text-white"
                                                            >
                                                                {lang}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {/* Work Mode */}
                                <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                                    <Globe className="h-5 w-5 shrink-0 text-[#a374ff]" />
                                    <div>
                                        <h4 className="text-sm font-medium text-neutral-400">
                                            Work Mode
                                        </h4>
                                        <p className="text-white">
                                            {workModeLabels[offer.work_mode] ||
                                                offer.work_mode}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Benefits Section */}
                            {offer.benefits && offer.benefits.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                    className="mb-8"
                                >
                                    <h3 className="mb-4 text-lg font-bold text-white">
                                        Benefits & Perks
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {offer.benefits.map((benefit) => (
                                            <div
                                                key={benefit}
                                                className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-400"
                                            >
                                                <Star className="h-3 w-3" />
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

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
                            {/* Apply Card */}
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
                                            ).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
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

                            {/* Company Card */}
                            {offer.company && (
                                <Card className="border-white/10 bg-transparent">
                                    <CardContent className="p-6">
                                        <h3 className="mb-4 text-lg font-bold text-white">
                                            About {offer.company.name}
                                        </h3>
                                        {offer.company.description && (
                                            <p className="mb-4 text-sm text-neutral-400">
                                                {offer.company.description}
                                            </p>
                                        )}
                                        <div className="space-y-2 text-sm text-neutral-400">
                                            <div className="flex items-center">
                                                <Building2 className="mr-2 h-4 w-4" />
                                                <span className="capitalize">
                                                    {offer.company.sector}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="mr-2 h-4 w-4" />
                                                {offer.company.city}
                                            </div>
                                            {offer.company.website_url && (
                                                <a
                                                    href={
                                                        offer.company
                                                            .website_url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-[#a374ff] hover:underline"
                                                >
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Visit Website
                                                </a>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* JANUS Guarantee Card */}
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
