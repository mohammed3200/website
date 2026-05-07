'use client';

import { motion } from 'framer-motion';
import useLanguage from '@/hooks/use-language';
import Image from 'next/image';

interface AboutHeroProps {
  title: string;
  content: string;
}

export function AboutHero({ title, content }: AboutHeroProps) {
  const { isArabic } = useLanguage();

  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-16 md:py-24"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-6 text-center md:text-start"
          >
            <h1 className="text-3xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl drop-shadow-sm">
              {title}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              {content}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-white p-8 shadow-xl md:h-96 md:w-96">
              <Image
                src="/images/logo.png"
                alt="EBIC Logo"
                fill
                className="object-contain p-8 drop-shadow-md"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -z-10 h-full w-full opacity-30">
        <div className="absolute -right-[5%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-[10%] -left-[5%] h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
      </div>
    </section>
  );
}
