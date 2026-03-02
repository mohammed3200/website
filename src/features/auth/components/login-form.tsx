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
  ArrowLeft,
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
import useLanguage from '@/hooks/use-language';

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isArabic, lang } = useLanguage();

  const callbackUrl = searchParams.get('callbackUrl') || DEFAULT_LOGIN_REDIRECT;
  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked'
    ? 'Email already in use with different provider!'
    : '';

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
        dir={isArabic ? "rtl" : "ltr"}
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
                {isArabic ? 'مركز الريادة' : 'Incubator'}
              </h2>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                {isArabic ? 'تسجيل الدخول' : 'Sign In'}
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
                {showTwoFactor
                  ? (isArabic ? 'التحقق من الحساب' : 'Verify Account')
                  : (isArabic ? 'تسجيل الدخول' : 'Welcome Back')
                }
              </motion.h1>
              <p className="text-sm text-gray-500">
                {showTwoFactor
                  ? (isArabic ? 'أدخل رمز التحقق المرسل إلى بريدك' : 'Enter the 6-digit code sent to your email')
                  : (isArabic ? 'سجل دخولك للوصول إلى لوحة التحكم' : 'Sign in to access your dashboard')
                }
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {!showTwoFactor ? (
                    <motion.div
                      key="login-form"
                      initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isArabic ? -20 : 20 }}
                      className="space-y-5"
                    >
                      {/* Google Sign In */}
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
                          {isArabic ? 'المتابعة مع Google' : 'Continue with Google'}
                        </span>
                      </motion.button>

                      {/* Divider */}
                      <div className="relative flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium uppercase">
                          {isArabic ? 'أو' : 'OR'}
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      {/* Email Field */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                              {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                            </label>
                            <FormControl>
                              <div className="relative group">
                                <Mail className={cn(
                                  "absolute top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                                  isArabic ? "right-4" : "left-4",
                                  focusedField === 'email' ? 'text-orange-500' : 'text-gray-400'
                                )} />
                                <input
                                  {...field}
                                  type="email"
                                  disabled={isPending}
                                  placeholder={isArabic ? 'your@email.com' : 'your@email.com'}
                                  onFocus={() => setFocusedField('email')}
                                  onBlur={() => setFocusedField(null)}
                                  className={cn(
                                    "w-full h-14 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400",
                                    "transition-all duration-300 outline-none",
                                    "focus:border-orange-500 focus:bg-white focus:shadow-lg focus:shadow-orange-500/10",
                                    isArabic ? "pr-12 pl-4" : "pl-12 pr-4"
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
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {isArabic ? 'كلمة المرور' : 'Password'}
                              </label>
                              <Link
                                href="/auth/reset"
                                className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
                              >
                                {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot?'}
                              </Link>
                            </div>
                            <FormControl>
                              <div className="relative group">
                                <Lock className={cn(
                                  "absolute top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                                  isArabic ? "right-4" : "left-4",
                                  focusedField === 'password' ? 'text-orange-500' : 'text-gray-400'
                                )} />
                                <input
                                  {...field}
                                  type={showPassword ? 'text' : 'password'}
                                  disabled={isPending}
                                  placeholder={isArabic ? '••••••••' : '••••••••'}
                                  onFocus={() => setFocusedField('password')}
                                  onBlur={() => setFocusedField(null)}
                                  className={cn(
                                    "w-full h-14 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400",
                                    "transition-all duration-300 outline-none",
                                    "focus:border-orange-500 focus:bg-white focus:shadow-lg focus:shadow-orange-500/10",
                                    isArabic ? "pr-12 pl-12" : "pl-12 pr-12"
                                  )}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className={cn(
                                    "absolute top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 transition-colors",
                                    isArabic ? "left-3" : "right-3"
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
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                              {isArabic ? 'رمز التحقق' : 'Verification Code'}
                            </label>
                            <FormControl>
                              <div className="flex flex-col items-center gap-6 w-full">
                                <div className="relative">
                                  <input
                                    {...field}
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
                                    ? `${isArabic ? 'إعادة الإرسال بعد' : 'Resend in'} ${resendCooldown}s`
                                    : (isArabic ? 'إعادة إرسال الرمز' : 'Resend code')}
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
                        {isArabic ? 'جاري المعالجة...' : 'Processing...'}
                      </>
                    ) : showTwoFactor ? (
                      <>
                        {isArabic ? 'تحقق وتسجيل الدخول' : 'Verify & Sign In'}
                        <CheckCircle2 className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                        {isArabic ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
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
                      onClick={() => setShowTwoFactor(false)}
                      className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
                    >
                      {isArabic ? 'العودة إلى تسجيل الدخول' : 'Back to login'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </Form>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400">
              {isArabic
                ? 'بتسجيل الدخول، أنت توافق على شروط الاستخدام وسياسة الخصوصية'
                : 'By signing in, you agree to our Terms of Use and Privacy Policy'
              }
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}