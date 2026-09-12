import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mockProperties } from "@/data/mockProperties";
import PropertyCard from "@/components/property/PropertyCard";

export default function FeaturedSection() {
  const featured = mockProperties.filter(
    (p) => p.buyOrRent === "Buy" && p.price >= 150000000
  );

  return (
    <section className="bg-canvas-muted py-28 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-primary)]">
              Handpicked for You
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium text-ink tracking-[-0.03em] md:text-4xl">
              Featured Residences
            </h2>
            <p className="mt-3 max-w-lg text-sm text-ink-700 leading-relaxed">
              Premium listings in Lagos and Abuja, curated by expert agents
              for discerning buyers.
            </p>
          </div>
          <Link
            href="/properties"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800 hover:text-ink transition-colors duration-200"
          >
            View All Properties
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.slice(0, 4).map((property) => (
            <PropertyCard key={property.id} property={property} featured />
          ))}
        </div>
      </div>
    </section>
  );
}
