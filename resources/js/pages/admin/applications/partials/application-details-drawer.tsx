import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Application } from '@/types';
import { router } from '@inertiajs/react';

import {
    Calendar,
    CheckCircle2,
    Download,
    Eye,
    FileText,
    Mail,
    MapPin,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface ApplicationDetailsDrawerProps {
    application: Application | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ApplicationDetailsDrawer({
    application,
    open,
    onOpenChange,
}: ApplicationDetailsDrawerProps) {
    const [processing, setProcessing] = useState(false);

    if (!application) return null;

    const handleStatusChange = (status: string) => {
        router.patch(
            `/admin/applications/${application.id}/status`,
            { status },
            {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onSuccess: () => onOpenChange(false),
                preserveScroll: true,
            },
        );
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto px-4 sm:max-w-2xl">
                <SheetHeader className="mb-6 space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={application.user?.avatar || undefined}
                                    alt={application.user?.name}
                                />
                                <AvatarFallback className="text-xl">
                                    {application.user?.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <SheetTitle className="text-xl">
                                    {application.user?.name}
                                </SheetTitle>
                                <SheetDescription className="flex items-center gap-2">
                                    <Mail className="size-3.5" />
                                    {application.user?.email}
                                </SheetDescription>
                            </div>
                        </div>
                        <Badge
                            variant={
                                application.status === 'new'
                                    ? 'secondary'
                                    : application.status === 'hired'
                                      ? 'default'
                                      : 'outline'
                            }
                            className="capitalize"
                        >
                            {application.status}
                        </Badge>
                    </div>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Offer Info */}
                    <div className="rounded-lg border bg-muted/20 p-4">
                        <h4 className="mb-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                            Applied For
                        </h4>
                        <div className="font-semibold text-foreground">
                            {application.offer?.title}
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="size-3.5" />
                                {application.offer?.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="size-3.5" />
                                Applied on{' '}
                                {new Date(
                                    application.created_at,
                                ).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Resume & Documents */}
                    <div>
                        <h4 className="mb-3 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                            Documents
                        </h4>
                        <div className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                                    <FileText className="size-5" />
                                </div>
                                <div>
                                    <div className="font-medium">
                                        Resume.pdf
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Uploaded{' '}
                                        {new Date(
                                            application.created_at,
                                        ).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Preview"
                                >
                                    <Eye className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Download"
                                >
                                    <Download className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Cover Note */}
                    <div>
                        <h4 className="mb-3 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                            Cover Note
                        </h4>
                        <div className="rounded-md bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
                            {application.cover_note || (
                                <span className="text-muted-foreground/50 italic">
                                    No cover note provided.
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <SheetFooter className="mx-auto mt-8 flex flex-row justify-between gap-2 sm:justify-start">
                    <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 sm:flex-none"
                        onClick={() => handleStatusChange('shortlisted')}
                        disabled={processing}
                    >
                        <CheckCircle2 className="mr-2 size-4" />
                        Shortlist
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex-1 sm:flex-none"
                        onClick={() => handleStatusChange('rejected')}
                        disabled={processing}
                    >
                        <XCircle className="mr-2 size-4" />
                        Reject
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        onClick={() => handleStatusChange('viewed')}
                        disabled={processing}
                    >
                        Mark as Viewed
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
