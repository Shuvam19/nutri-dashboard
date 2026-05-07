"use client";

import React, { useState, useEffect, useActionState } from "react";
import Link from "next/link";
import { saveDietPlan, searchFoodItemsFiltered, getClientsList } from "@/app/actions/dietPlan";
import { getTaxonomyTagsBatch, TaxonomyTag } from "@/app/actions/taxonomy";
import { getClientById } from "@/app/actions/client";
import { FoodItem, MealSlot, MealCategory } from "@/lib/types/database";
import { MEAL_CATEGORIES } from "@/lib/constants";

type MealItem = {
  id: string; // unique local ID
  food: FoodItem;
  quantity: number;
};

type Slot = {
  id: string;
  meal_type: MealSlot;
  items: MealItem[];
};

const MEAL_SLOT_LABELS: Record<MealSlot, { label: string; icon: string; time: string }> = {
  early_morning: { label: "Early Morning", icon: "routine", time: "06:30 AM" },
  breakfast: { label: "Breakfast", icon: "bakery_dining", time: "08:30 AM" },
  mid_morning: { label: "Mid Morning", icon: "local_cafe", time: "11:00 AM" },
  lunch: { label: "Lunch", icon: "restaurant", time: "01:30 PM" },
  evening_snack: { label: "Evening Snack", icon: "tapas", time: "04:30 PM" },
  dinner: { label: "Dinner", icon: "dinner_dining", time: "08:00 PM" },
  bedtime: { label: "Bedtime", icon: "bedtime", time: "10:30 PM" }
};

