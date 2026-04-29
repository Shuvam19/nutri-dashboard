"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteDietPlan } from "@/app/actions/dietPlan";

export default function DietPlanActions({ planId }: { planId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this diet plan? This action cannot be undone.")) {
      startTransition(async () => {
        const res = await deleteDietPlan(planId);
        if (!res.success) {
          alert(res.message || "Failed to delete diet plan");
        }
      });
    }
  };

  return (
    <div className="flex gap-1">
      <Link href={`/diet-plans/${planId}`} className="p-2 rounded-md text-outline hover:bg-surface-variant hover:text-on-surface transition-colors tooltip-trigger relative" title="View Plan">
        <span className="material-symbols-outlined text-[20px]">visibility</span>
      </Link>
      <Link href={`/diet-plans/${planId}/edit`} className="p-2 rounded-md text-outline hover:bg-surface-variant hover:text-on-surface transition-colors" title="Edit Plan">
        <span className="material-symbols-outlined text-[20px]">edit</span>
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isPending}
        title="Delete Plan"
        className="p-2 rounded-md text-outline hover:bg-error-container hover:text-error transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[20px]">delete</span>
      </button>
    </div>
  );
}
