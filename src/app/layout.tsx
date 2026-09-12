import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "Harmony Gardens | Luxury Properties & Estates",
  description:
    "Find verified luxury apartments, duplexes, and mansions in Lekki, Ikoyi, Victoria Island, Ikeja GRA, and Abuja. Harmony Gardens connects you with Nigeria's finest properties.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-full flex flex-col font-body text-ink bg-canvas">
        <ClientProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </ClientProviders>
      </body>
    </html>
  );
}
