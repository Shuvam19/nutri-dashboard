"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MealCategory } from "@/lib/types/database";

export async function createFoodAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  const dietary_tags = formData.getAll("dietary_tags") as string[];
  const diseaseTagsStr = formData.get("disease_tags") as string;
  const disease_tags = diseaseTagsStr ? JSON.parse(diseaseTagsStr) : [];
  
  const serving_size_amount = formData.get("serving_size_amount") as string;
  const serving_size_unit = formData.get("serving_size_unit") as string;

  const foodData = {
    name: formData.get("name") as string,
    category: formData.get("category") as MealCategory,
    serving_size: `${serving_size_amount} ${serving_size_unit}`,
    description: (formData.get("description") as string) || null,
    calories_per_serving: parseFloat(formData.get("calories_per_serving") as string),
    protein_g: parseFloat(formData.get("protein_g") as string),
    carbs_g: parseFloat(formData.get("carbs_g") as string),
    fat_g: parseFloat(formData.get("fat_g") as string),
    fiber_g: parseFloat((formData.get("fiber_g") as string) || "0"),
    dietary_tags,
    disease_tags,
    region_tags: [(formData.get("region_tags") as string)],
    created_by: user?.id,
  };

  const { error } = await supabase.from("food_items").insert(foodData);

  if (error) {
    console.error("Error creating food item:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/food-bucket");
  redirect("/food-bucket");
}

export type FoodFilters = {
  search?: string;
  dietary?: string; // comma separated
  disease?: string; // comma separated
  region?: string;
};

export async function getPaginatedFoods(page: number = 1, limit: number = 12, filters?: FoodFilters) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  let query = supabase
    .from("food_items")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }
  
  if (filters?.dietary) {
    const tags = filters.dietary.split(',');
    // supabase contains checks if array column contains all these elements
    query = query.contains("dietary_tags", tags);
  }
  
  if (filters?.disease) {
    const tags = filters.disease.split(',');
    query = query.contains("disease_tags", tags);
  }
  
  if (filters?.region && filters.region !== "All Regions") {
    query = query.contains("region_tags", [filters.region]);
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);
  
  if (error) {
    console.error("Error fetching foods:", error);
    return { data: [], count: 0 };
  }
  
  return { data, count: count || 0 };
}
