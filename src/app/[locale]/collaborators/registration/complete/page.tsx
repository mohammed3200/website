
'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollaboratorFormStore } from '@/features/collaborators/store';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

export default function RegistrationCompletePage() {
    const t = useTranslations('Collaborators.form.success');
    const { width, height } = useWindowSize();
    const reset = useCollaboratorFormStore((state) => state.reset);

    useEffect(() => {
        // Clear the form store on mount of success page
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
            />

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
            </motion.div>

            <div className="space-y-4">
                <motion.h1
                    className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
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

                <motion.div
                    className="p-4 bg-muted/50 rounded-lg text-sm text-left space-y-2 border border-border/50"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="font-semibold">{t('whatNext')}</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>{t('step1')}</li>
                        <li>{t('step2')}</li>
                        <li>{t('step3')}</li>
                    </ul>
                </motion.div>
            </div>

            <motion.div
                className="flex flex-wrap gap-4 justify-center pt-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <Button asChild size="lg" variant="default">
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
