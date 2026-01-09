import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { type Offer } from '@/types';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    Briefcase,
    Building2,
    Clock,
    DollarSign,
    Flame,
    MapPin,
    Users,
} from 'lucide-react';

interface OfferCardProps {
    offer: Offer;
}

const workModeLabels = {
    onsite: 'On-site',
    remote: 'Remote',
    hybrid: 'Hybrid',
};

const experienceLevelLabels = {
    junior: 'Junior',
    mid: 'Mid-level',
    senior: 'Senior',
    lead: 'Lead',
};

export function OfferCard({ offer }: OfferCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="group relative h-full overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:border-[#5617c2]/50 hover:bg-white/10">
                <div className="absolute inset-0 bg-linear-to-br from-[#5617c2]/0 to-[#5617c2]/0 opacity-0 transition-opacity duration-500 group-hover:from-[#5617c2]/5 group-hover:to-transparent group-hover:opacity-100" />

                <CardHeader className="relative z-10 space-y-2 pb-2">
                    {/* Company & Urgent Badge Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-neutral-400">
                            {offer.company ? (
                                <>
                                    <Building2 className="h-3.5 w-3.5" />
                                    <span className="truncate">
                                        {offer.company.name}
                                    </span>
                                </>
                            ) : (
                                <span className="text-neutral-500">
                                    Unknown Company
                                </span>
                            )}
                        </div>
                        {offer.is_urgent && (
                            <Badge className="border-red-500/30 bg-red-500/20 text-red-400">
                                <Flame className="mr-1 h-3 w-3" />
                                Urgent
                            </Badge>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#a374ff]">
                        {offer.title}
                    </h3>

                    {/* Type & Level Badges */}
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant="outline"
                            className="border-white/20 text-neutral-400"
                        >
                            {offer.type}
                        </Badge>
                        <Badge
                            variant="outline"
                            className="border-[#5617c2]/30 text-[#a374ff]"
                        >
                            {experienceLevelLabels[offer.experience_level] ||
                                offer.experience_level}
                        </Badge>
                        <Badge
                            variant="outline"
                            className="border-emerald-500/30 text-emerald-400"
                        >
                            {workModeLabels[offer.work_mode] || offer.work_mode}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4 pb-4">
                    {/* Location & Salary Row */}
                    <div className="flex flex-wrap gap-3 text-sm text-neutral-400">
                        <div className="flex items-center">
                            <MapPin className="mr-1.5 h-3.5 w-3.5" />
                            {offer.location}
                        </div>
                        {offer.salary_range && (
                            <div className="flex items-center text-[#5617c2]">
                                <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                                {offer.salary_range}
                            </div>
                        )}
                    </div>

                    {/* Positions & Deadline Row */}
                    <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
                        {offer.positions_count > 1 && (
                            <div className="flex items-center">
                                <Users className="mr-1 h-3 w-3" />
                                {offer.positions_count} positions
                            </div>
                        )}
                        <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            Deadline:{' '}
                            {new Date(offer.deadline).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Description Preview */}
                    <p className="line-clamp-2 text-sm text-neutral-500">
                        {offer.description.replace(/<[^>]+>/g, '')}
                    </p>

                    {/* Languages Required */}
                    {offer.languages_required &&
                        offer.languages_required.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-3 w-3 text-neutral-500" />
                                <div className="flex flex-wrap gap-1">
                                    {offer.languages_required.map((lang) => (
                                        <span
                                            key={lang}
                                            className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-neutral-400"
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                </CardContent>

                <CardFooter className="relative z-10 pt-0">
                    <Link href={`/offers/${offer.slug}`} className="w-full">
                        <Button className="w-full translate-y-2 justify-between bg-white text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-neutral-200">
                            View Details
                            <ArrowUpRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
