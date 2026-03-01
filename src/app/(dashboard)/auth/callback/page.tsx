import { auth } from '@/auth';
import { redirect } from "next/navigation";


export default async function CallbackPage() {
  const session = await auth();

  if (session) {
    return redirect("/");
  }

  return redirect("/auth/login");
}