import {
  ListOfIndustrialSectors,
  sharedResources as sharedResource,
} from './types/types';
import { Clock3, CheckCircle2, XCircle } from 'lucide-react';

export const EntranceNamePlaceholders = {
  en: [
    'Your company name',
    'Your organization name',
    'Your workshop name',
    'Your center name',
    'Or even the name of your platform',
  ],
  ar: [
    'اسم شركتك',
    'اسم مؤسستك',
    'اسم ورشة عملك',
    'اسم مركزك',
    'أو حتي اسم منصتك',
  ],
};

export const SectorTranslations = {
  [ListOfIndustrialSectors.IronIndustriesManufacturing]: {
    en: 'Iron Industries Manufacturing',
    ar: 'الصناعات الحديدية (تصنيع)',
  },
  [ListOfIndustrialSectors.IronIndustriesMaintenance]: {
    en: 'Iron Industries Maintenance',
    ar: 'الصناعات الحديدية (صيانة)',
  },
  [ListOfIndustrialSectors.PlasticIndustries]: {
    en: 'Plastic Industries',
    ar: 'الصناعات البلاستيكية',
  },
  [ListOfIndustrialSectors.ChemicalIndustries]: {
    en: 'Chemical Industries',
    ar: 'الصناعات الكيميائية',
  },
  [ListOfIndustrialSectors.ElectricalIndustriesManufacturing]: {
    en: 'Electrical Industries Manufacturing',
    ar: 'الصناعات الكهربائية (تصنيع)',
  },
  [ListOfIndustrialSectors.ElectricalIndustriesMaintenance]: {
    en: 'Electrical Industries Maintenance',
    ar: 'الصناعات الكهربائية (صيانة)',
  },
  [ListOfIndustrialSectors.Electronics]: {
    en: 'Electronics',
    ar: 'الإلكترونيات',
  },
  [ListOfIndustrialSectors.Control]: { en: 'Control', ar: 'التحكم' },
  [ListOfIndustrialSectors.HeavyIndustries]: {
    en: 'Heavy Industries',
    ar: 'الصناعات الثقيلة',
  },
  [ListOfIndustrialSectors.Manufacturing]: {
    en: 'Manufacturing',
    ar: 'التصنيع',
  },
  [ListOfIndustrialSectors.Mining]: { en: 'Mining', ar: 'التعدين' },
  [ListOfIndustrialSectors.FoodIndustries]: {
    en: 'Food Industries',
    ar: 'الصناعات الغذائية',
  },
  [ListOfIndustrialSectors.Telecommunications]: {
    en: 'Telecommunications',
    ar: 'الاتصالات',
  },
  [ListOfIndustrialSectors.Technology]: { en: 'Technology', ar: 'التكنولوجيا' },
  [ListOfIndustrialSectors.RenewableEnergy]: {
    en: 'Renewable Energy',
    ar: 'الطاقة المتجددة',
  },
};

export const sharedResources = {
  [sharedResource.machines]: {
    en: 'Machines',
    ar: 'الآلات',
  },
  [sharedResource.experiences]: {
    en: 'Experiences',
    ar: 'الخبرات',
  },
};

// Status configurations for admin workflow
export const statusConfig = {
  PENDING: {
    icon: Clock3,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: { ar: 'قيد المراجعة', en: 'Pending' },
    pulse: 'bg-amber-400',
  },
  APPROVED: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    label: { ar: 'معتمد', en: 'Approved' },
    pulse: 'bg-green-400',
  },
  REJECTED: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: { ar: 'مرفوض', en: 'Rejected' },
    pulse: 'bg-red-400',
  },
  ARCHIVED: {
    icon: XCircle,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    label: { ar: 'مؤرشف', en: 'Archived' },
    pulse: 'bg-gray-400',
  },
  UNDER_REVIEW: {
    icon: Clock3,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    label: { ar: 'قيد المراجعة', en: 'Under Review' },
    pulse: 'bg-blue-400',
  },
};

// Sector color mapping for visual variety
export const sectorColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Technology: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  Manufacturing: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  Healthcare: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  Finance: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  Education: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  Construction: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  Retail: {
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
  },
  Energy: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
  },
  default: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
};
