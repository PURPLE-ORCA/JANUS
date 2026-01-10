import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Offer, User } from '@/types';
import { useForm } from '@inertiajs/react';
import {
    Check,
    CheckCircle2,
    FileText,
    Loader2,
    UploadCloud,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    offer: Offer;
    user: User;
    isOpen: boolean;
    onClose: () => void;
}

export default function ApplicationModal({
    offer,
    user,
    isOpen,
    onClose,
}: Props) {
    const [isSuccess, setIsSuccess] = useState(false);

    // In a real app, this would use the inertia form helper
    const { data, setData, processing, reset } = useForm({
        cover_note: '',
        resume: null as File | null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock submission delay
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            // In real app: post(route('applications.store'))
        }, 1500);
    };

    const handleClose = () => {
        if (isSuccess) {
            // Reset state when closing after success
            setTimeout(() => {
                setIsSuccess(false);
                reset();
            }, 300);
        }
        onClose();
    };

    if (isSuccess) {
        return (
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-425px">
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <DialogTitle className="mb-2 text-xl">
                            Application Sent!
                        </DialogTitle>
                        <DialogDescription className="mb-6">
                            Your application for{' '}
                            <span className="font-semibold text-foreground">
                                {offer.title}
                            </span>{' '}
                            has been successfully submitted. We'll be in touch
                            soon.
                        </DialogDescription>
                        <Button
                            onClick={handleClose}
                            className="w-full bg-[#5617c2] hover:bg-[#4512a0]"
                        >
                            Done
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-550px">
                <DialogHeader>
                    <DialogTitle>Apply for {offer.title}</DialogTitle>
                    <DialogDescription>
                        Review your details and add a cover note to complete
                        your application.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                    {/* Personal Info Summary */}
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                        <h4 className="mb-3 font-medium text-foreground">
                            Applicant Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-muted-foreground">
                            <div>
                                <span className="block text-xs text-neutral-500 uppercase">
                                    Name
                                </span>
                                <span className="text-foreground">
                                    {user.name}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-neutral-500 uppercase">
                                    Email
                                </span>
                                <span className="text-foreground">
                                    {user.email}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-neutral-500 uppercase">
                                    Phone
                                </span>
                                <span className="text-foreground">
                                    {user.profile?.phone || 'Not provided'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-neutral-500 uppercase">
                                    Current Role
                                </span>
                                <span className="text-foreground">
                                    {user.profile?.headline || 'Not provided'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Resume Section */}
                    <div className="space-y-2">
                        <Label htmlFor="resume">Resume</Label>
                        {user.profile?.resume_path ? (
                            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-400">
                                <Check className="h-4 w-4" />
                                <span className="font-medium">
                                    Resume on file
                                </span>
                                <span className="ml-auto text-xs opacity-70">
                                    Last updated:{' '}
                                    {new Date(
                                        user.profile.updated_at,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="file"
                                    id="resume-upload"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setData('resume', file);
                                    }}
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                                        data.resume
                                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10'
                                            : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50'
                                    }`}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const file = e.dataTransfer.files?.[0];
                                        if (file) setData('resume', file);
                                    }}
                                >
                                    <div className="space-y-1 text-center">
                                        {data.resume ? (
                                            <>
                                                <FileText className="mx-auto h-8 w-8 text-violet-500" />
                                                <p className="text-sm font-medium text-violet-700 dark:text-violet-400">
                                                    {data.resume.name}
                                                </p>
                                                <p className="text-xs text-neutral-400">
                                                    {(
                                                        data.resume.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{' '}
                                                    MB • Click to change
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <UploadCloud className="mx-auto h-8 w-8 text-neutral-400" />
                                                <p className="text-sm text-muted-foreground">
                                                    <span className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400">
                                                        Click to upload
                                                    </span>{' '}
                                                    or drag and drop
                                                </p>
                                                <p className="text-xs text-neutral-400">
                                                    PDF, DOC up to 5MB
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Cover Note */}
                    <div className="space-y-2">
                        <Label htmlFor="cover_note">
                            Cover Note (Optional)
                        </Label>
                        <Textarea
                            id="cover_note"
                            placeholder="Tell us why you're a great fit for this role..."
                            className="min-h-120px resize-none"
                            value={data.cover_note}
                            onChange={(e) =>
                                setData('cover_note', e.target.value)
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#5617c2] hover:bg-[#4512a0]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    submitting...
                                </>
                            ) : (
                                'Submit Application'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