export function MealBuilder({ initialClientId }: { initialClientId?: string }) {
  const [state, formAction, isPending] = useActionState(saveDietPlan, null);
  
  // Basic Info State
  const [title, setTitle] = useState("New Template");
  const [clientId, setClientId] = useState(initialClientId || "");
  const [totalDays, setTotalDays] = useState(7);
  
  // Data State
  const [clients, setClients] = useState<{id: string; full_name: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [foodResults, setFoodResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Filter State
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDietary, setFilterDietary] = useState<string[]>([]);
  const [filterDisease, setFilterDisease] = useState<string[]>([]);
  const [filterRegion, setFilterRegion] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Taxonomy tags
  const [dietaryTags, setDietaryTags] = useState<TaxonomyTag[]>([]);
  const [diseaseTags, setDiseaseTags] = useState<TaxonomyTag[]>([]);
  const [regionTags, setRegionTags] = useState<TaxonomyTag[]>([]);
  
  // Builder State
  const [slots, setSlots] = useState<Slot[]>([
    { id: "slot-1", meal_type: "early_morning", items: [] },
    { id: "slot-2", meal_type: "breakfast", items: [] }
  ]);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(slots[0].id);

  // Fetch initial data
  useEffect(() => {
    getClientsList().then(data => setClients(data));
    getTaxonomyTagsBatch(["dietary_tag", "disease_tag", "region_tag"]).then(tags => {
      setDietaryTags(tags["dietary_tag"] || []);
      setDiseaseTags(tags["disease_tag"] || []);
      setRegionTags(tags["region_tag"] || []);
    });

    if (initialClientId) {
      getClientById(initialClientId).then(client => {
        if (client) {
          setTitle(`Diet Plan for ${client.full_name}`);
          // Pre-apply filters
          if (client.dietary_preference) {
            setFilterDietary([client.dietary_preference]);
          }
          if (client.active_diseases && client.active_diseases.length > 0) {
            setFilterDisease(client.active_diseases);
          }
          if (client.region) {
            // Take the first region if comma separated
            setFilterRegion(client.region.split(',')[0].trim());
          }
        }
      });
    }
  }, [initialClientId]);

  // Search Foods Effect with debounce + filters
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchFoodItemsFiltered({
        query: searchQuery,
        category: filterCategory || undefined,
        dietary: filterDietary.length > 0 ? filterDietary : undefined,
        disease: filterDisease.length > 0 ? filterDisease : undefined,
        region: filterRegion || undefined,
      });
      setFoodResults(results);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterCategory, filterDietary, filterDisease, filterRegion]);

  // Derived Macros
  const totals = slots.reduce((acc, slot) => {
    slot.items.forEach(item => {
      acc.calories += (item.food.calories_per_serving * item.quantity);
      acc.protein += (item.food.protein_g * item.quantity);
      acc.carbs += (item.food.carbs_g * item.quantity);
      acc.fat += (item.food.fat_g * item.quantity);
    });
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Methods
  const addSlot = () => {
    const availableSlots = Object.keys(MEAL_SLOT_LABELS) as MealSlot[];
    const existingTypes = slots.map(s => s.meal_type);
    const nextType = availableSlots.find(s => !existingTypes.includes(s)) || "snack";
    
    const newSlot: Slot = {
      id: `slot-${Date.now()}`,
      meal_type: nextType as MealSlot,
      items: []
    };
    setSlots([...slots, newSlot]);
    setActiveSlotId(newSlot.id);
  };

  const removeSlot = (slotId: string) => {
    setSlots(slots.filter(s => s.id !== slotId));
    if (activeSlotId === slotId) setActiveSlotId(null);
  };

  const changeSlotType = (slotId: string, newType: MealSlot) => {
    setSlots(slots.map(s => s.id === slotId ? { ...s, meal_type: newType } : s));
  };

  const addFoodToSlot = (food: FoodItem) => {
    if (!activeSlotId) return;
    
    setSlots(slots.map(s => {
      if (s.id === activeSlotId) {
        return {
          ...s,
          items: [...s.items, { id: `item-${Date.now()}`, food, quantity: 1 }]
        };
      }
      return s;
    }));
  };

  const updateItemQuantity = (slotId: string, itemId: string, qty: number) => {
    setSlots(slots.map(s => {
      if (s.id === slotId) {
        return {
          ...s,
          items: s.items.map(item => item.id === itemId ? { ...item, quantity: Math.max(0.1, qty) } : item)
        };
      }
      return s;
    }));
  };

  const removeItem = (slotId: string, itemId: string) => {
    setSlots(slots.map(s => {
      if (s.id === slotId) {
        return {
          ...s,
          items: s.items.filter(item => item.id !== itemId)
        };
      }
      return s;
    }));
  };

  // Prepare payload for submission
  const mealPayload = slots.flatMap((slot, slotIndex) => {
    return slot.items.map((item, itemIndex) => ({
      day_number: 1, // MVP
      meal_type: slot.meal_type,
      food_item_id: item.food.id,
      quantity: item.quantity,
      sort_order: itemIndex
    }));
  });

  // Filter helpers
  const activeFilterCount = [filterCategory, ...filterDietary, ...filterDisease, filterRegion].filter(Boolean).length;
  const clearFilters = () => {
    setFilterCategory("");
    setFilterDietary([]);
    setFilterDisease([]);
    setFilterRegion("");
  };
  const toggleDietaryFilter = (val: string) => {
    setFilterDietary(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };
  const toggleDiseaseFilter = (val: string) => {
    setFilterDisease(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA" && (e.target as HTMLElement).tagName !== "BUTTON") {
      e.preventDefault();
    }
  };

  return (
    <form action={formAction} onKeyDown={handleKeyDown} className="flex flex-col space-y-6">
      <input type="hidden" name="meals" value={JSON.stringify(mealPayload)} />
      
      {state?.success === false && (
        <div className="bg-error-container text-on-error-container p-md rounded-lg mb-4 text-sm">
          {state.message}
        </div>
      )}

      {/* Builder Header */}
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <p className="font-label-caps text-label-caps text-primary mb-1 uppercase">
              Diet Plan Builder
            </p>
            <input 
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-h3 md:font-h2 text-h3 md:text-h2 text-on-surface bg-transparent border-b-2 border-outline-variant/50 hover:border-outline-variant focus:border-primary focus:outline-none transition-colors w-full py-1 px-1"
              placeholder="Template Title"
              required
            />
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4 items-center">
            <div className={`flex items-center gap-2 bg-surface-container-lowest border rounded-lg p-2 flex-1 min-w-[160px] md:min-w-[200px] ${initialClientId ? 'border-primary/30 bg-primary/5' : 'border-outline-variant'}`}>
              <span className={`material-symbols-outlined ${initialClientId ? 'text-primary' : 'text-outline'}`}>person</span>
              <select 
                name="client_id"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                disabled={!!initialClientId}
                className={`w-full bg-transparent border-none p-0 text-body-sm font-body-sm focus:ring-0 text-on-surface outline-none ${initialClientId ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
              >
                <option value="">Template (No Client)</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.full_name}</option>
                ))}
              </select>
              {initialClientId && (
                <input type="hidden" name="client_id" value={initialClientId} />
              )}
            </div>

            <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-2">
              <span className="material-symbols-outlined text-outline">calendar_month</span>
              <input
                name="total_days"
                className="bg-transparent border-none p-0 text-body-sm font-body-sm focus:ring-0 text-on-surface outline-none w-16"
                type="number"
                placeholder="Days"
                min="1"
                value={totalDays}
                onChange={(e) => setTotalDays(parseInt(e.target.value) || 1)}
                required
              />
              <span className="text-outline mx-1">Days</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/diet-plans"
            className="px-3 md:px-4 py-2 rounded-lg font-label-caps text-label-caps text-secondary border border-secondary hover:bg-secondary-fixed transition-colors flex items-center gap-2 text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending || mealPayload.length === 0}
            className="px-3 md:px-4 py-2 rounded-lg font-label-caps text-label-caps text-on-primary bg-primary hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 text-xs"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {isPending ? "Saving..." : "Save Plan"}
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline Builder */}
        <div className="lg:col-span-8 space-y-6">
          {slots.map((slot) => {
            const labelInfo = MEAL_SLOT_LABELS[slot.meal_type] || { label: "Meal", icon: "restaurant", time: "--:--" };
            const isActive = activeSlotId === slot.id;
            
            return (
              <div 
                key={slot.id} 
                onClick={() => setActiveSlotId(slot.id)}
                className={`bg-surface-container-lowest rounded-xl shadow-card border overflow-hidden transition-all ${isActive ? 'border-primary ring-1 ring-primary/20' : 'border-outline-variant hover:border-primary/50 cursor-pointer'}`}
              >
                <div className={`border-b p-3 md:p-4 flex items-center justify-between ${isActive ? 'bg-primary-container/10 border-primary/20' : 'bg-surface border-surface-variant'}`}>
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <span className="material-symbols-outlined text-tertiary-container text-[20px] md:text-[24px]">{labelInfo.icon}</span>
                    <select 
                      value={slot.meal_type} 
                      onChange={(e) => changeSlotType(slot.id, e.target.value as MealSlot)}
                      className="font-h3 text-h3 text-on-surface bg-transparent border-none p-0 focus:ring-0 cursor-pointer outline-none text-sm md:text-base"
                    >
                      {Object.entries(MEAL_SLOT_LABELS).map(([val, info]) => (
                        <option key={val} value={val}>{info.label}</option>
                      ))}
                    </select>
                    <span className="font-data-tabular text-data-tabular text-on-surface-variant bg-surface-variant px-2 py-1 rounded text-xs hidden sm:inline-block">
                      {labelInfo.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="text-primary font-label-caps text-label-caps text-[10px] md:text-xs flex items-center gap-1 uppercase tracking-wider bg-primary-container/30 px-2 py-1 rounded hidden sm:flex">
                        <span className="material-symbols-outlined text-[14px]">edit</span> Active
                      </span>
                    )}
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeSlot(slot.id); }} className="text-outline hover:text-error p-1">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-4 space-y-2 min-h-[100px]">
                  {slot.items.length === 0 ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-outline-variant rounded-lg bg-surface/50">
                      <span className="material-symbols-outlined text-outline mb-2 text-3xl">restaurant</span>
                      <p className="font-body-md text-body-md text-on-surface-variant">No items added yet.</p>
                      <p className="mt-1 text-xs text-on-surface-variant">Click to make this slot active, then click items in the right sidebar to add them.</p>
                    </div>
                  ) : (
                    slot.items.map((item, index) => (
                      <div key={item.id} className={`flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-4 p-2 hover:bg-surface-container-low rounded-lg group transition-colors ${index > 0 ? 'border-t border-surface-variant border-dashed' : ''}`}>
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded bg-secondary-container/20 flex items-center justify-center text-secondary flex-shrink-0">
                          <span className="material-symbols-outlined text-[20px] md:text-[24px]">
                            {item.food.category === 'beverage' ? 'water_drop' : 'eco'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body-md text-body-md text-on-surface font-medium truncate">{item.food.name}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 hidden sm:block">{item.food.description || "No notes"}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <input
                            className="w-14 md:w-16 p-1 border border-outline-variant rounded text-center font-data-tabular text-data-tabular focus:ring-2 focus:ring-secondary focus:border-secondary outline-none text-sm"
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(slot.id, item.id, parseFloat(e.target.value))}
                          />
                          <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">{item.food.serving_size}</span>
                        </div>
                        <div className="w-auto md:w-24 text-right shrink-0">
                          <p className="font-data-tabular text-data-tabular text-on-surface text-sm">
                            {Math.round(item.food.calories_per_serving * item.quantity)} kcal
                          </p>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeItem(slot.id, item.id); }} className="p-1 text-outline hover:text-error sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {/* Add New Slot Button */}
          <button type="button" onClick={addSlot} className="w-full py-4 border-2 border-dashed border-primary-container/50 text-primary hover:bg-primary-container/10 rounded-xl font-label-caps text-label-caps flex items-center justify-center gap-2 transition-colors uppercase tracking-wider">
            <span className="material-symbols-outlined">add_circle</span>
            Add Meal Slot
          </button>
        </div>

        {/* Right Column: Sidebar (Sticky) */}
        <div className="lg:col-span-4 space-y-4 md:space-y-6 lg:sticky lg:top-24">
          {/* Daily Summary Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant p-4 md:p-6">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">monitoring</span>
              Daily Targets
            </h3>
            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Calories</p>
                <p className="font-h2 text-h2 text-on-surface">
                  {Math.round(totals.calories).toLocaleString()} <span className="text-body-sm font-normal text-on-surface-variant">kcal</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {/* Macro: Protein */}
              <div className="bg-surface p-3 rounded-lg border border-surface-variant text-center">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Protein</p>
                <p className="font-data-tabular text-data-tabular text-on-surface text-lg font-bold">{Math.round(totals.protein)}g</p>
              </div>
              {/* Macro: Carbs */}
              <div className="bg-surface p-3 rounded-lg border border-surface-variant text-center">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Carbs</p>
                <p className="font-data-tabular text-data-tabular text-on-surface text-lg font-bold">{Math.round(totals.carbs)}g</p>
              </div>
              {/* Macro: Fats */}
              <div className="bg-surface p-3 rounded-lg border border-surface-variant text-center">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Fats</p>
                <p className="font-data-tabular text-data-tabular text-on-surface text-lg font-bold">{Math.round(totals.fat)}g</p>
              </div>
            </div>
          </div>

          {/* Quick Food Search Widget */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden flex flex-col max-h-[calc(100vh-350px)] min-h-[400px]">
            <div className="p-4 border-b border-surface-variant bg-surface space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">kitchen</span>
                  Food Bucket
                </h3>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${showFilters ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-error text-on-error rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-body-sm font-body-sm focus:ring-2 focus:ring-secondary focus:border-secondary bg-surface-container-lowest outline-none"
                  placeholder="Search foods..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setFilterCategory("")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${!filterCategory ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
                >
                  All
                </button>
                {MEAL_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFilterCategory(filterCategory === cat.value ? "" : cat.value)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${filterCategory === cat.value ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Collapsible Filter Panel */}
            {showFilters && (
              <div className="p-4 border-b border-surface-variant bg-surface-container-low space-y-4 animate-in">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Advanced Filters</span>
                  {activeFilterCount > 0 && (
                    <button type="button" onClick={clearFilters} className="text-primary text-xs font-medium hover:underline">
                      Clear All
                    </button>
                  )}
                </div>
                {/* Dietary */}
                {dietaryTags.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">Dietary</p>
                    <div className="flex flex-wrap gap-1.5">
                      {dietaryTags.map(tag => (
                        <button
                          key={tag.value}
                          type="button"
                          onClick={() => toggleDietaryFilter(tag.value)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${filterDietary.includes(tag.value) ? 'border-primary text-primary bg-primary-container/20' : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Disease */}
                {diseaseTags.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">Disease Friendly</p>
                    <div className="flex flex-wrap gap-1.5">
                      {diseaseTags.map(tag => (
                        <button
                          key={tag.value}
                          type="button"
                          onClick={() => toggleDiseaseFilter(tag.value)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${filterDisease.includes(tag.value) ? 'border-primary text-primary bg-primary-container/20' : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Region */}
                {regionTags.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">Region</p>
                    <select
                      value={filterRegion}
                      onChange={(e) => setFilterRegion(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="">All Regions</option>
                      {regionTags.map(tag => (
                        <option key={tag.value} value={tag.value}>{tag.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="overflow-y-auto p-2 flex-1 relative">
              {isSearching && (
                <div className="absolute inset-0 bg-surface/50 flex items-center justify-center z-10">
                  <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
                </div>
              )}
              
              {foodResults.length === 0 && !isSearching ? (
                <div className="text-center p-6 text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl text-outline mb-2 block">search_off</span>
                  <p className="text-sm">{searchQuery || activeFilterCount > 0 ? "No foods match your search or filters." : "Start typing or use filters to find foods."}</p>
                </div>
              ) : (
                <>
                  <p className="px-2 py-1 font-label-caps text-label-caps text-outline uppercase mt-1 mb-1">
                    {foodResults.length} Result{foodResults.length !== 1 ? 's' : ''}
                  </p>
                  {foodResults.map(food => (
                    <div key={food.id} onClick={() => addFoodToSlot(food)} className="flex items-center justify-between p-2.5 hover:bg-surface-container-low rounded-lg cursor-pointer group">
                      <div className="flex-1 min-w-0">
                        <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">{food.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-semibold text-primary">{food.calories_per_serving} kcal</span>
                          <span className="text-[10px] text-on-surface-variant">P:{food.protein_g}g</span>
                          <span className="text-[10px] text-on-surface-variant">C:{food.carbs_g}g</span>
                          <span className="text-[10px] text-on-surface-variant">F:{food.fat_g}g</span>
                        </div>
                        <p className="text-[10px] text-outline mt-0.5">{food.serving_size} • {food.category}</p>
                      </div>
                      <button type="button" disabled={!activeSlotId} className="w-8 h-8 rounded-full bg-surface-variant text-primary flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-on-primary disabled:opacity-30 disabled:cursor-not-allowed ml-2">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
