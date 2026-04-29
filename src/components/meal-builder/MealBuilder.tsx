"use client";

import React, { useState, useEffect, useActionState } from "react";
import Link from "next/link";
import { saveDietPlan, searchFoodItems, getClientsList } from "@/app/actions/dietPlan";
import { FoodItem, MealSlot } from "@/lib/types/database";

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

export function MealBuilder() {
  const [state, formAction, isPending] = useActionState(saveDietPlan, null);
  
  // Basic Info State
  const [title, setTitle] = useState("New Template");
  const [clientId, setClientId] = useState("");
  const [totalDays, setTotalDays] = useState(7);
  
  // Data State
  const [clients, setClients] = useState<{id: string; full_name: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [foodResults, setFoodResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Builder State
  const [slots, setSlots] = useState<Slot[]>([
    { id: "slot-1", meal_type: "early_morning", items: [] },
    { id: "slot-2", meal_type: "breakfast", items: [] }
  ]);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(slots[0].id);

  // Fetch initial clients
  useEffect(() => {
    getClientsList().then(data => setClients(data));
  }, []);

  // Search Foods Effect with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchFoodItems(searchQuery);
      setFoodResults(results);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
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
              className="font-h2 text-h2 text-on-surface bg-transparent border-b border-transparent hover:border-outline-variant focus:border-primary focus:outline-none transition-colors w-full max-w-md"
              placeholder="Template Title"
              required
            />
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-2 min-w-[200px]">
              <span className="material-symbols-outlined text-outline">person</span>
              <select 
                name="client_id"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-body-sm font-body-sm focus:ring-0 text-on-surface cursor-pointer outline-none"
              >
                <option value="">Template (No Client)</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.full_name}</option>
                ))}
              </select>
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
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/diet-plans"
            className="px-4 py-2 rounded-lg font-label-caps text-label-caps text-secondary border border-secondary hover:bg-secondary-fixed transition-colors flex items-center gap-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending || mealPayload.length === 0}
            className="px-4 py-2 rounded-lg font-label-caps text-label-caps text-on-primary bg-primary hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
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
                <div className={`border-b p-4 flex items-center justify-between ${isActive ? 'bg-primary-container/10 border-primary/20' : 'bg-surface border-surface-variant'}`}>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary-container">{labelInfo.icon}</span>
                    <select 
                      value={slot.meal_type} 
                      onChange={(e) => changeSlotType(slot.id, e.target.value as MealSlot)}
                      className="font-h3 text-h3 text-on-surface bg-transparent border-none p-0 focus:ring-0 cursor-pointer outline-none"
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
                      <span className="text-primary font-label-caps text-label-caps text-xs flex items-center gap-1 uppercase tracking-wider bg-primary-container/30 px-2 py-1 rounded">
                        <span className="material-symbols-outlined text-[14px]">edit</span> Active Slot
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
                      <div key={item.id} className={`flex items-center gap-4 p-2 hover:bg-surface-container-low rounded-lg group transition-colors ${index > 0 ? 'border-t border-surface-variant border-dashed' : ''}`}>
                        <div className="w-10 h-10 rounded bg-secondary-container/20 flex items-center justify-center text-secondary flex-shrink-0">
                          <span className="material-symbols-outlined">
                            {item.food.category === 'beverage' ? 'water_drop' : 'eco'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-body-md text-body-md text-on-surface font-medium">{item.food.name}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">{item.food.description || "No notes"}</p>
                        </div>
                        <div className="flex items-center gap-2 w-32">
                          <input
                            className="w-16 p-1 border border-outline-variant rounded text-center font-data-tabular text-data-tabular focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(slot.id, item.id, parseFloat(e.target.value))}
                          />
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{item.food.serving_size}</span>
                        </div>
                        <div className="w-24 text-right">
                          <p className="font-data-tabular text-data-tabular text-on-surface">
                            {Math.round(item.food.calories_per_serving * item.quantity)} kcal
                          </p>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeItem(slot.id, item.id); }} className="p-1 text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined">delete</span>
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
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* Daily Summary Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant p-6">
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-y-auto p-2 flex-1 relative">
              {isSearching && (
                <div className="absolute inset-0 bg-surface/50 flex items-center justify-center z-10">
                  <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
                </div>
              )}
              
              {foodResults.length === 0 && !isSearching ? (
                <div className="text-center p-6 text-on-surface-variant">
                  {searchQuery ? "No foods found." : "Start typing to search your Food Bucket."}
                </div>
              ) : (
                <>
                  <p className="px-2 py-1 font-label-caps text-label-caps text-outline uppercase mt-2 mb-1">
                    Results
                  </p>
                  {foodResults.map(food => (
                    <div key={food.id} onClick={() => addFoodToSlot(food)} className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded-lg cursor-pointer group">
                      <div>
                        <p className="font-body-sm text-body-sm text-on-surface font-medium">{food.name}</p>
                        <p className="font-data-tabular text-data-tabular text-outline text-[12px]">
                          {food.serving_size} • {food.calories_per_serving} kcal
                        </p>
                      </div>
                      <button type="button" disabled={!activeSlotId} className="w-8 h-8 rounded-full bg-surface-variant text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-on-primary disabled:opacity-30 disabled:cursor-not-allowed">
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
