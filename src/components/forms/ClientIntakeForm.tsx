"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { createClientAction, updateClientAction } from "@/app/actions/client";
import { Client } from "@/lib/types/database";

export function ClientIntakeForm({ initialData }: { initialData?: Client }) {
  const action = initialData ? updateClientAction.bind(null, initialData.id) : createClientAction;
  const [state, formAction, isPending] = useActionState(action, null);

  const isEdit = !!initialData;
  const title = isEdit ? "Edit Client Profile" : "New Client Intake";

  // Attempt to split full name for the first/last name inputs
  let defaultFirstName = "";
  let defaultLastName = "";
  if (initialData?.full_name) {
    const parts = initialData.full_name.split(" ");
    defaultFirstName = parts[0] || "";
    defaultLastName = parts.slice(1).join(" ") || "";
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header & Progress */}
      <header className="mb-lg">
        <Link href={isEdit ? `/clients/${initialData.id}` : "/clients"} className="inline-flex items-center gap-sm mb-md text-surface-tint hover:underline">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
          <span className="font-label-caps text-label-caps uppercase tracking-wider">Cancel</span>
        </Link>
        <h1 className="font-h1 text-h1 text-on-background mb-md">{title}</h1>
      </header>
      
      <form className="space-y-lg" action={formAction}>
        {state?.success === false && (
          <div className="bg-error-container text-on-error-container p-md rounded-lg mb-4 text-sm">
            {state.message}
          </div>
        )}

        {/* Section 1: Personal Info */}
        <section className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/30 overflow-hidden">
          <div className="px-md py-md border-b border-surface-variant bg-surface-container-low/50 flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <h2 className="font-h3 text-h3 text-on-surface">Personal Information</h2>
          </div>
          <div className="p-md grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">First Name</label>
              <input 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-outline-variant" 
                placeholder="e.g. Jane" 
                type="text"
                name="first_name"
                defaultValue={defaultFirstName}
                required
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Last Name</label>
              <input 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-outline-variant" 
                placeholder="e.g. Doe" 
                type="text"
                name="last_name"
                defaultValue={defaultLastName}
                required
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Age</label>
              <input 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                placeholder="Years" 
                type="number"
                name="age"
                defaultValue={initialData?.age}
                required
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Biological Sex</label>
              <select 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none"
                defaultValue={initialData?.gender || ""}
                name="gender"
                required
              >
                <option disabled value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
                <input 
                  className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT pl-10 pr-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                  placeholder="client@example.com" 
                  type="email"
                  name="email"
                  defaultValue={initialData?.email || ""}
                />
              </div>
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant">call</span>
                <input 
                  className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT pl-10 pr-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                  placeholder="(555) 123-4567" 
                  type="tel"
                  name="phone"
                  defaultValue={initialData?.phone}
                  required
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Health Data */}
        <section className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/30 overflow-hidden">
          <div className="px-md py-md border-b border-surface-variant bg-surface-container-low/50 flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">favorite</span>
              </div>
              <h2 className="font-h3 text-h3 text-on-surface">Health Data</h2>
            </div>
          </div>
          <div className="p-md grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Height (cm)</label>
              <input 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                placeholder="e.g. 175" 
                type="number"
                step="0.1"
                name="height_cm"
                defaultValue={initialData?.height_cm || ""}
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Weight (kg)</label>
              <input 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                placeholder="e.g. 70" 
                type="number"
                step="0.1"
                name="weight_kg"
                defaultValue={initialData?.weight_kg || ""}
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Daily Activity Level</label>
              <select 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none"
                defaultValue={initialData?.daily_activity_level || "sedentary"}
                name="daily_activity_level"
              >
                <option value="sedentary">Sedentary (Little to no exercise)</option>
                <option value="light">Light (Exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (Exercise 3-5 days/week)</option>
                <option value="active">Active (Exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (Hard exercise daily)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Active Diseases (comma-separated)</label>
              <input 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                placeholder="e.g. Diabetes, Hypertension" 
                type="text"
                name="active_diseases"
                defaultValue={initialData?.active_diseases?.join(", ") || ""}
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Past Diseases (comma-separated)</label>
              <input 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                placeholder="e.g. Appendicitis" 
                type="text"
                name="past_diseases"
                defaultValue={initialData?.past_diseases?.join(", ") || ""}
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Allergies (comma-separated)</label>
              <input 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                placeholder="e.g. Peanuts, Shellfish" 
                type="text"
                name="allergies"
                defaultValue={initialData?.allergies?.join(", ") || ""}
              />
            </div>
          </div>
        </section>

        {/* Section 3: Preferences */}
        <section className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/30 overflow-hidden">
          <div className="px-md py-md border-b border-surface-variant bg-surface-container-low/50 flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary-container">
                <span className="material-symbols-outlined text-[18px]">restaurant</span>
              </div>
              <h2 className="font-h3 text-h3 text-on-surface">Preferences</h2>
            </div>
          </div>
          <div className="p-md grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Dietary Preference</label>
              <select 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none"
                defaultValue={initialData?.dietary_preference || "veg"}
                name="dietary_preference"
              >
                <option value="veg">Vegetarian</option>
                <option value="non_veg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="eggetarian">Eggetarian</option>
              </select>
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Region (Optional)</label>
              <input 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                placeholder="e.g. North India, Mediterranean" 
                type="text"
                name="region"
                defaultValue={initialData?.region || ""}
              />
            </div>
          </div>
        </section>

        {/* Section 4: Goals & Notes */}
        <section className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/30 overflow-hidden">
          <div className="px-md py-md border-b border-surface-variant bg-surface-container-low/50 flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[18px]">flag</span>
              </div>
              <h2 className="font-h3 text-h3 text-on-surface">Goals & Notes</h2>
            </div>
          </div>
          <div className="p-md space-y-md">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Primary Goals</label>
              <textarea 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-y min-h-[100px]" 
                placeholder="e.g. Lose 5kg in 2 months, improve stamina..." 
                name="goals"
                defaultValue={initialData?.goals || ""}
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Global Notes</label>
              <textarea 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-y min-h-[100px]" 
                placeholder="Any private notes for the consultant..." 
                name="notes"
                defaultValue={initialData?.notes || ""}
              />
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <div className="pt-md flex justify-end gap-sm items-center sticky bottom-md bg-background/80 backdrop-blur-sm p-sm rounded-xl border border-surface-variant">
          <button 
            className="font-label-caps text-label-caps px-xl py-[12px] rounded-DEFAULT bg-primary text-on-primary hover:bg-primary/90 transition-colors uppercase tracking-wider shadow-sm flex items-center gap-xs disabled:opacity-70" 
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving..." : isEdit ? "Update Client Profile" : "Create Client"}
            <span className="material-symbols-outlined text-[18px]">
              {isEdit ? "save" : "person_add"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
