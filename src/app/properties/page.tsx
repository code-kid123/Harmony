import { Suspense } from "react";
import PropertiesClient from "@/components/property/PropertiesClient";
import PropertyCard from "@/components/property/PropertyCard";
import { mockProperties } from "@/data/mockProperties";

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockProperties.slice(0, 4).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      }
    >
      <PropertiesClient />
    </Suspense>
  );
}