'use client';

export interface UseShareLinkOptions {
  title?: string;
  isArabic: boolean;
  toast: any; // Using any or specific toast type if imported
}

export function useShareLink({ title, isArabic, toast }: UseShareLinkOptions) {
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title || 'Shared Link',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: isArabic ? 'تم نسخ الرابط' : 'Link copied',
          description: isArabic
            ? 'تم نسخ الرابط إلى الحافظة'
            : 'Link copied to clipboard',
        });
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      console.warn('Error sharing', err);
      toast({
        title: isArabic ? 'خطأ في المشاركة' : 'Error sharing',
        description: isArabic
          ? 'حدث خطأ أثناء محاولة مشاركة الرابط'
          : 'An error occurred while trying to share the link',
        variant: 'destructive',
      });
    }
  };

  return { share };
}
