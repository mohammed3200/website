import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  // 🔄 Data Normalization Strategy
  // Priority: Direct Prop > Collaborator Object Prop > Legacy Prop > Default

  const data = {
    companyName: props.companyName || props.collaborator?.companyName || props.CompaniesName || "Unknown Company",
    industrialSector: props.industrialSector || props.collaborator?.industrialSector || "General Sector",
    specialization: props.specialization || props.collaborator?.specialization || props.ExperienceProvided || "Specialization",
    location: props.location || props.collaborator?.location,
    email: props.email || props.collaborator?.email || "",
    primaryPhoneNumber: props.primaryPhoneNumber || props.collaborator?.primaryPhoneNumber || "",
    site: props.site || props.collaborator?.site,
    imageId: props.imageId || props.collaborator?.imageId || props.logoUrl || props.companyImage,
  };

  const displayUrl = data.site?.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <div
      className={cn(
        "group md:w-[600px] md:h-[320px] bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row relative cursor-pointer rtl:flex-row-reverse",
        props.className
      )}
      onClick={props.onClick}
    >
      {/* 
        1️⃣ LEFT SECTION: Identity 
        - Fixed width on desktop
        - Centered content
      */}
      <div className="w-full md:w-[240px] shrink-0 bg-white flex flex-col items-center justify-center p-6 border-b md:border-b-0 border-gray-100">

        {/* Logo Container */}
        <div className="w-[160px] h-[160px] rounded-full border border-gray-100 flex items-center justify-center bg-gray-50/50 mb-4 p-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
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

        {/* Horizontal Divider */}
        <div className="w-12 h-px bg-gray-200 mb-4" />

        {/* Company Name */}
        <h3 className="text-lg md:text-xl font-bold font-almarai text-center text-gray-900 leading-tight px-2 w-full break-words">
          {data.companyName}
        </h3>
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block w-px bg-gray-200 self-stretch my-8" />

      {/* 
        2️⃣ RIGHT SECTION: Information
        - Flexible width
        - Content aligned to top-left
      */}
      <div className="flex-1 min-w-0 p-5 md:p-4 flex flex-col">

        {/* Header: Sector Badge */}
        <div className="my-4">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary text-[#ffffff] text-base font-medium tracking-wide shadow-sm font-almarai">
            {data.industrialSector}
          </span>
        </div>

        {/* Specialization with Quotes */}
        <div className="relative mb-5">
          <p className="text-gray-600 font-medium italic text-sm md:text-base leading-relaxed font-almarai line-clamp-4 break-words w-full rtl:text-right relative">
            <span className="inline-block align-baseline me-4 rtl:ms-4 rtl:me-0">
              <Quote className="w-4 h-4 text-gray-300 inline-block -translate-y-1 rotate-180 rtl:rotate-0" />
            </span>
            {data.specialization}
            <span className="inline-block align-baseline ms-4 rtl:me-4 rtl:ms-0">
              <Quote className="w-4 h-4 text-gray-300 inline-block -translate-y-1" />
            </span>
          </p>
        </div>

        {/* Separator Divider */}
        <div className="h-px bg-gray-200 mb-5 w-[40%] self-center" />

        {/* Contact Details List */}
        <div className="space-y-3">

          {/* Phone */}
          <div className="flex items-center group/item rtl:flex-row-reverse">
            <div className="w-8 flex justify-center shrink-0">
              <Phone className="w-5 h-5 text-gray-900 stroke-[1.5]" />
            </div>
            <span className="text-gray-600 text-sm md:text-base font-outfit ms-2 rtl:me-2 rtl:ms-0">
              {data.primaryPhoneNumber}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center group/item rtl:flex-row-reverse">
            <div className="w-8 flex justify-center shrink-0">
              <Mail className="w-5 h-5 text-gray-900 stroke-[1.5]" />
            </div>
            <span className="text-gray-600 text-sm md:text-base font-outfit ms-2 rtl:me-2 rtl:ms-0 truncate">
              {data.email}
            </span>
          </div>

          {/* Website */}
          {data.site && (
            <div className="flex items-center group/item rtl:flex-row-reverse">
              <div className="w-8 flex justify-center shrink-0">
                <Globe className="w-5 h-5 text-gray-900 stroke-[1.5]" />
              </div>
              <a
                href={data.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 text-sm md:text-base font-outfit ms-2 rtl:me-2 rtl:ms-0 hover:text-[#FF6B00] transition-colors truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {displayUrl}
              </a>
            </div>
          )}

          {/* Location */}
          {data.location && (
            <div className="flex items-center group/item rtl:flex-row-reverse">
              <div className="w-8 flex justify-center shrink-0">
                <MapPin className="w-5 h-5 text-gray-900 stroke-[1.5]" />
              </div>
              <span className="text-gray-600 text-sm md:text-base font-outfit ms-2 rtl:me-2 rtl:ms-0">
                {data.location}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCompanies;
