import { Button } from '@/components/ui/button';
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
import { Offer, OfferType } from '@/types';
import { router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface OfferFormProps {
    offer?: Offer;
    mode: 'create' | 'edit';
}

export function OfferForm({ offer, mode }: OfferFormProps) {
    // using local state instead of useForm for now to purely mock the interaction without backend
    const [data, setData] = useState({
        title: offer?.title || '',
        slug: offer?.slug || '',
        location: offer?.location || '',
        type: offer?.type || 'full-time',
        salary_range: offer?.salary_range || '',
        description: offer?.description || '',
        is_active: offer?.is_active ?? true,
    });

    const [processing, setProcessing] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Mock network delay
        setTimeout(() => {
            setProcessing(false);
            console.log('Form Submitted:', data);

            // Redirect back to index
            router.visit('/admin/offers');
        }, 1000);
    };

    // Auto-generate slug from title if in create mode and slug is empty
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const updates: any = { title };

        if (
            mode === 'create' &&
            (!data.slug ||
                data.slug ===
                    title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, ''))
        ) {
            updates.slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        }

        setData((prev) => ({ ...prev, ...updates }));
    };

    return (
        <form onSubmit={submit} className="max-w-3xl space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
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

                <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                        id="slug"
                        value={data.slug}
                        onChange={(e) =>
                            setData({ ...data, slug: e.target.value })
                        }
                        placeholder="e.g. senior-react-developer"
                        required
                    />
                </div>

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
                </div>

                <div className="space-y-2">
                    <Label htmlFor="salary_range">Salary Range</Label>
                    <Input
                        id="salary_range"
                        value={data.salary_range || ''}
                        onChange={(e) =>
                            setData({ ...data, salary_range: e.target.value })
                        }
                        placeholder="e.g. 15k - 20k MAD"
                    />
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
                        </SelectContent>
                    </Select>
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
            </div>

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

            <div className="flex items-center gap-4">
                <Button
                    type="submit"
                    disabled={processing}
                    variant="purple"
                >
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
