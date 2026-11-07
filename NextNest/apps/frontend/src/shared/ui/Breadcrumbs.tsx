"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumbs({
  items,
  showHome = true,
  className = ""
}: BreadcrumbsProps): React.JSX.Element {
  const pathname = usePathname();

  const resolvedItems: BreadcrumbItem[] = React.useMemo(() => {
    if (items && items.length > 0) {
      return items;
    }
    if (!pathname || pathname === "/") {
      return [];
    }

    const segments = pathname.split("/").filter(Boolean);
    return segments.map((seg, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      const label = seg
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      return { label, href };
    });
  }, [items, pathname]);

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-slate-500 ${className}`.trim()}>
      <ol className="flex items-center space-x-1.5 flex-wrap">
        {showHome && (
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}

        {resolvedItems.map((item, index) => {
          const isLast = index === resolvedItems.length - 1;
          const showSeparator = showHome || index > 0;

          return (
            <React.Fragment key={item.href || index}>
              {showSeparator && (
                <li aria-hidden="true" className="text-slate-400">
                  <ChevronRight className="h-3 w-3" />
                </li>
              )}
              <li className="inline-flex items-center">
                {isLast || !item.href ? (
                  <span className="font-semibold text-slate-900" aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;

