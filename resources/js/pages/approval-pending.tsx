import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LogOut, ShieldAlert } from 'lucide-react';

export default function ApprovalPending() {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <GuestLayout>
            <Head title="Access Pending" />

            <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#5617c2]/10 ring-1 ring-[#5617c2]/50">
                        <ShieldAlert className="h-12 w-12 text-[#5617c2]" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-xl"
                >
                    <h1 className="mb-6 text-4xl font-black tracking-tighter text-white md:text-5xl">
                        ACCESS PENDING
                    </h1>
                    <p className="mb-8 text-lg leading-relaxed text-neutral-400">
                        Your dossier has been received and is currently under
                        review by the JANUS Security Council. This vetting
                        process ensures the integrity of our network.
                    </p>

                    <div className="mb-10 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <p className="text-sm text-neutral-300">
                            <strong>Status:</strong> Awaiting Clearance
                            <br />
                            You will be notified via secure transmission (email)
                            once your verifyication is complete.
                        </p>
                    </div>

                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="text-neutral-500 hover:bg-white/5 hover:text-white"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Terminate Session
                    </Button>
                </motion.div>
            </div>
        </GuestLayout>
    );
}
