'use client';

import { useParams } from 'next/navigation';

export const useTemplateId = () => {
  const params = useParams();
  return params.id as string;
};
