import { MealBuilder } from "@/components/meal-builder/MealBuilder";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function NewDietPlanPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { client } = await searchParams;
  const clientId = typeof client === "string" ? client : undefined;

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6 md:p-8 min-h-[calc(100vh-4rem)]">
      <div className="max-w-container-max mx-auto">
        <MealBuilder initialClientId={clientId} />
      </div>
    </div>
  );
}

