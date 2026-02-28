import React from 'react';
import { TemplateList } from '@/features/admin/components/templates/template-list';
import { PageHeader } from '@/features/admin/components/page-header';

export const metadata = {
  title: 'Templates Management',
};

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates Management"
        description="Manage email and WhatsApp message templates."
      />
      <TemplateList />
    </div>
  );
}
