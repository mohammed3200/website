import React from "react";
import { cn } from "@/lib/utils";
import useLanguage from "@/hooks/use-language";
import { Phone, Mail, Globe, MapPin, Building2, LucideIcon } from "lucide-react";
import { Modal, ModalTrigger, ModalBody, ModalContent } from "@/components/ui/animated-modal";

// 🧱 Data Contract
export interface Collaborator {
  companyName: string;
  primaryPhoneNumber: string;
  email: string;
  site?: string;
  location?: string;
  industrialSector: string;
  specialization: string;
  logoUrl?: string;
  image?: {
    data: string;
    type: string;
  };
  logoComponent?: React.ReactNode;
}

// Legacy props support + new interface
interface CardCompaniesProps extends Partial<Collaborator> {
  className?: string;
  CompaniesName?: string;
  ExperienceProvided?: string;
  companyImage?: string;
}

// 🔧 Internal Components
const LogoRenderer = ({
  logoUrl,
  image,
  logoComponent,
  companyName,
}: {
  logoUrl?: string;
  image?: { data: string; type: string };
  logoComponent?: React.ReactNode;
  companyName: string;
}) => {
  if (logoComponent) return <>{logoComponent}</>;

  if (image?.data) {
    const src = `data:${image.type};base64,${image.data}`;
    return (
      <img
        src={src}
        alt={`${companyName} logo`}
        className="w-full h-full object-contain"
      />
    );
  }

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${companyName} logo`}
        className="w-full h-full object-contain"
      />
    );
  }

  return <Building2 className="w-1/2 h-1/2 text-primary/70" />;
};

const ContactItem = ({
  icon: Icon,
  text,
  href,
}: {
  icon: LucideIcon;
  text?: string;
  href?: string;
}) => {
  if (!text) return null;

  const content = (
    <div className="flex items-center gap-3 text-black">
      <Icon className="w-6 h-6 shrink-0 stroke-[1.5]" />
      <span className="text-sm font-sans truncate max-w-[180px]">
        {text}
      </span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="block w-full hover:opacity-80 transition-opacity"
      >
        {content}
      </a>
    );
  }

  return <div className="block w-full">{content}</div>;
};

const CompanyDetailsModal = ({ data }: { data: Collaborator }) => {
  const { isArabic } = useLanguage();

  return (
    <ModalBody>
      <ModalContent>
        <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
          {/* Header */}
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="relative w-24 h-24 rounded-full bg-gray-100 p-4 flex items-center justify-center border border-border">
              <LogoRenderer
                logoUrl={data.logoUrl}
                image={data.image}
                logoComponent={data.logoComponent}
                companyName={data.companyName}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{data.companyName}</h2>
              <p className="text-sm text-primary font-medium mt-1">{data.industrialSector}</p>
            </div>
          </div>

          {/* Specialization */}
          {data.specialization && (
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">
                {isArabic ? "التخصص" : "Specialization"}
              </h3>
              <p className="text-base font-normal text-foreground leading-relaxed">
                {data.specialization}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-3">
            <ContactItem icon={MapPin} text={data.location} />
            <ContactItem icon={Phone} text={data.primaryPhoneNumber} href={`tel:${data.primaryPhoneNumber}`} />
            <ContactItem icon={Mail} text={data.email} href={`mailto:${data.email}`} />
            <ContactItem
              icon={Globe}
              text={data.site?.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              href={data.site}
            />
          </div>
        </div>
      </ModalContent>
    </ModalBody>
  );
};

export const CardCompanies = (props: CardCompaniesProps) => {
  const { isArabic } = useLanguage();

  const data: Collaborator = {
    companyName: props.companyName || props.CompaniesName || "",
    primaryPhoneNumber: props.primaryPhoneNumber || "",
    email: props.email || "",
    industrialSector: props.industrialSector || "Industrial Sector",
    specialization: props.specialization || props.ExperienceProvided || "Specialization",
    logoUrl: props.logoUrl || props.companyImage,
    image: props.image,
    site: props.site,
    location: props.location,
    logoComponent: props.logoComponent,
  };

  const formattedSite = data.site?.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <Modal>
      <ModalTrigger className="w-full max-w-[524px] mx-auto text-start cursor-pointer transition-transform duration-300 hover:scale-[1.02] focus:outline-none rounded-[17px]">
        <div
          className={cn(
            "flex flex-col md:flex-row w-full h-auto md:h-[282px] overflow-hidden rounded-[17px] bg-white shadow-md border border-gray-100",
            props.className
          )}
          dir={isArabic ? "rtl" : "ltr"}
        >
          {/* 1️⃣ Left Panel - Image/Blur Background */}
          <div className="w-full md:w-[213px] relative flex flex-col items-center justify-start pt-16 p-4 text-center overflow-hidden bg-gray-50 border-e border-gray-100 shrink-0">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />

            {/* Logo Container */}
            <div className="relative z-10 w-[124px] h-[124px] mb-8 bg-transparent flex items-center justify-center p-2">
              <LogoRenderer
                logoUrl={data.logoUrl}
                image={data.image}
                logoComponent={data.logoComponent}
                companyName={data.companyName}
              />
            </div>

            {/* Company Name */}
            <h3 className="relative z-10 font-bold text-2xl text-black leading-tight px-2 break-words max-w-full">
              {data.companyName}
            </h3>
          </div>

          {/* 2️⃣ Right Panel - Content */}
          <div className="flex-1 relative p-6 pt-12 md:pl-[28px]">
            {/* Industrial Sector Pill */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-full px-5 py-2 inline-flex items-center justify-center mb-6 self-start">
              <span className="text-white text-base font-normal leading-none transform translate-y-[1px]">
                {data.industrialSector}
              </span>
            </div>

            {/* Separator Line */}
            <div className="w-full h-px bg-gray-200 mb-6" />

            {/* Contact Details */}
            <div className="space-y-5">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-black" />
                <div className="text-sm text-black flex items-center gap-1">
                  <span>{data.primaryPhoneNumber}</span>
                  {!data.primaryPhoneNumber && <span className="font-semibold opacity-40">(if available)</span>}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-black" />
                <div className="text-sm text-black flex items-center gap-1">
                  <span className="truncate max-w-[180px]">{data.email}</span>
                  {!data.email && <span className="font-semibold opacity-40">(if available)</span>}
                </div>
              </div>

              {/* Website */}
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-black" />
                <div className="text-sm text-black flex items-center gap-1">
                  <span className="truncate max-w-[180px]">{formattedSite}</span>
                  {!formattedSite && <span className="font-semibold opacity-40">(if available)</span>}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-black" />
                <div className="text-sm text-black flex items-center gap-1">
                  <span className="truncate max-w-[180px]">{data.location}</span>
                  {!data.location && <span className="font-semibold opacity-40">(if available)</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalTrigger>

      <CompanyDetailsModal data={data} />
    </Modal>
  );
};
