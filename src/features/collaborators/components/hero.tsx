'use client';

import React from 'react';
import { Introduction } from './introduction';
import { AnimatedList, SeparatorGradients } from '@/components';
import { CardCompanies } from './card-companies';
import type { Collaborator } from './card-companies';
import { useGetCollaborators } from '@/features/collaborators/api/use-get-public-collaborators';

export const Hero = () => {
  const { data: realCollaborators, isLoading } = useGetCollaborators();

  // Map public API response to full Collaborator objects with sensible defaults
  const displayItems = React.useMemo((): Collaborator[] => {
    const realData = realCollaborators || [];
    return realData.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      primaryPhoneNumber: '',
      email: '',
      industrialSector: item.industrialSector || '',
      specialization: item.specialization || '',
      location: item.location || null,
      site: item.site || null,
      status: 'APPROVED' as const,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      image: item.image
        ? {
            id: item.id,
            url: item.image.data || '',
          }
        : null,
    }));
  }, [realCollaborators]);

  if (isLoading) return null;
  if (displayItems.length === 0) return null;

  return (
    <section className="py-0">
      <div className="container mx-auto space-y-5 sm:space-y-10">
        <Introduction />
        <SeparatorGradients className="-translate-y-2 md:-translate-y-6 lg:-translate-y-12" />
        <div
          dir="ltr"
          className="-translate-y-2 md:-translate-y-6 lg:-translate-y-12"
        >
          <AnimatedList
            direction="left"
            speed="slow"
            pauseOnHover={true}
            layout="horizontal"
            items={displayItems}
            renderItem={(item) => <CardCompanies collaborator={item} />}
          />
        </div>
      </div>
    </section>
  );
};
