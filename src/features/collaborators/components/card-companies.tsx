'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  Quote,
  X,
  Cog,
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useLanguage from '@/hooks/use-language';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { statusConfig, sectorColors } from '@/features/collaborators/constants';
import { Prisma } from '@prisma/client';

// 🧱 Strict Database Schema Interface
export type Collaborator = Prisma.CollaboratorGetPayload<{
  include: {
    image: true;
    experienceProvidedMedia: true;
    machineryAndEquipmentMedia: true;
  };
}>;

export interface CardCompaniesProps {
  collaborator: Collaborator;
  className?: string;
  onClick?: () => void;
  showStatus?: boolean; // For admin views
  compact?: boolean; // Compact mode for grids
}

export const CardCompanies: React.FC<CardCompaniesProps> = ({
  collaborator,
  className,
  onClick,
  showStatus = false,
  compact = false,
}) => {
  const { isArabic, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTabKey);
    document.body.style.overflow = 'hidden';

    // Focus first element
    setTimeout(() => {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusableElements?.length) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Get sector styling
  const sectorStyle =
    sectorColors[collaborator.industrialSector || ''] || sectorColors.default;

  // Status config
  const status = statusConfig[collaborator.status];
  const StatusIcon = status.icon;

  // Format dates
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'MMM yyyy', { locale: isArabic ? ar : enUS });
  };

  // Get image URL with fallback
  const imageUrl = collaborator.image?.url || collaborator.imageId;
  const displayUrl = collaborator.site
    ?.replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  // Compact Card View
  if (compact) {
    return (
      <>
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer',
            className,
          )}
          onClick={() => {
            setIsOpen(true);
            onClick?.();
          }}
        >
          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div
                className={cn(
                  'w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden',
                  sectorStyle.bg,
                )}
              >
                {imageUrl && !imageError ? (
                  <img
                    src={imageUrl}
                    alt={collaborator.companyName}
                    className="w-full h-full object-contain p-2"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <Building2 className={cn('w-8 h-8', sectorStyle.text)} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-900 leading-tight line-clamp-1">
                    {collaborator.companyName}
                  </h3>
                  {showStatus && (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                        status.bg,
                        status.color,
                        status.border,
                        'border',
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <span
                  className={cn(
                    'inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider',
                    sectorStyle.bg,
                    sectorStyle.text,
                  )}
                >
                  {collaborator.industrialSector || 'General'}
                </span>

                <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                  {collaborator.specialization || ''}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[100px]">
                  {collaborator.location ||
                    (isArabic ? 'موقع غير محدد' : 'Location N/A')}
                </span>
              </div>
              {collaborator.site && (
                <div className="flex items-center gap-1 text-primary">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[80px]">{displayUrl}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Modal Portal */}
        {isMounted &&
          createPortal(
            <DetailModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              collaborator={collaborator}
              isArabic={isArabic}
              status={status}
              StatusIcon={StatusIcon}
              sectorStyle={sectorStyle}
              imageUrl={imageUrl}
              imageError={imageError}
              setImageError={setImageError}
              displayUrl={displayUrl}
              formatDate={formatDate}
            />,
            document.body,
          )}
      </>
    );
  }

  // Standard Card View (Original Design Enhanced)
  return (
    <>
      <div
        className={cn(
          'group md:w-[600px] md:h-[320px] bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col md:flex-row relative cursor-pointer rtl:flex-row-reverse',
          className,
        )}
        onClick={() => {
          setIsOpen(true);
          onClick?.();
        }}
      >
        {/* Status Badge (if showStatus enabled) */}
        {showStatus && (
          <div
            className={cn(
              'absolute top-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm',
              status.bg,
              status.border,
              isArabic ? 'left-4' : 'right-4',
            )}
          >
            <span className={cn('relative flex h-2 w-2', status.color)}>
              <span
                className={cn(
                  'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                  status.pulse,
                )}
              ></span>
              <span
                className={cn(
                  'relative inline-flex rounded-full h-2 w-2',
                  status.pulse,
                )}
              ></span>
            </span>
            <StatusIcon className={cn('w-3.5 h-3.5', status.color)} />
            <span
              className={cn(
                'text-xs font-bold uppercase tracking-wider',
                status.color,
              )}
            >
              {status.label[isArabic ? 'ar' : 'en']}
            </span>
          </div>
        )}

        {/* 1️⃣ LEFT SECTION: Identity */}
        <div className="w-full md:w-[240px] shrink-0 bg-white flex flex-col items-center justify-center p-6 border-b md:border-b-0 border-gray-100 relative z-10 transition-colors group-hover:bg-gray-50/30">
          <div
            className={cn(
              'w-[160px] h-[160px] rounded-full border-2 flex items-center justify-center mb-4 p-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden transform group-hover:scale-105 transition-transform duration-500',
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
          <h3 className="text-lg md:text-xl font-bold font-din-bold text-center text-gray-900 leading-tight px-2 w-full break-words">
            {collaborator.companyName}
          </h3>
          <p className="mt-2 text-xs text-gray-400 font-din-regular">
            {isArabic ? 'عضو منذ' : 'Member since'}{' '}
            {formatDate(collaborator.createdAt)}
          </p>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-gray-100 self-stretch my-8 relative z-10" />

        {/* 2️⃣ RIGHT SECTION: Information */}
        <div className="flex-1 min-w-0 p-8 flex flex-col relative z-10">
          {/* Sector Badge */}
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

          {/* Specialization Quote */}
          <div className="relative mb-6">
            <Quote
              className={cn(
                'absolute -top-2 w-6 h-6 opacity-20',
                isArabic ? '-right-2' : '-left-2',
                sectorStyle.text,
              )}
            />
            <p className="text-gray-600 font-din-medium italic text-base leading-relaxed line-clamp-4 ps-4 border-l-2 rtl:border-l-0 rtl:border-r-2 rtl:ps-0 rtl:pe-4 border-gray-200">
              {collaborator.specialization || ''}
            </p>
          </div>

          {/* Contact Info */}
          <div className="mt-auto space-y-3 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-3 text-sm text-gray-500 font-din-regular">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  sectorStyle.bg,
                )}
              >
                <Phone className={cn('w-4 h-4', sectorStyle.text)} />
              </div>
              <span className="truncate">
                {collaborator.primaryPhoneNumber}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 font-din-regular truncate">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  sectorStyle.bg,
                )}
              >
                <Mail className={cn('w-4 h-4', sectorStyle.text)} />
              </div>
              <span className="truncate">{collaborator.email}</span>
            </div>
            {collaborator.site && (
              <div className="flex items-center gap-3 text-sm text-gray-500 font-din-regular truncate">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    sectorStyle.bg,
                  )}
                >
                  <Globe className={cn('w-4 h-4', sectorStyle.text)} />
                </div>
                <span className="truncate text-primary">{displayUrl}</span>
              </div>
            )}
          </div>

          {/* View Profile Indicator */}
          <div className="absolute bottom-4 end-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2">
            <span className="text-[10px] font-din-bold text-primary uppercase tracking-widest">
              {isArabic ? 'عرض الملف' : 'View Profile'}
            </span>
            <ArrowRight
              className={cn('w-3 h-3 text-primary', isArabic && 'rotate-180')}
            />
          </div>
        </div>
      </div>

      {/* Modal Portal */}
      {isMounted &&
        createPortal(
          <DetailModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            collaborator={collaborator}
            isArabic={isArabic}
            status={status}
            StatusIcon={StatusIcon}
            sectorStyle={sectorStyle}
            imageUrl={imageUrl}
            imageError={imageError}
            setImageError={setImageError}
            displayUrl={displayUrl}
            formatDate={formatDate}
          />,
          document.body,
        )}
    </>
  );
};

