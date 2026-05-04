"use client";

import React, { useEffect, useState } from "react";
import { getMyPermissions } from "@/app/actions/permissions";
import { RolePermission } from "@/lib/types/database";

interface RequirePermissionProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Client-side component that conditionally renders children based on user permissions.
 * It fetches the user's permissions once and then provides checking logic.
 */
export default function RequirePermission({ feature, children, fallback = null }: RequirePermissionProps) {
  const [permissions, setPermissions] = useState<RolePermission[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const perms = await getMyPermissions();
      setPermissions(perms);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return null; // Or a skeleton

  const isEnabled = permissions?.find(p => p.feature === feature)?.is_enabled ?? true;

  if (!isEnabled) return <>{fallback}</>;

  return <>{children}</>;
}
