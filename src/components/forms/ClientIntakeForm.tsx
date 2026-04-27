"use client";

import React, { useState } from "react";
import Link from "next/link";

export function ClientIntakeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stubbed server action simulation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate backend delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    alert("Form submitted! (Backend connection pending)");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header & Progress */}
      <header className="mb-lg">
        <Link href="/clients" className="inline-flex items-center gap-sm mb-md text-surface-tint hover:underline">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
          <span className="font-label-caps text-label-caps uppercase tracking-wider">Cancel Intake</span>
        </Link>
        <h1 className="font-h1 text-h1 text-on-background mb-md">New Client Intake</h1>
        
        {/* Segmented Progress Bar */}
        <div className="flex items-center w-full gap-xs mb-sm">
          <div className="h-2 flex-1 bg-primary rounded-full"></div>
          <div className="h-2 flex-1 bg-surface-container-high rounded-full"></div>
          <div className="h-2 flex-1 bg-surface-container-high rounded-full"></div>
          <div className="h-2 flex-1 bg-surface-container-high rounded-full"></div>
        </div>
        <div className="flex justify-between w-full font-label-caps text-label-caps text-on-surface-variant">
          <span className="text-primary">Personal Info</span>
          <span>Health Data</span>
          <span>Preferences</span>
          <span>Goals &amp; Notes</span>
        </div>
      </header>
      
      <form className="space-y-lg" onSubmit={handleSubmit}>
        {/* Section 1: Personal Info */}
        <section className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/30 overflow-hidden">
          <div className="px-md py-md border-b border-surface-variant bg-surface-container-low/50 flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <h2 className="font-h3 text-h3 text-on-surface">Personal Information</h2>
          </div>
          <div className="p-md grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="col-span-1 md:col-span-2 flex gap-md items-center mb-sm">
              <div className="w-20 h-20 rounded-full bg-surface-container-high border border-outline-variant flex flex-col items-center justify-center text-on-surface-variant cursor-pointer hover:bg-surface-dim transition-colors">
                <span className="material-symbols-outlined mb-xs">add_a_photo</span>
                <span className="font-label-caps text-[10px]">Upload</span>
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                Add a profile picture (optional)
              </div>
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">First Name</label>
              <input 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-outline-variant" 
                placeholder="e.g. Jane" 
                type="text"
                required
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Last Name</label>
              <input 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-outline-variant" 
                placeholder="e.g. Doe" 
                type="text"
                required
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Age</label>
              <input 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                placeholder="Years" 
                type="number"
                required
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Biological Sex</label>
              <select 
                className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none"
                defaultValue=""
                required
              >
                <option disabled value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-base block uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
                <input 
                  className="w-full font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded-DEFAULT pl-10 pr-sm py-[10px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                  placeholder="client@example.com" 
                  type="email"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Health Data */}
        <section className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/30 overflow-hidden opacity-50 pointer-events-none filter grayscale-[50%] transition-all">
          <div className="px-md py-md border-b border-surface-variant bg-surface-container-low/50 flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[18px]">favorite</span>
              </div>
              <h2 className="font-h3 text-h3 text-on-surface">Health Data</h2>
            </div>
            <span className="font-label-caps text-label-caps text-outline-variant">Step 2</span>
          </div>
          <div className="p-md text-center py-xl">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-sm">lock</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Complete Personal Information to unlock</p>
          </div>
        </section>

        {/* Action Bar */}
        <div className="pt-md flex justify-end gap-sm items-center sticky bottom-md bg-background/80 backdrop-blur-sm p-sm rounded-xl border border-surface-variant">
          <button 
            className="font-label-caps text-label-caps px-md py-[12px] rounded-DEFAULT text-on-surface-variant hover:bg-surface-container transition-colors uppercase tracking-wider" 
            type="button"
          >
            Save Draft
          </button>
          <button 
            className="font-label-caps text-label-caps px-xl py-[12px] rounded-DEFAULT bg-primary text-on-primary hover:bg-primary/90 transition-colors uppercase tracking-wider shadow-sm flex items-center gap-xs disabled:opacity-70" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Continue to Health Data"}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  );
}
