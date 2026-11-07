"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export interface BackToTopProps {
  threshold?: number;
  className?: string;
}

export function BackToTop({
  threshold = 300,
  className = ""
}: BackToTopProps): React.JSX.Element | null {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Scroll back to top"
      className={`fixed bottom-6 right-6 z-40 flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 animate-in fade-in ${className}`.trim()}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}

export default BackToTop;

