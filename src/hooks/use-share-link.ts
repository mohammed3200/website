'use client';
import type { toast } from '@/hooks/use-toast';

export interface UseShareLinkOptions {
  title?: string;
  isArabic: boolean;
  toast: typeof toast;
}

function isAbortError(e: unknown): e is { name: string } {
  return typeof e === 'object' && e !== null && 'name' in e;
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
    } catch (err: unknown) {
      if (isAbortError(err) && err.name === 'AbortError') {
        return;
      }
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn('Error sharing:', errorMessage);
      
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
