import { redirect } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { readPendingCookie } from '@/features/auth/two-factor/pending-cookie';
import { VerifyForm } from '@/features/auth/components/verify-form';
import { TwoFactorConstants } from '@/features/auth/two-factor/store';

export const dynamic = 'force-dynamic';

export default async function VerifyPage() {
  const pending = await readPendingCookie();
  if (!pending) {
    redirect('/auth/login');
  }

  // The (dashboard)/auth/ route group doesn't sit under [locale]/, so the
  // intl provider isn't applied automatically. Load the right locale and
  // wrap the form ourselves so useTranslations works inside VerifyForm.
  const messages = await getMessages({ locale: pending.locale });

  return (
    <NextIntlClientProvider locale={pending.locale} messages={messages}>
      <VerifyForm
        email={pending.email}
        locale={pending.locale}
        initialCooldownSeconds={Math.min(
          TwoFactorConstants.RESEND_TTL,
          Math.max(
            0,
            TwoFactorConstants.RESEND_TTL -
              Math.floor((Date.now() - pending.iat) / 1000),
          ),
        )}
      />
    </NextIntlClientProvider>
  );
}
