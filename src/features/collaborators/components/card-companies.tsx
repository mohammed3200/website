import React from 'react';
import { cn } from '@/lib/utils';
import useLanguage from '@/hooks/use-language';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Building2,
  LucideIcon,
  Quote,
} from 'lucide-react';
import {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
} from '@/components/ui/animated-modal';

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
    <div className="flex items-center gap-2 text-gray-700">
      <Icon className="w-4 h-4 shrink-0 stroke-[1.5]" />
      <span className="text-xs font-medium truncate max-w-[150px]">{text}</span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="block hover:text-primary transition-colors"
      >
        {content}
      </a>
    );
  }

  return <div className="block">{content}</div>;
};

const CompanyDetailsModal = ({ data }: { data: Collaborator }) => {
  const { isArabic } = useLanguage();

  return (
    <ModalBody>
      <ModalContent>
        <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
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
              <h2 className="text-2xl font-bold text-foreground">
                {data.companyName}
              </h2>
              <p className="text-sm text-primary font-medium mt-1">
                {data.industrialSector}
              </p>
            </div>
          </div>

          {/* Specialization */}
          {data.specialization && (
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">
                {isArabic ? 'التخصص' : 'Specialization'}
              </h3>
              <p className="text-base font-normal text-foreground leading-relaxed">
                {data.specialization}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-3">
            <ContactItem icon={MapPin} text={data.location} />
            <ContactItem
              icon={Phone}
              text={data.primaryPhoneNumber}
              href={`tel:${data.primaryPhoneNumber}`}
            />
            <ContactItem
              icon={Mail}
              text={data.email}
              href={`mailto:${data.email}`}
            />
            <ContactItem
              icon={Globe}
              text={data.site?.replace(/^https?:\/\//, '').replace(/\/$/, '')}
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
    companyName: props.companyName || props.CompaniesName || '',
    primaryPhoneNumber: props.primaryPhoneNumber || '',
    email: props.email || '',
    industrialSector: props.industrialSector || 'Industrial Sector',
    specialization:
      props.specialization || props.ExperienceProvided || 'Specialization',
    logoUrl: props.logoUrl || props.companyImage,
    image: props.image,
    site: props.site,
    location: props.location,
    logoComponent: props.logoComponent,
  };

  const formattedSite = data.site
    ?.replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  return (
    <Modal>
      <ModalTrigger className="w-full max-w-4xl mx-auto text-start cursor-pointer transition-transform duration-300 hover:scale-[1.01] focus:outline-none rounded-[17px]">
        <div
          className={cn(
            'flex flex-col md:flex-row w-full overflow-hidden rounded-[17px] bg-white shadow-sm border border-gray-100 h-auto md:h-[280px]', // Fixed height for desktop to ensure proportions
            props.className,
          )}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {/* 1️⃣ Left Panel - Logo & Name (25%) */}
          <div className="w-full md:w-1/4 flex flex-col items-center justify-between border-b md:border-b-0 md:border-e border-gray-100 bg-white py-4 px-2 shrink-0">
            {/* Logo Section (60%) */}
            <div className="h-[60%] w-full flex items-center justify-center p-4">
              <div className="w-24 h-24 relative flex items-center justify-center">
                <LogoRenderer
                  logoUrl={data.logoUrl}
                  image={data.image}
                  logoComponent={data.logoComponent}
                  companyName={data.companyName}
                />
              </div>
            </div>

            {/* Separator */}
            <div className="w-[80%] h-px bg-gray-200 my-2" />

            {/* Name Section (40%) */}
            <div className="h-[40%] w-full flex items-center justify-center text-center px-2">
              <h3 className="font-bold text-lg md:text-xl text-black leading-tight break-words line-clamp-3">
                {data.companyName}
              </h3>
            </div>
          </div>

          {/* 2️⃣ Right Panel - Content (75%) */}
          <div className="w-full md:w-3/4 flex flex-col">
            {/* Top Section - Industry & Specialization (50%) */}
            <div className="flex-1 p-5 flex flex-col justify-start">
              {/* Industry Sector - Aligned Start */}
              <div className="w-full flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-primary/80 uppercase tracking-wider">
                  {data.industrialSector}
                </span>
              </div>

              {/* Specialization - Centered with Big Quotes */}
              <div className="flex-1 flex flex-col items-center justify-center relative px-8 py-2">
                {/* Top Quote */}
                <Quote className="w-8 h-8 text-primary/20 absolute top-0 left-4 rotate-180 transform -scale-x-100" />

                <p className="text-center text-base md:text-lg font-bold italic text-gray-700 leading-snug mx-4 z-10">
                  {data.specialization}
                </p>

                {/* Bottom Quote */}
                <Quote className="w-8 h-8 text-primary/20 absolute bottom-0 right-4" />
              </div>
            </div>

            {/* Bottom Section - Contact Info Badge (50%) */}
            <div className="flex-1 p-5 flex items-end">
              <div className="w-full bg-gray-50/80 hover:bg-gray-100 transition-colors rounded-xl p-4 border border-gray-100/50 group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Contact Items */}
                  <ContactItem
                    icon={Phone}
                    text={data.primaryPhoneNumber}
                    href={`tel:${data.primaryPhoneNumber}`}
                  />
                  <ContactItem
                    icon={Mail}
                    text={data.email}
                    href={`mailto:${data.email}`}
                  />
                  <ContactItem
                    icon={Globe}
                    text={formattedSite}
                    href={data.site}
                  />
                  <ContactItem icon={MapPin} text={data.location} />
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
