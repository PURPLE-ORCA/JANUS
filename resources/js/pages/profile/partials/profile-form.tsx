import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SkillsInput } from '@/components/ui/skills-input';
import { SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ProfileForm({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage<SharedData>().props.auth.user;

    // In a real app, we'd hydrate this from user.profile
    // For now, mock empty state or default values
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            headline: user.profile?.headline || '',
            phone: user.profile?.phone || '',
            linkedin_url: user.profile?.linkedin_url || '',
            skills: user.profile?.skills || [],
            resume: null as File | null,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Mock submission - in real app: patch(route('profile.update'));
        console.log('Submitting profile update:', data);

        // Since we don't have a backend route yet, we'll just simulate a success message
        // This is a "Frontend Mode" compromise
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-foreground">
                    Professional Profile
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Update your professional details to attract the best offers.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input
                            id="headline"
                            className="mt-1 block w-full"
                            value={data.headline}
                            onChange={(e) =>
                                setData('headline', e.target.value)
                            }
                            required
                            placeholder="e.g. Senior Frontend Developer"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            required
                            placeholder="+1 234 567 890"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                        id="linkedin_url"
                        type="url"
                        className="mt-1 block w-full"
                        value={data.linkedin_url}
                        onChange={(e) =>
                            setData('linkedin_url', e.target.value)
                        }
                        placeholder="https://linkedin.com/in/username"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Skills</Label>
                    <SkillsInput
                        value={data.skills}
                        onChange={(skills) => setData('skills', skills)}
                        placeholder="Add a skill (e.g. React, Laravel)..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="resume">Resume (PDF)</Label>
                    <div className="flex items-center gap-4 rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
                        <Input
                            id="resume"
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) =>
                                setData('resume', e.target.files?.[0] || null)
                            }
                        />
                        <label
                            htmlFor="resume"
                            className="cursor-pointer rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                        >
                            Choose File
                        </label>
                        <span className="text-sm text-muted-foreground">
                            {data.resume
                                ? data.resume.name
                                : user.profile?.resume_path
                                  ? 'Current resume uploaded'
                                  : 'No file chosen'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={processing} type="submit">
                        Save Changes
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 dark:text-green-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
