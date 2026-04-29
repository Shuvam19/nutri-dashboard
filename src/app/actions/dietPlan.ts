"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MealSlot, PlanStatus } from "@/lib/types/database";

export async function searchFoodItems(query: string) {
  const supabase = await createClient();
  
  let q = supabase.from("food_items").select("*").eq("is_active", true);
  if (query) {
    q = q.ilike("name", `%${query}%`);
  }
  
  const { data, error } = await q.order("name").limit(20);
  
  if (error) {
    console.error("Error searching foods:", error);
    return [];
  }
  return data;
}

export async function getClientsList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id, full_name")
    .order("full_name");
    
  if (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
  return data;
}

export interface SaveMealPayload {
  day_number: number;
  meal_type: MealSlot;
  food_item_id: string;
  quantity: number;
  sort_order: number;
}

export async function saveDietPlan(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, message: "Unauthorized" };
  }
  
  const clientId = formData.get("client_id") as string;
  const title = formData.get("title") as string;
  const totalDays = parseInt(formData.get("total_days") as string, 10);
  const mealsJson = formData.get("meals") as string;
  
  if (!title || !mealsJson) {
    return { success: false, message: "Missing required fields" };
  }
  
  let meals: SaveMealPayload[] = [];
  try {
    meals = JSON.parse(mealsJson);
  } catch (e) {
    return { success: false, message: "Invalid meals data" };
  }
  
  if (meals.length === 0) {
    return { success: false, message: "A plan must have at least one meal." };
  }
  
  // 1. Insert the Diet Plan
  const planData = {
    client_id: clientId || null,
    created_by: user.id,
    title,
    total_days: totalDays || 7,
    status: "active" as PlanStatus,
  };
  
  const { data: plan, error: planError } = await supabase
    .from("diet_plans")
    .insert(planData)
    .select()
    .single();
    
  if (planError || !plan) {
    console.error("Error saving plan:", planError);
    return { success: false, message: planError?.message || "Failed to save plan" };
  }
  
  // 2. Insert the meals
  const mealRecords = meals.map(m => ({
    ...m,
    diet_plan_id: plan.id,
  }));
  
  const { error: mealsError } = await supabase
    .from("diet_plan_meals")
    .insert(mealRecords);
    
  if (mealsError) {
    console.error("Error saving meals:", mealsError);
    return { success: false, message: mealsError.message };
  }
  
  revalidatePath("/diet-plans");
  redirect("/diet-plans");
}

export async function getDietPlanById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("diet_plans")
    .select(`
      *,
      client:clients(id, full_name, age, goals, phone),
      meals:diet_plan_meals(
        *,
        food_item:food_items(*)
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching diet plan:", error);
    return null;
  }

  return data;
}
