import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import DietPlanActions from "@/components/diet-plans/DietPlanActions";

export default async function DietPlansPage({ searchParams }: { searchParams: Promise<{ type?: string, sort?: string }> }) {
  const resolvedParams = await searchParams;
  const filterType = resolvedParams.type || 'template';
  const sortBy = resolvedParams.sort || 'recent';

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

  let query = supabase
    .from("diet_plans")
    .select(`
      *,
      diet_plan_meals (
        quantity,
        food_items (
          calories_per_serving,
          protein_g,
          carbs_g,
          fat_g
        )
      )
    `);

  if (filterType === 'template') {
    query = query.is("client_id", null);
  } else if (filterType === 'client') {
    query = query.not("client_id", "is", null);
  }

  if (sortBy === 'recent') {
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === 'oldest') {
    query = query.order("created_at", { ascending: true });
  }

  const { data: dietPlans } = await query;

  const dynamicPlans = dietPlans?.map(plan => {
    let totalCal = 0;
    let totalPro = 0;
    let totalCarb = 0;
    let totalFat = 0;
    
    plan.diet_plan_meals?.forEach((meal: any) => {
      const food = meal.food_items;
      if (food) {
        totalCal += food.calories_per_serving * meal.quantity;
        totalPro += food.protein_g * meal.quantity;
        totalCarb += food.carbs_g * meal.quantity;
        totalFat += food.fat_g * meal.quantity;
      }
    });

    const sumMacros = totalPro + totalCarb + totalFat;
    const pPct = sumMacros ? Math.round((totalPro / sumMacros) * 100) : 0;
    const cPct = sumMacros ? Math.round((totalCarb / sumMacros) * 100) : 0;
    const fPct = sumMacros ? Math.round((totalFat / sumMacros) * 100) : 0;

    return { 
      ...plan, 
      totalCal: Math.round(totalCal), 
      pPct, 
      cPct, 
      fPct,
      hasMeals: plan.diet_plan_meals?.length > 0
    };
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background min-h-[calc(100vh-4rem)]">
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
            className="bg-primary hover:bg-surface-tint text-on-primary px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-body-md text-body-md font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] shrink-0"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Create New Template
          </Link>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 flex-1">
            <Link href={`/diet-plans?type=all&sort=${sortBy}`} className={`px-4 py-1.5 rounded-full font-body-sm text-body-sm font-medium transition-colors border ${filterType === 'all' ? 'bg-on-surface text-surface border-transparent' : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant border-outline-variant'}`}>
              All Plans
            </Link>
            <Link href={`/diet-plans?type=template&sort=${sortBy}`} className={`px-4 py-1.5 rounded-full font-body-sm text-body-sm font-medium transition-colors border ${filterType === 'template' ? 'bg-on-surface text-surface border-transparent' : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant border-outline-variant'}`}>
              Templates
            </Link>
            <Link href={`/diet-plans?type=client&sort=${sortBy}`} className={`px-4 py-1.5 rounded-full font-body-sm text-body-sm font-medium transition-colors border ${filterType === 'client' ? 'bg-on-surface text-surface border-transparent' : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant border-outline-variant'}`}>
              Client Plans
            </Link>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="font-body-sm text-body-sm">Sort by:</span>
            <div className="flex bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
              <Link href={`/diet-plans?type=${filterType}&sort=recent`} className={`px-3 py-1.5 font-body-sm text-body-sm transition-colors ${sortBy === 'recent' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-surface-variant'}`}>
                Recent
              </Link>
              <Link href={`/diet-plans?type=${filterType}&sort=oldest`} className={`px-3 py-1.5 font-body-sm text-body-sm transition-colors border-l border-outline-variant ${sortBy === 'oldest' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-surface-variant'}`}>
                Oldest
              </Link>
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-3">
          {dynamicPlans && dynamicPlans.length > 0 ? (
            dynamicPlans.map((plan) => (
              <div key={plan.id} className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden flex flex-col transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] group relative">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-label-caps text-label-caps tracking-wider">
                      {plan.client_id ? 'CLIENT PLAN' : 'TEMPLATE'}
                    </span>
                  </div>
                  <h3 className="font-h3 text-h3 text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors cursor-pointer">
                    {plan.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-6">
                    {plan.notes || "Custom created plan."}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-surface-container rounded-lg p-2 flex flex-col">
                      <span className="font-label-caps text-label-caps text-outline mb-1">TARGET CALORIES</span>
                      <span className="font-data-tabular text-data-tabular text-on-surface">{plan.totalCal.toLocaleString()} kcal</span>
                    </div>
                    <div className="bg-surface-container rounded-lg p-2 flex flex-col">
                      <span className="font-label-caps text-label-caps text-outline mb-1">DURATION</span>
                      <span className="font-data-tabular text-data-tabular text-on-surface">{plan.total_days} Days</span>
                    </div>
                  </div>
                  
                  {plan.hasMeals && (
                    <div className="mb-2">
                      <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-1">
                        <span>P: {plan.pPct}%</span>
                        <span>C: {plan.cPct}%</span>
                        <span>F: {plan.fPct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden flex">
                        <div className="bg-secondary h-full" style={{ width: `${plan.pPct}%` }}></div>
                        <div className="bg-tertiary-container h-full" style={{ width: `${plan.cPct}%` }}></div>
                        <div className="bg-primary-container h-full" style={{ width: `${plan.fPct}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t border-surface-variant bg-surface-container-low p-3 px-6 flex justify-between items-center">
                  <button className="text-primary hover:text-surface-tint font-body-sm text-body-sm font-semibold transition-colors">
                    Assign to Client
                  </button>
                  <DietPlanActions planId={plan.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 text-on-surface-variant">
              No diet plans found.
            </div>
          )}

          {/* Create New */}
          <Link href="/diet-plans/new" className="bg-surface border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-10 text-center hover:bg-surface-container-lowest hover:border-primary transition-all cursor-pointer group min-h-[320px]">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors">
              <span className="material-symbols-outlined text-[32px] text-outline group-hover:text-primary transition-colors">
                post_add
              </span>
            </div>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">Build Custom Template</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[250px]">
              Start from scratch with our dynamic meal builder.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
