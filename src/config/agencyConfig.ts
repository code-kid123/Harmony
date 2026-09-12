import { AgencyConfig, CurrencyDefinition } from "@/types";

export const SUPPORTED_CURRENCIES: CurrencyDefinition[] = [
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AED", symbol: "AED", name: "UAE Dirham" },
];

export const defaultAgencyConfig: AgencyConfig = {
  agencyName: "Harmony Gardens",
  logo: "/images/logo.jfif",
  brandColor: "#9B3848",
  phone: "08177766115",
  whatsappNumber: "08177766115",
  email: "info@harmonygardens.com",
  officeAddress: "Lekki Phase 1, Lagos, Nigeria",
  defaultCity: "Lagos",
  country: "Nigeria",
  currency: "NGN",
  supportedCurrencies: SUPPORTED_CURRENCIES,
};
