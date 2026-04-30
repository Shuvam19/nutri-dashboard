import { FoodItemForm } from "@/components/forms/FoodItemForm";
import { getTaxonomyTagsBatch } from "@/app/actions/taxonomy";

export default async function NewFoodItemPage() {
  const tags = await getTaxonomyTagsBatch(["dietary_tag", "disease_tag", "region_tag"]);

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-background min-h-[calc(100vh-4rem)]">
      <div className="max-w-container-max mx-auto">
        <FoodItemForm
          dietaryTags={tags.dietary_tag}
          diseaseTags={tags.disease_tag}
          regionTags={tags.region_tag}
        />
      </div>
    </div>
  );
}
