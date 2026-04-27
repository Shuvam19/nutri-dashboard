// ============================================================
// Constants — enum values, tag options, and configuration
// ============================================================

import type { NavItem } from "@/lib/types";

// ---- Activity Levels ----
export const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "light", label: "Light (1-3 days/week)" },
  { value: "moderate", label: "Moderate (3-5 days/week)" },
  { value: "active", label: "Active (6-7 days/week)" },
  { value: "very_active", label: "Very Active (intense daily)" },
] as const;

// ---- Dietary Preferences ----
export const DIETARY_PREFERENCES = [
  { value: "veg", label: "Vegetarian" },
  { value: "non_veg", label: "Non-Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "eggetarian", label: "Eggetarian" },
] as const;

// ---- Gender Options ----
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

// ---- Meal Categories ----
export const MEAL_CATEGORIES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
  { value: "beverage", label: "Beverage" },
] as const;

// ---- Meal Slots (time-of-day) ----
export const MEAL_SLOTS = [
  { value: "early_morning", label: "Early Morning", time: "6:00 AM" },
  { value: "breakfast", label: "Breakfast", time: "8:00 AM" },
  { value: "mid_morning", label: "Mid-Morning Snack", time: "10:30 AM" },
  { value: "lunch", label: "Lunch", time: "1:00 PM" },
  { value: "evening_snack", label: "Evening Snack", time: "4:30 PM" },
  { value: "dinner", label: "Dinner", time: "8:00 PM" },
  { value: "bedtime", label: "Bedtime", time: "10:00 PM" },
] as const;

// ---- Dietary Tags (for food items) ----
export const DIETARY_TAGS = [
  "veg",
  "non_veg",
  "vegan",
  "gluten_free",
  "dairy_free",
  "sugar_free",
  "high_protein",
  "high_fiber",
  "low_carb",
  "low_fat",
  "keto",
  "whole_grain",
] as const;

// ---- Disease Tags (food compatibility) ----
export const DISEASE_TAGS = [
  "diabetes_friendly",
  "heart_healthy",
  "hypertension_safe",
  "thyroid_friendly",
  "pcod_friendly",
  "kidney_friendly",
  "liver_friendly",
  "cholesterol_safe",
  "gastric_friendly",
  "anti_inflammatory",
] as const;

// ---- Region Tags ----
export const REGION_TAGS = [
  "north_indian",
  "south_indian",
  "east_indian",
  "west_indian",
  "bengali",
  "gujarati",
  "maharashtrian",
  "punjabi",
  "rajasthani",
  "tamil",
  "kerala",
  "continental",
  "universal",
] as const;

// ---- Common Diseases (for client intake) ----
export const COMMON_DISEASES = [
  "Diabetes (Type 1)",
  "Diabetes (Type 2)",
  "Hypertension",
  "Thyroid (Hypo)",
  "Thyroid (Hyper)",
  "PCOD/PCOS",
  "Cholesterol (High)",
  "Heart Disease",
  "Kidney Disease",
  "Liver Disease",
  "Gastric Issues",
  "Arthritis",
  "Asthma",
  "Anemia",
  "Obesity",
] as const;

// ---- Common Allergies ----
export const COMMON_ALLERGIES = [
  "Milk/Dairy",
  "Gluten/Wheat",
  "Peanuts",
  "Tree Nuts",
  "Soy",
  "Eggs",
  "Fish",
  "Shellfish",
  "Sesame",
] as const;

// ---- Client Status ----
export const CLIENT_STATUSES = [
  { value: "active", label: "Active", color: "green" },
  { value: "inactive", label: "Inactive", color: "gray" },
  { value: "completed", label: "Completed", color: "blue" },
] as const;

// ---- Plan Status ----
export const PLAN_STATUSES = [
  { value: "draft", label: "Draft", color: "yellow" },
  { value: "active", label: "Active", color: "green" },
  { value: "completed", label: "Completed", color: "blue" },
  { value: "archived", label: "Archived", color: "gray" },
] as const;

// ---- Sidebar Navigation ----
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: "LayoutDashboard",
    roles: ["admin", "receptionist", "consultant"],
  },
  {
    label: "Clients",
    href: "/clients",
    icon: "Users",
    roles: ["admin", "receptionist", "consultant"],
  },
  {
    label: "Food Bucket",
    href: "/food-bucket",
    icon: "Apple",
    roles: ["admin", "consultant"],
  },
  {
    label: "Diet Plans",
    href: "/diet-plans",
    icon: "ClipboardList",
    roles: ["admin", "consultant"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: "Settings",
    roles: ["admin"],
  },
];

// ---- App Config ----
export const APP_CONFIG = {
  name: "NutriPlan",
  description: "Nutritionist CRM & Meal Planner",
  defaultPageSize: 20,
  maxPlanDays: 30,
  whatsappCountryCode: "91", // India
} as const;
