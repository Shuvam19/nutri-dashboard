"use server";

import { createClient } from "@/lib/supabase/server";
import { MEAL_SLOTS } from "@/lib/constants";
import path from "path";
import fs from "fs";
import os from "os";

// Storage bucket name — create this in Supabase Dashboard → Storage → New Bucket
// Name: "diet-plan-pdfs", set as Public bucket
const BUCKET_NAME = "diet-plan-pdfs";

/**
 * Generate a diet plan PDF, upload to Supabase Storage (upsert), and return the public URL.
 */
export async function generateAndUploadPdf(dietPlanId: string): Promise<{
  success: boolean;
  url?: string;
  message?: string;
}> {
  const supabase = await createClient();

  // 1. Fetch the diet plan with all related data
  const { data: plan, error: planError } = await supabase
    .from("diet_plans")
    .select(`
      *,
      client:clients(id, full_name, age, gender, phone, goals, height_cm, weight_kg, dietary_preference, allergies, active_diseases),
      meals:diet_plan_meals(
        *,
        food_item:food_items(*)
      )
    `)
    .eq("id", dietPlanId)
    .single();

  if (planError || !plan) {
    console.error("Error fetching plan for PDF:", planError);
    return { success: false, message: "Diet plan not found" };
  }

  // 3. Build the PDF
  const pdfBuffer = await buildPdf(plan);

  // 4. Deterministic storage path so upsert replaces existing file
  const storagePath = plan.client_id
    ? `clients/${plan.client_id}/${dietPlanId}.pdf`
    : `templates/${dietPlanId}.pdf`;

  // 5. Upload to Supabase Storage (upsert = replace if exists)
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading PDF:", uploadError);
    return { success: false, message: `Upload failed: ${uploadError.message}` };
  }

  // 4. Get a signed URL (works regardless of bucket visibility, 7-day expiry)
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, 60 * 60 * 24 * 7); // 7 days in seconds

  if (signedUrlError || !signedUrlData?.signedUrl) {
    console.error("Error creating signed URL:", signedUrlError);
    return { success: false, message: "PDF uploaded but could not generate download link" };
  }

  return {
    success: true,
    url: signedUrlData.signedUrl,
  };
}

// ============================================================
// PDF builder — Daily food options layout
//
// Format per day:
//   Morning:   Food A, Food B, Food C
//   Lunch:     Food D, Food E
//   Evening:   Food F, Food G
// ============================================================

