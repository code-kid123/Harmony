"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, SlidersHorizontal } from "lucide-react";
import { PropertyType } from "@/types";
import { defaultAgencyConfig } from "@/config/agencyConfig";

const LOCATIONS = [
  "Lekki Phase 1",
  "Lekki Phase 2",
  "Ikoyi",
  "Victoria Island",
  "Ikeja GRA",
  "Maitama",
];

const PROPERTY_TYPES: { label: string; value: PropertyType }[] = [
  { label: "Apartment", value: "apartment" },
  { label: "Duplex", value: "duplex" },
  { label: "Penthouse", value: "penthouse" },
  { label: "Mansion", value: "mansion" },
  { label: "Terrace", value: "terrace" },
];

const PRICE_PRESETS = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under \u20A610M", min: 0, max: 10000000 },
  { label: "\u20A610M \u2013 \u20A650M", min: 10000000, max: 50000000 },
  { label: "\u20A650M \u2013 \u20A6200M", min: 50000000, max: 200000000 },
  { label: "\u20A6200M \u2013 \u20A6500M", min: 200000000, max: 500000000 },
  { label: "Above \u20A6500M", min: 500000000, max: Infinity },
];

export default function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Buy" | "Rent">("Buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceIndex, setPriceIndex] = useState(0);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("buyOrRent", activeTab);
    if (location) params.set("location", location);
    if (propertyType) params.set("type", propertyType);
    const price = PRICE_PRESETS[priceIndex];
    if (price.min > 0) params.set("minPrice", String(price.min));
    if (price.max !== Infinity) params.set("maxPrice", String(price.max));
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative h-[86vh] min-h-[640px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/house%201.png')",
        }}
      />
      <div className="absolute inset-0 bg-ink-900/40" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6 pb-24 md:px-10 lg:px-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-canvas/60 font-body">
          {defaultAgencyConfig.agencyName}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-medium leading-[1.05] text-canvas tracking-[-0.03em] md:text-7xl">
          {"Discover Nigeria's Finest Residences"}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-canvas/70 font-body leading-relaxed">
          Verified luxury apartments, duplexes, and mansions in Lekki, Ikoyi,
          Victoria Island, and Abuja. Your perfect home awaits.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-1/2">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10 lg:px-16">
          <div className="rounded-xl bg-canvas p-3 shadow-lifted">
            <div className="flex border-b border-line pb-3 mb-3">
              <div className="inline-flex rounded-lg bg-canvas-muted p-1 border border-line">
                {(["Buy", "Rent"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-colors duration-200 ${
                      activeTab === tab
                        ? "bg-ink text-canvas"
                        : "text-ink-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4">
              <div className="flex items-center gap-2 border-0 border-r border-line px-5 py-3">
                <MapPin className="h-4 w-4 shrink-0 text-ink-700" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full appearance-none bg-transparent text-sm text-ink-700 outline-none"
                >
                  <option value="">All Locations</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 border-0 border-r border-line px-5 py-3">
                <Home className="h-4 w-4 shrink-0 text-ink-700" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full appearance-none bg-transparent text-sm text-ink-700 outline-none"
                >
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 border-0 border-line px-5 py-3 sm:border-r-0">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-ink-700" />
                <select
                  value={priceIndex}
                  onChange={(e) => setPriceIndex(Number(e.target.value))}
                  className="w-full appearance-none bg-transparent text-sm text-ink-700 outline-none"
                >
                  {PRICE_PRESETS.map((p, i) => (
                    <option key={p.label} value={i}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="px-3 py-3">
                <button
                  onClick={handleSearch}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-cta px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-cta-700"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-8 text-xs text-canvas/50">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          200+ Verified Listings
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          Trusted by 1,200+ Clients
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          Free VIP Inspections
        </span>
      </div>
    </section>
  );
}
