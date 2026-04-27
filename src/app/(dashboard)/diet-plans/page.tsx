import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function DietPlansPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const { data: dietPlans } = await supabase
    .from("diet_plans")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-background min-h-[calc(100vh-4rem)]">
      <div className="max-w-container-max mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-variant pb-6">
          <div>
            <h1 className="font-h1 text-h1 text-on-surface mb-2">Diet Plan Library</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage and create reusable nutritional templates for your clients.
            </p>
          </div>
          <Link
            href="/diet-plans/new"
            className="bg-primary hover:bg-surface-tint text-on-primary px-6 py-3 rounded-lg font-body-md text-body-md font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Create New Template
          </Link>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-1.5 rounded-full bg-on-surface text-surface font-body-sm text-body-sm font-medium transition-colors">
              All Templates
            </button>
            <button className="px-4 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-body-sm text-body-sm font-medium transition-colors border border-outline-variant">
              Weight Loss
            </button>
            <button className="px-4 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-body-sm text-body-sm font-medium transition-colors border border-outline-variant">
              Clinical
            </button>
            <button className="px-4 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-body-sm text-body-sm font-medium transition-colors border border-outline-variant">
              High Protein
            </button>
            <button className="px-4 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-body-sm text-body-sm font-medium transition-colors border border-outline-variant">
              Plant-Based
            </button>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="font-body-sm text-body-sm">Sort by:</span>
            <select className="bg-surface-container-lowest border border-outline-variant rounded-md py-1.5 pl-3 pr-8 font-body-sm text-body-sm focus:ring-primary focus:border-primary text-on-surface cursor-pointer">
              <option>Most Used</option>
              <option>Recently Added</option>
              <option>Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-3">
          {dietPlans && dietPlans.length > 0 ? (
            dietPlans.map((plan) => (
              <div key={plan.id} className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden flex flex-col transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] group relative">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-label-caps text-label-caps tracking-wider">
                      PLAN
                    </span>
                    <span className="text-on-surface-variant text-body-sm font-body-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">star</span> 0.0
                    </span>
                  </div>
                  <h3 className="font-h3 text-h3 text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors cursor-pointer">
                    {plan.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-6">
                    {plan.notes || "No description provided."}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-surface-container rounded-lg p-2 flex flex-col">
                      <span className="font-label-caps text-label-caps text-outline mb-1">TARGET CALORIES</span>
                      <span className="font-data-tabular text-data-tabular text-on-surface">- kcal</span>
                    </div>
                    <div className="bg-surface-container rounded-lg p-2 flex flex-col">
                      <span className="font-label-caps text-label-caps text-outline mb-1">DURATION</span>
                      <span className="font-data-tabular text-data-tabular text-on-surface">{plan.total_days} Days</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-surface-variant bg-surface-container-low p-3 px-6 flex justify-between items-center">
                  <button className="text-primary hover:text-surface-tint font-body-sm text-body-sm font-semibold transition-colors">
                    Assign to Client
                  </button>
                  <div className="flex gap-1">
                    <button className="p-2 rounded-md text-outline hover:bg-surface-variant hover:text-on-surface transition-colors tooltip-trigger relative">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="p-2 rounded-md text-outline hover:bg-surface-variant hover:text-on-surface transition-colors">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button className="p-2 rounded-md text-outline hover:bg-error-container hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Card 1 */}
              <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden flex flex-col transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] group relative">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-label-caps text-label-caps tracking-wider">
                      WEIGHT LOSS
                    </span>
                    <span className="text-on-surface-variant text-body-sm font-body-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-yellow-400">star</span> 4.9
                    </span>
                  </div>
                  <h3 className="font-h3 text-h3 text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors cursor-pointer">
                    7-Day Rapid Metabolic Reset
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-6">
                    High protein, low carb structure designed for breaking plateaus. Includes detailed hydration protocols.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-surface-container rounded-lg p-2 flex flex-col">
                      <span className="font-label-caps text-label-caps text-outline mb-1">TARGET CALORIES</span>
                      <span className="font-data-tabular text-data-tabular text-on-surface">1400 - 1600 kcal</span>
                    </div>
                    <div className="bg-surface-container rounded-lg p-2 flex flex-col">
                      <span className="font-label-caps text-label-caps text-outline mb-1">DURATION</span>
                      <span className="font-data-tabular text-data-tabular text-on-surface">7 Days (Repeatable)</span>
                    </div>
                  </div>
                  {/* Macro Preview Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-1">
                      <span>P: 40%</span>
                      <span>C: 30%</span>
                      <span>F: 30%</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden flex">
                      <div className="bg-secondary h-full" style={{ width: "40%" }}></div>
                      <div className="bg-tertiary-container h-full" style={{ width: "30%" }}></div>
                      <div className="bg-primary-container h-full" style={{ width: "30%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-surface-variant bg-surface-container-low p-3 px-6 flex justify-between items-center">
                  <button className="text-primary hover:text-surface-tint font-body-sm text-body-sm font-semibold transition-colors">
                    Assign to Client
                  </button>
                  <div className="flex gap-1">
                    <button className="p-2 rounded-md text-outline hover:bg-surface-variant hover:text-on-surface transition-colors tooltip-trigger relative">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="p-2 rounded-md text-outline hover:bg-surface-variant hover:text-on-surface transition-colors">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button className="p-2 rounded-md text-outline hover:bg-error-container hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden flex flex-col transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] group relative">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-primary-container text-on-primary-container px-2 py-1 rounded font-label-caps text-label-caps tracking-wider">
                      PLANT-BASED
                    </span>
                  </div>
                  <h3 className="font-h3 text-h3 text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors cursor-pointer">
                    Vegan Athlete Hypertrophy
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-6">
                    Optimized amino acid profiles using purely plant sources. High volume, calorie dense meals.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-surface-container rounded-lg p-2 flex flex-col">
                      <span className="font-label-caps text-label-caps text-outline mb-1">TARGET CALORIES</span>
                      <span className="font-data-tabular text-data-tabular text-on-surface">2800 - 3200 kcal</span>
                    </div>
                    <div className="bg-surface-container rounded-lg p-2 flex flex-col">
                      <span className="font-label-caps text-label-caps text-outline mb-1">DURATION</span>
                      <span className="font-data-tabular text-data-tabular text-on-surface">4 Weeks</span>
                    </div>
                  </div>
                  {/* Macro Preview Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-1">
                      <span>P: 25%</span>
                      <span>C: 55%</span>
                      <span>F: 20%</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden flex">
                      <div className="bg-secondary h-full" style={{ width: "25%" }}></div>
                      <div className="bg-tertiary-container h-full" style={{ width: "55%" }}></div>
                      <div className="bg-primary-container h-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-surface-variant bg-surface-container-low p-3 px-6 flex justify-between items-center">
                  <button className="text-primary hover:text-surface-tint font-body-sm text-body-sm font-semibold transition-colors">
                    Assign to Client
                  </button>
                  <div className="flex gap-1">
                    <button className="p-2 rounded-md text-outline hover:bg-surface-variant hover:text-on-surface transition-colors tooltip-trigger relative">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="p-2 rounded-md text-outline hover:bg-surface-variant hover:text-on-surface transition-colors">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button className="p-2 rounded-md text-outline hover:bg-error-container hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Empty State / Create New */}
          <Link href="/diet-plans/new" className="bg-surface border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-10 text-center hover:bg-surface-container-lowest hover:border-primary transition-all cursor-pointer group min-h-[320px]">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors">
              <span className="material-symbols-outlined text-[32px] text-outline group-hover:text-primary transition-colors">
                post_add
              </span>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">Build Custom Template</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[250px]">
              Start from scratch with our drag-and-drop meal builder.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
