export const config = {
    isProduction: process.env.NODE_ENV === 'production',
    thresholds: {
        innovators: Number(process.env.NEXT_PUBLIC_INNOVATORS_THRESHOLD) || 3,
        collaborators: Number(process.env.NEXT_PUBLIC_COLLABORATORS_THRESHOLD) || 3,
        faq: Number(process.env.NEXT_PUBLIC_FAQ_THRESHOLD) || 1,
    },
} as const;
