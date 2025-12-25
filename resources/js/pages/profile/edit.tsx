import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ProfileForm from './partials/profile-form';

interface EditProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Edit({ mustVerifyEmail, status }: EditProfileProps) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Profile', href: '/candidate-profile' },
            ]}
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:border dark:border-zinc-800 dark:bg-zinc-900/50">
                        <ProfileForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
