'use client';

import { useRouter } from 'next/navigation';
import useLanguage from '@/hooks/use-language';

export const useSubmissionsLogic = () => {
  const { lang, isArabic } = useLanguage();
  const router = useRouter();

  const handleView = (type: 'innovators' | 'collaborators', id: string) => {
    router.push(`/${lang}/admin/submissions/${type}/${id}`);
  };

  const handleApprove = (type: 'innovators' | 'collaborators', id: string) => {
    // TODO: Implement approval logic when API is ready
    console.log(`Approving ${type} with id: ${id}`);
  };

  const handleReject = (type: 'innovators' | 'collaborators', id: string) => {
    // TODO: Implement rejection logic when API is ready
    console.log(`Rejecting ${type} with id: ${id}`);
  };

  return {
    handleView,
    handleApprove,
    handleReject,
    isArabic,
    lang,
  };
};