async function buildPdf(plan: any): Promise<Buffer> {
  const pdfmake = require("pdfmake");

  pdfmake.fonts = {
    Roboto: {
      normal: path.join(process.cwd(), "node_modules/pdfmake/build/fonts/Roboto/Roboto-Regular.ttf"),
      bold: path.join(process.cwd(), "node_modules/pdfmake/build/fonts/Roboto/Roboto-Medium.ttf"),
      italics: path.join(process.cwd(), "node_modules/pdfmake/build/fonts/Roboto/Roboto-Italic.ttf"),
      bolditalics: path.join(process.cwd(), "node_modules/pdfmake/build/fonts/Roboto/Roboto-MediumItalic.ttf"),
    },
  };

  const content: any[] = [];

  // ── HEADER (Medical prescription-style) ──────────────────────
  content.push({
    columns: [
      {
        width: "*",
        stack: [
          { text: "NutriCore Wellness Clinic", style: "clinicName" },
          {
            text: "Dr. [Your Name] — M.Sc. Nutrition & Dietetics",
            style: "clinicSubtitle",
          },
          {
            text: "123 Health Avenue, Wellness Tower, Floor 3 | Mumbai, MH 400001",
            style: "clinicAddress",
          },
          {
            text: "Phone: +91 98765 43210 | Email: clinic@nutricore.in",
            style: "clinicAddress",
          },
        ],
      },
    ],
  });

  // Green divider
  content.push({
    canvas: [
      { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: "#16a34a" },
    ],
    margin: [0, 8, 0, 12],
  });

  // ── CLIENT INFO ──────────────────────────────────────────────
  if (plan.client) {
    const c = plan.client;
    content.push({
      columns: [
        {
          width: "50%",
          stack: [
            { text: "PATIENT DETAILS", style: "sectionLabel" },
            { text: c.full_name, style: "clientName", margin: [0, 4, 0, 2] },
            {
              text: `Age: ${c.age} yrs | Gender: ${(c.gender || "").charAt(0).toUpperCase() + (c.gender || "").slice(1)}`,
              style: "clientDetail",
            },
            {
              text: `Dietary Preference: ${(c.dietary_preference || "").replace(/_/g, " ")}`,
              style: "clientDetail",
            },
          ],
        },
        {
          width: "50%",
          stack: [
            { text: "PLAN DETAILS", style: "sectionLabel" },
            { text: plan.title, style: "clientName", margin: [0, 4, 0, 2] },
            { text: `Duration: ${plan.total_days} Days`, style: "clientDetail" },
            {
              text: `Date: ${plan.start_date ? new Date(plan.start_date).toLocaleDateString("en-IN") : "—"} to ${plan.end_date ? new Date(plan.end_date).toLocaleDateString("en-IN") : "—"}`,
              style: "clientDetail",
            },
          ],
        },
      ],
      margin: [0, 0, 0, 4],
    });

    // Medical info
    const medInfo: string[] = [];
    if (c.allergies?.length) medInfo.push(`Allergies: ${c.allergies.join(", ")}`);
    if (c.active_diseases?.length) medInfo.push(`Conditions: ${c.active_diseases.join(", ")}`);
    if (c.goals) medInfo.push(`Goals: ${c.goals}`);
    if (medInfo.length > 0) {
      content.push({
        text: medInfo.join("  |  "),
        fontSize: 8, color: "#555", italics: true,
        margin: [0, 0, 0, 8],
      });
    }
  }

  // Thin divider
  content.push({
    canvas: [
      { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#ccc" },
    ],
    margin: [0, 4, 0, 10],
  });

  // ── DAILY FOOD OPTIONS ───────────────────────────────────────
  // Group meals by day, then by meal slot
  const mealsByDay: Record<number, any[]> = {};
  for (const meal of plan.meals || []) {
    if (!mealsByDay[meal.day_number]) mealsByDay[meal.day_number] = [];
    mealsByDay[meal.day_number].push(meal);
  }

  const slotOrder = MEAL_SLOTS.map((s) => s.value);
  const sortedDays = Object.keys(mealsByDay).map(Number).sort((a, b) => a - b);

  for (const day of sortedDays) {
    const dayMeals = mealsByDay[day];

    // Group by meal slot
    const mealsBySlot: Record<string, any[]> = {};
    for (const meal of dayMeals) {
      if (!mealsBySlot[meal.meal_type]) mealsBySlot[meal.meal_type] = [];
      mealsBySlot[meal.meal_type].push(meal);
    }

    // Sort slots by defined order
    const orderedSlots = Object.keys(mealsBySlot).sort(
      (a, b) => (slotOrder as string[]).indexOf(a) - (slotOrder as string[]).indexOf(b)
    );

    // Day header
    content.push({
      text: `DAY ${day}`,
      style: "dayTitle",
      margin: [0, 10, 0, 6],
    });

    // Build a simple 2-column table: Meal Slot | Food Options
    const tableBody: any[][] = [
      [
        { text: "Meal", style: "tableHeader" },
        { text: "Food Options", style: "tableHeader" },
      ],
    ];

    for (const slot of orderedSlots) {
      const slotLabel =
        MEAL_SLOTS.find((s) => s.value === slot)?.label ?? slot.replace(/_/g, " ");

      const slotTime =
        MEAL_SLOTS.find((s) => s.value === slot)?.time ?? "";

      const foods = mealsBySlot[slot];

      // Build comma-separated food list with serving info
      const foodNames = foods
        .map((m: any) => {
          const name = m.food_item?.name ?? "—";
          const serving = m.food_item?.serving_size ?? "serving";
          const qty = m.quantity;
          return qty > 1 ? `${name} (${qty} × ${serving})` : `${name}`;
        })
        .join(",  ");

      tableBody.push([
        {
          stack: [
            { text: slotLabel, fontSize: 9, bold: true, color: "#15803d" },
            ...(slotTime ? [{ text: slotTime, fontSize: 7, color: "#888", italics: true }] : []),
          ],
        },
        { text: foodNames, fontSize: 9 },
      ]);
    }

    content.push({
      table: {
        headerRows: 1,
        widths: [90, "*"],
        body: tableBody,
      },
      layout: {
        hLineWidth: (i: number, node: any) =>
          i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.3,
        vLineWidth: () => 0.5,
        vLineColor: () => "#e5e7eb",
        hLineColor: (i: number) => (i <= 1 ? "#16a34a" : "#e5e7eb"),
        paddingLeft: () => 8,
        paddingRight: () => 8,
        paddingTop: () => 6,
        paddingBottom: () => 6,
        fillColor: (rowIndex: number) => (rowIndex === 0 ? "#f0fdf4" : null),
      },
      margin: [0, 0, 0, 4],
    });
  }

  // ── NOTES ────────────────────────────────────────────────────
  if (plan.notes) {
    content.push({
      text: `Consultant's Note: ${plan.notes}`,
      margin: [0, 16, 0, 0],
      fontSize: 9, italics: true, color: "#555",
    });
  }

  // ── Build document definition ────────────────────────────────
  const docDefinition = {
    content,
    pageMargins: [40, 40, 40, 80],
    defaultStyle: {
      font: "Roboto",
      fontSize: 10,
    },
    styles: {
      clinicName: { fontSize: 20, bold: true, color: "#16a34a" },
      clinicSubtitle: { fontSize: 10, color: "#333", margin: [0, 2, 0, 2] },
      clinicAddress: { fontSize: 8, color: "#666" },
      sectionLabel: { fontSize: 8, bold: true, color: "#16a34a", characterSpacing: 1 },
      clientName: { fontSize: 13, bold: true, color: "#1a1a1a" },
      clientDetail: { fontSize: 9, color: "#444" },
      dayTitle: { fontSize: 12, bold: true, color: "#15803d", characterSpacing: 1 },
      tableHeader: { fontSize: 8, bold: true, color: "#166534" },
    },
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        {
          stack: [
            {
              canvas: [
                { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#16a34a" },
              ],
            },
            {
              columns: [
                {
                  text: "This diet plan is personalized. Do not share or self-medicate. Consult your nutritionist for changes.",
                  fontSize: 7, color: "#888", italics: true, alignment: "left",
                },
                {
                  text: `Page ${currentPage} of ${pageCount}`,
                  fontSize: 7, color: "#888", alignment: "right",
                },
              ],
              margin: [0, 4, 0, 0],
            },
            {
              text: "NutriCore Wellness Clinic | www.nutricore.in | +91 98765 43210",
              fontSize: 7, color: "#aaa", alignment: "center",
              margin: [0, 2, 0, 0],
            },
          ],
          margin: [40, 10, 40, 0],
        },
      ],
    }),
  };

  // ── Generate PDF to a temp file, read it back ────────────────
  const tmpPath = path.join(os.tmpdir(), `nutricrm-pdf-${Date.now()}.pdf`);
  const pdf = pdfmake.createPdf(docDefinition);

  await pdf.write(tmpPath);

  // Small delay to ensure file is fully flushed
  await new Promise((resolve) => setTimeout(resolve, 200));

  const buffer = fs.readFileSync(tmpPath);

  // Clean up temp file
  try { fs.unlinkSync(tmpPath); } catch {}

  return buffer;
}
