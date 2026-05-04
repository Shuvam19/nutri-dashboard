"use client";

import React, { useState } from "react";
import { UserRole, RolePermission } from "@/lib/types/database";
import { FEATURES } from "@/lib/permissions";
import { updateRolePermission } from "@/app/actions/permissions";

interface RolePermissionMatrixProps {
  initialPermissions: RolePermission[];
}

export default function RolePermissionMatrix({ initialPermissions }: RolePermissionMatrixProps) {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [isPending, setIsPending] = useState(false);

  // Group features by category for better UI
  const featureGroups = [
    {
      title: "Core Navigation",
      features: [
        { key: FEATURES.DASHBOARD_VIEW, label: "Access Dashboard" },
        { key: FEATURES.SETTINGS_VIEW, label: "Access System Settings" },
      ]
    },
    {
      title: "Client Management",
      features: [
        { key: FEATURES.CLIENTS_VIEW, label: "View Client List" },
        { key: FEATURES.CLIENTS_CREATE, label: "Register New Clients" },
        { key: FEATURES.CLIENTS_EDIT, label: "Edit Client Profiles" },
      ]
    },
    {
      title: "Clinical Planning",
      features: [
        { key: FEATURES.FOOD_BUCKET_VIEW, label: "Access Food Database" },
        { key: FEATURES.FOOD_BUCKET_CREATE, label: "Manage Food Items" },
        { key: FEATURES.DIET_PLANS_VIEW, label: "View Diet Plans" },
        { key: FEATURES.DIET_PLANS_CREATE, label: "Create New Plans" },
        { key: FEATURES.DIET_PLANS_EDIT, label: "Modify Existing Plans" },
      ]
    },
    {
      title: "Consultations",
      features: [
        { key: FEATURES.APPOINTMENTS_VIEW, label: "View Calendar" },
        { key: FEATURES.APPOINTMENTS_CREATE, label: "Schedule Appointments" },
      ]
    }
  ];

  const roles: UserRole[] = ["admin", "consultant", "receptionist"];

  const getPermission = (role: UserRole, feature: string) => {
    return permissions.find(p => p.role === role && p.feature === feature)?.is_enabled ?? true;
  };

  const handleToggle = async (role: UserRole, feature: string, currentState: boolean) => {
    if (role === "admin") return; // Admin always enabled

    setIsPending(true);
    const newState = !currentState;
    
    // Optimistic update
    setPermissions(prev => {
      const exists = prev.find(p => p.role === role && p.feature === feature);
      if (exists) {
        return prev.map(p => (p.role === role && p.feature === feature) ? { ...p, is_enabled: newState } : p);
      } else {
        return [...prev, { id: "temp", role, feature, is_enabled: newState, updated_at: new Date().toISOString() }];
      }
    });

    const result = await updateRolePermission(role, feature, newState);
    if (!result.success) {
      // Revert on error
      setPermissions(prev => prev.map(p => (p.role === role && p.feature === feature) ? { ...p, is_enabled: currentState } : p));
      alert("Failed to update permission: " + result.message);
    }
    setIsPending(false);
  };

  return (
    <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant">
            <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant w-1/2">Feature Area / Permission</th>
            {roles.map(role => (
              <th key={role} className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center capitalize">
                {role}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {featureGroups.map(group => (
            <React.Fragment key={group.title}>
              <tr className="bg-surface-container/50">
                <td colSpan={4} className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-primary/70">
                  {group.title}
                </td>
              </tr>
              {group.features.map(feature => (
                <tr key={feature.key} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-on-surface">{feature.label}</div>
                    <div className="text-[10px] font-mono text-outline uppercase">{feature.key}</div>
                  </td>
                  {roles.map(role => {
                    const isEnabled = getPermission(role, feature.key);
                    const isAdmin = role === "admin";
                    
                    return (
                      <td key={role} className="px-6 py-4 text-center">
                        <button
                          disabled={isPending || isAdmin}
                          onClick={() => handleToggle(role, feature.key, isEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            isEnabled ? "bg-primary" : "bg-outline/30"
                          } ${isAdmin ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isEnabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
