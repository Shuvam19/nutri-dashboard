import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export default async function FoodBucketPage() {
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

  // Fetch from the backend
  const { data: foodItems } = await supabase
    .from("food_items")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-background min-h-[calc(100vh-4rem)]">
      {/* Filter Sidebar */}
      <aside className="w-full md:w-72 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col overflow-y-auto z-10 flex-shrink-0">
        <div className="p-6 border-b border-outline-variant/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-h3 text-h3 text-on-surface">Filters</h2>
            <button className="text-primary font-body-sm text-body-sm hover:underline">Clear All</button>
          </div>
          {/* Mobile Search */}
          <div className="md:hidden mb-4 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary" placeholder="Search foods..." type="text"/>
          </div>
        </div>
        
        <div className="p-6 flex flex-col gap-8">
          {/* Dietary Preference */}
          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4">Dietary Preference</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer" type="checkbox"/>
                <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Vegetarian</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer" type="checkbox"/>
                <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Vegan</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer" type="checkbox"/>
                <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Pescatarian</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer" type="checkbox"/>
                <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Gluten-Free</span>
              </label>
            </div>
          </div>
          
          {/* Disease Compatibility */}
          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4">Disease Compatibility</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 rounded-full border border-primary text-primary font-body-sm text-body-sm bg-primary-container/10 hover:bg-primary-container/20 transition-colors">Diabetes-friendly</button>
              <button className="px-3 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-body-sm text-body-sm hover:border-primary hover:text-primary transition-colors">Heart-healthy</button>
              <button className="px-3 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-body-sm text-body-sm hover:border-primary hover:text-primary transition-colors">Low-FODMAP</button>
              <button className="px-3 py-1.5 rounded-full border border-primary text-primary font-body-sm text-body-sm bg-primary-container/10 hover:bg-primary-container/20 transition-colors">Hypertension</button>
            </div>
          </div>
          
          {/* Region */}
          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4">Region / Cuisine</h3>
            <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:border-primary">
              <option>All Regions</option>
              <option>Mediterranean</option>
              <option>East Asian</option>
              <option>South Asian</option>
              <option>Latin American</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Grid Area */}
      <div className="flex-1 p-6 md:p-8 bg-background overflow-y-auto">
        <div className="max-w-container-max mx-auto">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="font-h1 text-h1 text-on-background">Food Bucket</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Showing {foodItems?.length || 0} master database entries.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foodItems && foodItems.length > 0 ? (
              foodItems.map((food) => (
                <div key={food.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
                  <div className="h-40 w-full relative overflow-hidden bg-surface-variant">
                    {food.image_url && (
                      <img alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={food.image_url}/>
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
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
                  <div className="h-40 w-full relative overflow-hidden bg-surface-variant">
                    <img alt="Quinoa Salad Bowl" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKqX29ca5ig5lf_oBDM5ygrxrdrIlwEp6NxPWnWFbLhbg4FpMST1YfMG05JnbmQZIB3aJl4VsinjdJfvJ41fPko7anAiRQuFITfvdf8dTi0agI7nedd5wkobGSHs9vpFfqekT9KofTwdZG_dihcHKmd0Zem-pRt1oG_Yv38e2Kf-u-vTsH1aBpIkqOg1dR_kq8P5nkoHoYikAiB9N89nB1hWFuu7srstDpi8buDCvFYMDipCZd5DjghJymQFocqI9n35c3AfToIsE"/>
                    <div className="absolute top-3 right-3 flex gap-1">
                      <span className="bg-white/90 backdrop-blur text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">V</span>
                      <span className="bg-white/90 backdrop-blur text-tertiary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">GF</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-h3 text-h3 text-on-surface leading-tight mb-1">Quinoa Power Bowl</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Mediterranean • Lunch</p>
                    <div className="mt-auto">
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-h2 text-h2 text-primary">340</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mb-1">kcal / 100g</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-outline-variant/20">
                        <div className="text-center">
                          <div className="font-data-tabular text-data-tabular text-on-surface">12g</div>
                          <div className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">PRO</div>
                        </div>
                        <div className="text-center border-l border-r border-outline-variant/20">
                          <div className="font-data-tabular text-data-tabular text-on-surface">45g</div>
                          <div className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">CARB</div>
                        </div>
                        <div className="text-center">
                          <div className="font-data-tabular text-data-tabular text-on-surface">8g</div>
                          <div className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">FAT</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
                  <div className="h-40 w-full relative overflow-hidden bg-surface-variant">
                    <img alt="Grilled Salmon" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQJUauyIkBDjCGcib2G4NmXZem8FAxyWYWNBFozdGIeUbSF68McPYscBptQN1YSpm_33EUblKJYqCDoZ5G-ipdWvEFtkn-QmhAh3wMHQCg2ogUrOzrgoC0mdC1-Tq2znujKy7VzDqKVcvUwjB34r1ndrRS3qGZRVChDXqAZf1AXiTfiN3n8T5gCw7dOndLHs-byJ-70xov6eQT_VzD8okwHgSSFhhd5xWwz8A36E7PNlBcrMMBlb6oy8abz_Fz1ljAKUIcn-eooWs"/>
                    <div className="absolute top-3 right-3 flex gap-1">
                      <span className="bg-secondary/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">Pesc</span>
                      <span className="bg-white/90 backdrop-blur text-tertiary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">GF</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-h3 text-h3 text-on-surface leading-tight mb-1">Wild Caught Salmon</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Global • Dinner</p>
                    <div className="mt-auto">
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-h2 text-h2 text-primary">208</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mb-1">kcal / 100g</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-outline-variant/20">
                        <div className="text-center">
                          <div className="font-data-tabular text-data-tabular text-on-surface">20g</div>
                          <div className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">PRO</div>
                        </div>
                        <div className="text-center border-l border-r border-outline-variant/20">
                          <div className="font-data-tabular text-data-tabular text-on-surface">0g</div>
                          <div className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">CARB</div>
                        </div>
                        <div className="text-center">
                          <div className="font-data-tabular text-data-tabular text-on-surface">13g</div>
                          <div className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">FAT</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
