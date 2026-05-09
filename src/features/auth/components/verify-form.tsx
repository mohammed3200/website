'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { CodeInput } from './code-input';
import { FormError } from './form-error';
import { FormSuccess } from './form-success';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { cn } from '@/lib/utils';

export interface VerifyFormProps {
  email: string;
  locale?: 'ar' | 'en';
  initialCooldownSeconds?: number;
}

export function VerifyForm({
  email,
  locale = 'en',
  initialCooldownSeconds = 0,
}: VerifyFormProps) {
  const t = useTranslations('Auth.verify');
  const isArabic = locale === 'ar';
  const router = useRouter();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(initialCooldownSeconds);
  const [isPending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  async function submit(submittedCode: string) {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code: submittedCode }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429) setError(t('errors.locked'));
        else if (res.status === 410) setError(t('errors.expired'));
        else if (typeof body.remainingAttempts === 'number')
          setError(`${t('errors.invalid')} (${body.remainingAttempts} ${t('attemptsRemaining')})`);
        else setError(body.error || t('errors.invalid'));
        setCode('');
        return;
      }

      // Promote to a NextAuth session via the bypass-token path.
      const signRes = await signIn('credentials', {
        email: body.email,
        tfaBypass: body.tfaBypass,
        password: '',
        redirect: false,
      });

      if (signRes?.error) {
        setError(t('errors.sessionFailed'));
        return;
      }

      setSuccess(t('success'));
      router.replace(signRes?.url || DEFAULT_LOGIN_REDIRECT);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  function onResend() {
    if (resendCooldown > 0) return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await fetch('/api/auth/resend-2fa', { method: 'POST' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || t('errors.resendFailed'));
        if (typeof body.retryAfter === 'number') setResendCooldown(body.retryAfter);
        return;
      }
      setSuccess(t('resendSent'));
      setResendCooldown(body.resendInSeconds || 60);
    });
  }

  return (
    <div
      className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-almarai">
          {t('title')}
        </h1>
        <p className="text-sm text-gray-500 mt-2">{t('subtitle', { email })}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.length === 6) void submit(code);
        }}
        className="flex flex-col items-center gap-6"
      >
        <CodeInput
          value={code}
          onChange={setCode}
          disabled={submitting}
          isArabic={isArabic}
          onComplete={submit}
          ariaLabel={t('codeInputLabel')}
        />

        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}

        <button
          type="submit"
          disabled={submitting || code.length !== 6}
          className={cn(
            'w-full h-12 rounded-xl font-semibold text-white transition-all',
            'bg-gradient-to-r from-orange-500 to-orange-600',
            'hover:from-orange-600 hover:to-orange-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {submitting ? t('verifying') : t('verifyAction')}
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={isPending || resendCooldown > 0}
          className="text-sm text-gray-500 hover:text-orange-600 disabled:opacity-50"
        >
          {resendCooldown > 0
            ? `${t('resendIn')} ${resendCooldown}s`
            : t('resend')}
        </button>
      </form>
    </div>
  );
}
