"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import useLanguage from "@/hooks/use-language";
import Link from "next/link";
import { useTranslations } from "next-intl";

// Ensure Neat is only loaded on the client side
// We can't use next/dynamic for the Neat render function directly usually, 
// so we might need to strictly import it inside a useEffect or dynamic import the whole component if needed.
// However, the user provided code snippet suggests direct usage. 
// Let's use a dynamic import for the library to be safe.

const neatConfig = {
    colors: [
        {
            color: '#FF5373',
            enabled: true,
        },
        {
            color: '#17E7FF',
            enabled: true,
        },
        {
            color: '#FFC858',
            enabled: true,
        },
        {
            color: '#6D3BFF',
            enabled: true,
        },
        {
            color: '#f5e1e5',
            enabled: false,
        },
    ],
    speed: 6,
    horizontalPressure: 7,
    verticalPressure: 8,
    waveFrequencyX: 1,
    waveFrequencyY: 2,
    waveAmplitude: 8,
    shadows: 4,
    highlights: 6,
    colorBrightness: 0.95,
    colorSaturation: -8,
    wireframe: false,
    colorBlending: 10,
    backgroundColor: '#003FFF',
    backgroundAlpha: 1,
    grainScale: 4,
    grainSparsity: 0,
    grainIntensity: 0.25,
    grainSpeed: 1,
    resolution: 1,
    yOffset: 756,
    yOffsetWaveMultiplier: 6.2,
    yOffsetColorMultiplier: 5.8,
    yOffsetFlowMultiplier: 6.5,
    flowDistortionA: 1.1,
    flowDistortionB: 0.8,
    flowScale: 1.6,
    flowEase: 0.32,
    flowEnabled: true,
    mouseDistortionStrength: 0.1,
    mouseDistortionRadius: 0.25,
    mouseDecayRate: 0.96,
    mouseDarken: 0.24,
    enableProceduralTexture: false,
    textureVoidLikelihood: 0.27,
    textureVoidWidthMin: 60,
    textureVoidWidthMax: 420,
    textureBandDensity: 1.2,
    textureColorBlending: 0.06,
    textureSeed: 333,
    textureEase: 0.22,
    proceduralBackgroundColor: '#0E0707',
    textureShapeTriangles: 20,
    textureShapeCircles: 15,
    textureShapeBars: 15,
    textureShapeSquiggles: 10,
};

export const HomeHero = () => {
    const { isArabic } = useLanguage();
    const t = useTranslations("Home");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let neatInstance: any = null;

        const initNeat = async () => {
            if (!canvasRef.current) return;

            try {
                // Dynamic import to avoid SSR issues
                const { NeatGradient } = await import("@firecms/neat");

                neatInstance = new NeatGradient({
                    ref: canvasRef.current,
                    ...neatConfig
                });
            } catch (error) {
                console.error("Failed to load Neat background:", error);
            }
        };

        initNeat();

        return () => {
            // Cleanup if neat has a destroy method, though the library docs might not specify one explicitly.
            // Often these libraries just attach to the canvas.
            if (neatInstance && typeof neatInstance.destroy === 'function') {
                neatInstance.destroy();
            }
        };
    }, []);

    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            dir={isArabic ? "rtl" : "ltr"}
        >
            {/* Neat Dynamic Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 w-full h-full"
            />

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-stone-900/10 z-10" />

            {/* Content */}
            <div className="container mx-auto px-4 relative z-20">
                <div className="max-w-6xl mx-auto text-center space-y-12">
                    {/* Main Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <h1 className="font-din-bold text-5xl md:text-7xl lg:text-8xl text-white leading-tight tracking-tight drop-shadow-lg">
                            {t("title")}
                        </h1>

                        <p className="font-din-regular text-xl md:text-3xl text-stone-50/90 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                            {t("subtitle")}
                        </p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link
                            href={`/${isArabic ? "ar" : "en"}/innovators/registration`}
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-stone-50 hover:bg-white text-stone-900 font-din-bold text-xl rounded-full transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
                        >
                            <span>{t("startJourney")}</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href={`/${isArabic ? "ar" : "en"}/entrepreneurship`}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-din-bold text-xl rounded-full border-2 border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                        >
                            <span>{t("learnMore")}</span>
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto pt-16"
                    >
                        {[
                            { valueKey: "excellenceValue", labelKey: "excellence" },
                            { valueKey: "communityValue", labelKey: "community" },
                            { valueKey: "growthValue", labelKey: "growth" },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.labelKey}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.7 + index * 0.15, ease: "easeOut" }}
                                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
                            >
                                <div className="font-din-bold text-5xl md:text-6xl text-white mb-2">
                                    {t(stat.valueKey)}
                                </div>
                                <div className="font-din-regular text-lg text-stone-100/80">
                                    {t(stat.labelKey)}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
