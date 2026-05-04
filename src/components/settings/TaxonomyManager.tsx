"use client";

import React, { useState } from "react";
import { TaxonomyTagRow } from "@/lib/types";
import { 
  createTaxonomyTag, 
  updateTaxonomyTag, 
  deleteTaxonomyTag, 
  toggleTaxonomyTag 
} from "@/app/actions/taxonomy";

interface CategoryData {
  category: string;
  label: string;
  tags: TaxonomyTagRow[];
}

interface TaxonomyManagerProps {
  initialData: CategoryData[];
}

export default function TaxonomyManager({ initialData }: TaxonomyManagerProps) {
  const [activeCategory, setActiveCategory] = useState(initialData[0]?.category || "");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const currentCategory = initialData.find((c) => c.category === activeCategory);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setIsPending(true);
    const result = await toggleTaxonomyTag(id, !currentStatus);
    if (result.success) {
      setMessage({ type: "success", text: "Tag updated successfully." });
    } else {
      setMessage({ type: "error", text: result.message || "Failed to update tag." });
    }
    setIsPending(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag? This may affect existing data.")) return;
    setIsPending(true);
    const result = await deleteTaxonomyTag(id);
    if (result.success) {
      setMessage({ type: "success", text: "Tag deleted successfully." });
    } else {
      setMessage({ type: "error", text: result.message || "Failed to delete tag." });
    }
    setIsPending(false);
  };

  const handleAddTag = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    formData.append("category", activeCategory);
    
    const result = await createTaxonomyTag(formData);
    if (result.success) {
      setMessage({ type: "success", text: "Tag added successfully." });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ type: "error", text: result.message || "Failed to add tag." });
    }
    setIsPending(false);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center justify-between ${
          message.type === "success" ? "bg-primary-container/20 text-primary border border-primary/20" : "bg-error-container/20 text-error border border-error/20"
        }`}>
          <span className="text-sm font-medium">{message.text}</span>
          <button onClick={() => setMessage(null)} className="material-symbols-outlined text-[18px]">close</button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {initialData.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.category
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tags Table */}
      <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface">
        <form onSubmit={handleAddTag}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">Machine Value</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">Display Label</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant text-center">Sort Order</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant text-center">Status</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
            {currentCategory?.tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-surface-container/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-secondary">{tag.value}</td>
                <td className="px-4 py-3 font-medium text-on-surface">{tag.label}</td>
                <td className="px-4 py-3 text-center font-data-tabular">{tag.sort_order}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleToggleActive(tag.id, tag.is_active)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      tag.is_active 
                        ? "bg-primary-container/10 border-primary/30 text-primary" 
                        : "bg-outline/10 border-outline/30 text-outline"
                    }`}
                  >
                    <span className="w-1 h-1 rounded-full bg-current"></span>
                    {tag.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(tag.id)}
                      className="p-1.5 rounded-lg text-outline hover:bg-error-container/20 hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* Add New Row */}
            <tr className="bg-surface-container-lowest/50">
              <td className="px-4 py-3">
                <input
                  name="value"
                  required
                  placeholder="machine_key"
                  className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-1 text-xs font-mono"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  name="label"
                  required
                  placeholder="Display Label"
                  className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-1 text-sm"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  name="sort_order"
                  type="number"
                  defaultValue="0"
                  className="w-16 mx-auto bg-transparent border-b border-outline-variant focus:border-primary outline-none py-1 text-sm text-center"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-[10px] font-bold text-outline uppercase">New</span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary text-on-primary px-3 py-1 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  </div>
);
}
