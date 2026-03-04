'use client';

import { z } from 'zod';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FcGoogle
} from 'react-icons/fc';
import {
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import {
  RefreshCw,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

import { LoginSchema } from '../schemas';
import { login } from '../actions/login';
import { resendTwoFactor } from '../actions/resend-two-factor';
import { TextShimmer } from '@/components/motion-primitives/text-shimmer';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
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

export interface LoginFormProps {
  isGoogleEnabled?: boolean;
}

export function LoginForm({ isGoogleEnabled = true }: LoginFormProps) {
  const [isClient, setIsClient] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();


  // SANITIZE callbackUrl: Allow only internal relative paths starting with /
  const getSanitizedCallbackUrl = () => {
    const rawUrl = searchParams.get('callbackUrl');
    if (!rawUrl) return DEFAULT_LOGIN_REDIRECT;

    // Reject absolute URLs (containing :// or starting with //) to avoid open redirect vulnerabilities
    if (rawUrl.includes('://') || rawUrl.startsWith('//')) {
      return DEFAULT_LOGIN_REDIRECT;
    }

    // Ensure it starts with / and doesn't contain a host portion
    if (rawUrl.startsWith('/')) {
      return rawUrl;
    }

    return DEFAULT_LOGIN_REDIRECT;
  };

  const callbackUrl = getSanitizedCallbackUrl();

  const getUrlError = () => {
    const error = searchParams.get('error');
    if (!error) return "";

    const errorMap: Record<string, string> = {
      'OAuthAccountNotLinked': 'Email already in use with different provider!',
      'OAuthCallbackError': 'Failed to complete the external authentication.',
      'OAuthSignin': 'Error occurred during sign in process.',
      'CredentialsSignin': 'Invalid credentials provided.',
      'SessionRequired': 'Please sign in to access this page.',
      'Default': 'An unexpected authentication error occurred.'
    };

    return errorMap[error] || errorMap['Default'];
  };

  const urlError = getUrlError();

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

  const handleBackToLogin = () => {
    setShowTwoFactor(false);
    form.setValue('code', ''); // Reset 2FA input state
  };

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) setError(data.error);
          if (data?.success) setSuccess(data.success);
          if (data?.twoFactor) setShowTwoFactor(true);
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
          if (data?.error) setError(data.error);
          if (data?.success) {
            setSuccess(data.success);
            setResendCooldown(60);
          }
        })
        .catch(() => setError('Failed to resend code'));
    });
  };

  const onSocialClick = (provider: 'google') => {
    signIn(provider, { callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (!isClient || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <TextShimmer className="font-mono text-sm text-gray-600" duration={1}>
            Loading...
          </TextShimmer>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.4]" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/95 to-orange-50/30" />

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md mx-4"
        dir="ltr"
      >
        {/* Logo Header */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-900 font-almarai">
                Incubator
              </h2>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Sign In
              </p>
            </div>
          </div>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          variants={itemVariants}
          className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 overflow-hidden"
        >
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1
                className="text-2xl font-bold text-gray-900 font-almarai mb-2"
                layout
              >
                {showTwoFactor ? 'Verify Account' : 'Welcome Back'}
              </motion.h1>
              <p className="text-sm text-gray-500">
                {showTwoFactor
                  ? 'Enter the 6-digit code sent to your email'
                  : 'Sign in to access your dashboard'
                }
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {!showTwoFactor ? (
                    <motion.div
                      key="login-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-5"
                    >
                      {/* Google Sign In (Conditional) */}
                      {isGoogleEnabled && (
                        <motion.button
                          type="button"
                          onClick={() => onSocialClick('google')}
                          disabled={isPending}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full h-14 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10 transition-all disabled:opacity-50 group"
                        >
                          <FcGoogle className="w-5 h-5" />
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                            Continue with Google
                          </span>
                        </motion.button>
                      )}

                      {/* Divider */}
                      {isGoogleEnabled && (
                        <div className="relative flex items-center gap-4">
                          <div className="flex-1 h-px bg-gray-200" />
                          <span className="text-xs text-gray-400 font-medium uppercase">
                            OR
                          </span>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>
                      )}

                      {/* Email Field */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <label
                              htmlFor="login-email"
                              className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 cursor-pointer"
                            >
                              Email Address
                            </label>
                            <FormControl>
                              <div className="relative group">
                                <Mail className={cn(
                                  "absolute top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                                  "left-4",
                                  focusedField === 'email' ? 'text-orange-500' : 'text-gray-400'
                                )} />
                                <input
                                  {...field}
                                  id="login-email"
                                  type="email"
                                  disabled={isPending}
                                  placeholder="your@email.com"
                                  onFocus={() => setFocusedField('email')}
                                  onBlur={() => setFocusedField(null)}
                                  className={cn(
                                    "w-full h-14 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400",
                                    "transition-all duration-300 outline-none",
                                    "focus:border-orange-500 focus:bg-white focus:shadow-lg focus:shadow-orange-500/10",
                                    "pl-12 pr-4"
                                  )}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs mt-1" />
                          </FormItem>
                        )}
                      />

                      {/* Password Field */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-2">
                              <label
                                htmlFor="login-password"
                                className="text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer"
                              >
                                Password
                              </label>
                              <Link
                                href="/auth/reset"
                                className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
                              >
                                Forgot?
                              </Link>
                            </div>
                            <FormControl>
                              <div className="relative group">
                                <Lock className={cn(
                                  "absolute top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                                  "left-4",
                                  focusedField === 'password' ? 'text-orange-500' : 'text-gray-400'
                                )} />
                                <input
                                  {...field}
                                  id="login-password"
                                  type={showPassword ? 'text' : 'password'}
                                  disabled={isPending}
                                  placeholder="••••••••"
                                  onFocus={() => setFocusedField('password')}
                                  onBlur={() => setFocusedField(null)}
                                  className={cn(
                                    "w-full h-14 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400",
                                    "transition-all duration-300 outline-none",
                                    "focus:border-orange-500 focus:bg-white focus:shadow-lg focus:shadow-orange-500/10",
                                    "pl-12 pr-12"
                                  )}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                                  aria-pressed={showPassword}
                                  className={cn(
                                    "absolute top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 transition-colors",
                                    "right-3"
                                  )}
                                >
                                  {showPassword ? (
                                    <FaEyeSlash className="w-4 h-4 text-gray-500" />
                                  ) : (
                                    <FaEye className="w-4 h-4 text-gray-500" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="two-factor"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-6"
                    >
                      {/* 2FA Icon */}
                      <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                          <ShieldCheck className="w-10 h-10 text-orange-600" />
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-center">
                            <label
                              htmlFor="two-factor-code"
                              className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 cursor-pointer"
                            >
                              Verification Code
                            </label>
                            <FormControl>
                              <div className="flex flex-col items-center gap-6 w-full">
                                <div className="relative">
                                  <input
                                    {...field}
                                    id="two-factor-code"
                                    disabled={isPending}
                                    maxLength={6}
                                    placeholder="000000"
                                    className={cn(
                                      "w-48 h-16 text-center text-3xl font-bold tracking-[0.5em] bg-gray-50 border-2 border-gray-200 rounded-xl",
                                      "text-gray-900 placeholder:text-gray-300",
                                      "focus:border-orange-500 focus:bg-white focus:shadow-lg focus:shadow-orange-500/10",
                                      "transition-all duration-300 outline-none"
                                    )}
                                    autoFocus
                                  />
                                  <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={onResendCode}
                                  disabled={isPending || resendCooldown > 0}
                                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors disabled:opacity-50"
                                >
                                  <RefreshCw className={cn("w-4 h-4", isPending && "animate-spin")} />
                                  {resendCooldown > 0
                                    ? `Resend in ${resendCooldown}s`
                                    : 'Resend code'}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs mt-2 text-center" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Alerts */}
                <AnimatePresence>
                  {(error || urlError) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <FormError message={error || urlError} />
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <FormSuccess message={success} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full h-14 relative overflow-hidden rounded-xl font-bold text-white shadow-lg transition-all",
                    "bg-gradient-to-r from-orange-400 to-orange-600 shadow-orange-500/30",
                    "hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-500 hover:to-orange-700",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  )}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />

                  <span className="relative flex items-center justify-center gap-2">
                    {isPending ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : showTwoFactor ? (
                      <>
                        Verify & Sign In
                        <CheckCircle2 className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Back to Login Link (2FA mode) */}
                <AnimatePresence>
                  {showTwoFactor && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handleBackToLogin}
                      className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
                    >
                      Back to login
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </Form>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400">
              By signing in, you agree to our{" "}
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600 transition-colors">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600 transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}