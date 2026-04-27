import { FoodItemForm } from "@/components/forms/FoodItemForm";

export default function NewFoodItemPage() {
  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-background min-h-[calc(100vh-4rem)]">
      <div className="max-w-container-max mx-auto">
        <FoodItemForm />
      </div>
    </div>
  );
}
