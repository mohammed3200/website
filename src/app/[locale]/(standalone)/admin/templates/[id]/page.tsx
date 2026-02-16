'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { TemplateEditor } from '@/features/admin/components/templates/template-editor';
import { PageHeader } from '@/features/admin/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditTemplatePage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-template', id],
    queryFn: async () => {
      const res = await client.api.admin.templates[':id'].$get({
        param: { id },
      });
      if (!res.ok) throw new Error('Failed to fetch template');
      return await res.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Template" backLink="/admin/templates" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (error || !data?.template) {
    return <div>Error loading template</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Template: ${data.template.slug}`}
        description="Update message content and configuration."
        backLink="/admin/templates"
      />
      <TemplateEditor initialData={data.template} isEditing={true} />
    </div>
  );
}
