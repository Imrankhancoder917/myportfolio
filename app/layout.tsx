import type { Metadata } from "next";
import "./globals.css";
import Layout from "./layout-wrapper";
import { SITE_CONFIG } from "@/lib/constants/config";

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  authors: [{ name: SITE_CONFIG.author }],
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-900 text-white">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
