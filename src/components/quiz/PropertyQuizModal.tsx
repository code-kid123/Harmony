"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ShoppingCart,
  Key,
  MapPin,
  Home,
  Clock,
  User,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { BuyOrRent, PropertyType, Lead } from "@/types";
import { mockProperties } from "@/data/mockProperties";
import { formatPrice, generateWhatsAppLink } from "@/utils/formatters";
import { defaultAgencyConfig } from "@/config/agencyConfig";
import { useApp } from "@/context/AppContext";
import { insertRow } from "@/lib/supabase";

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

const TIMELINE_OPTIONS = [
  "Immediately",
  "Within 1-3 months",
  "Within 3-6 months",
  "Investing / Exploring",
];

interface QuizAnswers {
  intent: BuyOrRent | "";
  locations: string[];
  propertyType: PropertyType | "";
  minBedrooms: number;
  currency: string;
  minBudget: number;
  maxBudget: number;
  timeline: string;
}

const INITIAL: QuizAnswers = {
  intent: "",
  locations: [],
  propertyType: "",
  minBedrooms: 1,
  currency: "NGN",
  minBudget: 0,
  maxBudget: 0,
  timeline: "",
};

const BUDGET_PRESETS = [
  { label: "Under \u20A610M", min: 0, max: 10000000 },
  { label: "\u20A610M \u2013 \u20A650M", min: 10000000, max: 50000000 },
  { label: "\u20A650M \u2013 \u20A6200M", min: 50000000, max: 200000000 },
  { label: "\u20A6200M \u2013 \u20A6500M", min: 200000000, max: 500000000 },
  { label: "\u20A6500M+", min: 500000000, max: Infinity },
];

const STEPS = [
  { num: 1, label: "Intent" },
  { num: 2, label: "Location" },
  { num: 3, label: "Type" },
  { num: 4, label: "Budget" },
  { num: 5, label: "Timeline" },
];

