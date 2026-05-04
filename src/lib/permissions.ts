import { UserRole } from "./types/database";

/**
 * Feature keys for Role-Based Access Control (RBAC).
 * These match the keys in the `role_permissions` table.
 */
export const FEATURES = {
  DASHBOARD_VIEW: "dashboard.view",
  CLIENTS_VIEW: "clients.view",
  CLIENTS_CREATE: "clients.create",
  CLIENTS_EDIT: "clients.edit",
  FOOD_BUCKET_VIEW: "food_bucket.view",
  FOOD_BUCKET_CREATE: "food_bucket.create",
  DIET_PLANS_VIEW: "diet_plans.view",
  DIET_PLANS_CREATE: "diet_plans.create",
  DIET_PLANS_EDIT: "diet_plans.edit",
  APPOINTMENTS_VIEW: "appointments.view",
  APPOINTMENTS_CREATE: "appointments.create",
  SETTINGS_VIEW: "settings.view",
} as const;

export type FeatureKey = typeof FEATURES[keyof typeof FEATURES];

/**
 * Maps feature keys to navigation items for sidebar filtering.
 */
export const FEATURE_NAV_MAP: Record<string, FeatureKey> = {
  "/": FEATURES.DASHBOARD_VIEW,
  "/clients": FEATURES.CLIENTS_VIEW,
  "/food-bucket": FEATURES.FOOD_BUCKET_VIEW,
  "/diet-plans": FEATURES.DIET_PLANS_VIEW,
  "/calendar": FEATURES.APPOINTMENTS_VIEW,
  "/settings": FEATURES.SETTINGS_VIEW,
};

/**
 * Check if a role is allowed to access a specific feature.
 * This is a client-side helper for UI logic.
 * Server-side checks should query the database.
 */
export function isFeatureAllowed(permissions: { feature: string; is_enabled: boolean }[], feature: string): boolean {
  const permission = permissions.find((p) => p.feature === feature);
  return permission ? permission.is_enabled : false;
}
