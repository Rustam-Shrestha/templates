import * as React from "react";
import type { Metadata } from "next";
import { AppQueryProvider } from "@/shared/state/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enterprise ERP Platform",
  description: "High-reliability distributed ERP system"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AppQueryProvider>{children}</AppQueryProvider>
      </body>
    </html>
  );
}

