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
import { ArrowUpRight, Clock, DollarSign, MapPin } from 'lucide-react';

interface OfferCardProps {
    offer: Offer;
}

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

                <CardHeader className="relative z-10 space-y-1 pb-2">
                    <div className="flex items-start justify-between">
                        <Badge
                            variant="outline"
                            className="border-white/20 text-neutral-400"
                        >
                            {offer.type}
                        </Badge>
                        <span className="flex items-center text-xs text-neutral-500">
                            <Clock className="mr-1 h-3 w-3" />
                            {new Date(offer.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#a374ff]">
                        {offer.title}
                    </h3>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4 pb-4">
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
                    <p className="line-clamp-2 text-sm text-neutral-500">
                        {offer.description}
                    </p>
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
