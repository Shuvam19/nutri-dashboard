import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

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
            // This can be ignored if you have middleware refreshing
            // user sessions.
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex space-x-3">
          <Link
            href="/clients/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 shadow-sm transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Client
          </Link>
          <Link
            href="/diet-plans/new"
            className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 text-sm font-medium rounded-xl hover:bg-gray-50 shadow-sm transition-colors"
          >
            Create Plan
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Clients</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {clients?.length || 0}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Plans</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {plans?.filter(p => p.status === 'draft')?.length || 0}
          </p>
        </Card>
        <Card className="p-6 bg-primary-50 border-primary-100">
          <h3 className="text-sm font-medium text-primary-700">Today's Appointments</h3>
          <p className="mt-2 text-3xl font-bold text-primary-900">0</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Clients</h2>
          <Card className="overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {clients?.length ? (
                clients.map((client) => (
                  <li key={client.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{client.full_name}</p>
                        <p className="text-sm text-gray-500">{client.goals || "No specific goals"}</p>
                      </div>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {client.status}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-8 text-center text-gray-500">No recent clients found.</li>
              )}
            </ul>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Diet Plans</h2>
          <Card className="overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {plans?.length ? (
                plans.map((plan) => (
                  <li key={plan.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{plan.title}</p>
                        <p className="text-sm text-gray-500">For {plan.clients?.full_name}</p>
                      </div>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                        {plan.status}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-8 text-center text-gray-500">No diet plans found.</li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
