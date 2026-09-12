"use client";

import { type ReactNode } from "react";
import { AppProvider } from "@/context/AppContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
