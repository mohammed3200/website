import React from 'react';
import { TemplateEditor } from '@/features/admin/components/templates/template-editor';
import { PageHeader } from '@/features/admin/components/page-header';

export const metadata = {
  title: 'New Template',
};

export default function NewTemplatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Template"
        description="Define a new message template for Email or WhatsApp."
        backLink="/admin/templates"
      />
      <TemplateEditor />
    </div>
  );
}
