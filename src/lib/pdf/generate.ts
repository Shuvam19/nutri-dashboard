// ============================================================
// PDF Document Definition Builder — uses pdfmake
// ============================================================

// pdfmake 0.3.x doesn't ship type declarations, so we define
// a minimal shape for the document definition inline.
interface PdfContent {
  text?: string;
  style?: string;
  alignment?: "left" | "center" | "right";
  margin?: [number, number, number, number];
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italics?: boolean;
  table?: {
    headerRows?: number;
    widths?: (string | number)[];
    body: string[][];
  };
  layout?: string;
}

interface PdfStyle {
  fontSize?: number;
  bold?: boolean;
  color?: string;
  italics?: boolean;
  margin?: [number, number, number, number];
}

export interface PdfDocumentDefinition {
  content: PdfContent[];
  styles: Record<string, PdfStyle>;
  defaultStyle: {
    font?: string;
    fontSize?: number;
  };
  pageMargins: [number, number, number, number];
}

import type { DietPlanWithMeals } from "@/lib/types";
import { MEAL_SLOTS, APP_CONFIG } from "@/lib/constants";
import { formatDate, formatTag } from "@/lib/utils";

/**
 * Build a pdfmake document definition for a diet plan.
 */
export function buildDietPlanPdf(
  plan: DietPlanWithMeals
): PdfDocumentDefinition {
  const content: PdfContent[] = [];

  // ---- Header ----
  content.push({
    text: APP_CONFIG.name,
    style: "header",
    alignment: "center" as const,
    margin: [0, 0, 0, 4] as [number, number, number, number],
  });

  content.push({
    text: APP_CONFIG.description,
    style: "subheader",
    alignment: "center" as const,
    margin: [0, 0, 0, 20] as [number, number, number, number],
  });

  // ---- Client Info ----
  content.push({
    text: `Client: ${plan.client.full_name} (Age: ${plan.client.age})`,
    style: "sectionTitle",
  });

  if (plan.client.goals) {
    content.push({ text: `Goals: ${plan.client.goals}`, margin: [0, 0, 0, 4] as [number, number, number, number] });
  }

  content.push({
    text: `Plan: ${plan.title}`,
    margin: [0, 0, 0, 4] as [number, number, number, number],
  });

  if (plan.start_date && plan.end_date) {
    content.push({
      text: `Duration: ${formatDate(plan.start_date)} — ${formatDate(plan.end_date)}`,
      margin: [0, 0, 0, 16] as [number, number, number, number],
    });
  }

  // ---- Group meals by day ----
  const mealsByDay = new Map<number, DietPlanWithMeals["meals"]>();
  for (const meal of plan.meals) {
    const existing = mealsByDay.get(meal.day_number) ?? [];
    existing.push(meal);
    mealsByDay.set(meal.day_number, existing);
  }

  // ---- Render each day ----
  const sortedDays = Array.from(mealsByDay.keys()).sort((a, b) => a - b);

  for (const day of sortedDays) {
    const dayMeals = mealsByDay.get(day) ?? [];

    content.push({
      text: `Day ${day}`,
      style: "dayTitle",
      margin: [0, 12, 0, 6] as [number, number, number, number],
    });

    // Build table rows
    const tableBody: string[][] = [["Meal Slot", "Food", "Qty", "Notes"]];
    let totalCal = 0;
    let totalProtein = 0;

    // Sort meals by slot order
    const slotOrder = MEAL_SLOTS.map((s) => s.value);
    dayMeals.sort(
      (a, b) => slotOrder.indexOf(a.meal_type) - slotOrder.indexOf(b.meal_type)
    );

    for (const meal of dayMeals) {
      const slotLabel =
        MEAL_SLOTS.find((s) => s.value === meal.meal_type)?.label ??
        formatTag(meal.meal_type);

      tableBody.push([
        slotLabel,
        meal.food_item.name,
        `${meal.quantity} × ${meal.food_item.serving_size}`,
        meal.custom_instructions ?? "—",
      ]);

      totalCal += meal.food_item.calories_per_serving * meal.quantity;
      totalProtein += meal.food_item.protein_g * meal.quantity;
    }

    content.push({
      table: {
        headerRows: 1,
        widths: ["auto", "*", "auto", "auto"],
        body: tableBody,
      },
      layout: "lightHorizontalLines",
    });

    content.push({
      text: `Day Total: ${Math.round(totalCal)} kcal | ${Math.round(totalProtein)}g protein`,
      style: "dayTotal",
      margin: [0, 4, 0, 8] as [number, number, number, number],
    });
  }

  // ---- Footer note ----
  if (plan.notes) {
    content.push({
      text: `Notes: ${plan.notes}`,
      margin: [0, 16, 0, 0] as [number, number, number, number],
      italics: true,
    });
  }

  content.push({
    text: `Generated on ${formatDate(new Date().toISOString())}`,
    alignment: "center" as const,
    margin: [0, 24, 0, 0] as [number, number, number, number],
    fontSize: 8,
    color: "#999",
  });

  return {
    content,
    styles: {
      header: { fontSize: 22, bold: true, color: "#16a34a" },
      subheader: { fontSize: 11, color: "#666" },
      sectionTitle: { fontSize: 14, bold: true, margin: [0, 0, 0, 6] },
      dayTitle: { fontSize: 13, bold: true, color: "#15803d" },
      dayTotal: { fontSize: 10, color: "#444", italics: true },
    },
    defaultStyle: {
      font: "Roboto",
      fontSize: 10,
    },
    pageMargins: [40, 40, 40, 40] as [number, number, number, number],
  };
}
