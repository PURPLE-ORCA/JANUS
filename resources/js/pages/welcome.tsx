import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import GuestLayout from '@/layouts/guest-layout';
import { register } from '@/routes';
import type { Offer } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Lock, Shield, Users } from 'lucide-react';

interface PageProps {
    featuredOffers: Offer[];
    stats: {
        totalOffers: number;
        totalCompanies: number;
    };
    canRegister: boolean;
}

const Hero = () => (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
        {/* Glow Effect */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5617c2] opacity-10 blur-[120px]" />

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Badge
                variant="outline"
                className="mb-6 border-[#5617c2] bg-[#5617c2]/10 px-4 py-1.5 text-sm text-[#a374ff]"
            >
                MEMBERSHIP RESTRICTED
            </Badge>
        </motion.div>

        <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 max-w-4xl text-6xl font-black tracking-tighter text-white md:text-8xl"
        >
            THE VELVET ROPE <br />
            <span className="bg-linear-to-r from-white to-neutral-500 bg-clip-text text-transparent">
                OF RECRUITMENT.
            </span>
        </motion.h1>

        <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl text-lg text-neutral-400 md:text-xl"
        >
            Janus is not a job board. It is a curated network of elite talent
            and exclusive opportunities. Validation required.
        </motion.p>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
            <Link href={register()}>
                <Button
                    size="lg"
                    className="h-12 bg-white px-8 text-black hover:bg-neutral-200"
                >
                    Apply for Membership <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
            <Link href="#how-it-works">
                <Button
                    size="lg"
                    variant="outline"
                    className="h-12 border-white/20 text-white hover:bg-white/10"
                >
                    How it Works
                </Button>
            </Link>
        </motion.div>
    </section>
);

const TickerItem = ({ offer }: { offer: Offer }) => (
    <Card className="mx-4 w-75 shrink-0 border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:border-[#5617c2]/50">
        <CardContent className="p-6">
            <div className="mb-4 flex items-start justify-between">
                <Badge
                    variant="outline"
                    className="border-white/20 text-neutral-300"
                >
                    {offer.type}
                </Badge>
                {offer.salary_range && (
                    <span className="font-mono text-xs text-[#5617c2]">
                        {offer.salary_range}
                    </span>
                )}
            </div>
            <h3 className="mb-1 line-clamp-1 text-lg font-bold text-white">
                {offer.title}
            </h3>
            <div className="flex items-center text-sm text-neutral-500">
                <Users className="mr-2 h-3 w-3" />
                {offer.location}
            </div>
        </CardContent>
    </Card>
);

const OffersTicker = ({ offers }: { offers: Offer[] }) => {
    // Duplicate offers to create infinite scroll effect
    const tickerOffers = [...offers, ...offers, ...offers];

    return (
        <section className="border-y border-white/10 bg-black py-12">
            <div className="mb-8 px-6 text-center">
                <h2 className="text-sm font-bold tracking-widest text-[#5617c2] uppercase">
                    Live Opportunities
                </h2>
            </div>
            <div className="relative flex overflow-x-hidden">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-linear-to-r from-black to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-linear-to-l from-black to-transparent" />

                <motion.div
                    className="flex"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        ease: 'linear',
                        duration: 30,
                    }}
                >
                    {tickerOffers.map((offer, i) => (
                        <TickerItem key={`${offer.id}-${i}`} offer={offer} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const Feature = ({
    icon: Icon,
    title,
    desc,
}: {
    icon: any;
    title: string;
    desc: string;
}) => (
    <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
            <Icon className="h-8 w-8 text-[#5617c2]" />
        </div>
        <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
        <p className="max-w-xs leading-relaxed text-neutral-400">{desc}</p>
    </div>
);

const HowItWorks = () => (
    <section id="how-it-works" className="relative px-6 py-32">
        <div className="mx-auto max-w-7xl">
            <div className="mb-20 text-center">
                <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
                    THE PROTOCOL
                </h2>
                <p className="text-neutral-400">
                    Security clearance is not given. It is earned.
                </p>
            </div>

            <div className="grid gap-16 md:grid-cols-3">
                <Feature
                    icon={Lock}
                    title="1. Request Access"
                    desc="Submit your dossier. Our algorithms and administrators review every data point."
                />
                <Feature
                    icon={Shield}
                    title="2. Validation"
                    desc="We verify your skills, history, and intent. Only the top 5% clear this stage."
                />
                <Feature
                    icon={Briefcase}
                    title="3. The Vault"
                    desc="Gain access to unlisted opportunities from top-tier organizations."
                />
            </div>
        </div>
    </section>
);

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function Welcome({ featuredOffers }: PageProps) {
    return (
        <GuestLayout>
            <Head title="Welcome to Janus" />
            <Hero />
            <OffersTicker offers={featuredOffers || []} />
            <HowItWorks />
            <section className="relative overflow-hidden border-t border-white/10 bg-[#5617c2] py-24 text-center">
                <div className="relative z-10 mx-auto max-w-4xl px-6">
                    <h2 className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl">
                        READY TO CROSS THE THRESHOLD?
                    </h2>
                    <Link href={register()}>
                        <Button
                            size="lg"
                            className="h-14 bg-white px-10 text-lg font-bold text-[#5617c2] hover:bg-neutral-100"
                        >
                            Initiate Sequence
                        </Button>
                    </Link>
                </div>
            </section>
        </GuestLayout>
    );
}
