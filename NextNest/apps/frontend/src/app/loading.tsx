import * as React from "react";

export default function Loading(): React.JSX.Element {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-slate-600 font-medium">Loading ERP Control Plane...</div>
    </div>
  );
}

