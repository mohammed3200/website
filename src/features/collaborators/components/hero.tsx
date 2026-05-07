'use client';

import React from 'react';
import { Introduction } from './introduction';
import { AnimatedList, SeparatorGradients, CardCompanies } from '@/components';
import type { PublicCollaborator } from '@/features/collaborators/types/types';
import { useGetCollaborators } from '@/features/collaborators/api/use-get-public-collaborators';

export const Hero = () => {
  const { data: collaborators, isLoading } = useGetCollaborators();

  if (isLoading) return null;
  if (!collaborators || collaborators.length === 0) return null;

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
            items={collaborators}
            renderItem={(item: PublicCollaborator) => (
              <PublicCardCompanies collaborator={item} />
            )}
          />
        </div>
      </div>
    </section>
  );
};

import { Building2, MapPin, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import useLanguage from '@/hooks/use-language';

interface PublicCardCompaniesProps {
  collaborator: PublicCollaborator;
}

const PublicCardCompanies: React.FC<PublicCardCompaniesProps> = ({
  collaborator,
}) => {
  const { isArabic, lang } = useLanguage();
  const [imageError, setImageError] = React.useState(false);

  const imageUrl = collaborator.image?.url;
  const displayUrl = collaborator.site?.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const sectorColors: Record<string, { bg: string; text: string; border: string }> = {
    default: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
    Technology: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    Manufacturing: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  };

  const sectorStyle = sectorColors[collaborator.industrialSector] || sectorColors.default;

  return (
    <div
      className="md:w-[600px] md:h-[320px] bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col md:flex-row relative cursor-pointer rtl:flex-row-reverse"
    >
      <div className="w-full md:w-[240px] shrink-0 bg-white flex flex-col items-center justify-center p-6 border-b md:border-b-0 border-gray-100 relative z-10 transition-colors group-hover:bg-gray-50/30">
        <div
          className={cn(
            'w-[160px] h-[160px] rounded-full border-2 flex items-center justify-center mb-4 p-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden',
            sectorStyle.border,
            sectorStyle.bg,
          )}
        >
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={`${collaborator.companyName} logo`}
              className="w-full h-full object-contain p-4"
              onError={() => setImageError(true)}
            />
          ) : (
            <Building2 className={cn('w-16 h-16', sectorStyle.text)} />
          )}
        </div>
        <div className={cn('w-12 h-1 rounded-full mb-4', sectorStyle.bg)} />
        <h3 className="text-lg md:text-xl font-din-bold font-bold text-center text-gray-900 leading-tight px-2 w-full break-words">
          {collaborator.companyName}
        </h3>
      </div>

      <div className="hidden md:block w-px bg-gray-100 self-stretch my-8 relative z-10" />

      <div className="flex-1 min-w-0 p-8 flex flex-col relative z-10">
        <div className="mb-4">
          <span
            className={cn(
              'inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-din-bold tracking-widest uppercase shadow-sm border',
              sectorStyle.bg,
              sectorStyle.text,
              sectorStyle.border,
            )}
          >
            {collaborator.industrialSector || 'General'}
          </span>
        </div>

        <p className="text-gray-600 font-din-medium italic text-base leading-relaxed line-clamp-4 ps-4 border-l-2 rtl:border-l-0 rtl:border-r-2 rtl:ps-0 rtl:pe-4 border-gray-200">
          {collaborator.specialization || ''}
        </p>

        <div className="mt-auto space-y-3 pt-6 border-t border-gray-50">
          {collaborator.location && (
            <div className="flex items-center gap-3 text-sm text-gray-500 font-din-regular">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{collaborator.location}</span>
            </div>
          )}
          {collaborator.site && (
            <div className="flex items-center gap-3 text-sm text-gray-500 font-din-regular truncate">
              <Globe className="w-4 h-4" />
              <span className="truncate text-primary">{displayUrl}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};