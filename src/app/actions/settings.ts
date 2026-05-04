"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UserRole } from "@/lib/types/database";
import { revalidatePath } from "next/cache";

/**
 * Fetch all user profiles with their associated auth email.
 * This combines data from public.profiles and auth.users (via admin client).
 */
export async function getUsers() {
  const adminSupabase = createAdminClient();
  const supabase = await createClient();

  // Get all profiles from public schema
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (profileError) {
    console.error("Error fetching user profiles:", profileError);
    return { success: false, message: profileError.message };
  }

  // Get all users from auth schema to get emails
  const { data: { users }, error: authError } = await adminSupabase.auth.admin.listUsers();

  if (authError) {
    console.error("Error fetching auth users:", authError);
    return { success: false, message: authError.message };
  }

  // Combine profile and auth data
  const combinedUsers = profiles.map((profile) => {
    const authUser = users.find((u) => u.id === profile.id);
    return {
      ...profile,
      email: authUser?.email || "No email found",
      last_sign_in: authUser?.last_sign_in_at,
    };
  });

  return { success: true, data: combinedUsers };
}

/**
 * Invite a new user via email and assign them a role.
 */
export async function createUser(formData: FormData) {
  const adminSupabase = createAdminClient();
  
  const email = formData.get("email") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as UserRole;

  if (!email || !fullName || !role) {
    return { success: false, message: "Email, full name, and role are required." };
  }

  // Invite user via Supabase Auth
  const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
    data: {
      full_name: fullName,
      role: role,
    },
    // The trigger public.handle_new_user() in SQL handles profile creation
  });

  if (error) {
    console.error("Error inviting user:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/settings/users");
  return { success: true, data: data.user };
}

/**
 * Update a user's role.
 */
export async function updateUserRole(userId: string, role: UserRole) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user role:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/settings/users");
  return { success: true };
}

/**
 * Toggle user active status.
 */
export async function toggleUserActive(userId: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", userId);

  if (error) {
    console.error("Error toggling user status:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/settings/users");
  return { success: true };
}
