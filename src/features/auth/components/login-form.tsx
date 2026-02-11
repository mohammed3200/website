'use client';

import { z } from 'zod';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';

import { LoginSchema } from '../schemas';
import { login } from '../actions/login';
import { resendTwoFactor } from '../actions/resend-two-factor';
import { TextShimmer } from '@/components/motion-primitives/text-shimmer';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { FormError } from '@/features/auth/components/form-error';
import { FormSuccess } from '@/features/auth/components/form-success';

export function LoginForm() {
  const [isClient, setIsClient] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [resendCooldown, setResendCooldown] = useState(0);

  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || DEFAULT_LOGIN_REDIRECT;

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (!isClient) return;

    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [session, status, callbackUrl, router, isClient]);

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError('Something went wrong!'));
    });
  };

  const onResendCode = () => {
    if (resendCooldown > 0) return;

    setError('');
    setSuccess('');

    const email = form.getValues('email');
    if (!email) {
      setError('Email is required to resend code');
      return;
    }

    startTransition(() => {
      resendTwoFactor(email)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }
          if (data?.success) {
            setSuccess(data.success);
            setResendCooldown(60); // 1 minute cooldown
          }
        })
        .catch(() => setError('Failed to resend code'));
    });
  };

  const onSocialClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  if (!isClient || status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <TextShimmer className="font-mono text-xl text-white" duration={1}>
          Loading...
        </TextShimmer>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Login Card */}
      <div className="relative h-auto bg-[rgba(35,31,32,0.5)] backdrop-blur-[100px] rounded-3xl p-[40px] md:p-[60px] flex flex-col justify-center gap-8 w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[32px] md:text-[40px] leading-[50px] font-semibold text-white font-outfit text-center">
            {showTwoFactor ? 'Verify Account' : 'Sign in'}
          </h1>
          <p className="text-base md:text-lg text-white/40 font-outfit text-center">
            {showTwoFactor
              ? 'Check your email for the 6-digit verification code'
              : 'Sign in with open account'}
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {!showTwoFactor && (
              <>
                {/* Social Buttons */}
                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() => onSocialClick('google')}
                    disabled={isPending}
                    className="w-full h-14 flex items-center justify-center gap-3 bg-white/[0.08] border border-white/[0.08] rounded-2xl transition-all hover:bg-white/[0.12] disabled:opacity-50"
                  >
                    <FcGoogle className="w-6 h-6" />
                    <span className="text-lg text-white font-outfit">
                      Continue with Google
                    </span>
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 px-4">
                  <div className="flex-1 h-px bg-white/[0.08]" />
                  <span className="text-sm text-white/40 font-outfit">OR</span>
                  <div className="flex-1 h-px bg-white/[0.08]" />
                </div>
              </>
            )}

            {/* Form Fields */}
            <div className="flex flex-col gap-6">
              {showTwoFactor ? (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <label className="text-base font-medium text-white/40 font-outfit uppercase tracking-wide mb-4">
                        Verification Code
                      </label>
                      <FormControl>
                        <div className="flex flex-col items-center gap-6 w-full">
                          <input
                            {...field}
                            disabled={isPending}
                            maxLength={6}
                            placeholder="000 000"
                            className="w-full max-w-[280px] h-16 px-4 bg-white/5 border border-white/10 rounded-2xl text-3xl font-bold text-center text-white placeholder:text-white/10 font-mono tracking-[0.5em] focus:outline-none focus:border-orange-500 transition-all shadow-inner"
                            autoFocus
                          />

                          <button
                            type="button"
                            onClick={onResendCode}
                            disabled={isPending || resendCooldown > 0}
                            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed group"
                          >
                            <RefreshCw className={cn("w-4 h-4", isPending && "animate-spin")} />
                            {resendCooldown > 0
                              ? `Resend available in ${resendCooldown}s`
                              : 'Didn\'t receive a code? Resend'}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 mt-2" />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-base font-medium text-white/40 font-outfit uppercase tracking-wide">
                          Email
                        </label>
                        <FormControl>
                          <input
                            {...field}
                            type="email"
                            disabled={isPending}
                            placeholder="Email"
                            className="w-full h-14 px-4 bg-transparent border border-white/[0.08] rounded-xl text-lg text-white placeholder:text-[#8A8F93] font-outfit focus:outline-none focus:border-white/20 transition-colors"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-base font-medium text-white/40 font-outfit uppercase tracking-wide">
                          Password
                        </label>
                        <FormControl>
                          <div className="relative">
                            <input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              disabled={isPending}
                              placeholder="Password"
                              className="w-full h-14 px-4 pr-12 bg-transparent border border-white/[0.08] rounded-xl text-lg text-white placeholder:text-[#8A8F93] font-outfit focus:outline-none focus:border-white/20 transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8F93] hover:text-white transition-colors"
                            >
                              {showPassword ? (
                                <FaEyeSlash className="w-6 h-6" />
                              ) : (
                                <FaEye className="w-6 h-6" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <Link
                          href="/auth/reset"
                          className="block text-right text-base text-red-300 font-outfit mt-2 hover:underline"
                        >
                          Forgot password?
                        </Link>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <FormSuccess message={success} />
            <FormError message={error || urlError} />

            {/* Submit Button */}
            <div className="flex flex-col gap-4 mt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-14 bg-gradient-to-t from-orange-600 to-orange-400 rounded-xl flex items-center justify-center font-semibold text-lg text-white shadow-[0_4px_20px_rgba(234,88,12,0.5)] hover:shadow-[0_6px_25px_rgba(234,88,12,0.6)] hover:translate-y-[-1px] active:translate-y-[0px] transition-all disabled:opacity-50"
              >
                {isPending
                  ? 'Processing...'
                  : showTwoFactor
                    ? 'Verify & Sign in'
                    : 'Sign in'}
              </button>

              {showTwoFactor && (
                <button
                  type="button"
                  onClick={() => setShowTwoFactor(false)}
                  className="text-sm text-white/40 hover:text-white transition-colors py-2"
                >
                  Back to Login
                </button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

