"use client";

import * as React from "react";
import { Button } from "@workspace/ui";
import { useSystemHealth } from "../api/use-system-health";

export function HealthStatusCard(): React.JSX.Element {
  const { data, isLoading, isError, refetch } = useSystemHealth();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">ERP Infrastructure Telemetry</h2>
          <p className="text-sm text-slate-500">
            Real-time readiness probe across Primary DB, Read Replicas, and Redis Cluster
          </p>
        </div>
        <Button onClick={() => void refetch()} size="sm" variant="outline">
          Refresh Probe
        </Button>
      </div>

      <div className="mt-4">
        {isLoading && <p className="text-sm text-slate-600">Checking cluster readiness...</p>}
        {isError && (
          <p className="text-sm font-medium text-red-600">
            Backend offline or unreachable (Run `pnpm infra:up` and `pnpm dev`)
          </p>
        )}
        {data !== undefined && (
          <dl className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-sm">
            <div>
              <dt className="text-slate-500">Postgres Primary (Write)</dt>
              <dd className="font-mono font-semibold uppercase text-slate-900">
                {data.checks.postgresWrite}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Postgres Replica (Read)</dt>
              <dd className="font-mono font-semibold uppercase text-slate-900">
                {data.checks.postgresRead}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Redis Stampede Guard</dt>
              <dd className="font-mono font-semibold uppercase text-slate-900">
                {data.checks.redis}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}

