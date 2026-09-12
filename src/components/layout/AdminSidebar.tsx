"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, ExternalLink } from "lucide-react";
import { defaultAgencyConfig } from "@/config/agencyConfig";
import { cn } from "@/lib/utils";

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Public Site", href: "/properties", icon: ExternalLink },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const config = defaultAgencyConfig;

  return (
    <aside className="bg-ink-900 text-canvas/70 w-64 flex flex-col">
      <div className="px-6 py-6 border-b border-canvas/10">
        <span className="font-display text-lg text-canvas">{config.agencyName}</span>
      </div>

      <nav className="flex flex-col py-4">
        {adminLinks.map((link) => {
          const isActive =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-canvas/5 text-canvas border-l-2 border-[var(--brand-primary)]"
                  : "text-canvas/50 hover:text-canvas/70 border-l-2 border-transparent"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-canvas/10 px-6 py-4">
        <Link
          href="/"
          className="text-sm font-medium text-canvas/50 hover:text-canvas/70 transition-colors duration-200"
        >
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
