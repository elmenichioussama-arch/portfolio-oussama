import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const description =
  "Portfolio d'Oussama El Menichi, ingénieur en automatisation, instrumentation, DCS, SCADA et intelligence industrielle.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "oussama-el-menichi-ic.chatgpt.team";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "Oussama El Menichi — Ingénieur I&C",
      template: "%s — Oussama El Menichi"
    },
    description,
    keywords: [
      "automatisation industrielle",
      "DCS",
      "SCADA",
      "instrumentation",
      "Honeywell Experion PKS",
      "Yokogawa CENTUM VP",
      "ingénieur contrôle commande"
    ],
    authors: [{ name: "Oussama El Menichi" }],
    icons: {
      icon: "/assets/img/profile-0.jpg",
      shortcut: "/assets/img/profile-0.jpg"
    },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: metadataBase,
      siteName: "Oussama El Menichi — Portfolio I&C",
      title: "Oussama El Menichi — Ingénieur I&C",
      description,
      images: [
        {
          url: "/og.png",
          width: 1731,
          height: 909,
          alt: "Oussama El Menichi — Ingénieur I&C"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "Oussama El Menichi — Ingénieur I&C",
      description,
      images: ["/og.png"]
    }
  };
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
