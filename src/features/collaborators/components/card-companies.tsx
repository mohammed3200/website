import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  Quote,
  X,
  Cog,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useLanguage from '@/hooks/use-language';

// 🧱 Data Contract (Prisma Schema Aligned)
export interface Collaborator {
  id?: string;
  companyName: string;
  primaryPhoneNumber: string;
  optionalPhoneNumber?: string | null;
  email: string;
  location?: string | null;
  site?: string | null;
  industrialSector: string;
  specialization: string;
  experienceProvided?: string | null;
  machineryAndEquipment?: string | null;
  imageId?: string | null;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVisible?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Legacy & Flexible Props Support
export interface CardCompaniesProps extends Partial<Collaborator> {
  className?: string;
  onClick?: () => void;

  // Legacy/Alternative Prop Names
  CompaniesName?: string;
  ExperienceProvided?: string;
  companyImage?: string;
  logoUrl?: string;

  // Support passing the full object directly
  collaborator?: Collaborator;
}

export const CardCompanies: React.FC<CardCompaniesProps> = (props) => {
  const { isArabic } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

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

    // Focus first focusable element when opened
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements?.length) {
      (focusableElements[0] as HTMLElement).focus();
    }

    // Disable body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const data = {
    companyName: props.companyName || props.collaborator?.companyName || props.CompaniesName || "Unknown Company",
    industrialSector: props.industrialSector || props.collaborator?.industrialSector || "General Sector",
    specialization: props.specialization || props.collaborator?.specialization || props.ExperienceProvided || "Specialization",
    location: props.location || props.collaborator?.location,
    email: props.email || props.collaborator?.email || "",
    primaryPhoneNumber: props.primaryPhoneNumber || props.collaborator?.primaryPhoneNumber || "",
    site: props.site || props.collaborator?.site,
    imageId: props.imageId || props.collaborator?.imageId || props.logoUrl || props.companyImage,
    experienceProvided: props.experienceProvided || props.collaborator?.experienceProvided,
    machineryAndEquipment: props.machineryAndEquipment || props.collaborator?.machineryAndEquipment,
  };

  const displayUrl = data.site?.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            dir={isArabic ? "rtl" : "ltr"}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-company-name"
          >
            {/* Close Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className={cn(
                "absolute top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20",
                isArabic ? "left-4" : "right-4"
              )}
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Modal Header */}
              <div className="bg-gray-50/50 p-8 flex items-center gap-6 border-b border-gray-100">
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-sm shrink-0 bg-white flex items-center justify-center overflow-hidden p-2">
                  {data.imageId ? (
                    <img
                      src={data.imageId}
                      alt={data.companyName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-gray-200" />
                  )}
                </div>
                <div>
                  <h2
                    id="modal-company-name"
                    className="text-2xl md:text-3xl font-din-bold text-gray-900 leading-tight"
                  >
                    {data.companyName}
                  </h2>
                  <div className="mt-2 text-primary font-din-medium">
                    {data.industrialSector}
                  </div>
                  {data.location && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-din-regular">{data.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-8">
                {/* Specialization */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-din-bold uppercase text-xs tracking-wider">
                    <Quote className="w-4 h-4" />
                    {isArabic ? "التخصص والخبرات" : "Specialization & Expertise"}
                  </div>
                  <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50">
                    <p className="text-gray-700 font-din-medium text-lg leading-relaxed italic">
                      {data.specialization}
                    </p>
                    {data.experienceProvided && (
                      <p className="mt-4 text-gray-600 font-din-regular leading-relaxed text-base pt-4 border-t border-blue-100/50">
                        {data.experienceProvided}
                      </p>
                    )}
                  </div>
                </div>

                {/* Machinery */}
                {data.machineryAndEquipment && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary font-din-bold uppercase text-xs tracking-wider">
                      <Cog className="w-4 h-4" />
                      {isArabic ? "المعدات والآلات" : "Machinery & Equipment"}
                    </div>
                    <p className="text-gray-600 leading-relaxed font-din-regular whitespace-pre-line bg-gray-50 p-6 rounded-2xl">
                      {data.machineryAndEquipment}
                    </p>
                  </div>
                )}

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-din-bold uppercase tracking-wider">
                        {isArabic ? "الهاتف" : "Phone"}
                      </p>
                      <p className="text-sm font-din-medium text-gray-900">{data.primaryPhoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-din-bold uppercase tracking-wider">
                        {isArabic ? "البريد الإلكتروني" : "Email"}
                      </p>
                      <p className="text-sm font-din-medium text-gray-900 truncate">{data.email}</p>
                    </div>
                  </div>

                  {data.site && (
                    <a
                      href={data.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors sm:col-span-2 group/link"
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm group-hover/link:bg-primary group-hover/link:text-white transition-colors">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-din-bold uppercase tracking-wider">
                          {isArabic ? "الموقع الإلكتروني" : "Website"}
                        </p>
                        <p className="text-sm font-din-medium text-gray-900 truncate">{displayUrl}</p>
                      </div>
                      <ArrowRight className={cn("ms-auto w-4 h-4 text-gray-300 transition-transform group-hover/link:translate-x-1", isArabic && "rotate-180 group-hover/link:-translate-x-1")} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        className={cn(
          "group md:w-[600px] md:h-[320px] bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col md:flex-row relative cursor-pointer rtl:flex-row-reverse",
          props.className
        )}
        onClick={() => {
          setIsOpen(true);
          props.onClick?.();
        }}
      >
        {/* 1️⃣ LEFT SECTION: Identity */}
        <div className="w-full md:w-[240px] shrink-0 bg-white flex flex-col items-center justify-center p-6 border-b md:border-b-0 border-gray-100 relative z-10 transition-colors group-hover:bg-gray-50/30">
          <div className="w-[160px] h-[160px] rounded-full border border-gray-100 flex items-center justify-center bg-gray-50/50 mb-4 p-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
            {data.imageId ? (
              <img
                src={data.imageId}
                alt={`${data.companyName} logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-16 h-16 text-gray-300 stroke-1" />
            )}
          </div>
          <div className="w-12 h-px bg-gray-200 mb-4" />
          <h3 className="text-lg md:text-xl font-bold font-din-bold text-center text-gray-900 leading-tight px-2 w-full break-words">
            {data.companyName}
          </h3>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-gray-100 self-stretch my-8 relative z-10" />

        {/* 2️⃣ RIGHT SECTION: Information */}
        <div className="flex-1 min-w-0 p-8 flex flex-col relative z-10">
          <div className="mb-4">
            <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-din-bold tracking-widest uppercase shadow-sm">
              {data.industrialSector}
            </span>
          </div>

          <div className="relative mb-6">
            <p className="text-gray-600 font-din-medium italic text-base leading-relaxed line-clamp-4 ps-4 border-l-2 border-primary/20 rtl:border-l-0 rtl:border-r-2 rtl:ps-0 rtl:pe-4">
              {data.specialization}
            </p>
          </div>

          <div className="mt-auto space-y-3 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-3 text-sm text-gray-500 font-din-regular">
              <Phone className="w-4 h-4 text-primary" />
              <span>{data.primaryPhoneNumber}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 font-din-regular truncate">
              <Mail className="w-4 h-4 text-primary" />
              <span className="truncate">{data.email}</span>
            </div>
          </div>

          {/* View Profile Indicator */}
          <div className="absolute bottom-4 end-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2">
            <span className="text-[10px] font-din-bold text-primary uppercase tracking-widest">
              {isArabic ? "عرض الملف" : "View Profile"}
            </span>
            <ArrowRight className={cn("w-3 h-3 text-primary", isArabic && "rotate-180")} />
          </div>
        </div>
      </div>

      {isMounted && createPortal(modalContent, document.body)}
    </>
  );
};

export default CardCompanies;
