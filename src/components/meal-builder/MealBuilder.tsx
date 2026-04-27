"use client";

import React, { useState } from "react";
import Link from "next/link";

export function MealBuilder() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Builder Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <p className="font-label-caps text-label-caps text-primary mb-1 uppercase">
              Diet Plan Builder
            </p>
            <h1 className="font-h2 text-h2 text-on-surface">New Template</h1>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-2 min-w-[200px]">
              <span className="material-symbols-outlined text-outline">person</span>
              <select className="w-full bg-transparent border-none p-0 text-body-sm font-body-sm focus:ring-0 text-on-surface cursor-pointer outline-none">
                <option value="">Template (No Client)</option>
                <option value="1">Sarah Jenkins</option>
                <option value="2">Michael Chang</option>
                <option value="3">Emma Thompson</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-2">
              <span className="material-symbols-outlined text-outline">calendar_month</span>
              <input
                className="bg-transparent border-none p-0 text-body-sm font-body-sm focus:ring-0 text-on-surface outline-none"
                type="number"
                placeholder="Total Days"
                defaultValue="7"
              />
              <span className="text-outline mx-1">Days</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/diet-plans"
            className="px-4 py-2 rounded-lg font-label-caps text-label-caps text-secondary border border-secondary hover:bg-secondary-fixed transition-colors flex items-center gap-2"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg font-label-caps text-label-caps text-on-primary bg-primary hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {isSaving ? "Saving..." : "Save Plan"}
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline Builder */}
        <div className="lg:col-span-8 space-y-6">
          {/* Slot: Early Morning */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden">
            <div className="border-b border-surface-variant p-4 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary-container">routine</span>
                <h3 className="font-h3 text-h3 text-on-surface">Early Morning</h3>
                <span className="font-data-tabular text-data-tabular text-on-surface-variant bg-surface-variant px-2 py-1 rounded">
                  06:30 AM
                </span>
              </div>
              <button className="text-primary hover:text-surface-tint font-label-caps text-label-caps flex items-center gap-1 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">add</span> Add Food
              </button>
            </div>
            <div className="p-4 space-y-2">
              {/* Food Item */}
              <div className="flex items-center gap-4 p-2 hover:bg-surface-container-low rounded-lg group transition-colors">
                <div className="w-10 h-10 rounded bg-primary-container/20 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">water_drop</span>
                </div>
                <div className="flex-1">
                  <p className="font-body-md text-body-md text-on-surface font-medium">Warm Water with Lemon</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Detoxification, hydration</p>
                </div>
                <div className="flex items-center gap-2 w-32">
                  <input
                    className="w-16 p-1 border border-outline-variant rounded text-center font-data-tabular text-data-tabular focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
                    type="number"
                    defaultValue="1"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Glass</span>
                </div>
                <div className="w-24 text-right">
                  <p className="font-data-tabular text-data-tabular text-on-surface">15 kcal</p>
                </div>
                <button className="p-1 text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>

              {/* Food Item */}
              <div className="flex items-center gap-4 p-2 hover:bg-surface-container-low rounded-lg group transition-colors border-t border-surface-variant border-dashed">
                <div className="w-10 h-10 rounded bg-tertiary-container/20 flex items-center justify-center text-tertiary flex-shrink-0">
                  <span className="material-symbols-outlined">eco</span>
                </div>
                <div className="flex-1">
                  <p className="font-body-md text-body-md text-on-surface font-medium">Soaked Almonds</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Peel before eating</p>
                </div>
                <div className="flex items-center gap-2 w-32">
                  <input
                    className="w-16 p-1 border border-outline-variant rounded text-center font-data-tabular text-data-tabular focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
                    type="number"
                    defaultValue="6"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Pieces</span>
                </div>
                <div className="w-24 text-right">
                  <p className="font-data-tabular text-data-tabular text-on-surface">42 kcal</p>
                </div>
                <button className="p-1 text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Slot: Breakfast */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden">
            <div className="border-b border-surface-variant p-4 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary-container">bakery_dining</span>
                <h3 className="font-h3 text-h3 text-on-surface">Breakfast</h3>
                <span className="font-data-tabular text-data-tabular text-on-surface-variant bg-surface-variant px-2 py-1 rounded">
                  08:30 AM
                </span>
              </div>
              <button className="text-primary hover:text-surface-tint font-label-caps text-label-caps flex items-center gap-1 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">add</span> Add Food
              </button>
            </div>
            <div className="p-4 space-y-2">
              {/* Empty State */}
              <div className="py-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-outline-variant rounded-lg bg-surface/50">
                <span className="material-symbols-outlined text-outline mb-2 text-3xl">restaurant</span>
                <p className="font-body-md text-body-md text-on-surface-variant">No items added to Breakfast yet.</p>
                <button className="mt-2 text-primary font-label-caps text-label-caps hover:underline">
                  Browse Food Bucket
                </button>
              </div>
            </div>
          </div>

          {/* Add New Slot Button */}
          <button className="w-full py-4 border-2 border-dashed border-primary-container/50 text-primary hover:bg-primary-container/10 rounded-xl font-label-caps text-label-caps flex items-center justify-center gap-2 transition-colors uppercase tracking-wider">
            <span className="material-symbols-outlined">add_circle</span>
            Add Custom Meal Slot
          </button>
        </div>

        {/* Right Column: Sidebar (Sticky) */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* Daily Summary Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant p-6">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">monitoring</span>
              Daily Targets
            </h3>
            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Calories</p>
                <p className="font-h2 text-h2 text-on-surface">
                  1,450 <span className="text-body-sm font-normal text-on-surface-variant">/ 1800 kcal</span>
                </p>
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden mb-6">
              <div className="h-full bg-gradient-to-r from-primary to-primary-fixed" style={{ width: "80%" }}></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Macro: Protein */}
              <div className="bg-surface p-3 rounded-lg border border-surface-variant text-center">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Protein</p>
                <p className="font-data-tabular text-data-tabular text-on-surface text-lg font-bold">45g</p>
                <p className="font-body-sm text-body-sm text-outline text-[11px]">of 120g</p>
                <div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-secondary-container" style={{ width: "37%" }}></div>
                </div>
              </div>
              {/* Macro: Carbs */}
              <div className="bg-surface p-3 rounded-lg border border-surface-variant text-center">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Carbs</p>
                <p className="font-data-tabular text-data-tabular text-on-surface text-lg font-bold">110g</p>
                <p className="font-body-sm text-body-sm text-outline text-[11px]">of 180g</p>
                <div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-tertiary-container" style={{ width: "61%" }}></div>
                </div>
              </div>
              {/* Macro: Fats */}
              <div className="bg-surface p-3 rounded-lg border border-surface-variant text-center">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Fats</p>
                <p className="font-data-tabular text-data-tabular text-on-surface text-lg font-bold">32g</p>
                <p className="font-body-sm text-body-sm text-outline text-[11px]">of 50g</p>
                <div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-tertiary-fixed-dim" style={{ width: "64%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Food Search Widget */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden flex flex-col max-h-[calc(100vh-400px)]">
            <div className="p-4 border-b border-surface-variant bg-surface">
              <h3 className="font-h3 text-h3 text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">kitchen</span>
                Food Bucket
              </h3>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-body-sm font-body-sm focus:ring-2 focus:ring-secondary focus:border-secondary bg-surface-container-lowest outline-none"
                  placeholder="Search foods..."
                  type="text"
                />
              </div>
            </div>
            <div className="overflow-y-auto p-2">
              <p className="px-2 py-1 font-label-caps text-label-caps text-outline uppercase mt-2 mb-1">
                Frequently Used
              </p>
              {/* Search Item */}
              <div className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded-lg cursor-pointer group">
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium">Oatmeal (Cooked)</p>
                  <p className="font-data-tabular text-data-tabular text-outline text-[12px]">100g • 68 kcal</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-variant text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-on-primary">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
              {/* Search Item */}
              <div className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded-lg cursor-pointer group">
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium">Boiled Egg</p>
                  <p className="font-data-tabular text-data-tabular text-outline text-[12px]">1 large • 78 kcal</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-variant text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-on-primary">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
              {/* Search Item */}
              <div className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded-lg cursor-pointer group">
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium">Greek Yogurt (Plain, 0%)</p>
                  <p className="font-data-tabular text-data-tabular text-outline text-[12px]">100g • 59 kcal</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-variant text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-on-primary">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
