import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function AdminPage() {
  const session = await auth();
  
  // If user is not authenticated, redirect to login
  if (!session?.user) {
    redirect('/auth/login');
  }
  
  // If user is authenticated, redirect to dashboard
  redirect('/admin/dashboard');
}
