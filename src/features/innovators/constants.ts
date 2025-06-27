import { StageDevelopment } from "./types"

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