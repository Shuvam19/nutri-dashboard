// ============================================================
// Database Row Types — mirrors the Supabase PostgreSQL schema.
// Replace with `supabase gen types typescript` output when available.
// ============================================================

// ---- Enums ----

export type UserRole = "admin" | "receptionist" | "consultant";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type DietaryPreference = "veg" | "non_veg" | "vegan" | "eggetarian";

export type GenderType = "male" | "female" | "other";

export type ClientStatus = "active" | "inactive" | "completed";

export type MealCategory =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "beverage";

export type MealSlot =
  | "early_morning"
  | "breakfast"
  | "mid_morning"
  | "lunch"
  | "evening_snack"
  | "dinner"
  | "bedtime";

export type PlanStatus = "draft" | "active" | "completed" | "archived";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";

export type AppointmentType = "initial_consultation" | "follow_up" | "check_in";

// ---- Row Types ----

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  full_name: string;
  age: number;
  gender: GenderType;
  phone: string;
  email: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  daily_activity_level: ActivityLevel;
  medical_history: Record<string, unknown>;
  active_diseases: string[];
  past_diseases: string[];
  allergies: string[];
  dietary_preference: DietaryPreference;
  region: string | null;
  goals: string | null;
  notes: string | null;
  onboarded_by: string | null;
  assigned_consultant: string | null;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  category: MealCategory;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  serving_size: string;
  dietary_tags: string[];
  disease_tags: string[];
  region_tags: string[];
  image_url: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DietPlan {
  id: string;
  client_id: string;
  created_by: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  status: PlanStatus;
  notes: string | null;
  total_days: number;
  created_at: string;
  updated_at: string;
}

export interface DietPlanMeal {
  id: string;
  diet_plan_id: string;
  day_number: number;
  meal_type: MealSlot;
  food_item_id: string;
  quantity: number;
  custom_instructions: string | null;
  sort_order: number;
  created_at: string;
}

export interface TaxonomyTagRow {
  id: string;
  category: string;
  value: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface RolePermission {
  id: string;
  role: UserRole;
  feature: string;
  is_enabled: boolean;
  updated_at: string;
}

export interface WhatsAppLog {
  id: string;
  client_id: string;
  diet_plan_id: string | null;
  sent_by: string;
  message_preview: string | null;
  sent_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  consultant_id: string;
  appointment_date: string;
  duration_minutes: number;
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  notes: string | null;
  meeting_link: string | null;
  created_at: string;
  updated_at: string;
}

// ---- Join / View Types ----

export interface DietPlanMealWithFood extends DietPlanMeal {
  food_item: FoodItem;
}

export interface DietPlanWithMeals extends DietPlan {
  meals: DietPlanMealWithFood[];
  client: Pick<Client, "id" | "full_name" | "age" | "goals" | "phone">;
}

export interface ClientWithConsultant extends Client {
  consultant: Pick<Profile, "id" | "full_name"> | null;
}
