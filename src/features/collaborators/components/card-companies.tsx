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
        "group bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row relative cursor-pointer",
        props.className
      )}
      onClick={props.onClick}
    >
      {/* 
        1️⃣ LEFT SECTION: Identity 
        - Fixed width on desktop
        - Centered content
      */}
      <div className="w-full md:w-[280px] shrink-0 bg-white flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">

        {/* Logo Container */}
        <div className="w-[140px] h-[140px] rounded-full border border-gray-100 flex items-center justify-center bg-gray-50/50 mb-6 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
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
        <div className="w-16 h-px bg-gray-200 mb-6" />

        {/* Company Name */}
        <h3 className="text-xl md:text-2xl font-bold font-almarai text-center text-gray-900 leading-tight px-2">
          {data.companyName}
        </h3>
      </div>

      {/* 
        2️⃣ RIGHT SECTION: Information
        - Flexible width
        - Content aligned to top-left
      */}
      <div className="flex-1 p-6 md:p-8 flex flex-col">

        {/* Header: Sector Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#FF6B00] text-white text-sm font-medium tracking-wide shadow-sm">
            {data.industrialSector}
          </span>
        </div>

        {/* Specialization with Quotes */}
        <div className="relative mb-8 pl-8 pr-4">
          {/* Opening Quote */}
          <Quote className="absolute top-0 left-0 w-5 h-5 text-gray-300 rotate-180 -translate-y-1/3" />

          <p className="text-gray-600 font-medium italic text-base md:text-lg leading-relaxed font-outfit">
            {data.specialization}
            <span className="text-gray-300 tracking-widest ml-2 select-none">.......</span>
          </p>

          {/* Closing Quote */}
          <Quote className="absolute bottom-0 right-0 w-5 h-5 text-gray-300 translate-y-1/3" />
        </div>

        {/* Contact Details List */}
        <div className="mt-auto space-y-4">

          {/* Phone */}
          <div className="flex items-center group/item">
            <div className="w-8 flex justify-center shrink-0">
              <Phone className="w-5 h-5 text-gray-900 stroke-[1.5]" />
            </div>
            <span className="text-gray-600 text-sm md:text-base font-outfit ml-2">
              {data.primaryPhoneNumber}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center group/item">
            <div className="w-8 flex justify-center shrink-0">
              <Mail className="w-5 h-5 text-gray-900 stroke-[1.5]" />
            </div>
            <span className="text-gray-600 text-sm md:text-base font-outfit ml-2 truncate">
              {data.email}
            </span>
          </div>

          {/* Website */}
          {data.site && (
            <div className="flex items-center group/item">
              <div className="w-8 flex justify-center shrink-0">
                <Globe className="w-5 h-5 text-gray-900 stroke-[1.5]" />
              </div>
              <a
                href={data.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 text-sm md:text-base font-outfit ml-2 hover:text-[#FF6B00] transition-colors truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {displayUrl}
              </a>
            </div>
          )}

          {/* Location */}
          {data.location && (
            <div className="flex items-center group/item">
              <div className="w-8 flex justify-center shrink-0">
                <MapPin className="w-5 h-5 text-gray-900 stroke-[1.5]" />
              </div>
              <span className="text-gray-600 text-sm md:text-base font-outfit ml-2">
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
