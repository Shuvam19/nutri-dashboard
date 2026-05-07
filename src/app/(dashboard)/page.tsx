import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  // ── Fetch all real stats ──────────────────────────────────
  const { count: totalClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: totalPlans } = await supabase
    .from("diet_plans")
    .select("*", { count: "exact", head: true });

  const { count: draftPlans } = await supabase
    .from("diet_plans")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft");

  const { count: totalAppointments } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("status", "scheduled");

  // ── Today's appointments ──────────────────────────────────
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

  const { data: todayAppointments } = await supabase
    .from("appointments")
    .select("*, clients(full_name)")
    .gte("appointment_date", startOfDay)
    .lt("appointment_date", endOfDay)
    .neq("status", "cancelled")
    .order("appointment_date", { ascending: true })
    .limit(5);

  // ── Recent clients ─────────────────────────────────────────
  const { data: recentClients } = await supabase
    .from("clients")
    .select("id, full_name, status, created_at, dietary_preference")
    .order("created_at", { ascending: false })
    .limit(5);

  // ── Recent diet plans ──────────────────────────────────────
  const { data: recentPlans } = await supabase
    .from("diet_plans")
    .select("id, title, status, created_at, clients(full_name)")
    .order("created_at", { ascending: false })
    .limit(5);

  // Format helpers
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const appointmentTypeLabel = (type: string) => {
    switch (type) {
      case "initial_consultation": return "Initial Consultation";
      case "follow_up": return "Follow-up";
      case "check_in": return "Check-in";
      default: return type.replace(/_/g, " ");
    }
  };

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-100 text-emerald-800";
      case "inactive": return "bg-slate-100 text-slate-600";
      case "completed": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-amber-100 text-amber-800";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const todayStr = today.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const todayDate = today.getDate();

  return (
    <div className="p-4 md:p-gutter lg:p-margin max-w-container-max mx-auto space-y-4 md:space-y-md">
      {/* Quick Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-md">
        {/* Active Clients */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex justify-between items-center group hover:border-primary-container transition-colors">
          <div>
            <p className="font-label-caps text-slate-500 mb-1 text-[10px] md:text-[11px]">Active Clients</p>
            <h2 className="font-h1 text-on-surface text-2xl md:text-4xl">{totalClients ?? 0}</h2>
            <span className="text-primary text-xs md:text-sm font-bold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs md:text-sm">groups</span>
              Total active
            </span>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 rounded-lg flex items-center justify-center text-primary-container shrink-0">
            <span className="material-symbols-outlined text-2xl md:text-3xl">groups</span>
          </div>
        </div>

        {/* Total Diet Plans */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex justify-between items-center group hover:border-secondary-container transition-colors">
          <div>
            <p className="font-label-caps text-slate-500 mb-1 text-[10px] md:text-[11px]">Diet Plans</p>
            <h2 className="font-h1 text-on-surface text-2xl md:text-4xl">{totalPlans ?? 0}</h2>
            <span className="text-secondary text-xs md:text-sm font-bold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs md:text-sm">description</span>
              Total plans
            </span>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-violet-50 rounded-lg flex items-center justify-center text-secondary-container shrink-0">
            <span className="material-symbols-outlined text-2xl md:text-3xl">description</span>
          </div>
        </div>

        {/* Draft Plans */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex justify-between items-center group hover:border-tertiary-container transition-colors">
          <div>
            <p className="font-label-caps text-slate-500 mb-1 text-[10px] md:text-[11px]">Pending Plans</p>
            <h2 className="font-h1 text-on-surface text-2xl md:text-4xl">{draftPlans ?? 0}</h2>
            <span className="text-tertiary text-xs md:text-sm font-bold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs md:text-sm">schedule</span>
              Needs review
            </span>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-50 rounded-lg flex items-center justify-center text-tertiary-container shrink-0">
            <span className="material-symbols-outlined text-2xl md:text-3xl">edit_note</span>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex justify-between items-center group hover:border-primary-container transition-colors">
          <div>
            <p className="font-label-caps text-slate-500 mb-1 text-[10px] md:text-[11px]">Scheduled</p>
            <h2 className="font-h1 text-on-surface text-2xl md:text-4xl">{totalAppointments ?? 0}</h2>
            <span className="text-primary text-xs md:text-sm font-bold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs md:text-sm">event</span>
              Appointments
            </span>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-lg flex items-center justify-center text-primary-container shrink-0">
            <span className="material-symbols-outlined text-2xl md:text-3xl">calendar_month</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-md">
        {/* Today's Appointments */}
        <section className="lg:col-span-3 space-y-3 md:space-y-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-h3 text-on-surface">Today&apos;s Appointments</h3>
            <Link href="/appointments" className="text-primary text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="divide-y divide-slate-100">
              {todayAppointments && todayAppointments.length > 0 ? (
                todayAppointments.map((apt) => (
                  <div key={apt.id} className="p-3 md:p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-container rounded-lg flex flex-col items-center justify-center text-secondary shrink-0">
                        <span className="text-[9px] md:text-[10px] font-bold uppercase">{todayStr}</span>
                        <span className="text-base md:text-lg font-bold leading-none">{todayDate}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-h3 text-sm md:text-base text-on-surface truncate">
                          {(() => {
                            const c = apt.clients as unknown;
                            if (Array.isArray(c) && c.length > 0) return c[0].full_name;
                            if (c && typeof c === "object" && "full_name" in c) return (c as { full_name: string }).full_name;
                            return "Unknown";
                          })()}
                        </h4>
                        <p className="text-body-sm text-slate-500 truncate">
                          {appointmentTypeLabel(apt.appointment_type)} • {formatTime(apt.appointment_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusBadgeClass(apt.status)}`}>
                        {apt.status}
                      </span>
                      <span className="material-symbols-outlined text-slate-300 text-[20px]">chevron_right</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 md:p-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-40">event_available</span>
                  <p className="font-body-md">No appointments scheduled for today</p>
                  <Link href="/appointments/new" className="text-primary text-sm font-semibold mt-2 inline-block hover:underline">
                    Schedule one →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recent Clients */}
        <section className="lg:col-span-2 space-y-3 md:space-y-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-h3 text-on-surface">Recent Clients</h3>
            <Link href="/clients" className="text-primary text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            {recentClients && recentClients.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentClients.map((client) => (
                  <Link
                    key={client.id}
                    href={`/clients/${client.id}`}
                    className="p-3 md:p-4 flex items-center justify-between hover:bg-slate-50 transition-colors block"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img
                          alt={client.full_name}
                          className="w-full h-full object-cover"
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(client.full_name)}&background=random&size=64`}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-data-tabular text-on-surface block truncate text-sm">{client.full_name}</span>
                        <span className="text-[11px] text-slate-400 capitalize">{client.dietary_preference?.replace("_", " ")}</span>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0 ${statusBadgeClass(client.status)}`}>
                      {client.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl mb-2 opacity-40">person_add</span>
                <p className="font-body-md">No clients yet</p>
                <Link href="/clients/new" className="text-primary text-sm font-semibold mt-2 inline-block hover:underline">
                  Add your first client →
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Recent Diet Plans */}
      {recentPlans && recentPlans.length > 0 && (
        <section className="space-y-3 md:space-y-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-h3 text-on-surface">Recent Diet Plans</h3>
            <Link href="/diet-plans" className="text-primary text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {recentPlans.map((plan) => (
              <Link
                key={plan.id}
                href={`/diet-plans/${plan.id}`}
                className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 hover:shadow-md transition-shadow block group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-h3 text-sm text-on-surface group-hover:text-primary transition-colors truncate pr-2">{plan.title}</h4>
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0 ${statusBadgeClass(plan.status)}`}>
                    {plan.status}
                  </span>
                </div>
                <p className="text-body-sm text-slate-500 truncate">
                  {(() => {
                    const c = plan.clients as unknown;
                    if (Array.isArray(c) && c.length > 0) return c[0].full_name;
                    if (c && typeof c === "object" && "full_name" in c) return (c as { full_name: string }).full_name;
                    return "Template";
                  })()}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  {new Date(plan.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Contextual FAB */}
      <Link href="/clients/new" className="fixed right-4 bottom-4 md:right-6 md:bottom-6 lg:right-12 lg:bottom-12 w-12 h-12 md:w-14 md:h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-40">
        <span className="material-symbols-outlined text-xl md:text-2xl">add</span>
      </Link>
    </div>
  );
}
