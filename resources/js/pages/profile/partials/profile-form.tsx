import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SkillsInput } from '@/components/ui/skills-input';
import { Availability, EducationLevel, SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ProfileForm({
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage<SharedData>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            // Basic Info
            headline: user.profile?.headline || '',
            phone: user.profile?.phone || '',
            linkedin_url: user.profile?.linkedin_url || '',
            portfolio_url: user.profile?.portfolio_url || '',
            skills: user.profile?.skills || [],

            // Location
            city: user.profile?.city || '',
            country: user.profile?.country || 'Morocco',

            // Personal
            date_of_birth: user.profile?.date_of_birth || '',
            nationality: user.profile?.nationality || 'Moroccan',

            // Professional
            years_of_experience: user.profile?.years_of_experience || 0,
            expected_salary: user.profile?.expected_salary || '',
            availability: (user.profile?.availability ||
                'negotiable') as Availability,
            education_level: (user.profile?.education_level ||
                null) as EducationLevel | null,

            // Morocco-specific
            has_driving_license: user.profile?.has_driving_license || false,

            // File
            resume: null as File | null,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Handle Resume Upload separately if new file selected
        if (data.resume instanceof File) {
            router.post(
                '/candidate-profile/resume',
                {
                    resume: data.resume,
                },
                {
                    forceFormData: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        // Then update profile data
                        patch('/candidate-profile', {
                            preserveScroll: true,
                        });
                    },
                },
            );
        } else {
            // Just update profile data
            patch('/candidate-profile', {
                preserveScroll: true,
            });
        }
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
                {/* Headline & Phone */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input
                            id="headline"
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
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            required
                            placeholder="+212 600 123 456"
                        />
                    </div>
                </div>

                {/* LinkedIn & Portfolio */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                        <Input
                            id="linkedin_url"
                            type="url"
                            value={data.linkedin_url || ''}
                            onChange={(e) =>
                                setData('linkedin_url', e.target.value)
                            }
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="portfolio_url">Portfolio URL</Label>
                        <Input
                            id="portfolio_url"
                            type="url"
                            value={data.portfolio_url || ''}
                            onChange={(e) =>
                                setData('portfolio_url', e.target.value)
                            }
                            placeholder="https://yourportfolio.com"
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            value={data.city || ''}
                            onChange={(e) => setData('city', e.target.value)}
                            placeholder="e.g. Casablanca"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                            id="country"
                            value={data.country}
                            onChange={(e) => setData('country', e.target.value)}
                            placeholder="e.g. Morocco"
                        />
                    </div>
                </div>

                {/* Personal Info */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                        <Input
                            id="date_of_birth"
                            type="date"
                            value={data.date_of_birth || ''}
                            onChange={(e) =>
                                setData('date_of_birth', e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                            id="nationality"
                            value={data.nationality || ''}
                            onChange={(e) =>
                                setData('nationality', e.target.value)
                            }
                            placeholder="e.g. Moroccan"
                        />
                    </div>
                </div>

                {/* Professional Info */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="years_of_experience">
                            Years of Experience
                        </Label>
                        <Input
                            id="years_of_experience"
                            type="number"
                            min={0}
                            value={data.years_of_experience || 0}
                            onChange={(e) =>
                                setData(
                                    'years_of_experience',
                                    Number(e.target.value),
                                )
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expected_salary">Expected Salary</Label>
                        <Input
                            id="expected_salary"
                            value={data.expected_salary || ''}
                            onChange={(e) =>
                                setData('expected_salary', e.target.value)
                            }
                            placeholder="e.g. 25k-35k MAD"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="availability">Availability</Label>
                        <Select
                            value={data.availability || 'negotiable'}
                            onValueChange={(value: Availability) =>
                                setData('availability', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="When can you start?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="immediate">
                                    Immediately
                                </SelectItem>
                                <SelectItem value="1_week">1 Week</SelectItem>
                                <SelectItem value="1_month">1 Month</SelectItem>
                                <SelectItem value="negotiable">
                                    Negotiable
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Education Level */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="education_level">Education Level</Label>
                        <Select
                            value={data.education_level || ''}
                            onValueChange={(value) =>
                                setData(
                                    'education_level',
                                    value as EducationLevel,
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select education level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bac">Bac</SelectItem>
                                <SelectItem value="bac+2">Bac+2</SelectItem>
                                <SelectItem value="bac+3">
                                    Bac+3 (Licence)
                                </SelectItem>
                                <SelectItem value="bac+5">
                                    Bac+5 (Master / Ingénieur)
                                </SelectItem>
                                <SelectItem value="phd">PhD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-8">
                        <Checkbox
                            id="has_driving_license"
                            checked={data.has_driving_license}
                            onCheckedChange={(checked) =>
                                setData('has_driving_license', checked === true)
                            }
                        />
                        <Label
                            htmlFor="has_driving_license"
                            className="cursor-pointer font-normal"
                        >
                            I have a driving license (Permis B)
                        </Label>
                    </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                    <Label>Skills</Label>
                    <SkillsInput
                        value={data.skills}
                        onChange={(skills) => setData('skills', skills)}
                        placeholder="Add a skill (e.g. React, Laravel)..."
                    />
                </div>

                {/* Resume Upload */}
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

                {/* Submit */}
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
