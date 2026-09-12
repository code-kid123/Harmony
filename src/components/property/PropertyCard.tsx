"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Ruler, MessageCircle, ChevronLeft, ChevronRight, Eye, ShieldCheck } from "lucide-react";
import { Property } from "@/types";
import { formatPrice, generateWhatsAppLink } from "@/utils/formatters";
import { defaultAgencyConfig } from "@/config/agencyConfig";

export default function PropertyCard({
  property,
  featured = false,
}: {
  property: Property;
  featured?: boolean;
}) {
  const [imgIndex, setImgIndex] = useState(0);

  const whatsappMsg = `Hello, I am interested in "${property.title}" listed at ${formatPrice(property.price, property.currency)} on ${defaultAgencyConfig.agencyName}. Please share more details.`;
  const whatsappHref = generateWhatsAppLink(defaultAgencyConfig.whatsappNumber, whatsappMsg);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i === 0 ? property.images.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i === property.images.length - 1 ? 0 : i + 1));
  };

  return (
    <article className="group bg-canvas-card rounded-lg overflow-hidden border border-line hover:shadow-card transition-shadow duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images[imgIndex]}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          unoptimized
        />

        <div className="absolute top-4 left-4 bg-canvas/95 backdrop-blur-[1px] text-[11px] font-semibold uppercase tracking-[0.14em] px-3 py-1.5 rounded-sm text-ink flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-gold" /> Verified
        </div>
        <span className="absolute top-4 right-4 bg-ink/85 text-canvas text-[11px] font-semibold px-3 py-1.5 rounded-sm">
          {property.buyOrRent === "Buy" ? "For Sale" : "For Rent"}
        </span>

        {featured && (
          <span className="absolute top-14 left-4 bg-gold-600 text-canvas text-[11px] font-semibold uppercase tracking-[0.14em] px-3 py-1.5 rounded-sm">
            Featured
          </span>
        )}

        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-canvas/85 shadow-soft transition-all duration-200 hover:bg-canvas active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 text-ink" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-canvas/85 shadow-soft transition-all duration-200 hover:bg-canvas active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 text-ink" />
        </button>

        <div className="absolute bottom-3 right-3 flex gap-1">
          {property.images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === imgIndex ? "w-4 bg-canvas" : "w-1.5 bg-canvas/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 space-y-3">
        <p className="font-display text-2xl text-ink tracking-tight">
          {formatPrice(property.price, property.currency)}
          {property.buyOrRent === "Rent" && (
            <span className="text-sm font-body font-normal text-ink-700"> /yr</span>
          )}
        </p>
        <h3 className="font-body font-medium text-ink-800">
          {property.bedrooms} Bed {property.title.split(" ").slice(1).join(" ")}
        </h3>
        <div className="flex items-center gap-4 text-sm text-ink-700 pt-3 border-t border-line">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" />{property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4" />{property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4" />{property.sizeSqFt.toLocaleString()}m&sup2;
          </span>
        </div>
        <div className="flex gap-2 pt-1">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-whatsapp px-3 py-3 text-xs font-semibold text-white transition-colors duration-200 hover:bg-whatsapp-700 active:bg-whatsapp-700"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <Link
            href={`/properties/${property.slug || property.id}`}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-ink/10 px-3 py-3 text-xs font-semibold text-ink-700 transition-colors duration-200 hover:border-ink/30 active:bg-canvas-muted"
          >
            <Eye className="h-3.5 w-3.5" />
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
