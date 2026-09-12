import { cn } from "@/lib/utils";

type PillVariant =
  | "new"
  | "contacted"
  | "qualified"
  | "won"
  | "lost"
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

const pillStyles: Record<PillVariant, string> = {
  new: "bg-ink/5 text-ink border border-ink/10",
  contacted: "bg-gold-50 text-gold-700 border border-gold-600/20",
  qualified: "bg-forest/10 text-forest border border-forest/20",
  won: "bg-forest text-white border border-forest",
  lost: "bg-ink/5 text-ink-700 line-through decoration-ink-700/40 border border-ink/10",
  pending: "bg-gold-50 text-gold-700 border border-gold-600/20",
  confirmed: "bg-forest/10 text-forest border border-forest/20",
  cancelled: "bg-ink/5 text-ink-700 border border-ink/10",
  completed: "bg-forest text-white border border-forest",
};

export function StatusPill({
  variant,
  children,
  className,
}: {
  variant: PillVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        pillStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
