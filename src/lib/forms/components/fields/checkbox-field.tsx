
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface CheckboxFieldProps {
    id?: string;
    checked?: boolean;
    onCheckedChange: (checked: boolean) => void;
    label: React.ReactNode; // Can be string or JSX (for links in terms)
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export function CheckboxField({
    id,
    checked,
    onCheckedChange,
    label,
    description,
    error,
    required,
    disabled,
    className,
}: CheckboxFieldProps) {
    const inputId = id || crypto.randomUUID();

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <Checkbox
                    id={inputId}
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                    disabled={disabled}
                    className={cn('mt-1', error && 'border-destructive')}
                />
                <div className="grid gap-1.5 leading-none">
                    <Label
                        htmlFor={inputId}
                        className={cn(
                            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                            error ? 'text-destructive' : 'text-foreground'
                        )}
                    >
                        {label}
                        {required && <span className="text-destructive ms-1">*</span>}
                    </Label>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
            </div>
            {error && (
                <p className="text-[0.8rem] font-medium text-destructive animate-in slide-in-from-top-1 fade-in">
                    {error}
                </p>
            )}
        </div>
    );
}
