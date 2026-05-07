import Link from "next/link";
import { getPaginatedFoods } from "@/app/actions/food";
import { getTaxonomyTagsBatch } from "@/app/actions/taxonomy";
import FoodFiltersSidebar from "@/components/food-bucket/FoodFiltersSidebar";

export default async function FoodBucketPage({ searchParams }: { searchParams: Promise<{ page?: string, search?: string, dietary?: string, disease?: string, region?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const search = resolvedSearchParams.search || "";
  const dietary = resolvedSearchParams.dietary || "";
  const disease = resolvedSearchParams.disease || "";
  const region = resolvedSearchParams.region || "";

  const limit = 12;

  const [{ data: foodItems, count }, tags] = await Promise.all([
    getPaginatedFoods(page, limit, { search, dietary, disease, region }),
    getTaxonomyTagsBatch(["dietary_tag", "disease_tag", "region_tag"]),
  ]);

  const totalPages = Math.ceil(count / limit);
  const startCount = count > 0 ? (page - 1) * limit + 1 : 0;
  const endCount = Math.min(page * limit, count);

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (dietary) params.set("dietary", dietary);
  if (disease) params.set("disease", disease);
  if (region) params.set("region", region);
  const searchParamString = params.toString() ? `&${params.toString()}` : '';

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-background min-h-[calc(100vh-4rem)]">
      <FoodFiltersSidebar
        dietaryTags={tags.dietary_tag}
        diseaseTags={tags.disease_tag}
        regionTags={tags.region_tag}
      />

      {/* Main Grid Area */}
      <div className="flex-1 p-4 md:p-8 bg-background overflow-y-auto">
        <div className="max-w-container-max mx-auto">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="font-h1 text-h1 text-on-background">Food Bucket</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Showing {startCount} - {endCount} of {count} master database entries.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-surface-container-highest rounded-lg p-1">
                <button className="p-1.5 rounded bg-surface shadow-sm text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button className="p-1.5 rounded text-on-surface-variant hover:text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">view_list</span>
                </button>
              </div>
              <Link
                href="/food-bucket/new"
                className="bg-primary hover:bg-primary-fixed-dim text-on-primary px-4 py-2 rounded-lg font-body-sm text-body-sm font-semibold flex items-center gap-2 shadow-[0_4px_14px_0_rgba(0,108,73,0.39)] transition-all"
              >
                <span className="material-symbols-outlined">add</span>
                Add New Food
              </Link>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {foodItems && foodItems.length > 0 ? (
              foodItems.map((food) => (
                <div key={food.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
                  <div className="h-40 w-full relative overflow-hidden bg-surface-variant">
                    {food.image_url && (
                      <img alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={food.image_url} />
                    )}
                    <div className="absolute top-3 right-3 flex gap-1">
                      {food.dietary_tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="bg-white/90 backdrop-blur text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                          {tag.substring(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-h3 text-h3 text-on-surface leading-tight mb-1">{food.name}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                      {food.region_tags?.[0] || 'Global'} • {food.category}
                    </p>
                    <div className="mt-auto">
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-h2 text-h2 text-primary">{food.calories_per_serving}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mb-1">kcal / {food.serving_size}</span>
                      </div>
                      {/* Macros */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-outline-variant/20">
                        <div className="text-center">
                          <div className="font-data-tabular text-data-tabular text-on-surface">{food.protein_g}g</div>
                          <div className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">PRO</div>
                        </div>
                        <div className="text-center border-l border-r border-outline-variant/20">
                          <div className="font-data-tabular text-data-tabular text-on-surface">{food.carbs_g}g</div>
                          <div className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">CARB</div>
                        </div>
                        <div className="text-center">
                          <div className="font-data-tabular text-data-tabular text-on-surface">{food.fat_g}g</div>
                          <div className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">FAT</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty state or mock items
              <>

              </>
            )}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              {page > 1 ? (
                <Link
                  href={`/food-bucket?page=${page - 1}${searchParamString}`}
                  className="px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface font-body-sm text-body-sm hover:bg-surface-variant transition-colors"
                >
                  Previous
                </Link>
              ) : (
                <button disabled className="px-4 py-2 bg-surface border border-outline-variant/50 rounded-lg text-on-surface/50 font-body-sm text-body-sm cursor-not-allowed">
                  Previous
                </button>
              )}

              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Page <span className="font-bold text-on-surface">{page}</span> of {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`/food-bucket?page=${page + 1}${searchParamString}`}
                  className="px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface font-body-sm text-body-sm hover:bg-surface-variant transition-colors"
                >
                  Next
                </Link>
              ) : (
                <button disabled className="px-4 py-2 bg-surface border border-outline-variant/50 rounded-lg text-on-surface/50 font-body-sm text-body-sm cursor-not-allowed">
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