export default function PropertyQuizModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addLead } = useApp();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [contactTime, setContactTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const matches = useMemo(() => {
    return mockProperties.filter((p) => {
      if (answers.intent && p.buyOrRent !== answers.intent) return false;
      if (
        answers.locations.length > 0 &&
        !answers.locations.includes(p.location.area)
      )
        return false;
      if (answers.propertyType && p.type !== answers.propertyType)
        return false;
      if (p.bedrooms < answers.minBedrooms) return false;
      if (answers.minBudget > 0 && p.price < answers.minBudget) return false;
      if (answers.maxBudget > 0 && answers.maxBudget !== Infinity && p.price > answers.maxBudget)
        return false;
      return true;
    });
  }, [answers]);

  const toggleLocation = (loc: string) => {
    setAnswers((prev) => ({
      ...prev,
      locations: prev.locations.includes(loc)
        ? prev.locations.filter((l) => l !== loc)
        : [...prev.locations, loc],
    }));
  };

  const canNext = () => {
    switch (step) {
      case 1:
        return answers.intent !== "";
      case 2:
        return answers.locations.length > 0;
      case 3:
        return answers.propertyType !== "";
      case 4:
        return true;
      case 5:
        return answers.timeline !== "";
      default:
        return true;
    }
  };

  const handleSubmitLead = async () => {
    const [first, ...rest] = fullName.trim().split(" ");
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      firstName: first || fullName,
      lastName: rest.join(" ") || "",
      email,
      phone,
      whatsappNumber: whatsapp || phone,
      source: "quiz",
      status: "new",
      budget: {
        min: answers.minBudget,
        max: answers.maxBudget,
        currency: answers.currency,
      },
      preferredLocations: answers.locations,
      preferredPropertyType: (answers.propertyType as PropertyType) || undefined,
      notes: `[Qualified via Quiz] Timeline: ${answers.timeline}. Intent: ${answers.intent}.`,
      interestedProperties: matches.map((m) => m.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addLead(lead);

    await insertRow("leads", {
      full_name: fullName.trim(),
      email,
      phone,
      whatsapp: whatsapp || phone,
      intent: answers.intent,
      budget_min: answers.minBudget,
      budget_max: answers.maxBudget,
      budget_currency: answers.currency,
      desired_location: answers.locations.join(", "),
      bedrooms: answers.minBedrooms,
      property_type: answers.propertyType || null,
      timeline: answers.timeline,
      status: "Qualified",
      source: "quiz",
      interested_properties: matches.map((m) => m.id),
    });

    setSubmitted(true);
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers(INITIAL);
    setFullName("");
    setEmail("");
    setPhone("");
    setWhatsapp("");
    setContactTime("");
    setSubmitted(false);
    onClose();
  };

  const handleBack = () => {
    if (submitted) {
      setSubmitted(false);
    } else if (step > 1) {
      setStep((s) => s - 1);
    } else {
      onClose();
    }
  };

  const whatsappLink = generateWhatsAppLink(
    defaultAgencyConfig.whatsappNumber,
    `Hello ${defaultAgencyConfig.agencyName}! I just completed the property match quiz and found ${matches.length} property/properties matching my criteria. I would like to discuss the next steps.`
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-4">
      <div className="relative flex w-full max-w-lg flex-col rounded-t-2xl bg-canvas-card shadow-lifted max-h-[90dvh] overflow-hidden sm:rounded-lg sm:max-h-[85vh]">
        {/* Drag handle */}
        <div className="flex justify-center pt-2 sm:hidden">
          <span className="h-1.5 w-10 rounded-full bg-ink/10" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              aria-label="Go back"
              className="flex shrink-0 items-center gap-1 rounded-full py-2.5 pl-2.5 pr-3.5 min-h-11 text-xs font-semibold text-ink-700 transition-colors hover:bg-canvas-muted active:bg-canvas-muted"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <div>
              <h2 className="text-lg font-bold text-ink">
                {submitted ? "You're All Set!" : "Find Your Perfect Property"}
              </h2>
              {!submitted && (
                <p className="mt-0.5 text-xs text-ink-700">
                  Step {step} of 5 &mdash; {STEPS[step - 1]?.label}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={resetQuiz}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-canvas-muted hover:text-ink active:bg-canvas-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div className="h-1 w-full bg-canvas-muted">
            <div
              className="h-full bg-[var(--brand-primary)] transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* --- STEP 1: Intent --- */}
          {step === 1 && !submitted && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-ink">
                Are you looking to buy or rent?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(["Buy", "Rent"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers((a) => ({ ...a, intent: opt }))}
                    className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all ${
                      answers.intent === opt
                        ? "border-[var(--brand-primary)] bg-gold-50 text-ink"
                        : "border-line text-ink-700 hover:border-ink/30"
                    }`}
                  >
                    {opt === "Buy" ? (
                      <ShoppingCart className="h-8 w-8" />
                    ) : (
                      <Key className="h-8 w-8" />
                    )}
                    <span className="text-sm font-semibold">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- STEP 2: Locations --- */}
          {step === 2 && !submitted && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-ink">
                Where do you want to live?
              </h3>
              <p className="text-xs text-ink-700">Select one or more areas</p>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => {
                  const active = answers.locations.includes(loc);
                  return (
                    <button
                      key={loc}
                      onClick={() => toggleLocation(loc)}
                      className={`inline-flex items-center gap-1.5 border border-line px-4 py-2 text-sm font-medium transition-all ${
                        active
                          ? "border-[var(--brand-primary)] bg-gold-50 text-ink"
                          : "border-line text-ink-700 hover:border-ink/30"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- STEP 3: Property Type & Bedrooms --- */}
          {step === 3 && !submitted && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-ink">
                  What type of property?
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {PROPERTY_TYPES.map((t) => {
                    const active = answers.propertyType === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() =>
                          setAnswers((a) => ({ ...a, propertyType: t.value }))
                        }
                        className={`flex items-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                          active
                            ? "border-[var(--brand-primary)] bg-gold-50 text-ink"
                            : "border-line text-ink-700 hover:border-ink/30"
                        }`}
                      >
                        <Home className="h-4 w-4" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink">
                  Minimum bedrooms
                </h3>
                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, minBedrooms: n }))
                      }
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-sm font-semibold transition-all ${
                        answers.minBedrooms === n
                          ? "border-[var(--brand-primary)] bg-gold-50 text-ink"
                          : "border-line text-ink-700 hover:border-ink/30"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- STEP 4: Budget --- */}
          {step === 4 && !submitted && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-ink">
                What is your budget?
              </h3>
              <p className="text-xs text-ink-700">
                All prices are in Nigerian Naira (&#8358;).
              </p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {BUDGET_PRESETS.map((preset) => {
                  const active =
                    answers.minBudget === preset.min &&
                    answers.maxBudget === preset.max;
                  return (
                    <button
                      key={preset.label}
                      onClick={() =>
                        setAnswers((a) => ({
                          ...a,
                          minBudget: preset.min,
                          maxBudget: preset.max,
                        }))
                      }
                      className={`rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                        active
                          ? "border-[var(--brand-primary)] bg-gold-50 text-ink"
                          : "border-line text-ink-700 hover:border-ink/30"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-ink-700">Min</label>
                  <input
                    type="number"
                    value={answers.minBudget || ""}
                    onChange={(e) =>
                      setAnswers((a) => ({
                        ...a,
                        minBudget: Number(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                    inputMode="numeric"
                    className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-[var(--brand-primary)]"
                  />
                </div>
                <span className="mt-4 text-ink-700/40">-</span>
                <div className="flex-1">
                  <label className="text-xs text-ink-700">Max</label>
                  <input
                    type="number"
                    value={answers.maxBudget || ""}
                    onChange={(e) =>
                      setAnswers((a) => ({
                        ...a,
                        maxBudget: Number(e.target.value) || 0,
                      }))
                    }
                    placeholder="No limit"
                    inputMode="numeric"
                    className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-[var(--brand-primary)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* --- STEP 5: Timeline --- */}
          {step === 5 && !submitted && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-ink">
                When do you plan to move?
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {TIMELINE_OPTIONS.map((opt) => {
                  const active = answers.timeline === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, timeline: opt }))
                      }
                      className={`flex items-center gap-3 rounded-lg border-2 px-5 py-4 text-left text-sm font-medium transition-all ${
                        active
                          ? "border-[var(--brand-primary)] bg-gold-50 text-ink"
                          : "border-line text-ink-700 hover:border-ink/30"
                      }`}
                    >
                      <Clock className="h-4 w-4 shrink-0" />
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- MATCH RESULTS + LEAD CAPTURE --- */}
          {submitted && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest/10">
                  <CheckCircle2 className="h-8 w-8 text-[var(--brand-primary)]" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-ink">
                  We matched{" "}
                  <span className="text-[var(--brand-primary)]">
                    {matches.length} propert{matches.length === 1 ? "y" : "ies"}
                  </span>{" "}
                  matching your criteria!
                </h3>
                <p className="mt-1 text-xs text-ink-700">
                  Your lead profile has been saved. Here are your next steps.
                </p>
              </div>

              {matches.length > 0 && (
                <div className="space-y-3">
                  {matches.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 rounded-lg border border-line bg-canvas-muted p-3"
                    >
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-canvas-muted">
                        <Image
                          src={p.images[0]}
                          alt={p.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">
                          {p.title}
                        </p>
                        <p className="text-xs text-ink-700">
                          {p.location.area} &middot; {p.bedrooms} Bed &middot;{" "}
                          {formatPrice(p.price, p.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {matches.length > 3 && (
                    <p className="text-center text-xs text-ink-700">
                      +{matches.length - 3} more matching properties
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Link
                  href={`/properties?buyOrRent=${answers.intent}&location=${answers.locations.join(",")}&type=${answers.propertyType}`}
                  onClick={resetQuiz}
                  className="flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-sm font-bold text-canvas transition-colors hover:bg-ink-800"
                  target="_blank"
                >
                  View Matched Listings
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={resetQuiz}
                  className="flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-6 py-3 text-sm font-bold text-canvas transition-colors hover:bg-whatsapp-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  Confirm on WhatsApp
                </a>
                <button
                  onClick={resetQuiz}
                  className="text-center text-xs font-medium text-ink-700/40 hover:text-ink-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with nav / lead form */}
        {!submitted && (
          <div className="border-t border-line px-6 py-4 safe-area-pb">
            {step === 5 && answers.timeline && (
              <div className="mb-4 space-y-3 rounded-lg border border-line bg-canvas-muted p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-700">
                  <Sparkles className="h-3.5 w-3.5 text-forest" />
                  Almost done &mdash; let us reach you
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-ink-700">Full Name</label>
                    <div className="mt-1 flex items-center gap-2 rounded-lg border border-line bg-canvas-card px-3">
                      <User className="h-3.5 w-3.5 text-ink-700" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                        placeholder="Adebayo Johnson"
                        className="w-full py-2 text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-ink-700">
                      Email Address
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-lg border border-line bg-canvas-card px-3">
                      <Mail className="h-3.5 w-3.5 text-ink-700" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@email.com"
                        className="w-full py-2 text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-ink-700">Phone Number</label>
                    <div className="mt-1 flex items-center gap-2 rounded-lg border border-line bg-canvas-card px-3">
                      <Phone className="h-3.5 w-3.5 text-ink-700" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="08177766115"
                        className="w-full py-2 text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-ink-700">
                      WhatsApp Number
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-lg border border-line bg-canvas-card px-3">
                      <MessageCircle className="h-3.5 w-3.5 text-ink-700" />
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        inputMode="tel"
                        placeholder="08177766115"
                        className="w-full py-2 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-ink-700">
                    Preferred Contact Time
                  </label>
                  <select
                    value={contactTime}
                    onChange={(e) => setContactTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-line bg-canvas-card px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)]"
                  >
                    <option value="">Select a time...</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening">Evening (4 PM - 7 PM)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1 text-sm font-medium text-ink-700 hover:text-ink-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-1 text-sm font-medium text-ink-700 hover:text-ink-700"
                >
                  <X className="h-4 w-4" />
                  Exit
                </button>
              )}

              {step < 5 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext()}
                  className="flex items-center gap-1 rounded-lg bg-ink px-5 py-2.5 text-sm font-bold text-canvas transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitLead}
                  disabled={
                    !fullName.trim() || !email.trim() || !phone.trim()
                  }
                  className="flex items-center gap-1.5 rounded-lg bg-ink px-5 py-2.5 text-sm font-bold text-canvas transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Sparkles className="h-4 w-4" />
                  See My Matches
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
