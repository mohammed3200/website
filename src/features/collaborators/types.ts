export enum ListOfIndustrialSectors {
  IronIndustriesManufacturing = "Iron Industries Manufacturing",
  IronIndustriesMaintenance = "Iron Industries Maintenance",
  PlasticIndustries = "Plastic Industries",
  ChemicalIndustries = "Chemical Industries",
  ElectricalIndustriesManufacturing = "Electrical Industries Manufacturing",
  ElectricalIndustriesMaintenance = "Electrical Industries Maintenance",
  Electronics = "Electronics",
  Control = "Control",
  HeavyIndustries = "Heavy Industries",
  Manufacturing = "Manufacturing",
  Mining = "Mining",
  FoodIndustries = "Food Industries",
  Telecommunications = "Telecommunications",
  Technology = "Technology",
  RenewableEnergy = "Renewable Energy",
}

export enum sharedResources {
  machines = "Machines",
  experiences = "Experiences",
}

// Base collaborator type without relations
type BaseCollaborator = {
  id: string;
  companyName: string;
  primaryPhoneNumber: string;
  optionalPhoneNumber: string | null;
  email: string | null;
  location: string | null;
  site: string | null;
  industrialSector: string;
  specialization: string;
  experienceProvided: string | null;
  machineryAndEquipment: string | null;
  createdAt: string;
  updatedAt: string;
};

// Media type
export type Media = {
  data: string;
  type: string;
  size: number;
};

// Collaborator with relations
export type Collaborator = BaseCollaborator & {
  image: Media | null;
  experienceProvidedMedia: {
    id: string;
    fileName: string;
  } & Media[];
  machineryAndEquipmentMedia: {
    id: string;
    fileName: string;
  } & Media[];
};

// Public collaborator type (subset of BaseCollaborator)
export type PublicCollaborator = Pick<
  BaseCollaborator,
  | 'id'
  | 'companyName'
  | 'location'
  | 'site'
  | 'industrialSector'
  | 'specialization'
> & {
  image: Media | null;
};

export enum RecordStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ARCHIVED = "ARCHIVED",
}

export type CollaboratorAdmin = Collaborator & {
  status: RecordStatus;
  isVisible: boolean;
}