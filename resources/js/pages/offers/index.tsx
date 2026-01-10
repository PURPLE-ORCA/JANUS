import { OfferCard } from '@/components/offer-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useOffers } from '@/hooks/use-mock-data';
import GuestLayout from '@/layouts/guest-layout';
import { type ExperienceLevel, type OfferType, type WorkMode } from '@/types';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Flame, Search, X } from 'lucide-react';
import { useState } from 'react';

export default function OffersIndex() {
    const [search, setSearch] = useState('');
    const [type, setType] = useState<string>('all');
    const [workMode, setWorkMode] = useState<string>('all');
    const [experienceLevel, setExperienceLevel] = useState<string>('all');
    const [showUrgentOnly, setShowUrgentOnly] = useState(false);

    // Derived filters for hook
    const filters = {
        search,
        type: type === 'all' ? undefined : (type as OfferType),
        workMode: workMode === 'all' ? undefined : (workMode as WorkMode),
        experienceLevel:
            experienceLevel === 'all'
                ? undefined
                : (experienceLevel as ExperienceLevel),
        isUrgent: showUrgentOnly || undefined,
        activeOnly: true,
    };

    const offers = useOffers(filters);

    const hasActiveFilters =
        search ||
        type !== 'all' ||
        workMode !== 'all' ||
        experienceLevel !== 'all' ||
        showUrgentOnly;

    const clearFilters = () => {
        setSearch('');
        setType('all');
        setWorkMode('all');
        setExperienceLevel('all');
        setShowUrgentOnly(false);
    };

    return (
        <GuestLayout>
            <Head title="Open Roles" />

            <div className="relative pt-32 pb-20">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <Badge
                            variant="outline"
                            className="mb-4 border-[#5617c2] bg-[#5617c2]/10 text-[#a374ff]"
                        >
                            RESTRICTED ACCESS
                        </Badge>
                        <h1 className="text-4xl font-black tracking-tighter text-white md:text-6xl">
                            OPEN{' '}
                            <span className="text-[#5617c2]">
                                TRANSMISSIONS
                            </span>
                        </h1>
                        <p className="mt-4 max-w-2xl text-lg text-neutral-400">
                            Authorized personnel only. Browse current
                            requisitions from our partner network. Clearance
                            verification required for details.
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8 space-y-4"
                    >
                        {/* Search & Primary Filters Row */}
                        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                                <Input
                                    placeholder="Search by keyword, role, or stack..."
                                    className="h-12 border-white/10 bg-black/50 pl-10 text-white placeholder:text-neutral-500 focus-visible:ring-[#5617c2]"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="w-full md:w-48">
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger className="h-12 border-white/10 bg-black/50 text-white focus:ring-[#5617c2]">
                                        <SelectValue placeholder="Job Type" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                                        <SelectItem value="all">
                                            All Types
                                        </SelectItem>
                                        <SelectItem value="full-time">
                                            Full-time
                                        </SelectItem>
                                        <SelectItem value="part-time">
                                            Part-time
                                        </SelectItem>
                                        <SelectItem value="freelance">
                                            Freelance
                                        </SelectItem>
                                        <SelectItem value="internship">
                                            Internship
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full md:w-48">
                                <Select
                                    value={workMode}
                                    onValueChange={setWorkMode}
                                >
                                    <SelectTrigger className="h-12 border-white/10 bg-black/50 text-white focus:ring-[#5617c2]">
                                        <SelectValue placeholder="Work Mode" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                                        <SelectItem value="all">
                                            All Modes
                                        </SelectItem>
                                        <SelectItem value="onsite">
                                            On-site
                                        </SelectItem>
                                        <SelectItem value="remote">
                                            Remote
                                        </SelectItem>
                                        <SelectItem value="hybrid">
                                            Hybrid
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full md:w-48">
                                <Select
                                    value={experienceLevel}
                                    onValueChange={setExperienceLevel}
                                >
                                    <SelectTrigger className="h-12 border-white/10 bg-black/50 text-white focus:ring-[#5617c2]">
                                        <SelectValue placeholder="Experience" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                                        <SelectItem value="all">
                                            All Levels
                                        </SelectItem>
                                        <SelectItem value="junior">
                                            Junior
                                        </SelectItem>
                                        <SelectItem value="mid">
                                            Mid-level
                                        </SelectItem>
                                        <SelectItem value="senior">
                                            Senior
                                        </SelectItem>
                                        <SelectItem value="lead">
                                            Lead
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Urgent Toggle & Clear Filters */}
                        <div className="flex items-center justify-between">
                            <Button
                                variant={showUrgentOnly ? 'default' : 'outline'}
                                size="sm"
                                onClick={() =>
                                    setShowUrgentOnly(!showUrgentOnly)
                                }
                                className={
                                    showUrgentOnly
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                                }
                            >
                                <Flame className="mr-2 h-4 w-4" />
                                Urgent Hiring Only
                            </Button>

                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-neutral-400 hover:text-white"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </motion.div>

                    {/* Results Count */}
                    <div className="mb-6 text-sm text-neutral-500">
                        Showing {offers.length} position
                        {offers.length !== 1 ? 's' : ''}
                    </div>

                    {/* Grid */}
                    {offers.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {offers.map((offer) => (
                                <OfferCard key={offer.id} offer={offer} />
                            ))}
                        </div>
                    ) : (
                        <div className="min-h-400px flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
                            <div className="mb-4 rounded-full bg-white/5 p-4">
                                <Search className="h-8 w-8 text-neutral-500" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-white">
                                No Transmissions Found
                            </h3>
                            <p className="text-neutral-400">
                                Adjust your frequency filters to intercept more
                                results.
                            </p>
                            <Button
                                variant="link"
                                className="mt-4 text-[#5617c2]"
                                onClick={clearFilters}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
