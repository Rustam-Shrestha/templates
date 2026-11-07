import * as React from "react";
import { HealthStatusCard } from "@/features/system-health/ui/health-status-card";

export default function HomePage(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Enterprise ERP Control Plane
        </h1>
        <p className="text-sm text-slate-600">
          Hexagonal Domain Core + Feature-Sliced Architecture Baseline
        </p>
      </header>
      <HealthStatusCard />
    </main>
  );
}

