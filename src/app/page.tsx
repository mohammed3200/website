import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

// This is the root page that redirects to the appropriate locale
export default async function RootPage() {
  // Get the preferred locale from headers or default to 'ar'
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Simple language detection
  let locale = 'ar'; // Default to Arabic
  
  if (acceptLanguage.includes('en')) {
    locale = 'en';
  }
  
  // Redirect to the localized home page
  redirect(`/${locale}`);
}
