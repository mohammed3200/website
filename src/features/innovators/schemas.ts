import { z } from "zod";
import { StageDevelopment } from "./types";

export const createCreativeRegistrationSchema = (
  t: (key: string) => string
) => {
  return z.object({
    // ====== Basic information ======
    name: z.string().min(1, { message: t("RequiredField") }),
    phoneNumber: z
      .string()
      .min(1, { message: t("RequiredField") })
      .refine(
        (phone) => typeof phone === "string" && /^\+[\d\s-]{6,15}$/.test(phone),
        { message: t("InvalidPhoneNumber") }
      ),
    email: z
      .string()
      .min(1, { message: t("RequiredField") })
      .email({
        message: t("InvalidEmail"),
      }),

    // ======= Project Details ======
    projectTitle: z.string().min(1, { message: t("RequiredField") }),
    projectDescription: z
      .string()
      .min(1, { message: t("RequiredField") })
      .max(1000, { message: `${t("MaximumFieldSize")} 1000` }),
    objective: z.string().optional(),
    stageDevelopment: z.nativeEnum(StageDevelopment).optional(),

    // ======== Center Policies ========
    TermsOfUse: z
      .boolean()
      .default(false)
      .refine((value) => value === true, {
        message: t("TermsOfUse"),
      }),
  });
};
