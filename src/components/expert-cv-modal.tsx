'use client';

import { useTranslations, useLocale } from 'next-intl';
import sanitizeHtml from 'sanitize-html';
import { AcademicExpert } from '@/features/academic-experts/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ExpertCvModalProps {
  expert: AcademicExpert | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExpertCvModal = ({ expert, isOpen, onClose }: ExpertCvModalProps) => {
  const t = useTranslations('AcademicExperts');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  if (!expert) return null;

  const fullName = isRtl ? expert.fullName : expert.fullNameEn || expert.fullName;
  const title = isRtl ? expert.title : expert.titleEn || expert.title;
  const specialization = isRtl ? expert.specialization : expert.specializationEn || expert.specialization;
  const university = isRtl ? expert.university : expert.universityEn || expert.university;
  const bio = isRtl ? expert.bio : expert.bioEn || expert.bio;
  const cvContent = isRtl ? expert.cv : expert.cvEn || expert.cv;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {expert.profileImage && (
              <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 border-4 border-primary/10">
                <img
                  src={expert.profileImage}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm">
                  {university}
                </Badge>
                <Badge variant="outline" className="text-sm border-primary/20 text-primary">
                  {specialization}
                </Badge>
              </div>
              <p className="text-gray-600 leading-relaxed mt-2 text-justify">
                {bio}
              </p>
            </div>
          </div>

          {(expert.email || expert.linkedin) && (
            <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
              {expert.email && (
                <a href={`mailto:${expert.email}`} className="text-sm text-blue-600 hover:underline">
                  {expert.email}
                </a>
              )}
              {expert.email && expert.linkedin && <Separator orientation="vertical" className="h-4" />}
              {expert.linkedin && (
                <a href={expert.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  LinkedIn Profile
                </a>
              )}
            </div>
          )}

          {cvContent && (
            <>
              <Separator />
              <div>
                <h4 className="text-lg font-bold mb-4">{t('cvTitle')}</h4>
                <div 
                  className="prose max-w-none prose-sm sm:prose-base prose-blue"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(cvContent, {
                      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                        'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                        'table', 'thead', 'tbody', 'tr', 'th', 'td',
                        'span', 'div', 'section', 'article', 'hr', 'br',
                      ]),
                      allowedAttributes: {
                        ...sanitizeHtml.defaults.allowedAttributes,
                        img: ['src', 'alt', 'width', 'height', 'class'],
                        '*': ['class', 'style', 'dir'],
                      },
                    }),
                  }}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
