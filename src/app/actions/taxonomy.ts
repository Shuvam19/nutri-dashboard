"use server";

import { createClient } from "@/lib/supabase/server";
import { TaxonomyTagRow } from "@/lib/types";
import { revalidatePath } from "next/cache";

export type TaxonomyTag = {
  value: string;
  label: string;
};

/**
 * Fetch active taxonomy tags for a given category.
 * Categories: 'dietary_tag', 'disease_tag', 'region_tag', 'disease', 'allergy'
 */
export async function getTaxonomyTags(category: string, includeInactive = false): Promise<TaxonomyTagRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from("taxonomy_tags")
    .select("*")
    .eq("category", category);
    
  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query.order("sort_order", { ascending: true });

  if (error) {
    console.error(`Error fetching taxonomy tags for category "${category}":`, error);
    return [];
  }

  return data || [];
}

/**
 * Fetch multiple taxonomy categories in one call.
 * Returns an object keyed by category name.
 */
export async function getTaxonomyTagsBatch(
  categories: string[]
): Promise<Record<string, TaxonomyTag[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("taxonomy_tags")
    .select("category, value, label")
    .in("category", categories)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching taxonomy tags batch:", error);
    return Object.fromEntries(categories.map((c) => [c, []]));
  }

  // Group by category
  const result: Record<string, TaxonomyTag[]> = {};
  for (const cat of categories) {
    result[cat] = [];
  }
  for (const row of data || []) {
    const cat = row.category as string;
    if (result[cat]) {
      result[cat].push({ value: row.value, label: row.label });
    }
  }

  return result;
}

/**
 * Create a new taxonomy tag.
 */
export async function createTaxonomyTag(formData: FormData) {
  const supabase = await createClient();
  
  const category = formData.get("category") as string;
  const value = formData.get("value") as string;
  const label = formData.get("label") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);

  if (!category || !value || !label) {
    return { success: false, message: "Category, value, and label are required." };
  }

  const { error } = await supabase
    .from("taxonomy_tags")
    .insert({ category, value, label, sort_order });

  if (error) {
    console.error("Error creating taxonomy tag:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

/**
 * Update an existing taxonomy tag.
 */
export async function updateTaxonomyTag(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const label = formData.get("label") as string;
  const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);
  const is_active = formData.get("is_active") === "true";

  const { error } = await supabase
    .from("taxonomy_tags")
    .update({ label, sort_order, is_active })
    .eq("id", id);

  if (error) {
    console.error("Error updating taxonomy tag:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

/**
 * Delete a taxonomy tag.
 */
export async function deleteTaxonomyTag(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("taxonomy_tags")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting taxonomy tag:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

/**
 * Toggle the active state of a taxonomy tag.
 */
export async function toggleTaxonomyTag(id: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("taxonomy_tags")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    console.error("Error toggling taxonomy tag:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}
