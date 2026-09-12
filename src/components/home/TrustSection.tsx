import Link from "next/link";
import { ShieldCheck, Crown, MapPin, Users, Building2, BadgeCheck, ArrowRight } from "lucide-react";

const stats = [
  { icon: Building2, value: "200+", label: "Verified Listings" },
  { icon: Users, value: "1,200+", label: "Happy Clients" },
  { icon: MapPin, value: "6+", label: "Prime Locations" },
  { icon: BadgeCheck, value: "10+", label: "Years Experience" },
];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Verified Titles",
    description:
      "Every property goes through rigorous title verification. We only list properties with genuine documentation \u2014 Governor's Consent, C of O, and registered surveys.",
  },
  {
    icon: Crown,
    title: "VIP Inspection Tours",
    description:
      "Enjoy complimentary chauffeur-driven inspection tours of shortlisted properties. Our agents provide guided walkthroughs with honest, insider assessments.",
  },
  {
    icon: MapPin,
    title: "Local Market Authority",
    description:
      "Deep expertise across Lekki, Ikoyi, Victoria Island, Ikeja GRA, and Abuja. We know the neighbourhoods, the pricing trends, and the opportunities.",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-canvas py-28 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-lg border border-line bg-canvas-card p-6 text-center"
            >
              <stat.icon className="h-6 w-6 text-[var(--brand-primary)]" />
              <span className="mt-3 text-2xl font-semibold text-ink">{stat.value}</span>
              <span className="mt-1 text-xs text-ink-700 uppercase tracking-[0.14em] font-semibold">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-12 md:grid-cols-3">
          {trustPoints.map((point) => (
            <div key={point.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded border border-line bg-gold-50">
                <point.icon className="h-5 w-5 text-[var(--brand-primary)]" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-ink">{point.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 overflow-hidden rounded-lg bg-ink">
          <div className="relative flex flex-col items-center px-8 py-20 text-center sm:px-16">
            <div className="relative z-10">
              <h2 className="font-display text-3xl font-medium text-canvas tracking-[-0.03em]">
                Not Sure Where to Start?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-canvas/60 leading-relaxed">
                Answer a few quick questions and our smart matching system will
                pair you with properties that fit your lifestyle, budget, and
                location preferences perfectly.
              </p>
              <Link
                href="/quiz"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-cta px-8 py-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-cta-700"
              >
                Find My Perfect Property
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
