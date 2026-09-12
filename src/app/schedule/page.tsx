"use client";

import {
  CalendarCheck,
  ArrowRight,
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { defaultAgencyConfig } from "@/config/agencyConfig";
import { generateWhatsAppLink } from "@/utils/formatters";

export default function SchedulePage() {
  const agencyName = defaultAgencyConfig.agencyName;

  const whatsappLink = generateWhatsAppLink(
    defaultAgencyConfig.whatsappNumber,
    `Hello ${agencyName}, I would like to schedule a property viewing. Please contact me with available slots.`
  );

  const inPersonLink = generateWhatsAppLink(
    defaultAgencyConfig.whatsappNumber,
    `Hello ${agencyName}, I would like to book an in-person property inspection. Please contact me with available slots and locations.`
  );

  const virtualLink = generateWhatsAppLink(
    defaultAgencyConfig.whatsappNumber,
    `Hello ${agencyName}, I would like to book a virtual live tour of your properties. Please contact me with available times.`
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-ink-700 transition-colors hover:text-ink active:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Home
      </Link>

      <div className="mt-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50">
          <CalendarCheck className="h-7 w-7 text-[var(--brand-primary)]" />
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">
          Schedule a Viewing
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-ink-700">
          Book a private inspection of any property on our platform. Choose
          between an in-person walkthrough or a virtual live tour with one of our
          expert agents.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {/* In-Person */}
        <div className="rounded-lg border border-line bg-canvas-card p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
            <MapPin className="h-5 w-5 text-[var(--brand-primary)]" />
          </div>
          <h2 className="mt-4 text-base font-bold text-ink">
            In-Person Inspection
          </h2>
          <p className="mt-2 text-xs text-ink-700">
            Visit the property with one of our agents. We provide
            chauffeur-driven tours across all locations in Lagos and Abuja.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-ink-700">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
              Guided walkthrough with expert agent
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
              Free pickup from your location
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
              60–90 minute detailed inspection
            </li>
          </ul>
          <a
            href={inPersonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg bg-cta py-3 text-sm font-bold text-white transition-colors hover:bg-cta-700"
          >
            Book In-Person
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Virtual Tour */}
        <div className="rounded-lg border border-line bg-canvas-card p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
            <Clock className="h-5 w-5 text-[var(--brand-primary)]" />
          </div>
          <h2 className="mt-4 text-base font-bold text-ink">
            Virtual Live Tour
          </h2>
          <p className="mt-2 text-xs text-ink-700">
            Join a live video call with our agent who will walk you through the
            property in real time from anywhere in the world.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-ink-700">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
              Live WhatsApp or Zoom walkthrough
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
              Perfect for overseas buyers
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
              Q&A session with the agent
            </li>
          </ul>
          <a
            href={virtualLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg border border-cta/40 py-3 text-sm font-bold text-cta transition-colors hover:bg-cta hover:text-white"
          >
            Book Virtual Tour
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Quick Contact */}
      <div className="mt-10 flex flex-col items-center gap-4 rounded-lg border border-line bg-canvas-muted p-6 text-center sm:flex-row sm:text-left">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-ink">Prefer to speak directly?</h3>
          <p className="mt-1 text-xs text-ink-700">
            Call us at {defaultAgencyConfig.phone} or message us on WhatsApp — we
            respond within minutes during business hours.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`tel:${defaultAgencyConfig.phone}`}
            className="flex min-h-11 items-center gap-1.5 rounded-lg border border-line bg-canvas-card px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted active:bg-canvas-muted"
          >
            <Phone className="h-3.5 w-3.5" />
            Call Now
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center gap-1.5 rounded-lg bg-whatsapp px-4 py-2.5 text-xs font-semibold text-canvas transition-colors hover:bg-whatsapp-700 active:bg-whatsapp-700"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
