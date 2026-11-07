import * as React from "react";
import Link from "next/link";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-slate-900">404 - Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-500">
        The requested ERP platform resource does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Return to Control Plane
      </Link>
    </div>
  );
}

