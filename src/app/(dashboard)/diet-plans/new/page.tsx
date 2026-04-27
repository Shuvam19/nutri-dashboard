import { MealBuilder } from "@/components/meal-builder/MealBuilder";

export default function NewDietPlanPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-background p-6 md:p-8 min-h-[calc(100vh-4rem)]">
      <div className="max-w-container-max mx-auto">
        <MealBuilder />
      </div>
    </div>
  );
}
