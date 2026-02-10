import { ListOfIndustrialSectors, sharedResources as sharedResource } from "./types/types";

export const EntranceNamePlaceholders = {
  en: [
    "Your company name",
    "Your organization name",
    "Your workshop name",
    "Your center name",
    "Or even the name of your platform",
  ],
  ar: [
    "اسم شركتك",
    "اسم مؤسستك",
    "اسم ورشة عملك",
    "اسم مركزك",
    "أو حتي اسم منصتك",
  ],
};

export const SectorTranslations = {
  [ListOfIndustrialSectors.IronIndustriesManufacturing]: {
    en: "Iron Industries Manufacturing",
    ar: "الصناعات الحديدية (تصنيع)",
  },
  [ListOfIndustrialSectors.IronIndustriesMaintenance]: {
    en: "Iron Industries Maintenance",
    ar: "الصناعات الحديدية (صيانة)",
  },
  [ListOfIndustrialSectors.PlasticIndustries]: {
    en: "Plastic Industries",
    ar: "الصناعات البلاستيكية",
  },
  [ListOfIndustrialSectors.ChemicalIndustries]: {
    en: "Chemical Industries",
    ar: "الصناعات الكيميائية",
  },
  [ListOfIndustrialSectors.ElectricalIndustriesManufacturing]: {
    en: "Electrical Industries Manufacturing",
    ar: "الصناعات الكهربائية (تصنيع)",
  },
  [ListOfIndustrialSectors.ElectricalIndustriesMaintenance]: {
    en: "Electrical Industries Maintenance",
    ar: "الصناعات الكهربائية (صيانة)",
  },
  [ListOfIndustrialSectors.Electronics]: {
    en: "Electronics",
    ar: "الإلكترونيات",
  },
  [ListOfIndustrialSectors.Control]: { en: "Control", ar: "التحكم" },
  [ListOfIndustrialSectors.HeavyIndustries]: {
    en: "Heavy Industries",
    ar: "الصناعات الثقيلة",
  },
  [ListOfIndustrialSectors.Manufacturing]: {
    en: "Manufacturing",
    ar: "التصنيع",
  },
  [ListOfIndustrialSectors.Mining]: { en: "Mining", ar: "التعدين" },
  [ListOfIndustrialSectors.FoodIndustries]: {
    en: "Food Industries",
    ar: "الصناعات الغذائية",
  },
  [ListOfIndustrialSectors.Telecommunications]: {
    en: "Telecommunications",
    ar: "الاتصالات",
  },
  [ListOfIndustrialSectors.Technology]: { en: "Technology", ar: "التكنولوجيا" },
  [ListOfIndustrialSectors.RenewableEnergy]: {
    en: "Renewable Energy",
    ar: "الطاقة المتجددة",
  },
};

export const sharedResources = {
  [sharedResource.machines] : {
    en: "Machines",
    ar: "الآلات",
  },
  [sharedResource.experiences] : {
    en: "Experiences",
    ar: "الخبرات",
  }
}