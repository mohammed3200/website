import { z } from "zod";
import { ListOfIndustrialSectors, TypesOfCooperation } from "./types";

export const createJoiningCompaniesCollaboratorSchema = (t: (key: string) => string) => {
  return z.object({
    companyName: z.string().min(1, { message: t("RequiredField") }),
    primaryPhoneNumber: z
      .string()
      .min(1, { message: t("RequiredField") })
      .refine(
        (phone) => /^\d{3}-\d{6,10}$/.test(phone),
        { message: t("InvalidPhoneNumber") }
      ),
    optionalPhoneNumber: z
      .string()
      .optional(),
    email: z.string().optional(),
    image: z
      .union([
        z.instanceof(File),
        z.string().transform((value) => (value === "" ? undefined : value)),
      ])
      .optional(),
    site: z.string().optional(),
    location: z.string().optional(),
    industrialSector: z.nativeEnum(ListOfIndustrialSectors, {
      required_error: t("RequiredField"),
    }),
    specialization: z.string().min(1,t("RequiredField")),
    experienceProvided: z.string().optional(),
    availableMaterials: z.string().optional(),
    typeOfCooperation: z.nativeEnum(TypesOfCooperation, {
      required_error: t("RequiredField"),
    }),
    CooperationInterests: z.string().optional(),
    TermsOfUse: z
      .boolean()
      .default(false)
      .refine((value) => value === true, {
        message: t("TermsOfUse"),
      }),
  });
};