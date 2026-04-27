// ============================================================
// Shared utility functions
// ============================================================

import { APP_CONFIG } from "@/lib/constants";

/**
 * Calculate BMI from height (cm) and weight (kg)
 */
export function calculateBMI(
  heightCm: number | null,
  weightKg: number | null
): number | null {
  if (!heightCm || !weightKg || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Get BMI category label
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

/**
 * Build a WhatsApp deep link for manual send
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  // Strip non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // Add country code if not present
  if (!cleaned.startsWith(APP_CONFIG.whatsappCountryCode)) {
    cleaned = APP_CONFIG.whatsappCountryCode + cleaned;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format a tag slug to human-readable label
 * e.g., "diabetes_friendly" → "Diabetes Friendly"
 */
export function formatTag(tag: string): string {
  return tag
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate initials from a full name (for avatars)
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Concatenate class names, filtering out falsy values
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
