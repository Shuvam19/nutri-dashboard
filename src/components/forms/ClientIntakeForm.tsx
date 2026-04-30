"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { createClientAction, updateClientAction } from "@/app/actions/client";
import { Client } from "@/lib/types/database";
import { TaxonomyTag } from "@/app/actions/taxonomy";

type TabId = "personal" | "health" | "preferences" | "goals";

interface ClientIntakeFormProps {
  initialData?: Client;
  diseases?: TaxonomyTag[];
  allergies?: TaxonomyTag[];
}

export function ClientIntakeForm({ initialData, diseases = [], allergies = [] }: ClientIntakeFormProps) {
  const action = initialData ? updateClientAction.bind(null, initialData.id) : createClientAction;
  const [state, formAction, isPending] = useActionState(action, null);

  const [activeTab, setActiveTab] = useState<TabId>("personal");

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

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "person" },
    { id: "health", label: "Health Data", icon: "favorite" },
    { id: "preferences", label: "Preferences", icon: "restaurant" },
    { id: "goals", label: "Goals & Notes", icon: "flag" },
  ] as const;

  const currentIndex = tabs.findIndex(t => t.id === activeTab);
  const isFirstTab = currentIndex === 0;
  const isLastTab = currentIndex === tabs.length - 1;

  const handleNext = () => {
    if (!isLastTab) setActiveTab(tabs[currentIndex + 1].id);
  };

  const handlePrev = () => {
    if (!isFirstTab) setActiveTab(tabs[currentIndex - 1].id);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-0">
      {/* Header */}
      <header className="mb-lg">
        <Link href={isEdit ? `/clients/${initialData.id}` : "/clients"} className="inline-flex items-center gap-sm mb-md text-surface-tint hover:underline">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
          <span className="font-label-caps text-label-caps uppercase tracking-wider">Cancel</span>
        </Link>
        <h1 className="font-h1 text-h1 text-on-background mb-md">{title}</h1>
      </header>
      
      <form className="flex flex-col md:flex-row gap-8" action={formAction}>
        
        {/* Sidebar Navigation (iPad Split View Left) */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/30 p-2 overflow-hidden flex flex-row md:flex-col gap-1 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap md:whitespace-normal
                  ${activeTab === tab.id 
                    ? "bg-primary-container text-on-primary-container font-semibold shadow-sm" 
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium"
                  }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${activeTab === tab.id ? "text-primary" : "text-on-surface-variant"}`}>
                  {tab.icon}
                </span>
                <span className="font-body-md text-body-md">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content Area (iPad Split View Right) */}
        <div className="flex-1 space-y-lg min-w-0 pb-24">
          
          {state?.success === false && (
            <div className="bg-error-container text-on-error-container p-md rounded-lg text-sm">
              {state.message}
            </div>
          )}

          {/* Section 1: Personal Info */}
          <div className={activeTab === "personal" ? "block" : "hidden"}>
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
          </div>

          {/* Section 2: Health Data */}
          <div className={activeTab === "health" ? "block" : "hidden"}>
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
                  <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Active Diseases</label>
                  {diseases.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {diseases.map((d) => (
                        <label
                          key={d.value}
                          className="inline-flex items-center px-3 py-1.5 border border-outline-variant rounded-full cursor-pointer hover:bg-surface-variant transition-colors has-[:checked]:bg-secondary/10 has-[:checked]:border-secondary has-[:checked]:text-secondary"
                        >
                          <input
                            name="active_diseases"
                            value={d.label}
                            className="sr-only"
                            type="checkbox"
                            defaultChecked={initialData?.active_diseases?.includes(d.label)}
                          />
                          <span className="text-body-sm font-body-sm font-medium">{d.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                      placeholder="e.g. Diabetes, Hypertension"
                      type="text"
                      name="active_diseases"
                      defaultValue={initialData?.active_diseases?.join(", ") || ""}
                    />
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Past Diseases</label>
                  {diseases.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {diseases.map((d) => (
                        <label
                          key={d.value}
                          className="inline-flex items-center px-3 py-1.5 border border-outline-variant rounded-full cursor-pointer hover:bg-surface-variant transition-colors has-[:checked]:bg-outline/10 has-[:checked]:border-outline has-[:checked]:text-outline"
                        >
                          <input
                            name="past_diseases"
                            value={d.label}
                            className="sr-only"
                            type="checkbox"
                            defaultChecked={initialData?.past_diseases?.includes(d.label)}
                          />
                          <span className="text-body-sm font-body-sm font-medium">{d.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                      placeholder="e.g. Appendicitis"
                      type="text"
                      name="past_diseases"
                      defaultValue={initialData?.past_diseases?.join(", ") || ""}
                    />
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Allergies</label>
                  {allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {allergies.map((a) => (
                        <label
                          key={a.value}
                          className="inline-flex items-center px-3 py-1.5 border border-outline-variant rounded-full cursor-pointer hover:bg-surface-variant transition-colors has-[:checked]:bg-error-container/20 has-[:checked]:border-error has-[:checked]:text-error"
                        >
                          <input
                            name="allergies"
                            value={a.label}
                            className="sr-only"
                            type="checkbox"
                            defaultChecked={initialData?.allergies?.includes(a.label)}
                          />
                          <span className="text-body-sm font-body-sm font-medium">{a.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                      placeholder="e.g. Peanuts, Shellfish"
                      type="text"
                      name="allergies"
                      defaultValue={initialData?.allergies?.join(", ") || ""}
                    />
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Section 3: Preferences */}
          <div className={activeTab === "preferences" ? "block" : "hidden"}>
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
          </div>

          {/* Section 4: Goals & Notes */}
          <div className={activeTab === "goals" ? "block" : "hidden"}>
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
          </div>

          {/* Fixed Action Bar at bottom */}
          <div className="fixed bottom-0 left-0 right-0 md:sticky md:bottom-md md:left-auto md:right-auto mt-lg bg-surface-container-lowest/90 backdrop-blur-md p-4 md:p-sm rounded-t-xl md:rounded-xl border-t md:border border-outline-variant/50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex items-center justify-between gap-4 z-50">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirstTab}
              className="px-4 py-2 font-body-md font-medium text-on-surface hover:bg-surface-container-low rounded-lg transition-colors disabled:opacity-30 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">Previous</span>
            </button>
            
            <div className="flex items-center gap-4">
              {!isLastTab && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-primary text-on-primary font-body-md font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                >
                  Next Step
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              )}
              {isLastTab && (
                <button 
                  className="px-6 py-2 bg-primary text-on-primary font-body-md font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70" 
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : isEdit ? "Update Client Profile" : "Create Client"}
                  <span className="material-symbols-outlined text-[18px]">
                    {isEdit ? "save" : "check_circle"}
                  </span>
                </button>
              )}
            </div>
          </div>
          
        </div>
      </form>
    </div>
  );
}
