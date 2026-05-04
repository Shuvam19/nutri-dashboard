// ============================================================
// App-level types (non-database)
// ============================================================

/**
 * Standard response shape for Server Actions
 */
export interface ActionResponse<T = undefined> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Pagination params for list queries
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Filter state for the Food Bucket browser
 */
export interface FoodFilterState {
  search: string;
  category: string | null;
  dietaryTags: string[];
  diseaseTags: string[];
  regionTags: string[];
}

/**
 * Navigation item for sidebar
 */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: Array<"admin" | "receptionist" | "consultant">;
}

// Re-export database types for convenience
export type {
  UserRole,
  ActivityLevel,
  DietaryPreference,
  GenderType,
  ClientStatus,
  MealCategory,
  MealSlot,
  PlanStatus,
  Profile,
  Client,
  FoodItem,
  DietPlan,
  DietPlanMeal,
  WhatsAppLog,
  DietPlanWithMeals,
  DietPlanMealWithFood,
  ClientWithConsultant,
  TaxonomyTagRow,
  RolePermission,
} from "./database";
