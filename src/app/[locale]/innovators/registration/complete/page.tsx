
'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useInnovatorFormStore } from '@/features/innovators/store';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

export default function InnovatorRegistrationCompletePage() {
    const t = useTranslations('Innovators.success'); // Assuming similar structure
    const { width, height } = useWindowSize();
    const reset = useInnovatorFormStore((state) => state.reset);

    useEffect(() => {
        reset();
    }, [reset]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center max-w-2xl mx-auto space-y-8">
            <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={500}
                gravity={0.15}
                colors={['#f59e0b', '#d97706', '#fbbf24', '#fff']} // Orange theme
            />

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
                    <Lightbulb className="w-12 h-12 text-orange-600" />
                </div>
            </motion.div>

            <div className="space-y-4">
                <motion.h1
                    className="text-4xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {t('title')}
                </motion.h1>

                <motion.p
                    className="text-xl text-muted-foreground"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {t('message')}
                </motion.p>
            </div>

            <motion.div
                className="flex flex-wrap gap-4 justify-center pt-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <Button asChild size="lg" variant="default" className="bg-orange-600 hover:bg-orange-700">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        {t('returnHome')}
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/dashboard">
                        {t('goToDashboard')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </motion.div>
        </div>
    );
}
