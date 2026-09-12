import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "whatsapp" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-ink text-canvas hover:bg-ink-800 px-7 py-3.5 rounded text-sm font-semibold tracking-wide transition-colors duration-200",
  gold: "bg-[var(--brand-primary)] text-canvas hover:bg-[var(--brand-primary-hover)] px-7 py-3.5 rounded text-sm font-semibold tracking-wide transition-colors duration-200",
  outline:
    "border border-ink/20 text-ink hover:border-ink/40 hover:bg-ink/[0.02] px-7 py-3.5 rounded text-sm font-semibold transition-colors duration-200",
  whatsapp:
    "bg-whatsapp text-white hover:bg-whatsapp-700 px-6 py-3.5 rounded-lg font-semibold flex items-center gap-2 shadow-soft transition-colors duration-200",
  ghost:
    "text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink text-sm font-medium transition-colors duration-200",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(variantStyles[variant], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, type ButtonProps, type Variant };
