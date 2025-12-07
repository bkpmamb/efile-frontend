// app/layout.tsx

import "./globals.css";
import ClientProviders from "./ClientProviders";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "E-File System - Balkesmas Ambarawa",
    template: "%s | E-File Balkesmas Ambarawa",
  },
  description:
    "Sistem Manajemen File Elektronik Internal Balkesmas Ambarawa. Platform aman untuk penyimpanan dan pengelolaan dokumen pribadi karyawan dengan kontrol akses individual.",
  keywords: [
    "e-file",
    "balkesmas ambarawa",
    "sistem file elektronik",
    "manajemen dokumen",
    "file karyawan",
    "dokumen internal",
    "balkesmas",
    "ambarawa",
  ],
  authors: [
    {
      name: "Balkesmas Ambarawa",
      url: "https://balkesambarawa.dinkesjatengprov.go.id/",
    },
  ],
  creator: "Balkesmas Ambarawa IT Team",
  publisher: "Balkesmas Ambarawa",
  robots: {
    index: false, // Jangan diindex search engine (internal only)
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXTAUTH_URL || "https://efile-beryl.vercel.app",
    title: "E-File System - Balkesmas Ambarawa",
    description:
      "Sistem Manajemen File Elektronik Internal untuk karyawan Balkesmas Ambarawa",
    siteName: "E-File Balkesmas Ambarawa",
  },
  twitter: {
    card: "summary",
    title: "E-File System - Balkesmas Ambarawa",
    description: "Sistem Manajemen File Elektronik Internal Balkesmas Ambarawa",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  applicationName: "E-File Balkesmas Ambarawa",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "E-File Balkesmas",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
