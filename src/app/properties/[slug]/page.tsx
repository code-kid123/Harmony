"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Bath,
  Car,
  Ruler,
  FileText,
  MapPin,
  MessageCircle,
  Calendar,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Phone,
  ShieldCheck,
  Zap,
  Waves,
  Lock,
  Dumbbell,
  ChefHat,
  TreePine,
  Wifi,
  Snowflake,
} from "lucide-react";
import { mockProperties } from "@/data/mockProperties";
import { formatPrice, generateWhatsAppLink } from "@/utils/formatters";
import { defaultAgencyConfig } from "@/config/agencyConfig";
import ViewingRequestModal from "@/components/property/ViewingRequestModal";

function getAmenityIcon(feature: string) {
  const lower = feature.toLowerCase();
  if (lower.includes("power") || lower.includes("generator")) return Zap;
  if (lower.includes("pool")) return Waves;
  if (lower.includes("security") || lower.includes("cctv")) return ShieldCheck;
  if (lower.includes("lock") || lower.includes("safe")) return Lock;
  if (lower.includes("gym") || lower.includes("fitness")) return Dumbbell;
  if (lower.includes("park") || lower.includes("garage")) return Car;
  if (lower.includes("kitchen") || lower.includes("fitted")) return ChefHat;
  if (lower.includes("garden") || lower.includes("compound")) return TreePine;
  if (lower.includes("wifi") || lower.includes("internet")) return Wifi;
  if (lower.includes("ac") || lower.includes("air") || lower.includes("cool"))
    return Snowflake;
  return Check;
}

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const property = mockProperties.find(
    (p) => p.slug === slug || p.id === slug,
  );

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [viewingOpen, setViewingOpen] = useState(false);

  if (!property) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-display text-2xl text-ink">Property Not Found</h1>
        <p className="text-sm text-ink-700">
          The property you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/properties"
          className="rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-ink/90"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  const whatsappMsg = `Hello ${defaultAgencyConfig.agencyName}, I am inquiring about ${property.title} listed at ${formatPrice(property.price, property.currency)}.`;
  const whatsappHref = generateWhatsAppLink(
    defaultAgencyConfig.whatsappNumber,
    whatsappMsg
  );

  const bookingHref = generateWhatsAppLink(
    defaultAgencyConfig.whatsappNumber,
    `Hello ${defaultAgencyConfig.agencyName}, I would like to book an inspection of "${property.title}" listed at ${formatPrice(property.price, property.currency)}. Please share available slots.`
  );

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryIndex((i) => (i === 0 ? property.images.length - 1 : i - 1));
  };
  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryIndex((i) => (i === property.images.length - 1 ? 0 : i + 1));
  };

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-10 lg:px-16">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-1.5 text-xs text-ink-700">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-ink">Properties</Link>
          <span>/</span>
          <span className="max-w-[200px] truncate text-ink">{property.title}</span>
        </nav>

        {/* Title row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-medium tracking-[-0.03em] text-ink">
                {property.title}
              </h1>
              {property.buyOrRent === "Buy" && property.price >= 300000000 && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  Premium
                </span>
              )}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-700">
              <MapPin className="h-3.5 w-3.5" />
              {property.location.address}, {property.location.area},{" "}
              {property.location.city}, {property.location.state}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-700 transition-colors hover:bg-canvas-muted">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>
        </div>

        {/* ───── GALLERY ───── */}
        <div className="mt-7 grid grid-cols-1 gap-2 overflow-hidden rounded-lg lg:grid-cols-4 lg:grid-rows-2">
          {/* Main image */}
          <button
            onClick={() => { setGalleryIndex(0); setGalleryOpen(true); }}
            className="relative col-span-1 row-span-2 aspect-[4/3] overflow-hidden bg-canvas-muted lg:col-span-2 lg:aspect-auto"
          >
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
              unoptimized
            />
          </button>
          {/* Thumbnails */}
          {property.images.slice(1, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => { setGalleryIndex(i + 1); setGalleryOpen(true); }}
              className="relative hidden aspect-[16/10] overflow-hidden bg-canvas-muted lg:block"
            >
              <Image
                src={img}
                alt={`${property.title} photo ${i + 2}`}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
                unoptimized
              />
              {i === 2 && property.images.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink/60 text-sm font-semibold text-canvas">
                  +{property.images.length - 4} more
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ───── CONTENT + SIDEBAR ───── */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Left content */}
          <div className="space-y-10">
            {/* Specs bar */}
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-line bg-canvas-muted p-4 sm:grid-cols-5">
              <div className="flex flex-col items-center gap-1 text-center">
                <Bed className="h-5 w-5 text-[var(--brand-primary)]" />
                <span className="text-sm font-semibold text-ink">{property.bedrooms}</span>
                <span className="text-[10px] text-ink-700">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <Bath className="h-5 w-5 text-[var(--brand-primary)]" />
                <span className="text-sm font-semibold text-ink">{property.bathrooms}</span>
                <span className="text-[10px] text-ink-700">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <Car className="h-5 w-5 text-[var(--brand-primary)]" />
                <span className="text-sm font-semibold text-ink">2</span>
                <span className="text-[10px] text-ink-700">Car Parks</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <Ruler className="h-5 w-5 text-[var(--brand-primary)]" />
                <span className="text-sm font-semibold text-ink">
                  {property.sizeSqFt.toLocaleString()}
                </span>
                <span className="text-[10px] text-ink-700">Sq. Ft.</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <FileText className="h-5 w-5 text-[var(--brand-primary)]" />
                <span className="text-sm font-semibold text-ink">Title</span>
                <span className="text-[10px] text-ink-700">Governor&apos;s Consent</span>
              </div>
            </div>

            {/* Property type & status */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold capitalize">
                {property.type}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                property.buyOrRent === "Buy"
                  ? "bg-ink/5 text-ink"
                  : "bg-gold/10 text-gold"
              }`}>
                For {property.buyOrRent}
              </span>
              {property.furnished && (
                <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                  Furnished
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-xl text-ink">About This Property</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                {property.description}
              </p>
            </div>

            {/* Amenities checklist */}
            <div>
              <h2 className="font-display text-xl text-ink">Key Features &amp; Amenities</h2>
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {property.features.map((feat) => {
                  const AmenityIcon = getAmenityIcon(feat);
                  return (
                    <div
                      key={feat}
                      className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2.5"
                    >
                      <AmenityIcon className="h-4 w-4 shrink-0 text-gold" />
                      <span className="text-sm text-ink-700">{feat}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agent card */}
            <div className="rounded-lg border border-line p-5">
              <h2 className="font-display text-xl text-ink">Your Agent</h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-canvas-muted">
                  <Image
                    src={property.agent.avatar}
                    alt={property.agent.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-medium text-ink">{property.agent.name}</p>
                  <p className="text-xs text-ink-700">{defaultAgencyConfig.agencyName} Agent</p>
                </div>
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-700 transition-colors hover:bg-canvas-muted"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call
                </a>
              </div>
            </div>
          </div>

          {/* ───── SIDEBAR ───── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-line bg-canvas-card p-6 shadow-card">
              {/* Price */}
              <div className="text-center">
                <span className="font-display text-3xl text-ink">
                  {formatPrice(property.price, property.currency)}
                </span>
                {property.buyOrRent === "Rent" && (
                  <span className="text-sm font-normal text-ink-700"> /year</span>
                )}
              </div>

              {/* Quick facts */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
                <div className="text-center">
                  <span className="text-xs text-ink-700">Type</span>
                  <p className="text-xs font-semibold text-ink capitalize">
                    {property.type}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-xs text-ink-700">Beds</span>
                  <p className="text-xs font-semibold text-ink">
                    {property.bedrooms}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-xs text-ink-700">Size</span>
                  <p className="text-xs font-semibold text-ink">
                    {property.sizeSqFt.toLocaleString()} sqft
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-5 space-y-3">
                <a
                  href={bookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-cta py-3.5 text-sm font-semibold text-white transition-colors hover:bg-cta-700"
                >
                  <Calendar className="h-4 w-4" />
                  Book Inspection on WhatsApp
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-whatsapp py-3.5 text-sm font-semibold text-white transition-colors hover:bg-whatsapp/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Direct Agent WhatsApp Inquiry
                </a>
                <button
                  onClick={() => setViewingOpen(true)}
                  className="w-full text-center text-xs font-medium text-ink-700 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink"
                >
                  Prefer a form? Request a callback instead
                </button>
              </div>

              {/* Micro-details */}
              <div className="mt-5 space-y-2.5 border-t border-line pt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-700">Property Ref</span>
                  <span className="font-mono font-semibold text-ink">
                    {property.id.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-700">Status</span>
                  <span className="font-semibold text-forest capitalize">
                    {property.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-700">Listed</span>
                  <span className="text-ink-700">
                    {new Date(property.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── FULLSCREEN GALLERY MODAL ───── */}
      {galleryOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setGalleryOpen(false)}
        >
          <button
            onClick={() => setGalleryOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={prevImg}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-canvas/10 text-white hover:bg-canvas/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            className="relative h-[70vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={property.images[galleryIndex]}
              alt={`${property.title} — Photo ${galleryIndex + 1}`}
              fill
              sizes="80vw"
              className="object-contain"
              unoptimized
            />
          </div>

          <button
            onClick={nextImg}
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-canvas/10 text-white hover:bg-canvas/20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5">
            {property.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setGalleryIndex(i); }}
                className={`h-2 rounded-full transition-all ${
                  i === galleryIndex ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ───── VIEWING REQUEST MODAL ───── */}
      <ViewingRequestModal
        open={viewingOpen}
        onClose={() => setViewingOpen(false)}
        property={property}
      />
    </>
  );
}
