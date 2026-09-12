"use client";

import { useMemo, useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Home,
  DollarSign,
  Calendar,
  Clock,
  StickyNote,
  Save,
  Tag,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { defaultAgencyConfig } from "@/config/agencyConfig";
import { supabase, updateRow } from "@/lib/supabase";
import { formatPrice, generateWhatsAppLink } from "@/utils/formatters";
import { mockProperties } from "@/data/mockProperties";
import type { LeadStatus } from "@/types";

const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-700" },
  { value: "contacted", label: "Contacted", color: "bg-amber-100 text-amber-700" },
  { value: "viewing-scheduled", label: "Viewing Scheduled", color: "bg-canvas-muted text-ink" },
  { value: "converted", label: "Converted", color: "bg-forest/10 text-ink" },
  { value: "not-interested", label: "Not Interested", color: "bg-canvas-muted text-ink-700" },
];

function LeadsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { leads, viewingRequests, updateLead, setLeads } = useApp();

  const activeId = searchParams.get("id");
  const selectedLead = useMemo(
    () => leads.find((l) => l.id === activeId) || null,
    [leads, activeId]
  );

  const [agentNotes, setAgentNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [prevLeadId, setPrevLeadId] = useState<string | null>(null);

  if (selectedLead && selectedLead.id !== prevLeadId) {
    setPrevLeadId(selectedLead.id);
    const existing = selectedLead.notes.startsWith("[Agent Notes]")
      ? selectedLead.notes.replace("[Agent Notes] ", "")
      : "";
    setAgentNotes(existing);
    setNotesSaved(false);
  }

  useEffect(() => {
    async function fetchLeads() {
      if (!supabase) return;
      const { data } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const mapped = data.map((row) => ({
          id: row.id,
          firstName: (row.full_name || "").split(" ")[0] || "",
          lastName: (row.full_name || "").split(" ").slice(1).join(" ") || "",
          email: row.email || "",
          phone: row.phone || "",
          whatsappNumber: row.whatsapp || "",
          source: row.source || "other",
          status: row.status || "new",
          budget: row.budget_min != null ? {
            min: row.budget_min,
            max: row.budget_max ?? 0,
            currency: row.budget_currency || "NGN",
          } : undefined,
          preferredLocations: row.desired_location ? row.desired_location.split(", ") : [],
          preferredPropertyType: row.property_type || undefined,
          notes: row.notes || `[Qualified via Quiz] Timeline: ${row.timeline || ""}. Intent: ${row.intent || ""}.`,
          interestedProperties: row.interested_properties || [],
          createdAt: row.created_at || new Date().toISOString(),
          updatedAt: row.updated_at || new Date().toISOString(),
        }));
        setLeads(mapped);
      }
    }
    fetchLeads();
  }, [setLeads]);

  const saveNotes = useCallback(() => {
    if (!selectedLead) return;
    const prefix = agentNotes.trim()
      ? `[Agent Notes] ${agentNotes.trim()}`
      : selectedLead.notes.replace(/^\[Agent Notes\]\s*/, "");
    updateLead(selectedLead.id, { notes: prefix });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }, [selectedLead, agentNotes, updateLead]);

  const handleStatusChange = async (status: LeadStatus) => {
    if (!selectedLead) return;
    const previousStatus = selectedLead.status;
    updateLead(selectedLead.id, { status });
    if (status === previousStatus) return;
    await updateRow("leads", { status }, selectedLead.id);
  };

  const leadViewings = useMemo(
    () =>
      selectedLead
        ? viewingRequests.filter(
            (v) =>
              v.leadId === selectedLead.id ||
              selectedLead.interestedProperties.includes(v.propertyId)
          )
        : [],
    [selectedLead, viewingRequests]
  );

  const interestedPropertyData = useMemo(
    () =>
      selectedLead
        ? mockProperties.filter((p) => selectedLead.interestedProperties.includes(p.id))
        : [],
    [selectedLead]
  );

  const parseQuizData = (notes: string) => {
    const timeline = notes.match(/Timeline:\s*([^.]*)/)?.[1]?.trim() || "";
    const intent = notes.match(/Intent:\s*([^.]*)/)?.[1]?.trim() || "";
    const isQualified = notes.includes("[Qualified via Quiz]");
    return { timeline, intent, isQualified };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-line text-ink-700 hover:bg-canvas-muted active:bg-canvas-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-ink">Lead Management</h1>
          <p className="mt-0.5 text-sm text-ink-700">
            Select a lead to view full profile, notes, and inspection history.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* --- LEAD LIST PANEL --- */}
        <div className="rounded-lg border border-line bg-canvas-card">
          <div className="border-b border-line px-4 py-3">
            <h2 className="text-xs font-semibold text-ink">
              All Leads ({leads.length})
            </h2>
          </div>
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
            {leads.length === 0 ? (
              <div className="px-4 py-12 text-center text-xs text-ink-700">
                No leads yet.
              </div>
            ) : (
              leads.map((lead) => {
                const isActive = lead.id === activeId;
                const statusOpt =
                  STATUS_OPTIONS.find((s) => s.value === lead.status) ||
                  STATUS_OPTIONS[0];
                return (
                  <button
                    key={lead.id}
                    onClick={() => router.push(`/admin/leads?id=${lead.id}`)}
                    className={`flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "bg-gold-50"
                        : "hover:bg-canvas-muted"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas-muted text-xs font-semibold text-ink-700">
                      {lead.firstName?.[0] || "?"}
                      {lead.lastName?.[0] || ""}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {lead.firstName} {lead.lastName}
                      </p>
                      <p className="truncate text-[10px] text-ink-700">
                        {lead.email}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${statusOpt.color}`}
                    >
                      {statusOpt.label}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* --- LEAD DETAIL PANEL --- */}
        {!selectedLead ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-line bg-canvas-card text-sm text-ink-700">
            Select a lead from the list to view details.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Card */}
            <div className="rounded-lg border border-line bg-canvas-card p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-lg font-semibold text-ink">
                    {selectedLead.firstName?.[0] || "?"}
                    {selectedLead.lastName?.[0] || ""}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-ink">
                      {selectedLead.firstName} {selectedLead.lastName}
                    </h2>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleStatusChange(opt.value)}
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold transition-all ${
                            selectedLead.status === opt.value
                              ? `${opt.color} ring-2 ring-offset-1`
                              : "bg-canvas-muted text-ink-700 hover:bg-canvas-muted"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={generateWhatsAppLink(
                      selectedLead.whatsappNumber || selectedLead.phone,
                      `Hi ${selectedLead.firstName}, this is ${defaultAgencyConfig.agencyName} following up on your property inquiry.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-whatsapp px-3 py-2 text-xs font-semibold text-white hover:bg-whatsapp-700"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-700 hover:bg-canvas-muted"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </a>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-700 hover:bg-canvas-muted"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Contact */}
              <div className="rounded-lg border border-line bg-canvas-card p-4">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <Phone className="h-3.5 w-3.5 text-ink-700" />
                  Contact Details
                </h3>
                <div className="space-y-2 text-xs text-ink-700">
                  <p><span className="text-ink-700">Phone:</span> {selectedLead.phone}</p>
                  <p><span className="text-ink-700">WhatsApp:</span> {selectedLead.whatsappNumber || selectedLead.phone}</p>
                  <p><span className="text-ink-700">Email:</span> {selectedLead.email}</p>
                </div>
              </div>

              {/* Budget */}
              <div className="rounded-lg border border-line bg-canvas-card p-4">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <DollarSign className="h-3.5 w-3.5 text-ink-700" />
                  Target Budget
                </h3>
                {selectedLead.budget ? (
                  <div className="space-y-1 text-xs text-ink-700">
                    <p>
                      {formatPrice(selectedLead.budget.min, selectedLead.budget.currency)} —{" "}
                      {formatPrice(selectedLead.budget.max, selectedLead.budget.currency)}
                    </p>
                    <p className="text-[10px] text-ink-700">Currency: {selectedLead.budget.currency}</p>
                  </div>
                ) : (
                  <p className="text-xs text-ink-700">Not specified</p>
                )}
              </div>

              {/* Location & Type */}
              <div className="rounded-lg border border-line bg-canvas-card p-4">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <MapPin className="h-3.5 w-3.5 text-ink-700" />
                  Preferences
                </h3>
                <div className="space-y-2 text-xs text-ink-700">
                  <p>
                    <span className="text-ink-700">Locations:</span>{" "}
                    {selectedLead.preferredLocations.join(", ") || "None selected"}
                  </p>
                  <p>
                    <span className="text-ink-700">Property Type:</span>{" "}
                    {selectedLead.preferredPropertyType
                      ? selectedLead.preferredPropertyType.charAt(0).toUpperCase() +
                        selectedLead.preferredPropertyType.slice(1)
                      : "Any"}
                  </p>
                </div>
              </div>

              {/* Quiz Data */}
              <div className="rounded-lg border border-line bg-canvas-card p-4">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <Tag className="h-3.5 w-3.5 text-ink-700" />
                  Quiz Responses
                </h3>
                {(() => {
                  const quiz = parseQuizData(selectedLead.notes);
                  return quiz.isQualified ? (
                    <div className="space-y-2 text-xs text-ink-700">
                      <p><span className="text-ink-700">Intent:</span> {quiz.intent || "—"}</p>
                      <p><span className="text-ink-700">Timeline:</span> {quiz.timeline || "—"}</p>
                      <p><span className="text-ink-700">Source:</span> Matchmaker Quiz</p>
                    </div>
                  ) : (
                    <p className="text-xs text-ink-700">No quiz data — lead from direct inquiry.</p>
                  );
                })()}
              </div>

              {/* Source & Date */}
              <div className="rounded-lg border border-line bg-canvas-card p-4">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <Calendar className="h-3.5 w-3.5 text-ink-700" />
                  Lead Info
                </h3>
                <div className="space-y-2 text-xs text-ink-700">
                  <p>
                    <span className="text-ink-700">Source:</span>{" "}
                    <span className="capitalize">
                      {selectedLead.source === "quiz"
                        ? "Matchmaker Quiz"
                        : selectedLead.source === "property-detail"
                        ? "Property Detail Page"
                        : selectedLead.source.replace("-", " ")}
                    </span>
                  </p>
                  <p>
                    <span className="text-ink-700">Created:</span>{" "}
                    {new Date(selectedLead.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Interested Properties */}
            {interestedPropertyData.length > 0 && (
              <div className="rounded-lg border border-line bg-canvas-card p-5">
                <h3 className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <Home className="h-3.5 w-3.5 text-ink-700" />
                  Interested Properties ({interestedPropertyData.length})
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {interestedPropertyData.map((prop) => (
                    <Link
                      key={prop.id}
                      href={`/properties/${prop.slug || prop.id}`}
                      target="_blank"
                      className="flex items-center gap-3 rounded-lg border border-line p-3 hover:bg-canvas-muted"
                    >
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-canvas-muted">
                        <Image
                          src={prop.images[0]}
                          alt={prop.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-ink">
                          {prop.title}
                        </p>
                        <p className="text-[10px] text-ink-700">
                          {prop.location.area} · {formatPrice(prop.price, prop.currency)}
                        </p>
                      </div>
                      <Eye className="h-3.5 w-3.5 shrink-0 text-ink-700/40" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Viewings */}
            <div className="rounded-lg border border-line bg-canvas-card p-5">
              <h3 className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-ink">
                <Clock className="h-3.5 w-3.5 text-ink-700" />
                Inspection Schedule ({leadViewings.length})
              </h3>
              {leadViewings.length === 0 ? (
                <p className="text-xs text-ink-700">No viewing requests yet.</p>
              ) : (
                <div className="space-y-2">
                  {leadViewings.map((v) => {
                    const prop = mockProperties.find((p) => p.id === v.propertyId);
                    let meta: { inspectionType?: string } = {};
                    try {
                      meta = v.notes ? JSON.parse(v.notes) : {};
                    } catch {
                      meta = {};
                    }
                    return (
                      <div
                        key={v.id}
                        className="flex items-center justify-between rounded-lg border border-line px-4 py-3"
                      >
                        <div>
                          <p className="text-xs font-semibold text-ink">
                            {prop?.title || v.propertyId}
                          </p>
                          <p className="text-[10px] text-ink-700">
                            {meta.inspectionType === "virtual" ? "Virtual Tour" : "In-Person"} ·{" "}
                            {v.requestedDate} at {v.requestedTime}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            v.status === "confirmed"
                              ? "bg-forest/10 text-ink"
                              : v.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : v.status === "cancelled"
                              ? "bg-red-100 text-red-600"
                              : "bg-canvas-muted text-ink-700"
                          }`}
                        >
                          {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Agent Notes */}
            <div className="rounded-lg border border-line bg-canvas-card p-5">
              <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-ink">
                <StickyNote className="h-3.5 w-3.5 text-ink-700" />
                Internal Agent Notes
              </h3>
              <textarea
                value={agentNotes}
                onChange={(e) => {
                  setAgentNotes(e.target.value);
                  setNotesSaved(false);
                }}
                rows={4}
                placeholder="Add private notes about this lead (visible only to agents)..."
                className="w-full rounded-lg border border-line bg-canvas-muted px-3 py-2.5 text-xs text-ink-700 outline-none transition-colors placeholder:text-ink-700/40 focus:border-[var(--brand-primary)] focus:bg-canvas-card"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[10px] text-ink-700">
                  Notes are saved locally and visible only to agents.
                </p>
                <button
                  onClick={saveNotes}
                  className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-ink-800"
                >
                  {notesSaved ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Save Notes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-ink-700">Loading leads...</div>}>
      <LeadsContent />
    </Suspense>
  );
}