import { auth } from '@/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import SubmissionsContent from './components/submissions-content';

export default async function SubmissionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  // Fetch submissions
  const [innovators, collaborators] = await Promise.all([
    db.innovator.findMany({
      where: { status: 'PENDING' },
      include: {
        image: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    db.collaborator.findMany({
      where: { status: 'PENDING' },
      include: {
        image: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  // Map to serializable shapes
  const safeInnovators = innovators.map((i) => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));

  const safeCollaborators = collaborators.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <SubmissionsContent
      innovators={safeInnovators as any}
      collaborators={safeCollaborators as any}
    />
  );
}
