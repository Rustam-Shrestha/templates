"use client";

import React, { createContext, useContext } from "react";

export interface CanContextType {
  roles: string[];
  permissions: string[];
  isSuperUser?: boolean;
}

const CanContext = createContext<CanContextType>({
  roles: [],
  permissions: [],
  isSuperUser: false
});

export const CanProvider = CanContext.Provider;

export function useCan(): {
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (perm: string | string[]) => boolean;
  isSuperUser: boolean;
} {
  const ctx = useContext(CanContext);

  const hasRole = (role: string | string[]): boolean => {
    if (ctx.isSuperUser) return true;
    const targetRoles = Array.isArray(role) ? role : [role];
    return targetRoles.some((r) => ctx.roles.includes(r));
  };

  const hasPermission = (perm: string | string[]): boolean => {
    if (ctx.isSuperUser) return true;
    const targetPerms = Array.isArray(perm) ? perm : [perm];
    return targetPerms.some((p) => ctx.permissions.includes(p));
  };

  return {
    hasRole,
    hasPermission,
    isSuperUser: Boolean(ctx.isSuperUser)
  };
}

export interface CanProps {
  perm?: string | string[];
  role?: string | string[];
  behavior?: "hide" | "disable";
  fallback?: React.ReactNode;
  disabledTooltip?: string;
  children: React.ReactNode;
}

export const Can = React.memo(function Can({
  perm,
  role,
  behavior = "hide",
  fallback = null,
  disabledTooltip,
  children
}: CanProps): React.JSX.Element | null {
  const { hasRole, hasPermission, isSuperUser } = useCan();

  if (isSuperUser) {
    return <>{children}</>;
  }

  const roleAllowed = role ? hasRole(role) : true;
  const permAllowed = perm ? hasPermission(perm) : true;
  const isAllowed = roleAllowed && permAllowed;

  if (isAllowed) {
    return <>{children}</>;
  }

  if (behavior === "disable") {
    return (
      <span
        className="inline-block cursor-not-allowed opacity-50 pointer-events-none"
        title={disabledTooltip ?? "Permission required"}
      >
        {children}
      </span>
    );
  }

  return <>{fallback}</>;
});

export default Can;

