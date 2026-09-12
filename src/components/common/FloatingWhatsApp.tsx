"use client";

import { MessageCircle } from "lucide-react";
import { defaultAgencyConfig } from "@/config/agencyConfig";
import { generateWhatsAppLink } from "@/utils/formatters";

export default function FloatingWhatsApp() {
  const config = defaultAgencyConfig;
  const INQUIRY_MESSAGE = `Hello ${config.agencyName}, I am browsing your listings and would like to make an inquiry.`;
  const href = generateWhatsAppLink(config.whatsappNumber, INQUIRY_MESSAGE);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-soft transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
