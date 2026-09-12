"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { Property, Lead, ViewingRequest, AgencyConfig } from "@/types";
import { defaultAgencyConfig } from "@/config/agencyConfig";

interface AppState {
  properties: Property[];
  leads: Lead[];
  viewingRequests: ViewingRequest[];
  agencyConfig: AgencyConfig;
}

interface AppContextValue extends AppState {
  setProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  removeProperty: (id: string) => void;

  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  removeLead: (id: string) => void;

  setViewingRequests: (requests: ViewingRequest[]) => void;
  addViewingRequest: (request: ViewingRequest) => void;
  updateViewingRequest: (
    id: string,
    updates: Partial<ViewingRequest>
  ) => void;
  removeViewingRequest: (id: string) => void;

  updateAgencyConfig: (updates: Partial<AgencyConfig>) => void;
}

const STORAGE_KEYS = {
  properties: "propertymatch_properties",
  leads: "propertymatch_leads",
  viewingRequests: "propertymatch_viewing_requests",
  agencyConfig: "propertymatch_agency_config",
} as const;

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`Failed to save ${key} to localStorage`);
  }
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [properties, setPropertiesState] = useState<Property[]>(() =>
    loadFromStorage<Property[]>(STORAGE_KEYS.properties, [])
  );
  const [leads, setLeadsState] = useState<Lead[]>(() =>
    loadFromStorage<Lead[]>(STORAGE_KEYS.leads, [])
  );
  const [viewingRequests, setViewingRequestsState] = useState<ViewingRequest[]>(
    () => loadFromStorage<ViewingRequest[]>(STORAGE_KEYS.viewingRequests, [])
  );
  const [agencyConfig, setAgencyConfigState] = useState<AgencyConfig>(() =>
    loadFromStorage<AgencyConfig>(STORAGE_KEYS.agencyConfig, defaultAgencyConfig)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.properties, properties);
  }, [properties]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.leads, leads);
  }, [leads]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.viewingRequests, viewingRequests);
  }, [viewingRequests]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.agencyConfig, agencyConfig);
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--brand-primary", agencyConfig.brandColor);
      document.documentElement.style.setProperty("--brand-primary-hover", agencyConfig.brandColor + "CC");
    }
  }, [agencyConfig]);

  const setProperties = useCallback((value: Property[]) => {
    setPropertiesState(value);
  }, []);

  const addProperty = useCallback((property: Property) => {
    setPropertiesState((prev) => [...prev, property]);
  }, []);

  const updateProperty = useCallback(
    (id: string, updates: Partial<Property>) => {
      setPropertiesState((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        )
      );
    },
    []
  );

  const removeProperty = useCallback((id: string) => {
    setPropertiesState((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setLeads = useCallback((value: Lead[]) => {
    setLeadsState(value);
  }, []);

  const addLead = useCallback((lead: Lead) => {
    setLeadsState((prev) => [...prev, lead]);
  }, []);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeadsState((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
      )
    );
  }, []);

  const removeLead = useCallback((id: string) => {
    setLeadsState((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const setViewingRequests = useCallback((value: ViewingRequest[]) => {
    setViewingRequestsState(value);
  }, []);

  const addViewingRequest = useCallback((request: ViewingRequest) => {
    setViewingRequestsState((prev) => [...prev, request]);
  }, []);

  const updateViewingRequest = useCallback(
    (id: string, updates: Partial<ViewingRequest>) => {
      setViewingRequestsState((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
    },
    []
  );

  const removeViewingRequest = useCallback((id: string) => {
    setViewingRequestsState((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateAgencyConfig = useCallback((updates: Partial<AgencyConfig>) => {
    setAgencyConfigState((prev) => ({ ...prev, ...updates }));
  }, []);

  const value: AppContextValue = {
    properties,
    leads,
    viewingRequests,
    agencyConfig,
    setProperties,
    addProperty,
    updateProperty,
    removeProperty,
    setLeads,
    addLead,
    updateLead,
    removeLead,
    setViewingRequests,
    addViewingRequest,
    updateViewingRequest,
    removeViewingRequest,
    updateAgencyConfig,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
