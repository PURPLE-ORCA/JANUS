import { Button } from '@/components/ui/button';
import { login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { type PropsWithChildren } from 'react';

const Navbar = () => {
    const { auth } = usePage<SharedData>().props;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md"
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-black">
                        <span className="font-bold">J</span>
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-white">
                        JANUS
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {auth.user ? (
                        <Link href="/dashboard">
                            <Button
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white hover:text-black"
                            >
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href={login()}>
                                <Button
                                    variant="ghost"
                                    className="text-neutral-400 hover:text-white"
                                >
                                    Log in
                                </Button>
                            </Link>
                            <Link href={register()}>
                                <Button className="bg-[#5617c2] text-white hover:bg-[#45129e]">
                                    Request Access
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

const Footer = () => (
    <footer className="border-t border-white/10 bg-black py-12 text-center text-neutral-600">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
            <div className="flex gap-4 text-sm font-medium">
                <Link href="#" className="hover:text-white">
                    Privacy Protocol
                </Link>
                <Link href="#" className="hover:text-white">
                    Terms of Service
                </Link>
            </div>
            <div className="text-sm">
                &copy; 2026 PURPLE ORCA. ALL RIGHTS RESERVED.
            </div>
        </div>
    </footer>
);

const NoiseOverlay = () => (
    <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        }}
    ></div>
);

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="relative min-h-screen bg-[#050505] font-sans text-white selection:bg-[#5617c2] selection:text-white">
            <NoiseOverlay />
            <Navbar />
            <main className="relative z-10">{children}</main>
            <Footer />
        </div>
    );
}
