"use client";

import { useState } from "react";
import {
 Save,
 RotateCcw,
 Download,
 Upload,
 Building2,
 Phone,
 MessageCircle,
 Mail,
 MapPin,
 Globe,
 DollarSign,
 CheckCircle2,
 Palette,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { defaultAgencyConfig } from "@/config/agencyConfig";
import type { AgencyConfig } from "@/types";

export default function AdminSettingsPage() {
 const { agencyConfig, updateAgencyConfig } = useApp();
 const [form, setForm] = useState<AgencyConfig>({ ...agencyConfig });
 const [saved, setSaved] = useState(false);
 const [resetConfirm, setResetConfirm] = useState(false);

 const update = <K extends keyof AgencyConfig>(key: K, value: AgencyConfig[K]) => {
  setForm((prev) => ({ ...prev, [key]: value }));
  setSaved(false);
 };

 const handleSave = () => {
  updateAgencyConfig(form);
  setSaved(true);
  setTimeout(() => setSaved(false), 2500);
 };

 const handleReset = () => {
  setForm({ ...defaultAgencyConfig });
  updateAgencyConfig({ ...defaultAgencyConfig });
  setResetConfirm(false);
  setSaved(true);
  setTimeout(() => setSaved(false), 2500);
 };

 const handleExport = () => {
  const blob = new Blob([JSON.stringify(form, null, 2)], {
   type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `primenest-config-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
 };

 const handleImport = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
   const file = (e.target as HTMLInputElement).files?.[0];
   if (!file) return;
   const reader = new FileReader();
   reader.onload = (ev) => {
    try {
     const data = JSON.parse(ev.target?.result as string) as Partial<AgencyConfig>;
     setForm((prev) => ({ ...prev, ...data }));
     setSaved(false);
    } catch {
     alert("Invalid JSON file.");
    }
   };
   reader.readAsText(file);
  };
  input.click();
 };

 return (
  <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
   {/* Header */}
   <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
     <h1 className="text-2xl font-semibold text-ink">Agency Settings</h1>
     <p className="mt-1 text-sm text-ink-700">
      Customize branding, contact details, and currency — changes apply site-wide in real time.
     </p>
    </div>
    <div className="flex gap-2">
     <button
      onClick={() => setResetConfirm(true)}
      className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-700 hover:bg-canvas-muted"
     >
      <RotateCcw className="h-3.5 w-3.5" />
      Reset to Defaults
     </button>
     <button
      onClick={handleExport}
      className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-700 hover:bg-canvas-muted"
     >
      <Download className="h-3.5 w-3.5" />
      Export Config
     </button>
     <button
      onClick={handleImport}
      className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-700 hover:bg-canvas-muted"
     >
      <Upload className="h-3.5 w-3.5" />
      Import
     </button>
    </div>
   </div>

   <div className="mt-8 space-y-8">
    {/* --- AGENCY INFO --- */}
    <section className="rounded-lg border border-line bg-canvas-card p-6 ">
     <div className="flex items-center gap-2 mb-5">
      <Building2 className="h-4 w-4 text-ink-700" />
      <h2 className="text-sm font-semibold text-ink">Agency Information</h2>
     </div>

     <div className="grid gap-5 sm:grid-cols-2">
      {/* Agency Name */}
      <div>
       <label className="text-xs font-semibold text-ink-700">
        Agency Name
       </label>
       <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-canvas-card px-3 focus-within:border-[var(--brand-primary)]">
        <Building2 className="h-4 w-4 text-ink-700" />
        <input
         type="text"
         value={form.agencyName}
         onChange={(e) => update("agencyName", e.target.value)}
         className="w-full bg-transparent py-2.5 text-sm text-ink-700 outline-none"
         placeholder={defaultAgencyConfig.agencyName}
        />
       </div>
      </div>

      {/* Brand Color */}
      <div>
       <label className="text-xs font-semibold text-ink-700">
        Brand Color
       </label>
       <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-canvas-card px-3 focus-within:border-[var(--brand-primary)]">
        <Palette className="h-4 w-4 text-ink-700" />
        <input
         type="color"
         value={form.brandColor}
         onChange={(e) => update("brandColor", e.target.value)}
         className="h-8 w-8 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
        />
        <input
         type="text"
         value={form.brandColor}
         onChange={(e) => update("brandColor", e.target.value)}
         className="w-full bg-transparent py-2.5 text-sm text-ink-700 outline-none font-mono"
         placeholder="#0f766e"
        />
       </div>
      </div>

      {/* Phone */}
      <div>
       <label className="text-xs font-semibold text-ink-700">
        Contact Phone
       </label>
       <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-canvas-card px-3 focus-within:border-[var(--brand-primary)]">
        <Phone className="h-4 w-4 text-ink-700" />
        <input
         type="tel"
         value={form.phone}
         onChange={(e) => update("phone", e.target.value)}
         className="w-full bg-transparent py-2.5 text-sm text-ink-700 outline-none"
         placeholder="08177766115"
        />
       </div>
      </div>

      {/* WhatsApp */}
      <div>
       <label className="text-xs font-semibold text-ink-700">
        WhatsApp Number
       </label>
       <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-canvas-card px-3 focus-within:border-[var(--brand-primary)]">
        <MessageCircle className="h-4 w-4 text-ink-700" />
        <input
         type="tel"
         value={form.whatsappNumber}
         onChange={(e) => update("whatsappNumber", e.target.value)}
         className="w-full bg-transparent py-2.5 text-sm text-ink-700 outline-none"
         placeholder="08177766115"
        />
       </div>
      </div>

      {/* Email */}
      <div>
       <label className="text-xs font-semibold text-ink-700">
        Email Address
       </label>
       <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-canvas-card px-3 focus-within:border-[var(--brand-primary)]">
        <Mail className="h-4 w-4 text-ink-700" />
        <input
         type="email"
         value={form.email}
         onChange={(e) => update("email", e.target.value)}
         className="w-full bg-transparent py-2.5 text-sm text-ink-700 outline-none"
         placeholder="info@primenestrealty.com"
        />
       </div>
      </div>

      {/* Office Address */}
      <div>
       <label className="text-xs font-semibold text-ink-700">
        Physical Office Address
       </label>
       <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-canvas-card px-3 focus-within:border-[var(--brand-primary)]">
        <MapPin className="h-4 w-4 text-ink-700" />
        <input
         type="text"
         value={form.officeAddress}
         onChange={(e) => update("officeAddress", e.target.value)}
         className="w-full bg-transparent py-2.5 text-sm text-ink-700 outline-none"
         placeholder="Lekki Phase 1, Lagos, Nigeria"
        />
       </div>
      </div>

      {/* Default City */}
      <div>
       <label className="text-xs font-semibold text-ink-700">
        Primary City
       </label>
       <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-canvas-card px-3 focus-within:border-[var(--brand-primary)]">
        <Globe className="h-4 w-4 text-ink-700" />
        <input
         type="text"
         value={form.defaultCity}
         onChange={(e) => update("defaultCity", e.target.value)}
         className="w-full bg-transparent py-2.5 text-sm text-ink-700 outline-none"
         placeholder="Lagos"
        />
       </div>
      </div>

      {/* Country */}
      <div>
       <label className="text-xs font-semibold text-ink-700">
        Country
       </label>
       <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-canvas-card px-3 focus-within:border-[var(--brand-primary)]">
        <Globe className="h-4 w-4 text-ink-700" />
        <input
         type="text"
         value={form.country}
         onChange={(e) => update("country", e.target.value)}
         className="w-full bg-transparent py-2.5 text-sm text-ink-700 outline-none"
         placeholder="Nigeria"
        />
       </div>
      </div>
     </div>
    </section>

    {/* --- CURRENCY SELECTOR --- */}
    <section className="rounded-lg border border-line bg-canvas-card p-6 ">
     <div className="flex items-center gap-2 mb-5">
      <DollarSign className="h-4 w-4 text-ink-700" />
      <h2 className="text-sm font-semibold text-ink">Global Currency</h2>
      <span className="ml-auto rounded-full bg-gold-50 px-2 py-0.5 text-[10px] font-semibold text-ink">
       Live Preview
      </span>
     </div>
     <p className="mb-4 text-xs text-ink-700">
      All prices across the site are displayed in Nigerian Naira (NGN). This
      currency is fixed and cannot be changed.
     </p>

     <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
      <div className="flex flex-col items-center gap-1.5 rounded-lg border-2 border-[var(--brand-primary)] bg-gold-50 p-4">
       <span className="text-lg font-semibold text-ink">&#8358;</span>
       <span className="text-xs font-semibold text-[var(--brand-primary)]">
        NGN
       </span>
       <span className="text-[10px] text-ink-700">Nigerian Naira</span>
       <CheckCircle2 className="mt-1 h-4 w-4 text-forest" />
      </div>
     </div>
    </section>

    {/* --- LIVE PREVIEW --- */}
    <section className="rounded-lg border border-line bg-canvas-card p-6 ">
     <h2 className="mb-4 text-sm font-semibold text-ink">
      Branding Preview
     </h2>
     <div className="flex flex-col gap-4 rounded-lg border border-line bg-canvas-muted p-5 sm:flex-row sm:items-center">
      <div
       className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-white text-lg font-semibold"
       style={{ backgroundColor: form.brandColor }}
      >
       {form.agencyName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()}
      </div>
      <div className="flex-1">
       <p className="text-sm font-semibold text-ink">{form.agencyName}</p>
       <p className="mt-0.5 text-xs text-ink-700">
        {form.officeAddress}
       </p>
       <p className="mt-0.5 text-xs text-ink-700">
        {form.phone} &middot; {form.email}
       </p>
      </div>
      <div className="flex gap-2">
       <div
        className="rounded-lg px-4 py-2 text-xs font-semibold text-white"
        style={{ backgroundColor: form.brandColor }}
       >
        Book a Consultation
       </div>
       <a
        href={`https://wa.me/${form.whatsappNumber.replace(/[^0-9]/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 rounded-lg bg-whatsapp px-3 py-2 text-xs font-semibold text-white"
       >
        <MessageCircle className="h-3.5 w-3.5" />
        WhatsApp
       </a>
      </div>
     </div>
    </section>

    {/* --- SAVE BAR --- */}
    <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-line bg-canvas-card/90 py-4 ">
     {saved && (
      <span className="flex items-center gap-1 text-xs font-medium text-[var(--brand-primary)]">
       <CheckCircle2 className="h-3.5 w-3.5" />
       Saved successfully
      </span>
     )}
     <button
      onClick={handleSave}
      className="flex items-center gap-1.5 rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
     >
      <Save className="h-4 w-4" />
      Save Settings
     </button>
    </div>
   </div>

    {/* --- RESET CONFIRM MODAL --- */}
   {resetConfirm && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4">
     <div className="w-full max-w-sm rounded-lg bg-canvas-card p-6 shadow-lifted">
      <h3 className="text-lg font-semibold text-ink">Reset to Defaults?</h3>
      <p className="mt-2 text-sm text-ink-700">
       This will overwrite all current settings with the factory defaults
        ({defaultAgencyConfig.agencyName}). This action cannot be undone.
      </p>
      <div className="mt-6 flex gap-3">
       <button
        onClick={() => setResetConfirm(false)}
        className="flex-1 rounded-lg border border-line py-2.5 text-sm font-medium text-ink-700 hover:bg-canvas-muted"
       >
        Cancel
       </button>
       <button
        onClick={handleReset}
        className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
       >
        Reset All
       </button>
      </div>
     </div>
    </div>
   )}
  </div>
 );
}
