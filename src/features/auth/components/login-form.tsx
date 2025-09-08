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
import { TextShimmer } from '@/components/motion-primitives/text-shimmer';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

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

  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || DEFAULT_LOGIN_REDIRECT;
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      <div className="relative h-auto bg-[rgba(35, 31, 32, 0.5)]  backdrop-blur-[100px] rounded-3xl p-[60px] flex flex-col justify-center gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[40px] leading-[50px] font-semibold text-white font-outfit">
            Sign in
          </h1>
          <p className="text-lg text-white/40 font-outfit">
            Sign in with open account
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
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

              {/* Apple button - hidden as per design */}
              {false && (
                <button
                  type="button"
                  disabled={isPending}
                  className="w-full h-14 flex items-center justify-center gap-3 bg-white/[0.08] border border-white/[0.08] rounded-2xl transition-all hover:bg-white/[0.12] disabled:opacity-50"
                >
                  <FaApple className="w-6 h-6 text-white" />
                  <span className="text-lg text-white font-outfit">
                    Continue with Apple
                  </span>
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-sm text-white/40 font-outfit">OR</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-6">
              {showTwoFactor ? (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-base font-medium text-white/40 font-outfit uppercase tracking-wide">
                        Two Factor Code
                      </label>
                      <FormControl>
                        <input
                          {...field}
                          disabled={isPending}
                          placeholder="123456"
                          className="w-full h-14 px-4 bg-transparent border border-white/[0.08] rounded-xl text-lg text-white placeholder:text-[#8A8F93] font-outfit focus:outline-none focus:border-white/20 transition-colors"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
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
                          Forgot password ?
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
            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={isPending}
                /* Button */
                className="w-full h-14 bg-gradient-to-t from-orange-600 to-orange-400 to-90% hover:bg-gradient-to-b hover:from-orange-600 hover:to-orange-400 hover:to-60%  rounded-lg flex items-center justify-center font-semibold text-lg text-white font-outfit transition-colors disabled:opacity-50"
              >
                {isPending
                  ? 'Loading...'
                  : showTwoFactor
                    ? 'Confirm'
                    : 'Sign in'}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
