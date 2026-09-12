import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "verified" | "sale" | "rent" | "gold";
  className?: string;
}

const badgeStyles = {
  default:
    "bg-ink/85 text-canvas",
  verified:
    "bg-canvas/95 text-ink border border-line",
  sale:
    "bg-ink/85 text-canvas",
  rent:
    "bg-ink/85 text-canvas",
  gold:
    "bg-gold-600 text-canvas",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-semibold uppercase tracking-[0.14em]",
        badgeStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
