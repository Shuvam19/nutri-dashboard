import { getDietPlanById } from "@/app/actions/dietPlan";
import { notFound } from "next/navigation";
import WhatsAppShareButton from "@/components/pdf/WhatsAppShareButton";
import Link from "next/link";
import { DietPlanMealWithFood } from "@/lib/types/database";

export default async function DietPlanPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const plan = await getDietPlanById(resolvedParams.id);

  if (!plan) {
    notFound();
  }

  // Group meals by day
  const mealsByDay = plan.meals.reduce((acc: Record<number, DietPlanMealWithFood[]>, meal: DietPlanMealWithFood) => {
    if (!acc[meal.day_number]) acc[meal.day_number] = [];
    acc[meal.day_number].push(meal);
    return acc;
  }, {});

  const sortedDays = Object.keys(mealsByDay)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/diet-plans" className="text-[var(--color-primary)] hover:underline text-sm font-medium">
              &larr; Back to Plans
            </Link>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
              plan.status === 'active' ? 'bg-green-100 text-green-800' :
              plan.status === 'draft' ? 'bg-amber-100 text-amber-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {plan.status}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)]">{plan.title}</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">
            Client: {plan.client?.full_name || "Unknown"} {plan.client?.age ? `(${plan.client.age}y)` : ''}
          </p>
        </div>

        <div className="flex gap-3">
          {/* Action Buttons */}
          <button className="bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] font-medium py-2 px-4 rounded-xl transition-colors shadow-sm">
            Download PDF
          </button>
          <WhatsAppShareButton plan={plan} />
        </div>
      </div>

      {/* Plan Details grid */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-[var(--color-border)] p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-foreground)]">Plan Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-[var(--color-muted-foreground)]">Duration</p>
            <p className="font-medium">{plan.total_days} Days</p>
          </div>
          <div>
            <p className="text-sm text-[var(--color-muted-foreground)]">Start Date</p>
            <p className="font-medium">{plan.start_date ? new Date(plan.start_date).toLocaleDateString() : 'Not Set'}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--color-muted-foreground)]">End Date</p>
            <p className="font-medium">{plan.end_date ? new Date(plan.end_date).toLocaleDateString() : 'Not Set'}</p>
          </div>
        </div>
        {plan.notes && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-muted-foreground)]">Notes</p>
            <p className="mt-1">{plan.notes}</p>
          </div>
        )}
      </div>

      {/* Meals Day by Day */}
      <div className="space-y-8">
        {sortedDays.map(day => {
          const dayMeals = mealsByDay[day].sort((a: any, b: any) => a.sort_order - b.sort_order);
          
          // Group by meal type
          const mealsByType = dayMeals.reduce((acc: any, meal: any) => {
            if (!acc[meal.meal_type]) acc[meal.meal_type] = [];
            acc[meal.meal_type].push(meal);
            return acc;
          }, {});

          return (
            <div key={day} className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-[var(--color-border)] overflow-hidden">
              <div className="bg-[var(--color-surface-container)] px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center">
                <h3 className="text-lg font-bold text-[var(--color-primary)]">Day {day}</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-8">
                  {Object.entries(mealsByType).map(([mealType, meals]: [string, any]) => (
                    <div key={mealType}>
                      <h4 className="text-sm font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-4 border-b border-[var(--color-border)] pb-2">
                        {mealType.replace(/_/g, ' ')}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {meals.map((meal: any) => (
                          <div key={meal.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-surface-variant)] flex items-start gap-4">
                            {meal.food_item.image_url ? (
                              <img 
                                src={meal.food_item.image_url} 
                                alt={meal.food_item.name} 
                                className="w-16 h-16 rounded-lg object-cover bg-[var(--color-surface-dim)]"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-[var(--color-surface-dim)] flex items-center justify-center text-2xl">
                                🍽️
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-[var(--color-on-surface)] leading-tight">{meal.food_item.name}</p>
                              <p className="text-sm text-[var(--color-muted-foreground)] mt-1 font-medium">
                                {meal.quantity} &times; {meal.food_item.serving_size}
                              </p>
                              {meal.custom_instructions && (
                                <p className="text-xs text-[var(--color-tertiary)] mt-2 bg-[var(--color-tertiary-fixed)] px-2 py-1 rounded-md inline-block">
                                  Note: {meal.custom_instructions}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        {sortedDays.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[var(--color-border)]">
            <p className="text-[var(--color-muted-foreground)]">No meals added to this plan yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
