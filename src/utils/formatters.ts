import { CurrencyDefinition } from "@/types";
import { SUPPORTED_CURRENCIES } from "@/config/agencyConfig";

export function formatPrice(amount: number, currencyCode: string): string {
  const currency = SUPPORTED_CURRENCIES.find(
    (c: CurrencyDefinition) => c.code === currencyCode
  );

  if (!currency) {
    return `${amount.toLocaleString("en-US")} ${currencyCode}`;
  }

  if (currency.code === "AED") {
    return `AED ${amount.toLocaleString("en-US")}`;
  }

  return `${currency.symbol}${amount.toLocaleString("en-US")}`;
}

export function generateWhatsAppLink(
  phone: string,
  message: string
): string {
  const cleaned = phone.replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}
