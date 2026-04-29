import Link from "next/link";
import { getDietPlanById } from "@/app/actions/dietPlan";
import { notFound } from "next/navigation";

export default async function EditDietPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const plan = await getDietPlanById(resolvedParams.id);

  if (!plan) {
    notFound();
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6 md:p-8 min-h-[calc(100vh-4rem)]">
      <div className="max-w-container-max mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-variant pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href={`/diet-plans/${plan.id}`} className="text-primary hover:underline text-sm font-medium">
                &larr; Back to Preview
              </Link>
            </div>
            <h1 className="font-h1 text-h1 text-on-surface mb-2">Edit Diet Plan</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Editing: <span className="font-semibold text-on-surface">{plan.title}</span>
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant p-10 text-center">
          <span className="material-symbols-outlined text-[48px] text-outline mb-4">construction</span>
          <h2 className="font-h2 text-h2 text-on-surface mb-2">Edit Mode Coming Soon</h2>
          <p className="text-on-surface-variant max-w-lg mx-auto">
            The full interactive MealBuilder pre-populated with this plan's data is currently under construction. 
            For now, you can view the plan details or delete it if it's no longer needed.
          </p>
          <div className="mt-8">
            <Link href={`/diet-plans/${plan.id}`} className="bg-primary hover:bg-surface-tint text-on-primary px-6 py-3 rounded-lg font-body-md text-body-md font-semibold inline-flex items-center gap-2 transition-all shadow-sm">
              <span className="material-symbols-outlined">visibility</span>
              View Plan Preview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
