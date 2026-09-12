"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X, Shield } from "lucide-react";
import { defaultAgencyConfig } from "@/config/agencyConfig";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Properties", href: "/properties" },
  { label: "Buy", href: "/properties?buyOrRent=Buy" },
  { label: "Rent", href: "/properties?buyOrRent=Rent" },
  { label: "Match Quiz", href: "/quiz" },
  { label: "Schedule Viewing", href: "/schedule" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const config = defaultAgencyConfig;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-20 transition-all duration-200",
          scrolled
            ? "bg-wine/95 backdrop-blur-[2px] border-b border-white/10"
            : "bg-wine border-b border-white/10"
        )}
      >
        <nav className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6 md:px-10 lg:px-16">
          <Link href="/" className="shrink-0">
            <span className="font-display text-xl font-medium text-white tracking-tight">
              {config.agencyName}
            </span>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium tracking-wide text-white/70 hover:text-white transition-colors duration-200 py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-cta transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <a
              href={`tel:${config.phone}`}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
            >
              {config.phone}
            </a>
            <Link
              href="/schedule"
              className="bg-cta text-white hover:bg-cta-700 px-7 py-3.5 rounded text-sm font-semibold tracking-wide transition-colors duration-200"
            >
              Book a Viewing
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 border border-white/20 text-white/70 hover:border-white/40 px-3 py-2 rounded text-xs font-semibold transition-colors duration-200"
            >
              <Shield className="h-3.5 w-3.5" />
              Agent
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <a
              href={`tel:${config.phone}`}
              className="flex h-10 w-10 items-center justify-center rounded border border-white/20 text-white"
              aria-label="Call"
            >
              <Phone className="h-4 w-4" />
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded border border-white/20 text-white"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen takeover */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-ink flex flex-col">
          <div className="flex h-16 items-center justify-between px-6">
            <span className="font-display text-lg font-medium text-canvas">
              {config.agencyName}
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex h-10 w-10 items-center justify-center text-canvas/70 hover:text-canvas transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-1 flex-col justify-center px-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-4 font-display text-4xl text-canvas hover:text-cta transition-colors duration-200"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-8 border-t border-canvas/10 pt-6 flex flex-col gap-3">
              <Link
                href="/schedule"
                onClick={() => setMobileOpen(false)}
                className="bg-cta text-white px-6 py-3.5 rounded text-sm font-semibold tracking-wide text-center"
              >
                Book a Viewing
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="border border-canvas/20 text-canvas px-6 py-3.5 rounded text-sm font-semibold text-center"
              >
                Agent Panel
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
