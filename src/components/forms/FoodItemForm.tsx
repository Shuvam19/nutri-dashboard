"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { createFoodAction } from "@/app/actions/food";
import { TaxonomyTag } from "@/app/actions/taxonomy";

interface FoodItemFormProps {
  dietaryTags: TaxonomyTag[];
  diseaseTags: TaxonomyTag[];
  regionTags: TaxonomyTag[];
}

export function FoodItemForm({ dietaryTags, diseaseTags, regionTags }: FoodItemFormProps) {
  const [state, formAction, isPending] = useActionState(createFoodAction, null);

  const [selectedDiseaseTags, setSelectedDiseaseTags] = useState<string[]>([]);

  const toggleDiseaseTag = (value: string) => {
    setSelectedDiseaseTags((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  // Prevent default form submission on enter key inside inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA" && (e.target as HTMLElement).tagName !== "BUTTON") {
      e.preventDefault();
    }
  };

  return (
    <form action={formAction} onKeyDown={handleKeyDown} className="w-full flex-1">
      {state?.success === false && (
        <div className="bg-error-container text-on-error-container p-md rounded-lg mb-4 text-sm">
          {state.message}
        </div>
      )}
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-on-surface-variant mb-2">
            <Link href="/food-bucket" className="hover:text-primary transition-colors text-body-sm font-body-sm">
              Food Bucket
            </Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-on-surface font-medium text-body-sm font-body-sm">Add New Item</span>
          </div>
          <h1 className="font-h1 text-h1 text-on-surface">New Food Entry</h1>
        </div>
        <div className="flex gap-4">
          <Link
            href="/food-bucket"
            className="px-6 py-2 border border-outline text-on-surface rounded-lg font-medium hover:bg-surface-variant transition-colors text-body-sm font-body-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm text-body-sm font-body-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? "Saving..." : "Save Item"}
            {isPending && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Core Details & Macros */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container/30">
              <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                Basic Details
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                    Food Name *
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md font-body-md text-on-surface"
                    placeholder="e.g., Organic Quinoa"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      required
                      className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary text-body-md font-body-md text-on-surface pr-10"
                      defaultValue=""
                    >
                      <option disabled value="">
                        Select category
                      </option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                      <option value="beverage">Beverage</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                      expand_more
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                    Serving Size Base *
                  </label>
                  <div className="flex">
                    <input
                      name="serving_size_amount"
                      required
                      className="w-full px-4 py-3 border border-outline-variant border-r-0 rounded-l-lg bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-body-md font-body-md text-on-surface"
                      placeholder="100"
                      type="number"
                      step="0.1"
                    />
                    <select name="serving_size_unit" className="px-4 py-3 border border-outline-variant rounded-r-lg bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-secondary text-body-sm font-body-sm text-on-surface font-medium border-l-0">
                      <option value="g">grams (g)</option>
                      <option value="ml">ml</option>
                      <option value="oz">oz</option>
                      <option value="cup">cup</option>
                      <option value="serving">serving</option>
                    </select>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                    Description / Notes
                  </label>
                  <textarea
                    name="description"
                    className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md font-body-md text-on-surface resize-none"
                    placeholder="Add preparation notes or specific details about this item..."
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Nutritional Profile Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container/30 flex justify-between items-center">
              <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">pie_chart</span>
                Nutritional Profile
              </h2>
              <span className="text-body-sm font-body-sm text-on-surface-variant bg-surface-variant px-3 py-1 rounded-full">
                Per Serving Base
              </span>
            </div>
            <div className="p-6">
              {/* Calories Hero */}
              <div className="mb-8 bg-surface-container-low rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6 border border-outline-variant/50">
                <div className="flex-1">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 text-center sm:text-left">
                    Energy / Calories *
                  </label>
                  <div className="relative flex items-center justify-center sm:justify-start">
                    <input
                      name="calories_per_serving"
                      required
                      className="w-32 px-4 py-3 text-center sm:text-left text-h2 font-h2 border-b-2 border-outline-variant bg-transparent focus:outline-none focus:border-primary text-on-surface"
                      placeholder="0"
                      type="number"
                      step="0.1"
                    />
                    <span className="ml-3 font-body-lg text-body-lg text-on-surface-variant">kcal</span>
                  </div>
                </div>
              </div>

              {/* Macros Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-secondary/10 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative p-4 border border-outline-variant rounded-lg bg-surface flex flex-col items-center">
                    <span className="material-symbols-outlined text-secondary mb-2">fitness_center</span>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                      Protein *
                    </label>
                    <div className="flex items-end">
                      <input
                        name="protein_g"
                        required
                        className="w-16 px-2 py-1 text-center font-data-tabular text-data-tabular border-b border-outline-variant bg-transparent focus:outline-none focus:border-secondary text-on-surface"
                        placeholder="0"
                        type="number"
                        step="0.1"
                      />
                      <span className="ml-1 text-body-sm text-on-surface-variant">g</span>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-tertiary-container/10 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative p-4 border border-outline-variant rounded-lg bg-surface flex flex-col items-center">
                    <span className="material-symbols-outlined text-tertiary-container mb-2">grain</span>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                      Carbs *
                    </label>
                    <div className="flex items-end">
                      <input
                        name="carbs_g"
                        required
                        className="w-16 px-2 py-1 text-center font-data-tabular text-data-tabular border-b border-outline-variant bg-transparent focus:outline-none focus:border-tertiary-container text-on-surface"
                        placeholder="0"
                        type="number"
                        step="0.1"
                      />
                      <span className="ml-1 text-body-sm text-on-surface-variant">g</span>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative p-4 border border-outline-variant rounded-lg bg-surface flex flex-col items-center">
                    <span className="material-symbols-outlined text-primary mb-2">water_drop</span>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                      Fat *
                    </label>
                    <div className="flex items-end">
                      <input
                        name="fat_g"
                        required
                        className="w-16 px-2 py-1 text-center font-data-tabular text-data-tabular border-b border-outline-variant bg-transparent focus:outline-none focus:border-primary text-on-surface"
                        placeholder="0"
                        type="number"
                        step="0.1"
                      />
                      <span className="ml-1 text-body-sm text-on-surface-variant">g</span>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-outline/10 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative p-4 border border-outline-variant rounded-lg bg-surface flex flex-col items-center">
                    <span className="material-symbols-outlined text-outline mb-2">spa</span>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                      Fiber
                    </label>
                    <div className="flex items-end">
                      <input
                        name="fiber_g"
                        className="w-16 px-2 py-1 text-center font-data-tabular text-data-tabular border-b border-outline-variant bg-transparent focus:outline-none focus:border-outline text-on-surface"
                        placeholder="0"
                        type="number"
                        step="0.1"
                      />
                      <span className="ml-1 text-body-sm text-on-surface-variant">g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Media & Taxonomy */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tagging System Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container/30">
              <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">label</span>
                Taxonomy & Tags
              </h2>
            </div>
            <div className="p-6 flex-1 space-y-6">
              {/* Dietary Tags — Dynamic from DB */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-3 flex items-center justify-between">
                  Dietary Suitability
                </label>
                <div className="flex flex-wrap gap-2">
                  {dietaryTags.map((tag) => (
                    <label
                      key={tag.value}
                      className="inline-flex items-center px-3 py-1.5 border border-outline-variant rounded-full cursor-pointer hover:bg-surface-variant transition-colors has-[:checked]:bg-primary-container/20 has-[:checked]:border-primary has-[:checked]:text-primary"
                    >
                      <input name="dietary_tags" value={tag.value} className="sr-only" type="checkbox" />
                      <span className="text-body-sm font-body-sm font-medium">{tag.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Disease Tags — Dynamic from DB */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-3 flex items-center justify-between">
                  Clinical Conditions
                </label>
                <input type="hidden" name="disease_tags" value={JSON.stringify(selectedDiseaseTags)} />
                <div className="flex flex-wrap gap-2">
                  {diseaseTags.map((tag) => {
                    const isSelected = selectedDiseaseTags.includes(tag.value);
                    return (
                      <button
                        key={tag.value}
                        type="button"
                        onClick={() => toggleDiseaseTag(tag.value)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border font-body-sm text-body-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-primary-container/20 border-primary text-primary"
                            : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                        }`}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-sm">check</span>
                        )}
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Region Tags — Dynamic from DB */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-3">
                  Regional Availability
                </label>
                <select
                  name="region_tags"
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary text-body-md font-body-md text-on-surface"
                >
                  <option value="universal">Universal / Global</option>
                  {regionTags.filter(t => t.value !== "universal").map((tag) => (
                    <option key={tag.value} value={tag.value}>
                      {tag.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
