"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TaxonomyTag } from "@/app/actions/taxonomy";

interface FoodFiltersSidebarProps {
  dietaryTags: TaxonomyTag[];
  diseaseTags: TaxonomyTag[];
  regionTags: TaxonomyTag[];
}

export default function FoodFiltersSidebar({ dietaryTags, diseaseTags, regionTags }: FoodFiltersSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mobile: toggle filter panel
  const [mobileOpen, setMobileOpen] = useState(false);

  // Local state for search to debounce
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const isFirstRender = useRef(true);

  // Debounce search effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      if (currentSearch === searchTerm) return;

      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, pathname, router, searchParams]);

  // Handle Tag Toggles (Dietary, Disease)
  const handleToggle = (paramKey: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    const current = params.get(paramKey);
    let tags = current ? current.split(",") : [];

    if (tags.includes(value)) {
      tags = tags.filter((t) => t !== value);
    } else {
      tags.push(value);
    }

    if (tags.length > 0) {
      params.set(paramKey, tags.join(","));
    } else {
      params.delete(paramKey);
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handle Select Change (Region)
  const handleSelect = (paramKey: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "All Regions") {
      params.set(paramKey, value);
    } else {
      params.delete(paramKey);
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    setSearchTerm("");
    router.replace(pathname);
  };

  const currentDietary = searchParams.get("dietary")?.split(",") || [];
  const currentDisease = searchParams.get("disease")?.split(",") || [];
  const currentRegion = searchParams.get("region") || "All Regions";

  const activeFilterCount = currentDietary.filter(Boolean).length + currentDisease.filter(Boolean).length + (currentRegion !== "All Regions" ? 1 : 0);

  return (
    <>
      {/* Mobile filter toggle bar */}
      <div className="md:hidden bg-surface-container-lowest border-b border-outline-variant/30 p-3 flex items-center gap-3">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 pointer-events-none text-[20px]">search</span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none text-on-surface text-sm"
            placeholder="Search foods..."
            type="text"
          />
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-medium shrink-0 ${mobileOpen ? 'bg-primary text-on-primary border-primary' : 'bg-surface border-outline-variant text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-error text-on-error rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Mobile expandable filters */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-container-lowest border-b border-outline-variant/30 p-4 space-y-5 animate-in">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Filters</span>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-primary font-body-sm text-body-sm hover:underline">Clear All</button>
            )}
          </div>
          
          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3">Dietary Preference</h3>
            <div className="flex flex-wrap gap-2">
              {dietaryTags.map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => handleToggle("dietary", tag.value)}
                  className={`px-3 py-1.5 rounded-full border font-body-sm text-body-sm transition-colors ${
                    currentDietary.includes(tag.value)
                      ? "border-primary text-primary bg-primary-container/10"
                      : "border-outline-variant text-on-surface-variant hover:border-primary"
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3">Disease Compatibility</h3>
            <div className="flex flex-wrap gap-2">
              {diseaseTags.map((tag) => {
                const isActive = currentDisease.includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    onClick={() => handleToggle("disease", tag.value)}
                    className={`px-3 py-1.5 rounded-full border font-body-sm text-body-sm transition-colors ${
                      isActive
                        ? "border-primary text-primary bg-primary-container/10"
                        : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3">Region / Cuisine</h3>
            <select
              value={currentRegion}
              onChange={(e) => handleSelect("region", e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="All Regions">All Regions</option>
              {regionTags.map((tag) => (
                <option key={tag.value} value={tag.value}>{tag.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Desktop sidebar (unchanged) */}
      <aside className="hidden md:flex w-72 bg-surface-container-lowest border-r border-outline-variant/30 flex-col overflow-y-auto z-10 flex-shrink-0">
        <div className="p-6 border-b border-outline-variant/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-h3 text-h3 text-on-surface">Filters</h2>
            <button onClick={clearAll} className="text-primary font-body-sm text-body-sm hover:underline">Clear All</button>
          </div>
          <div className="mb-4 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 pointer-events-none">search</span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none text-on-surface"
              placeholder="Search foods..."
              type="text"
            />
          </div>
        </div>

        <div className="p-6 flex flex-col gap-8">
          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4">Dietary Preference</h3>
            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
              {dietaryTags.map((tag) => (
                <label key={tag.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={currentDietary.includes(tag.value)}
                    onChange={() => handleToggle("dietary", tag.value)}
                    className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">
                    {tag.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4">Disease Compatibility</h3>
            <div className="flex flex-wrap gap-2">
              {diseaseTags.map((tag) => {
                const isActive = currentDisease.includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    onClick={() => handleToggle("disease", tag.value)}
                    className={`px-3 py-1.5 rounded-full border font-body-sm text-body-sm transition-colors ${
                      isActive
                        ? "border-primary text-primary bg-primary-container/10"
                        : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4">Region / Cuisine</h3>
            <select
              value={currentRegion}
              onChange={(e) => handleSelect("region", e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="All Regions">All Regions</option>
              {regionTags.map((tag) => (
                <option key={tag.value} value={tag.value}>{tag.label}</option>
              ))}
            </select>
          </div>
        </div>
      </aside>
    </>
  );
}
