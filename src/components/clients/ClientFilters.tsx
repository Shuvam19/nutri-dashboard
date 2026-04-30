"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Consultant {
  id: string;
  full_name: string;
}

export default function ClientFilters({ consultants }: { consultants: Consultant[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset page on filter change
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="flex-1 flex flex-col gap-xs">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status Filter</label>
        <div className="relative">
          <select 
            className="w-full px-sm py-sm rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary font-body-md text-body-md text-on-surface outline-none transition-all appearance-none cursor-pointer pr-xl"
            value={searchParams.get("status") || "all"}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Consultation</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>
          <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-xs">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Assigned Consultant</label>
        <div className="relative">
          <select 
            className="w-full px-sm py-sm rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary font-body-md text-body-md text-on-surface outline-none transition-all appearance-none cursor-pointer pr-xl"
            value={searchParams.get("consultant") || "all"}
            onChange={(e) => handleFilterChange("consultant", e.target.value)}
          >
            <option value="all">All Clinic Consultants</option>
            <option value="my_clients">My Clients</option>
            {consultants.map(c => (
              <option key={c.id} value={c.id}>{c.full_name}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-xs">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Dietary Profile</label>
        <div className="relative">
          <select 
            className="w-full px-sm py-sm rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary font-body-md text-body-md text-on-surface outline-none transition-all appearance-none cursor-pointer pr-xl"
            value={searchParams.get("diet") || "all"}
            onChange={(e) => handleFilterChange("diet", e.target.value)}
          >
            <option value="all">Any Preference</option>
            <option value="veg">Vegetarian</option>
            <option value="non_veg">Non-Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="eggetarian">Eggetarian</option>
          </select>
          <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
        </div>
      </div>
    </>
  );
}
