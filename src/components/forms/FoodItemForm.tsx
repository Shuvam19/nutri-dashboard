"use client";

import React, { useState } from "react";
import Link from "next/link";

export function FoodItemForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call for now
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    // Future: Call Server Action to save to Supabase
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex-1">
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
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm text-body-sm font-body-sm disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Item"}
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
                      required
                      className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary text-body-md font-body-md text-on-surface pr-10"
                      defaultValue=""
                    >
                      <option disabled value="">
                        Select category
                      </option>
                      <option value="grains">Grains & Cereals</option>
                      <option value="proteins">Proteins</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="dairy">Dairy & Alternatives</option>
                      <option value="fats">Fats & Oils</option>
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
                      required
                      className="w-full px-4 py-3 border border-outline-variant border-r-0 rounded-l-lg bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-body-md font-body-md text-on-surface"
                      placeholder="100"
                      type="number"
                    />
                    <select className="px-4 py-3 border border-outline-variant rounded-r-lg bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-secondary text-body-sm font-body-sm text-on-surface font-medium border-l-0">
                      <option value="g">grams (g)</option>
                      <option value="ml">ml</option>
                      <option value="oz">oz</option>
                      <option value="cup">cup</option>
                    </select>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                    Description / Notes
                  </label>
                  <textarea
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
                      required
                      className="w-32 px-4 py-3 text-center sm:text-left text-h2 font-h2 border-b-2 border-outline-variant bg-transparent focus:outline-none focus:border-primary text-on-surface"
                      placeholder="0"
                      type="number"
                    />
                    <span className="ml-3 font-body-lg text-body-lg text-on-surface-variant">kcal</span>
                  </div>
                </div>
                <div className="hidden sm:block h-16 w-px bg-outline-variant/50"></div>
                <div className="flex-1 w-full text-center sm:text-left">
                  <p className="text-body-sm font-body-sm text-on-surface-variant mb-2">
                    Macro Distribution Target
                  </p>
                  <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden flex">
                    <div className="h-full bg-secondary" style={{ width: "30%" }} title="Protein"></div>
                    <div className="h-full bg-tertiary-container" style={{ width: "50%" }} title="Carbs"></div>
                    <div className="h-full bg-primary" style={{ width: "20%" }} title="Fats"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-on-surface-variant font-medium">
                    <span className="text-secondary flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>Pro
                    </span>
                    <span className="text-tertiary-container flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>Carb
                    </span>
                    <span className="text-primary flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>Fat
                    </span>
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
                        required
                        className="w-16 px-2 py-1 text-center font-data-tabular text-data-tabular border-b border-outline-variant bg-transparent focus:outline-none focus:border-secondary text-on-surface"
                        placeholder="0"
                        type="number"
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
                        required
                        className="w-16 px-2 py-1 text-center font-data-tabular text-data-tabular border-b border-outline-variant bg-transparent focus:outline-none focus:border-tertiary-container text-on-surface"
                        placeholder="0"
                        type="number"
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
                        required
                        className="w-16 px-2 py-1 text-center font-data-tabular text-data-tabular border-b border-outline-variant bg-transparent focus:outline-none focus:border-primary text-on-surface"
                        placeholder="0"
                        type="number"
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
                        className="w-16 px-2 py-1 text-center font-data-tabular text-data-tabular border-b border-outline-variant bg-transparent focus:outline-none focus:border-outline text-on-surface"
                        placeholder="0"
                        type="number"
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
          {/* Image Upload Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container/30">
              <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">image</span>
                Media
              </h2>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">add_photo_alternate</span>
                </div>
                <p className="text-body-md font-body-md text-on-surface font-medium mb-1">
                  Click to upload image
                </p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
            </div>
          </div>

          {/* Tagging System Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container/30">
              <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">label</span>
                Taxonomy & Tags
              </h2>
            </div>
            <div className="p-6 flex-1 space-y-6">
              {/* Dietary Tags */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-3 flex items-center justify-between">
                  Dietary Suitability
                  <button type="button" className="text-primary hover:underline text-xs normal-case font-normal">Manage</button>
                </label>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center px-3 py-1.5 border border-outline-variant rounded-full cursor-pointer hover:bg-surface-variant transition-colors has-[:checked]:bg-primary-container/20 has-[:checked]:border-primary has-[:checked]:text-primary">
                    <input className="sr-only" type="checkbox" />
                    <span className="text-body-sm font-body-sm font-medium">Vegan</span>
                  </label>
                  <label className="inline-flex items-center px-3 py-1.5 border border-outline-variant rounded-full cursor-pointer hover:bg-surface-variant transition-colors has-[:checked]:bg-primary-container/20 has-[:checked]:border-primary has-[:checked]:text-primary">
                    <input className="sr-only" type="checkbox" />
                    <span className="text-body-sm font-body-sm font-medium">Gluten-Free</span>
                  </label>
                  <label className="inline-flex items-center px-3 py-1.5 border border-outline-variant rounded-full cursor-pointer hover:bg-surface-variant transition-colors has-[:checked]:bg-primary-container/20 has-[:checked]:border-primary has-[:checked]:text-primary">
                    <input className="sr-only" type="checkbox" />
                    <span className="text-body-sm font-body-sm font-medium">Keto</span>
                  </label>
                  <label className="inline-flex items-center px-3 py-1.5 border border-outline-variant rounded-full cursor-pointer hover:bg-surface-variant transition-colors has-[:checked]:bg-primary-container/20 has-[:checked]:border-primary has-[:checked]:text-primary">
                    <input className="sr-only" type="checkbox" />
                    <span className="text-body-sm font-body-sm font-medium">Dairy-Free</span>
                  </label>
                </div>
              </div>

              {/* Disease Tags */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-3 flex items-center justify-between">
                  Clinical Conditions
                  <button type="button" className="text-primary hover:underline text-xs normal-case font-normal">Manage</button>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                  <input
                    className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-body-sm text-on-surface mb-3"
                    placeholder="Search conditions to add..."
                    type="text"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container border border-outline-variant rounded-md text-body-sm font-body-sm text-on-surface">
                    Diabetes Type 2
                    <button type="button" className="text-on-surface-variant hover:text-error rounded-full p-0.5">
                      <span className="material-symbols-outlined text-sm block">close</span>
                    </button>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container border border-outline-variant rounded-md text-body-sm font-body-sm text-on-surface">
                    Hypertension
                    <button type="button" className="text-on-surface-variant hover:text-error rounded-full p-0.5">
                      <span className="material-symbols-outlined text-sm block">close</span>
                    </button>
                  </span>
                </div>
              </div>

              {/* Region Tags */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-3">
                  Regional Availability
                </label>
                <select className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary text-body-md font-body-md text-on-surface">
                  <option value="global">Global / Universal</option>
                  <option value="na">North America</option>
                  <option value="eu">Europe</option>
                  <option value="asia">Asia Pacific</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
