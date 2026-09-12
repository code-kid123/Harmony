"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  SlidersHorizontal,
  X,
  RotateCcw,
  BedDouble,
  Home,
  MapPin,
  Search,
} from "lucide-react";
import { mockProperties } from "@/data/mockProperties";
import { usePropertyFilter } from "@/hooks/usePropertyFilter";
import PropertyCard from "@/components/property/PropertyCard";
import type { PropertyType } from "@/types";

const PROPERTY_TYPES: { label: string; value: PropertyType }[] = [
  { label: "Apartment", value: "apartment" },
  { label: "Duplex", value: "duplex" },
  { label: "Penthouse", value: "penthouse" },
  { label: "Mansion", value: "mansion" },
  { label: "Terrace", value: "terrace" },
];

export default function PropertiesClient() {
  const searchParams = useSearchParams();
  const {
    filters,
    filtered,
    availableAreas,
    hasActiveFilters,
    setBuyOrRent,
    toggleLocation,
    togglePropertyType,
    setPriceRange,
    setBedrooms,
    resetFilters,
    setFilters,
  } = usePropertyFilter(mockProperties);

  useEffect(() => {
    const buyOrRent = searchParams.get("buyOrRent");
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    setFilters((prev) => {
      const next = { ...prev };
      if (buyOrRent === "Buy" || buyOrRent === "Rent") next.buyOrRent = buyOrRent;
      if (location) {
        next.locations = decodeURIComponent(location)
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean);
      }
      if (type) next.propertyTypes = [type as PropertyType];
      if (minPrice) next.minPrice = Number(minPrice);
      if (maxPrice) next.maxPrice = Number(maxPrice);
      return next;
    });
  }, [searchParams, setFilters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-700 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Home
      </Link>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tightest text-ink">Properties</h1>
          <p className="mt-1 text-sm text-ink-700">
            {filtered.length} propert{filtered.length === 1 ? "y" : "ies"} available
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs font-medium text-ink-700 hover:text-ink"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All Filters
          </button>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-line bg-canvas-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-line p-0.5">
            {(["All", "Buy", "Rent"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setBuyOrRent(opt)}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filters.buyOrRent === opt
                    ? "bg-ink text-canvas"
                    : "text-ink-700 hover:bg-canvas-muted"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-ink-700" />
            <div className="flex flex-wrap gap-1">
              {availableAreas.map((area) => {
                const active = filters.locations.includes(area);
                return (
                  <button
                    key={area}
                    onClick={() => toggleLocation(area)}
                    className={`rounded-md border px-3 py-2 text-xs font-medium transition-all active:scale-[0.98] ${
                      active
                        ? "border-[var(--brand-primary)] bg-gold-50 text-ink"
                        : "border-line text-ink-700 hover:border-ink/30"
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5 text-ink-700" />
            <div className="flex flex-wrap gap-1">
              {PROPERTY_TYPES.map((t) => {
                const active = filters.propertyTypes.includes(t.value);
                return (
                  <button
                    key={t.value}
                    onClick={() => togglePropertyType(t.value)}
                    className={`rounded-md border px-3 py-2 text-xs font-medium transition-all active:scale-[0.98] ${
                      active
                        ? "border-[var(--brand-primary)] bg-gold-50 text-ink"
                        : "border-line text-ink-700 hover:border-ink/30"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5 text-ink-700" />
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setBedrooms(n, 20)}
                  className={`flex h-7 w-7 items-center justify-center rounded text-[10px] font-semibold transition-all ${
                    filters.minBedrooms === n && filters.maxBedrooms === 20
                      ? "bg-ink text-canvas"
                      : "text-ink-700 hover:bg-canvas-muted"
                  }`}
                >
                  {n === 0 ? "Any" : `${n}+`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5 text-ink-700" />
            <select
              onChange={(e) => {
                const [min, max] = e.target.value.split(",").map(Number);
                setPriceRange(min || 0, max || Infinity);
              }}
              className="appearance-none rounded border border-line bg-canvas px-2 py-1.5 text-[10px] font-medium text-ink-700 outline-none"
              defaultValue="0,Infinity"
            >
              <option value="0,Infinity">Any Price</option>
              <option value="0,10000000">Under &#x20A6;10M</option>
              <option value="10000000,50000000">&#x20A6;10M &#x2013; &#x20A6;50M</option>
              <option value="50000000,200000000">&#x20A6;50M &#x2013; &#x20A6;200M</option>
              <option value="200000000,500000000">&#x20A6;200M &#x2013; &#x20A6;500M</option>
              <option value="500000000,Infinity">&#x20A6;500M+</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
            {filters.buyOrRent !== "All" && (
              <span className="inline-flex items-center gap-1 rounded bg-gold-50 px-2.5 py-0.5 text-[10px] font-semibold text-ink border border-[var(--brand-primary)]">
                {filters.buyOrRent}
                <button onClick={() => setBuyOrRent("All")} className="ml-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.locations.map((loc) => (
              <span
                key={loc}
                className="inline-flex items-center gap-1 rounded bg-canvas-muted px-2.5 py-0.5 text-[10px] font-semibold text-ink border border-line"
              >
                {loc}
                <button onClick={() => toggleLocation(loc)} className="ml-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.propertyTypes.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded bg-gold-50 px-2.5 py-0.5 text-[10px] font-semibold text-ink border border-[var(--brand-primary)] capitalize"
              >
                {t}
                <button onClick={() => togglePropertyType(t)} className="ml-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas-muted">
            <SlidersHorizontal className="h-6 w-6 text-ink-700" />
          </div>
          <h2 className="font-display text-lg font-medium text-ink">No Properties Found</h2>
          <p className="max-w-sm text-sm text-ink-700">
            Try adjusting your filters or{" "}
            <button onClick={resetFilters} className="font-semibold text-[var(--brand-primary)] hover:underline">
              clear all filters
            </button>{" "}
            to see all listings.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}