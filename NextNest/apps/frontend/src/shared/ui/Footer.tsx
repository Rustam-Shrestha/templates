import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export interface FooterProps {
  brandName?: string;
  className?: string;
}

export function Footer({
  brandName = "NextNest",
  className = ""
}: FooterProps): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`w-full border-t border-slate-200 bg-white py-8 text-xs text-slate-500 mt-auto ${className}`.trim()}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-white">
              <Shield className="h-3 w-3" />
            </div>
            <span className="font-semibold text-slate-800">{brandName} Core ERP</span>
            <span className="text-slate-400">|</span>
            <span>Ledger, Lending & Compliance Engine</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Documentation
            </Link>
            <Link href="/api/docs" className="hover:text-slate-900 transition-colors">
              OpenAPI (Swagger)
            </Link>
            <span className="text-slate-400">&copy; {currentYear} NextNest Architecture. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

