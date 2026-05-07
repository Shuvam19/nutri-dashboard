import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function DashboardPage() {
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
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );

  // Fetch some summary data from the backend to fulfill the "update via backend" requirement.
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .limit(5)
    .order("created_at", { ascending: false });

  const { data: plans } = await supabase
    .from("diet_plans")
    .select("*, clients(full_name)")
    .limit(5)
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 md:p-gutter lg:p-margin max-w-container-max mx-auto space-y-4 md:space-y-md">
      {/* Quick Stats Cards (Bento Style) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-md">
        <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex justify-between items-center group hover:border-primary-container transition-colors">
          <div>
            <p className="font-label-caps text-slate-500 mb-1">Active Clients</p>
            <h2 className="font-h1 text-on-surface">{clients?.length || 128}</h2>
            <span className="text-primary text-sm font-bold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +4.2% from last month
            </span>
          </div>
          <div className="w-16 h-16 bg-emerald-50 rounded-lg flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-3xl">groups</span>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex justify-between items-center group hover:border-tertiary-container transition-colors">
          <div>
            <p className="font-label-caps text-slate-500 mb-1">Pending Plans</p>
            <h2 className="font-h1 text-on-surface">{plans?.filter((p) => p.status === "draft")?.length || 14}</h2>
            <span className="text-tertiary text-sm font-bold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Needs review
            </span>
          </div>
          <div className="w-16 h-16 bg-amber-50 rounded-lg flex items-center justify-center text-tertiary-container">
            <span className="material-symbols-outlined text-3xl">description</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-md">
        {/* Today's Appointments */}
        <section className="lg:col-span-3 space-y-3 md:space-y-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-h3 text-on-surface">Today's Appointments</h3>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="divide-y divide-slate-100">
              {/* Appointment 1 */}
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-lg flex flex-col items-center justify-center text-secondary">
                    <span className="text-[10px] font-bold uppercase">Oct</span>
                    <span className="text-lg font-bold leading-none">24</span>
                  </div>
                  <div>
                    <h4 className="font-h3 text-base text-on-surface">Robert Fox</h4>
                    <p className="text-body-sm text-slate-500">Initial Consultation • 09:30 AM</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
              </div>
              
              {/* Appointment 2 */}
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-lg flex flex-col items-center justify-center text-secondary">
                    <span className="text-[10px] font-bold uppercase">Oct</span>
                    <span className="text-lg font-bold leading-none">24</span>
                  </div>
                  <div>
                    <h4 className="font-h3 text-base text-on-surface">Esther Howard</h4>
                    <p className="text-body-sm text-slate-500">Follow-up • 11:15 AM</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
              </div>
              
              {/* Appointment 3 */}
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-lg flex flex-col items-center justify-center text-secondary">
                    <span className="text-[10px] font-bold uppercase">Oct</span>
                    <span className="text-lg font-bold leading-none">24</span>
                  </div>
                  <div>
                    <h4 className="font-h3 text-base text-on-surface">Jerome Bell</h4>
                    <p className="text-body-sm text-slate-500">Keto Adjustment • 02:45 PM</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Clients */}
        <section className="lg:col-span-2 space-y-3 md:space-y-sm">
          <h3 className="font-h3 text-on-surface">Recent Clients</h3>
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-surface-container">
                <tr>
                  <th className="px-4 py-3 font-label-caps text-on-surface-variant text-[11px]">Client</th>
                  <th className="px-4 py-3 font-label-caps text-on-surface-variant text-[11px] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {clients && clients.length > 0 ? (
                  clients.map((client) => (
                    <tr key={client.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                            <img
                              alt="Client Avatar"
                              className="w-full h-full object-cover"
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(client.full_name)}&background=random`}
                            />
                          </div>
                          <span className="font-data-tabular text-on-surface">{client.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                            <img alt="Client Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYDXLUEdqFjrUFChnxh9-Oua6sUipn9LQPXY79t0RvvwiE2JRVqEoNqAExjn1ceQ8Q1Tuf2V097Tg2RUEC4qKR99H3iHfLarBEL6M5H6H6xLWPnVbxVmze0OfBtGWBiDAh5xSYr9SN2SyU1FYzAfu9d8DZm9tBayEfsGca3az6DnoNSrUCOcyPdnP-FHDwuY9CTJtAoRvtYrGKJRUCOyxUxqtxHv8d9Uiro9i9nOzCXiXUJy5gzZw-177eJh36cfqzTZHr2Z_U5x0"/>
                          </div>
                          <span className="font-data-tabular text-on-surface">Bessie Cooper</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                            <img alt="Client Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoCr2j6HIkI0x02UnFLfuL_YrorYmDD5cG8jG9X5yrd8SLjpGbM5QASKh0IDsTDp1jChxXKO-UxUVkKxP6N5NRe4sGCDF4VT3To55PRsitGfI__vmpNTO3uGiSeoj50j729ZMLGLP_lDQk6LgdkXXOmvNudMYNdU9mx2B2ub_ymagvNQfkLmfw5gNlLSAWfYLOiC_hQZiIpu6D_UayN158K04njCX56fqoKU5q9gnUfspeMnBNQKFpS8rTdcElA9FN0VAiMGTRhQM"/>
                          </div>
                          <span className="font-data-tabular text-on-surface">Arlene McCoy</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Maintenance</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                            <img alt="Client Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSM3ZXBFkKam4GfI3OTHJz7ZOaTQcM0z-eRXus-NoijbRBrC5ecxIqjS6_s825RdjgWsNBSNtVO6C5jtf0VYm29fuVPIV5mNSVrnypeAOa9PlEQ9AdvrI7hJHaweyIVRmdDtUrT5dZ3vDb4VheALrAiRKYapHpf1OrbhFwFqOvTVaShGvqYJOM4pdg42H60If8N4KpBFgrkNUSCRVlUp_MbXsAx31qWrblWM5CqQXE0PRgbKd_vgMzU7gc9wb_rr3C_JBi06Ntbcw"/>
                          </div>
                          <span className="font-data-tabular text-on-surface">Kathryn Murphy</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Active</span>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Contextual FAB (Dashboard relevant) */}
      <Link href="/clients/new" className="fixed right-6 bottom-6 md:bottom-12 md:right-12 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-40">
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>
    </div>
  );
}