// Separate Modal Component for cleaner code
interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborator: Collaborator;
  isArabic: boolean;
  status: (typeof statusConfig)['PENDING'];
  StatusIcon: React.ElementType;
  sectorStyle: { bg: string; text: string; border: string };
  imageUrl?: string | null;
  imageError: boolean;
  setImageError: (v: boolean) => void;
  displayUrl?: string;
  formatDate: (date: Date | string) => string;
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  collaborator,
  isArabic,
  status,
  StatusIcon,
  sectorStyle,
  imageUrl,
  imageError,
  setImageError,
  displayUrl,
  formatDate,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-100">
              <div
                className={cn('absolute inset-0 opacity-10', sectorStyle.bg)}
              />
              <button
                onClick={onClose}
                className={cn(
                  'absolute top-4 p-2 bg-white/80 hover:bg-white rounded-full transition-all shadow-sm z-20',
                  isArabic ? 'left-4' : 'right-4',
                )}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              {/* Profile Header */}
              <div className="px-8 pb-8 -mt-12 relative">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Logo */}
                  <div
                    className={cn(
                      'w-24 h-24 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center overflow-hidden bg-white',
                      sectorStyle.bg,
                    )}
                  >
                    {imageUrl && !imageError ? (
                      <img
                        src={imageUrl}
                        alt={collaborator.companyName}
                        className="w-full h-full object-contain p-4"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <Building2
                        className={cn('w-10 h-10', sectorStyle.text)}
                      />
                    )}
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-2xl md:text-3xl font-din-bold text-gray-900">
                        {collaborator.companyName}
                      </h2>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border',
                          status.bg,
                          status.color,
                          status.border,
                        )}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label[isArabic ? 'ar' : 'en']}
                      </span>
                    </div>

                    <span
                      className={cn(
                        'inline-block px-3 py-1 rounded-lg text-sm font-din-bold border',
                        sectorStyle.bg,
                        sectorStyle.text,
                        sectorStyle.border,
                      )}
                    >
                      {collaborator.industrialSector || 'General'}
                    </span>

                    {collaborator.location && (
                      <div className="flex items-center gap-2 text-gray-500 mt-3 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{collaborator.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="px-8 pb-8 space-y-8">
                {/* Specialization */}
                <section className="space-y-3">
                  <h3 className="text-sm font-din-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Quote className="w-4 h-4" />
                    {isArabic ? 'التخصص' : 'Specialization'}
                  </h3>
                  <div
                    className={cn(
                      'p-6 rounded-2xl border',
                      sectorStyle.bg,
                      sectorStyle.border,
                    )}
                  >
                    <p className="text-gray-700 font-din-medium text-lg leading-relaxed">
                      {collaborator.specialization || ''}
                    </p>
                  </div>
                </section>

                {/* Experience */}
                {collaborator.experienceProvided && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-din-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {isArabic ? 'الخبرة المقدمة' : 'Experience Provided'}
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {collaborator.experienceProvided}
                      </p>
                    </div>
                  </section>
                )}

                {/* Machinery */}
                {collaborator.machineryAndEquipment && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-din-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Cog className="w-4 h-4" />
                      {isArabic ? 'المعدات والآلات' : 'Machinery & Equipment'}
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {collaborator.machineryAndEquipment}
                      </p>
                    </div>
                  </section>
                )}

                {/* Contact Grid */}
                <section className="space-y-3">
                  <h3 className="text-sm font-din-bold text-gray-400 uppercase tracking-wider">
                    {isArabic ? 'معلومات التواصل' : 'Contact Information'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ContactItem
                      icon={Phone}
                      label={isArabic ? 'الهاتف الرئيسي' : 'Primary Phone'}
                      value={collaborator.primaryPhoneNumber}
                      href={`tel:${collaborator.primaryPhoneNumber}`}
                    />
                    {collaborator.optionalPhoneNumber && (
                      <ContactItem
                        icon={Phone}
                        label={isArabic ? 'الهاتف البديل' : 'Alternative Phone'}
                        value={collaborator.optionalPhoneNumber}
                        href={`tel:${collaborator.optionalPhoneNumber}`}
                      />
                    )}
                    <ContactItem
                      icon={Mail}
                      label={isArabic ? 'البريد الإلكتروني' : 'Email'}
                      value={collaborator.email}
                      href={`mailto:${collaborator.email}`}
                    />
                    {collaborator.site && (
                      <ContactItem
                        icon={Globe}
                        label={isArabic ? 'الموقع الإلكتروني' : 'Website'}
                        value={displayUrl}
                        href={collaborator.site}
                        external
                      />
                    )}
                  </div>
                </section>

                {/* Metadata */}
                <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {isArabic ? 'تم الإنشاء:' : 'Created:'}{' '}
                    {formatDate(collaborator.createdAt)}
                  </span>
                  {collaborator.reviewedAt && (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isArabic ? 'تمت المراجعة:' : 'Reviewed:'}{' '}
                      {formatDate(collaborator.reviewedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Contact Item Component
const ContactItem: React.FC<{
  icon: React.ElementType;
  label: string;
  value?: string;
  href?: string;
  external?: boolean;
}> = ({ icon: Icon, label, value, href, external }) => {
  const content = (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm group-hover:shadow-md transition-shadow">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-gray-400 font-din-bold uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-din-medium text-gray-900 truncate">
          {value}
        </p>
      </div>
      {external && (
        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
};

export default CardCompanies;
