"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { HealthStatusSchema, type HealthStatus } from "@workspace/contracts";
import { fetchWithContract } from "@/shared/api/http-client";

export function useSystemHealth(): UseQueryResult<HealthStatus> {
  return useQuery({
    queryKey: ["system-health", "ready"],
    queryFn: () =>
      fetchWithContract("/health/ready", {
        schema: HealthStatusSchema
      })
  });
}

