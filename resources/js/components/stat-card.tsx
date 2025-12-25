import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: string;
    trend?: string;
    color?: string; // Hex or generic color name if needed, but we'll stick to Tailwind classes mostly
    className?: string;
}

export function StatCard({
    label,
    value,
    icon,
    trend,
    color,
    className,
}: StatCardProps) {
    return (
        <Card
            className={cn('overflow-hidden border-none shadow-md', className)}
        >
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-2">
                        <div
                            className={cn(
                                'flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary',
                                color && `text-[${color}] bg-[${color}]/10`,
                            )}
                        >
                            <Icon icon={icon} className="size-5" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                            {label}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex items-baseline">
                    <h3 className="text-3xl font-bold tracking-tight text-foreground">
                        {value}
                    </h3>
                    {trend && (
                        <span className="ml-2 text-sm text-green-600 dark:text-green-500">
                            {trend}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
