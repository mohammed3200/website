import { redirect } from "next/navigation";


export default async function CallbackPage() {
  const session = true;
  
  if (session) {
    return redirect("/");
  }

  return (
    <div className="flex justify-center items-center h-screen bg-dark-100">
      <div className="font-mono text-sm animate-pulse">
        Processing authentication...
      </div>
    </div>
  );
}