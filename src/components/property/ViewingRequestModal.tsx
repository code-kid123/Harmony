"use client";

import { useState } from "react";
import { X, Video, MapPin, Clock, User, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Property, Lead } from "@/types";
import { useApp } from "@/context/AppContext";
import { insertRow } from "@/lib/supabase";

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
];

export default function ViewingRequestModal({
  open, onClose, property,
}: { open: boolean; onClose: () => void; property: Property }) {
  const { addViewingRequest, addLead } = useApp();
  const [inspectionType, setInspectionType] = useState<"in-person" | "virtual">("in-person");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = name.trim() && phone.trim() && email.trim() && date && time;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const leadId = `lead-${Date.now()}`;
    const [first, ...rest] = name.trim().split(" ");
    const lead: Lead = {
      id: leadId,
      firstName: first || name,
      lastName: rest.join(" ") || "",
      email,
      phone,
      whatsappNumber: phone,
      source: "property-detail",
      status: "new",
      notes: `[Qualified via Inspection] Property: ${property.title}. Inspection type: ${inspectionType}.`,
      preferredLocations: [property.location.area],
      interestedProperties: [property.id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addLead(lead);

    const meta = { inspectionType, visitorName: name, visitorPhone: phone, visitorEmail: email, propertyRef: property.id, propertyTitle: property.title };
    addViewingRequest({
      id: `vr-${Date.now()}`, leadId, propertyId: property.id,
      requestedDate: date, requestedTime: time, status: "pending",
      notes: JSON.stringify(meta),
      createdAt: new Date().toISOString(),
    });

    await insertRow("viewing_requests", {
      property_id: property.id,
      visitor_name: name,
      visitor_phone: phone,
      visitor_email: email,
      requested_date: date,
      requested_time: time,
      inspection_type: inspectionType,
      status: "pending",
      property_title: property.title,
      lead_id: leadId,
    });

    setSubmitted(true);
  };

  const resetAndClose = () => {
    setInspectionType("in-person"); setDate(""); setTime(""); setName(""); setPhone(""); setEmail(""); setSubmitted(false); onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4">
      <div className="relative flex w-full max-w-md flex-col rounded-lg bg-canvas-card shadow-lifted max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-medium text-ink">Schedule a Viewing</h2>
            <p className="mt-0.5 truncate text-xs text-ink-700 max-w-[280px]">{property.title}</p>
          </div>
          <button onClick={resetAndClose} className="flex h-8 w-8 items-center justify-center rounded text-ink-700 hover:text-ink transition-colors duration-150">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {submitted ? (
            <div className="space-y-4 py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest/10">
                <CheckCircle2 className="h-8 w-8 text-forest" />
              </div>
              <h3 className="font-display text-lg font-medium text-ink">Viewing Request Received!</h3>
              <p className="text-sm text-ink-700">
                Our agent will confirm your {inspectionType === "virtual" ? "virtual tour" : "in-person inspection"} for <strong>{date}</strong> at <strong>{time}</strong> shortly.
              </p>
              <button onClick={resetAndClose} className="mt-2 rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-canvas transition-colors duration-200 hover:bg-ink-800">Done</button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-700">Inspection Type</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {(["in-person", "virtual"] as const).map((type) => (
                    <button key={type} onClick={() => setInspectionType(type)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors duration-150 ${inspectionType === type ? "border-[var(--brand-primary)] bg-gold-50 text-ink" : "border-line text-ink-700 hover:border-ink/30"}`}>
                      {type === "in-person" ? <MapPin className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                      {type === "in-person" ? "In-Person" : "Virtual Tour"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-700">Preferred Date</p>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} className="underline-input mt-2" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-700">Preferred Time</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button key={slot} onClick={() => setTime(slot)}
                      className={`flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${time === slot ? "border-[var(--brand-primary)] bg-gold-50 text-ink" : "border-line text-ink-700 hover:border-ink/30"}`}>
                      <Clock className="h-3 w-3" />{slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-700">Full Name</p>
                  <div className="mt-1 flex items-center gap-2"><User className="h-4 w-4 text-ink-700" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Adebayo Johnson" className="underline-input" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-700">Phone Number</p>
                  <div className="mt-1 flex items-center gap-2"><Phone className="h-4 w-4 text-ink-700" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08177766115" className="underline-input" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-700">Email Address</p>
                  <div className="mt-1 flex items-center gap-2"><Mail className="h-4 w-4 text-ink-700" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="underline-input" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!submitted && (
          <div className="border-t border-line px-6 py-4">
            <button onClick={handleSubmit} disabled={!canSubmit}
              className="w-full rounded-lg bg-ink py-3.5 text-sm font-semibold text-canvas transition-colors duration-200 hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40">
              Confirm Viewing Request
            </button>
            <button onClick={resetAndClose}
              className="mt-2 w-full text-center text-xs font-medium text-ink-700 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
