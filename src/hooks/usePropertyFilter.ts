"use client";

import { useState, useMemo, useCallback } from "react";
import { Property, BuyOrRent, PropertyType, PropertyFilter } from "@/types";

const INITIAL_FILTERS: PropertyFilter = {
  buyOrRent: "All",
  locations: [],
  propertyTypes: [],
  minPrice: 0,
  maxPrice: Infinity,
  minBedrooms: 0,
  maxBedrooms: 20,
  furnished: null,
};

export function usePropertyFilter(properties: Property[]) {
  const [filters, setFilters] = useState<PropertyFilter>(INITIAL_FILTERS);

  const setBuyOrRent = useCallback((value: BuyOrRent | "All") => {
    setFilters((prev) => ({ ...prev, buyOrRent: value }));
  }, []);

  const toggleLocation = useCallback((city: string) => {
    setFilters((prev) => ({
      ...prev,
      locations: prev.locations.includes(city)
        ? prev.locations.filter((l) => l !== city)
        : [...prev.locations, city],
    }));
  }, []);

  const togglePropertyType = useCallback((type: PropertyType) => {
    setFilters((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  }, []);

  const setPriceRange = useCallback((min: number, max: number) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  }, []);

  const setBedrooms = useCallback((min: number, max: number) => {
    setFilters((prev) => ({ ...prev, minBedrooms: min, maxBedrooms: max }));
  }, []);

  const setFurnished = useCallback((value: boolean | null) => {
    setFilters((prev) => ({ ...prev, furnished: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const availableAreas = useMemo(() => {
    const areas = new Set(properties.map((p) => p.location.area));
    return Array.from(areas).sort();
  }, [properties]);

  const priceBounds = useMemo(() => {
    if (properties.length === 0) return { min: 0, max: 0 };
    const prices = properties.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [properties]);

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      if (
        filters.buyOrRent !== "All" &&
        property.buyOrRent !== filters.buyOrRent
      ) {
        return false;
      }

      if (
        filters.locations.length > 0 &&
        !filters.locations.includes(property.location.area)
      ) {
        return false;
      }

      if (
        filters.propertyTypes.length > 0 &&
        !filters.propertyTypes.includes(property.type)
      ) {
        return false;
      }

      if (property.price < filters.minPrice) return false;
      if (filters.maxPrice !== Infinity && property.price > filters.maxPrice)
        return false;

      if (property.bedrooms < filters.minBedrooms) return false;
      if (property.bedrooms > filters.maxBedrooms) return false;

      if (filters.furnished !== null && property.furnished !== filters.furnished) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.buyOrRent !== "All") count++;
    if (filters.locations.length > 0) count += filters.locations.length;
    if (filters.propertyTypes.length > 0) count += filters.propertyTypes.length;
    if (filters.minPrice > 0 || filters.maxPrice !== Infinity) count++;
    if (filters.minBedrooms > 0 || filters.maxBedrooms < 20) count++;
    if (filters.furnished !== null) count++;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  return {
    filters,
    filtered,
    availableAreas,
    priceBounds,
    activeFilterCount,
    hasActiveFilters,
    setBuyOrRent,
    toggleLocation,
    togglePropertyType,
    setPriceRange,
    setBedrooms,
    setFurnished,
    resetFilters,
    setFilters,
  };
}
