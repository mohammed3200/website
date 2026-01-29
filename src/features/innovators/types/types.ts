export type StageDevelopment = "IDEA" | "PROTOTYPE" | "DEVELOPMENT" | "TESTING" | "MARKET_READY";

export interface Innovator {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  projectTitle: string;
  projectDescription?: string;
  objective?: string;
  stageDevelopment: StageDevelopment;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isVisible?: boolean;
  imageId?: string;
  location?: string;
  city?: string;
  country?: string;
  specialization: string;
}
