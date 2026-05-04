"use server";

import { createClient } from "@/lib/supabase/server";
import { UserRole, RolePermission } from "@/lib/types/database";
import { revalidatePath } from "next/cache";

/**
 * Fetch all permissions for all roles.
 */
export async function getRolePermissions(): Promise<RolePermission[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("role_permissions")
    .select("*")
    .order("feature", { ascending: true });

  if (error) {
    console.error("Error fetching role permissions:", error);
    return [];
  }

  return data || [];
}

/**
 * Update a specific role permission toggle.
 */
export async function updateRolePermission(role: UserRole, feature: string, isEnabled: boolean) {
  const supabase = await createClient();

  // Upsert the permission
  const { error } = await supabase
    .from("role_permissions")
    .upsert(
      { role, feature, is_enabled: isEnabled },
      { onConflict: "role, feature" }
    );

  if (error) {
    console.error("Error updating role permission:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/settings/roles");
  return { success: true };
}

/**
 * Get permissions for the current user's role.
 */
export async function getMyPermissions(): Promise<RolePermission[]> {
  const supabase = await createClient();

  // First get current user's role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) return [];

  // Get permissions for that role
  const { data: permissions, error } = await supabase
    .from("role_permissions")
    .select("*")
    .eq("role", profile.role);

  if (error) {
    console.error("Error fetching my permissions:", error);
    return [];
  }

  return permissions || [];
}
