import { Metadata } from 'next';
import { AdminExpertList } from '@/features/academic-experts';

export const metadata: Metadata = {
  title: 'Academic Experts | Admin Dashboard',
  description: 'Manage the academic experts showcased on the platform.',
};

export default function AcademicExpertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Experts</h1>
        <p className="text-muted-foreground mt-2">
          Manage the academic experts showcased on the platform.
        </p>
      </div>
      
      <AdminExpertList />
    </div>
  );
}
