export type PropertyStatus = "available" | "sold" | "pending";
export type PropertyType = "apartment" | "duplex" | "penthouse" | "mansion" | "terrace";
export type BuyOrRent = "Buy" | "Rent";
export type LeadSource = "website" | "referral" | "social-media" | "walk-in" | "portal" | "quiz" | "property-detail" | "other";
export type LeadStatus = "new" | "contacted" | "viewing-scheduled" | "converted" | "not-interested";

export interface AgentInfo {
  name: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: PropertyType;
  buyOrRent: BuyOrRent;
  status: PropertyStatus;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqFt: number;
  furnished: boolean;
  location: {
    address: string;
    city: string;
    area: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  images: string[];
  features: string[];
  agent: AgentInfo;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  source: LeadSource;
  status: LeadStatus;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  preferredLocations: string[];
  preferredPropertyType?: PropertyType;
  notes: string;
  interestedProperties: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ViewingRequest {
  id: string;
  leadId: string;
  propertyId: string;
  requestedDate: string;
  requestedTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: string;
}

export interface LeadFilter {
  search?: string;
  source?: LeadSource;
  status?: PropertyStatus;
  preferredLocation?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PropertyFilter {
  buyOrRent: BuyOrRent | "All";
  locations: string[];
  propertyTypes: PropertyType[];
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  maxBedrooms: number;
  furnished: boolean | null;
}

export interface CurrencyDefinition {
  code: string;
  symbol: string;
  name: string;
}

export interface AgencyConfig {
  agencyName: string;
  logo: string;
  brandColor: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  officeAddress: string;
  defaultCity: string;
  country: string;
  currency: string;
  supportedCurrencies: CurrencyDefinition[];
}
