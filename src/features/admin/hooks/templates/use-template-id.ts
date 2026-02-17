'use client';

import { useParams } from 'next/navigation';

export const useTemplateId = () => {
  const params = useParams();
  const id = params?.id;

  if (Array.isArray(id)) {
    return id[0];
  }

  return id as string;
};
