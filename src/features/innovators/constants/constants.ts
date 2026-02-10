import { StageDevelopment } from "../types/types"

export const StagesDevelopment = {
    [StageDevelopment.STAGE] : {
    en: "Idea Stage",
    ar: "مرحلة الفكرة",
  },
    [StageDevelopment.PROTOTYPE] : {
        en: "prototype",
    ar: "النموذج الأولي"
  },
    [StageDevelopment.DEVELOPMENT] : {
        en: "Under construction",
    ar: "قيد الانشاء",
  },
    [StageDevelopment.TESTING] : {
        en: "Evaluation phase",
    ar: "مرحلة التقييم",
  },
    [StageDevelopment.RELEASED] : {
        en: "Ready to launch",
    ar: "جاهز للاطلاق",
  }
}

export const Countries = {
  // Arab Countries & Middle East
  LIBYA: { ar: "ليبيا", en: "Libya" },
  EGYPT: { ar: "مصر", en: "Egypt" },
  TUNISIA: { ar: "تونس", en: "Tunisia" },
  ALGERIA: { ar: "الجزائر", en: "Algeria" },
  MOROCCO: { ar: "المغرب", en: "Morocco" },
  SAUDI_ARABIA: { ar: "المملكة العربية السعودية", en: "Saudi Arabia" },
  UAE: { ar: "الإمارات", en: "United Arab Emirates" },
  JORDAN: { ar: "الأردن", en: "Jordan" },
  LEBANON: { ar: "لبنان", en: "Lebanon" },
  IRAQ: { ar: "العراق", en: "Iraq" },
  YEMEN: { ar: "اليمن", en: "Yemen" },
  SYRIA: { ar: "سوريا", en: "Syria" },
  PALESTINE: { ar: "فلسطين", en: "Palestine" },
  KUWAIT: { ar: "الكويت", en: "Kuwait" },
  QATAR: { ar: "قطر", en: "Qatar" },
  BAHRAIN: { ar: "البحرين", en: "Bahrain" },
  OMAN: { ar: "عمان", en: "Oman" },
  SUDAN: { ar: "السودان", en: "Sudan" },
  MAURITANIA: { ar: "موريتانيا", en: "Mauritania" },
  
  // Asia
  CHINA: { ar: "الصين", en: "China" },
  JAPAN: { ar: "اليابان", en: "Japan" },
  SOUTH_KOREA: { ar: "كوريا الجنوبية", en: "South Korea" },
  INDIA: { ar: "الهند", en: "India" },
  PAKISTAN: { ar: "باكستان", en: "Pakistan" },
  BANGLADESH: { ar: "بنغلاديش", en: "Bangladesh" },
  INDONESIA: { ar: "إندونيسيا", en: "Indonesia" },
  MALAYSIA: { ar: "ماليزيا", en: "Malaysia" },
  SINGAPORE: { ar: "سنغافورة", en: "Singapore" },
  THAILAND: { ar: "تايلاند", en: "Thailand" },
  VIETNAM: { ar: "فيتنام", en: "Vietnam" },
  PHILIPPINES: { ar: "الفلبين", en: "Philippines" },
  TURKEY: { ar: "تركيا", en: "Turkey" },
  IRAN: { ar: "إيران", en: "Iran" },
  AFGHANISTAN: { ar: "أفغانستان", en: "Afghanistan" },
  
  // Europe
  UNITED_KINGDOM: { ar: "المملكة المتحدة", en: "United Kingdom" },
  FRANCE: { ar: "فرنسا", en: "France" },
  GERMANY: { ar: "ألمانيا", en: "Germany" },
  ITALY: { ar: "إيطاليا", en: "Italy" },
  SPAIN: { ar: "إسبانيا", en: "Spain" },
  NETHERLANDS: { ar: "هولندا", en: "Netherlands" },
  BELGIUM: { ar: "بلجيكا", en: "Belgium" },
  SWITZERLAND: { ar: "سويسرا", en: "Switzerland" },
  AUSTRIA: { ar: "النمسا", en: "Austria" },
  SWEDEN: { ar: "السويد", en: "Sweden" },
  NORWAY: { ar: "النرويج", en: "Norway" },
  DENMARK: { ar: "الدنمارك", en: "Denmark" },
  FINLAND: { ar: "فنلندا", en: "Finland" },
  POLAND: { ar: "بولندا", en: "Poland" },
  GREECE: { ar: "اليونان", en: "Greece" },
  PORTUGAL: { ar: "البرتغال", en: "Portugal" },
  RUSSIA: { ar: "روسيا", en: "Russia" },
  UKRAINE: { ar: "أوكرانيا", en: "Ukraine" },
  
  // North America
  UNITED_STATES: { ar: "الولايات المتحدة", en: "United States" },
  CANADA: { ar: "كندا", en: "Canada" },
  MEXICO: { ar: "المكسيك", en: "Mexico" },
  
  // South America
  BRAZIL: { ar: "البرازيل", en: "Brazil" },
  ARGENTINA: { ar: "الأرجنتين", en: "Argentina" },
  CHILE: { ar: "تشيلي", en: "Chile" },
  COLOMBIA: { ar: "كولومبيا", en: "Colombia" },
  PERU: { ar: "بيرو", en: "Peru" },
  VENEZUELA: { ar: "فنزويلا", en: "Venezuela" },
  
  // Africa (Additional)
  SOUTH_AFRICA: { ar: "جنوب أفريقيا", en: "South Africa" },
  NIGERIA: { ar: "نيجيريا", en: "Nigeria" },
  KENYA: { ar: "كينيا", en: "Kenya" },
  ETHIOPIA: { ar: "إثيوبيا", en: "Ethiopia" },
  GHANA: { ar: "غانا", en: "Ghana" },
  
  // Oceania
  AUSTRALIA: { ar: "أستراليا", en: "Australia" },
  NEW_ZEALAND: { ar: "نيوزيلندا", en: "New Zealand" },
  
  // Other
  OTHER: { ar: "أخرى", en: "Other" },
} as const;