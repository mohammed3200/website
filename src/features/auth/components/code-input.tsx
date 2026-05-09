'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface CodeInputProps {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  isArabic?: boolean;
  /**
   * Fired when 6 digits have been entered. Useful for auto-submit.
   */
  onComplete?: (code: string) => void;
  ariaLabel?: string;
}

/**
 * 6-digit numeric code input. Mobile-friendly, RTL-safe, paste-friendly.
 * Auto-submits via onComplete once 6 digits are present.
 */
export function CodeInput({
  value,
  onChange,
  disabled,
  isArabic,
  onComplete,
  ariaLabel,
}: CodeInputProps) {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value.length === 6) onComplete?.(value);
  }, [value, onComplete]);

  return (
    <input
      ref={ref}
      data-testid="two-factor-code"
      autoFocus
      autoComplete="one-time-code"
      inputMode="numeric"
      pattern="\d*"
      maxLength={6}
      disabled={disabled}
      value={value}
      aria-label={ariaLabel || (isArabic ? 'رمز التحقق المكون من 6 أرقام' : '6-digit verification code')}
      onChange={(e) => {
        const next = e.target.value.replace(/\D/g, '').slice(0, 6);
        onChange(next);
      }}
      placeholder="000000"
      dir="ltr"
      className={cn(
        'w-48 h-16 text-center text-3xl font-bold tracking-[0.5em]',
        'bg-gray-50 border-2 border-gray-200 rounded-xl',
        'text-gray-900 placeholder:text-gray-300',
        'focus:border-orange-500 focus:bg-white focus:shadow-lg focus:shadow-orange-500/10',
        'transition-all duration-300 outline-none',
      )}
    />
  );
}
