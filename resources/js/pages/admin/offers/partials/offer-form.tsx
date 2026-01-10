import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SkillsInput } from '@/components/ui/skills-input';
import type {
    Company,
    EducationLevel,
    ExperienceLevel,
    Offer,
    OfferType,
    WorkMode,
} from '@/types';
import { router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface OfferFormProps {
    offer?: Offer;
    companies: Company[];
    mode: 'create' | 'edit';
}

export function OfferForm({ offer, companies, mode }: OfferFormProps) {
    const [data, setData] = useState({
        company_id: offer?.company_id || companies[0]?.id || 1,
        title: offer?.title || '',
        location: offer?.location || '',
        work_mode: (offer?.work_mode || 'onsite') as WorkMode,
        type: (offer?.type || 'full-time') as OfferType,
        experience_level: (offer?.experience_level || 'mid') as ExperienceLevel,
        education_required: (offer?.education_required || null) as
            | EducationLevel
            | 'none'
            | null,
        salary_range: offer?.salary_range || '',
        description: offer?.description || '',
        languages_required: offer?.languages_required || [],
        benefits: offer?.benefits || [],
        positions_count: offer?.positions_count || 1,
        is_urgent: offer?.is_urgent ?? false,
        is_active: offer?.is_active ?? true,
        deadline: offer?.deadline ? offer.deadline.split('T')[0] : '',
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        if (mode === 'create') {
            router.post('/admin/offers', data, {
                onError: (errs) => {
                    setErrors(errs);
                    setProcessing(false);
                },
                onSuccess: () => setProcessing(false),
            });
        } else {
            router.put(`/admin/offers/${offer?.slug}`, data, {
                onError: (errs) => {
                    setErrors(errs);
                    setProcessing(false);
                },
                onSuccess: () => setProcessing(false),
            });
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prev) => ({ ...prev, title: e.target.value }));
    };

    return (
        <form onSubmit={submit} className="max-w-4xl space-y-8">
            {companies.length === 0 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Companies Found</AlertTitle>
                    <AlertDescription>
                        You need at least one verified company to create an
                        offer. Please go to Companies and verify a company
                        first.
                    </AlertDescription>
                </Alert>
            )}

            {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Please fix the errors below before submitting.
                    </AlertDescription>
                </Alert>
            )}
            {/* Company & Title Row */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="company_id">Company</Label>
                    <Select
                        value={String(data.company_id)}
                        onValueChange={(value) =>
                            setData({ ...data, company_id: Number(value) })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                            {companies.map((company) => (
                                <SelectItem
                                    key={company.id}
                                    value={String(company.id)}
                                >
                                    {company.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                        id="title"
                        value={data.title}
                        onChange={handleTitleChange}
                        placeholder="e.g. Senior React Developer"
                        required
                    />
                </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    value={data.location}
                    onChange={(e) =>
                        setData({ ...data, location: e.target.value })
                    }
                    placeholder="e.g. Casablanca, Remote"
                    required
                />
                {errors.location && (
                    <p className="text-sm text-red-500">{errors.location}</p>
                )}
            </div>

            {/* Work Mode & Type Row */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="work_mode">Work Mode</Label>
                    <Select
                        value={data.work_mode}
                        onValueChange={(value: WorkMode) =>
                            setData({ ...data, work_mode: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select work mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="onsite">On-site</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">Employment Type</Label>
                    <Select
                        value={data.type}
                        onValueChange={(value: OfferType) =>
                            setData({ ...data, type: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="freelance">Freelance</SelectItem>
                            <SelectItem value="internship">
                                Internship
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="experience_level">Experience Level</Label>
                    <Select
                        value={data.experience_level}
                        onValueChange={(value: ExperienceLevel) =>
                            setData({ ...data, experience_level: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="junior">Junior</SelectItem>
                            <SelectItem value="mid">Mid-level</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                            <SelectItem value="lead">Lead</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Education & Salary Row */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="education_required">
                        Education Required
                    </Label>
                    <Select
                        value={data.education_required || 'none'}
                        onValueChange={(value) =>
                            setData({
                                ...data,
                                education_required:
                                    value === 'none'
                                        ? null
                                        : (value as EducationLevel),
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select education" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Not required</SelectItem>
                            <SelectItem value="bac">Bac</SelectItem>
                            <SelectItem value="bac+2">Bac+2</SelectItem>
                            <SelectItem value="bac+3">Bac+3</SelectItem>
                            <SelectItem value="bac+5">Bac+5</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="salary_range">Salary Range</Label>
                    <Input
                        id="salary_range"
                        value={data.salary_range || ''}
                        onChange={(e) =>
                            setData({ ...data, salary_range: e.target.value })
                        }
                        placeholder="e.g. 25k - 35k MAD"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="positions_count">Positions</Label>
                    <Input
                        id="positions_count"
                        type="number"
                        min={1}
                        value={data.positions_count}
                        onChange={(e) =>
                            setData({
                                ...data,
                                positions_count: Number(e.target.value),
                            })
                        }
                    />
                </div>
            </div>

            {/* Languages Required */}
            <div className="space-y-2">
                <Label>Languages Required</Label>
                <SkillsInput
                    value={data.languages_required || []}
                    onChange={(languages) =>
                        setData({ ...data, languages_required: languages })
                    }
                    placeholder="Add language (e.g. French, English, Arabic)..."
                />
            </div>

            {/* Benefits */}
            <div className="space-y-2">
                <Label>Benefits</Label>
                <SkillsInput
                    value={data.benefits || []}
                    onChange={(benefits) =>
                        setData({ ...data, benefits: benefits })
                    }
                    placeholder="Add benefit (e.g. Health insurance, Remote work)..."
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label>Description</Label>
                <div className="min-h-300px rounded-md border border-input">
                    <RichTextEditor
                        value={data.description}
                        onChange={(value) =>
                            setData({ ...data, description: value })
                        }
                    />
                </div>
            </div>

            {/* Deadline & Status Row */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                        id="deadline"
                        type="date"
                        value={data.deadline}
                        onChange={(e) =>
                            setData({ ...data, deadline: e.target.value })
                        }
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={data.is_active ? 'active' : 'draft'}
                        onValueChange={(value) =>
                            setData({ ...data, is_active: value === 'active' })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="draft">
                                Draft (Hidden)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                        id="is_urgent"
                        checked={data.is_urgent}
                        onCheckedChange={(checked) =>
                            setData({ ...data, is_urgent: checked === true })
                        }
                    />
                    <Label
                        htmlFor="is_urgent"
                        className="cursor-pointer font-normal"
                    >
                        Mark as Urgent Hiring
                    </Label>
                </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-4">
                <Button type="submit" disabled={processing} variant="purple">
                    {processing
                        ? 'Saving...'
                        : mode === 'create'
                          ? 'Create Offer'
                          : 'Update Offer'}
                </Button>
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() => router.visit('/admin/offers')}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
