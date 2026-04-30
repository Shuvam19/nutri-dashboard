import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientById, getClientDietPlans, getClientAppointments } from "@/app/actions/client";
import ClientTabs from "@/components/clients/ClientTabs";

export const metadata = {
  title: "Client Profile | NutriCRM",
};

type Params = Promise<{ id: string }>;

export default async function ClientProfilePage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  const [clientData, dietPlans, appointments] = await Promise.all([
    getClientById(id),
    getClientDietPlans(id),
    getClientAppointments(id)
  ]);
  
  if (!clientData) notFound();

  // BMI Calculation
  let bmi: number | string = "--";
  let bmiStatus = "--";
  let bmiColor = "bg-surface-container-low text-on-surface";
  if (clientData.height_cm && clientData.weight_kg) {
    const heightInMeters = clientData.height_cm / 100;
    const rawBmi = clientData.weight_kg / (heightInMeters * heightInMeters);
    bmi = parseFloat(rawBmi.toFixed(1));
    if (bmi < 18.5) { bmiStatus = "Underweight"; bmiColor = "bg-tertiary-container text-on-tertiary-container"; }
    else if (bmi < 25) { bmiStatus = "Healthy"; bmiColor = "bg-primary-container text-on-primary-container"; }
    else if (bmi < 30) { bmiStatus = "Overweight"; bmiColor = "bg-secondary-container text-on-secondary-container"; }
    else { bmiStatus = "Obese"; bmiColor = "bg-error-container text-on-error-container"; }
  }

  const names = clientData.full_name.split(" ");
  const firstName = names[0];
  const lastName = names.slice(1).join(" ");
  const formattedDate = new Date(clientData.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short" });

  const activityLabels: Record<string, string> = {
    sedentary: "Sedentary",
    light: "Light",
    moderate: "Moderate",
    active: "Active",
    very_active: "Very Active",
  };

  const dietaryLabel = clientData.dietary_preference
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  return (
    <div className="max-w-container-max mx-auto px-4 py-6 md:px-margin w-full">
      {/* Two-column layout: 40% left info panel | 60% right tabs */}
      <div className="flex flex-col lg:flex-row gap-gutter items-start">

        {/* ── LEFT COLUMN (40%) ─────────────────────────────────── */}
        <div className="w-full lg:w-[40%] shrink-0 space-y-gutter lg:sticky lg:top-20">

          {/* Profile Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden">
            {/* Avatar + Name header */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/5 px-6 pt-6 pb-4 flex items-center gap-4">
              <div className="relative shrink-0">
                <img
                  alt={`${firstName} ${lastName}`}
                  className="w-16 h-16 rounded-xl object-cover shadow-sm border-2 border-surface-container-lowest"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(clientData.full_name)}&background=random`}
                />
                <span className={`absolute -bottom-1.5 -right-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest border border-surface-container-lowest ${
                  clientData.status === "active" ? "bg-primary text-on-primary" :
                  clientData.status === "inactive" ? "bg-outline text-surface" :
                  "bg-secondary text-on-secondary"
                }`}>
                  {clientData.status}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-h2 text-h2 text-on-surface truncate">{firstName} {lastName}</h1>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  #{clientData.id.slice(0, 8).toUpperCase()} · Since {formattedDate}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[11px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{dietaryLabel}</span>
                  {clientData.region && (
                    <span className="text-[11px] font-medium bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full truncate max-w-[160px]">{clientData.region}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-4 py-3 flex gap-2 border-b border-outline-variant/30">
              <Link
                href={`/clients/${clientData.id}/edit`}
                className="flex-1 bg-surface-container text-on-surface-variant font-label-caps text-label-caps px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                EDIT
              </Link>
              <Link
                href={`/diet-plans/new?client=${clientData.id}`}
                className="flex-1 bg-primary text-on-primary font-label-caps text-label-caps px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors shadow-sm text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                NEW PLAN
              </Link>
            </div>

            {/* Quick Stats grid */}
            <div className="p-4">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">analytics</span>
                QUICK STATS
              </p>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[
                  { label: "AGE", value: clientData.age, unit: "yrs" },
                  { label: "SEX", value: clientData.gender === "male" ? "M" : clientData.gender === "female" ? "F" : "O", unit: "" },
                  { label: "HEIGHT", value: clientData.height_cm || "--", unit: "cm" },
                  { label: "WEIGHT", value: clientData.weight_kg || "--", unit: "kg" },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="bg-surface-container-low rounded-lg p-2.5 text-center">
                    <p className="text-[9px] font-bold text-on-surface-variant tracking-wider mb-1">{label}</p>
                    <p className="font-h3 text-h3 text-primary leading-none">{value}<span className="text-[10px] font-normal text-on-surface-variant">{unit}</span></p>
                  </div>
                ))}
              </div>
              {/* BMI highlight */}
              <div className={`rounded-lg p-3 flex items-center justify-between ${bmiColor}`}>
                <div>
                  <p className="text-[9px] font-bold tracking-wider opacity-70 mb-0.5">BODY MASS INDEX</p>
                  <p className="font-h2 text-h2 leading-none">{bmi}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wide opacity-80">{bmiStatus}</span>
                  <p className="text-[10px] opacity-60 mt-0.5">kg/m²</p>
                </div>
              </div>
              {/* Activity level */}
              <div className="mt-2 flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">directions_run</span>
                <div>
                  <p className="text-[9px] font-bold text-on-surface-variant tracking-wider">ACTIVITY LEVEL</p>
                  <p className="text-xs font-medium text-on-surface">{activityLabels[clientData.daily_activity_level] ?? clientData.daily_activity_level}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical & Preferences Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary">medical_services</span>
              <h2 className="font-h3 text-h3 text-on-surface">Medical &amp; Preferences</h2>
            </div>
            <div className="p-4 space-y-4">

              {/* Dietary & Allergies chips */}
              <div>
                <p className="text-[9px] font-bold text-on-surface-variant tracking-wider mb-2">DIETARY &amp; ALLERGIES</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full">{dietaryLabel}</span>
                  {(clientData.allergies || []).map((a: string, i: number) => (
                    <span key={i} className="bg-error-container/30 text-error text-[11px] font-medium px-2.5 py-1 rounded-full">{a}</span>
                  ))}
                  {(!clientData.allergies || clientData.allergies.length === 0) && (
                    <span className="text-xs text-on-surface-variant italic">No known allergies</span>
                  )}
                </div>
              </div>

              {/* Diseases row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] font-bold text-on-surface-variant tracking-wider mb-1.5">ACTIVE CONDITIONS</p>
                  {clientData.active_diseases && clientData.active_diseases.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {clientData.active_diseases.map((d, i) => (
                        <span key={i} className="bg-secondary-container/30 text-on-secondary-container text-[10px] font-medium px-2 py-0.5 rounded-full">{d}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant italic">None</p>
                  )}
                </div>
                <div>
                  <p className="text-[9px] font-bold text-on-surface-variant tracking-wider mb-1.5">PAST DISEASES</p>
                  {clientData.past_diseases && clientData.past_diseases.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {clientData.past_diseases.map((d, i) => (
                        <span key={i} className="bg-surface-container text-on-surface-variant text-[10px] font-medium px-2 py-0.5 rounded-full">{d}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant italic">None</p>
                  )}
                </div>
              </div>

              {/* Region */}
              {clientData.region && (
                <div>
                  <p className="text-[9px] font-bold text-on-surface-variant tracking-wider mb-1.5">REGION / CUISINE</p>
                  <p className="text-xs text-on-surface">{clientData.region}</p>
                </div>
              )}

              {/* Goals */}
              {clientData.goals && (
                <div>
                  <p className="text-[9px] font-bold text-on-surface-variant tracking-wider mb-1.5">GOALS</p>
                  <p className="text-xs text-on-surface leading-relaxed line-clamp-3">{clientData.goals}</p>
                </div>
              )}

              {/* Notes */}
              {clientData.notes && (
                <div>
                  <p className="text-[9px] font-bold text-on-surface-variant tracking-wider mb-1.5">NOTES</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-4 whitespace-pre-wrap">{clientData.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (60%) ─────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <ClientTabs dietPlans={dietPlans} appointments={appointments} />
        </div>

      </div>
    </div>
  );
}
