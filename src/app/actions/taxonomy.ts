"use server";

import { createClient } from "@/lib/supabase/server";

export type TaxonomyTag = {
  value: string;
  label: string;
};

/**
 * Fetch active taxonomy tags for a given category.
 * Categories: 'dietary_tag', 'disease_tag', 'region_tag', 'disease', 'allergy'
 */
export async function getTaxonomyTags(category: string): Promise<TaxonomyTag[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("taxonomy_tags")
    .select("value, label")
    .eq("category", category)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

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
