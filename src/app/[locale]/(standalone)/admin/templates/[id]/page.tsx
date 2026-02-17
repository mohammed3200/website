'use client';

import React from 'react';
import { useTemplateId } from '@/features/admin/hooks/templates/use-template-id';
import { useGetTemplate } from '@/features/admin/api/templates/use-get-template';
import { TemplateEditor } from '@/features/admin/components/templates/template-editor';
import { TemplateSkeleton } from '@/features/admin/components/templates/template-skeleton';
import { PageHeader } from '@/features/admin/components/page-header';

export default function EditTemplatePage() {
  const id = useTemplateId();

  const { data, isLoading, error } = useGetTemplate(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Template" backLink="/admin/templates" />
        <TemplateSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return <div>Error loading template</div>;
  }

  const template = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Template: ${template.slug}`}
        description="Update message content and configuration."
        backLink="/admin/templates"
      />
      <TemplateEditor initialData={template} isEditing={true} />
    </div>
  );
}
