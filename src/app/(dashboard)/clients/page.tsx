import Link from "next/link";
import { getPaginatedClients } from "@/app/actions/client";

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const limit = 10;
  const { data: clients, count } = await getPaginatedClients(page, limit);
  const totalPages = Math.ceil(count / limit);
  const startCount = (page - 1) * limit + 1;
  const endCount = Math.min(page * limit, count);
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-base">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface mb-1">Client Roster</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage demographics, track active consultations, and access detailed health records.
          </p>
        </div>
        <Link href="/clients/new" className="bg-primary text-on-primary font-body-md text-body-md px-md py-sm rounded-lg shadow-card flex items-center gap-xs hover:bg-surface-tint hover:-translate-y-px transition-all border border-transparent">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>person_add</span>
          Add New Client
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-surface-dim p-md flex flex-col xl:flex-row gap-md items-end">
        <div className="w-full xl:w-1/3 flex flex-col gap-xs">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Search Roster</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full pl-xl pr-sm py-sm rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary font-body-md text-body-md text-on-surface outline-none transition-all placeholder-outline-variant"
              placeholder="Client Name, Email or ID Number"
              type="text"
            />
          </div>
        </div>
        <div className="w-full xl:flex-1 flex flex-wrap sm:flex-nowrap gap-md">
          <div className="flex-1 flex flex-col gap-xs">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status Filter</label>
            <div className="relative">
              <select className="w-full px-sm py-sm rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary font-body-md text-body-md text-on-surface outline-none transition-all appearance-none cursor-pointer pr-xl">
                <option>All Statuses</option>
                <option>Active Consultation</option>
                <option>On Maintenance</option>
                <option>Inactive</option>
              </select>
              <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-xs">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Assigned Consultant</label>
            <div className="relative">
              <select className="w-full px-sm py-sm rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary font-body-md text-body-md text-on-surface outline-none transition-all appearance-none cursor-pointer pr-xl">
                <option>My Clients (Dr. Smith)</option>
                <option>All Clinic Consultants</option>
                <option>Dr. Sarah Jenkins</option>
                <option>Mark Thompson (RD)</option>
              </select>
              <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-xs">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Dietary Profile</label>
            <div className="relative">
              <select className="w-full px-sm py-sm rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary font-body-md text-body-md text-on-surface outline-none transition-all appearance-none cursor-pointer pr-xl">
                <option>Any Preference</option>
                <option>Plant-Based / Vegan</option>
                <option>Ketogenic</option>
                <option>Gluten-Free</option>
                <option>Low FODMAP</option>
              </select>
              <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-surface-dim overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-surface-dim bg-surface-container-low">
                <th className="px-md py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Client Name &amp; Contact</th>
                <th className="px-md py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Assigned Consultant</th>
                <th className="px-md py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Last Consult</th>
                <th className="px-md py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Dietary Pref.</th>
                <th className="px-md py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Status</th>
                <th className="px-md py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-dim bg-surface-container-lowest">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-md py-xl text-center text-on-surface-variant font-body-md">
                    No clients found. Add a new client to get started.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-surface-container transition-colors group">
                    <td className="px-md py-sm whitespace-nowrap">
                      <div className="flex items-center gap-sm">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center font-bold text-on-surface-variant">
                          {client.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-data-tabular text-data-tabular text-on-surface font-semibold">{client.full_name}</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{client.email || 'No email provided'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-sm whitespace-nowrap font-data-tabular text-data-tabular text-on-surface-variant">
                      {client.profiles?.full_name || 'Unassigned'}
                    </td>
                    <td className="px-md py-sm whitespace-nowrap">
                      <div className="font-data-tabular text-data-tabular text-on-surface">{new Date(client.created_at).toLocaleDateString()}</div>
                      <div className="font-body-sm text-body-sm text-outline mt-0.5 text-[12px]">Joined</div>
                    </td>
                    <td className="px-md py-sm whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps text-label-caps border border-secondary-fixed-dim capitalize">
                        {client.dietary_preference.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-md py-sm whitespace-nowrap text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-label-caps gap-1.5 border border-primary-fixed-dim capitalize">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> {client.status}
                      </span>
                    </td>
                    <td className="px-md py-sm whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/clients/${client.id}`} className="p-1.5 rounded-lg text-outline hover:bg-surface-variant hover:text-secondary transition-colors" title="View Patient File">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </Link>
                        <button className="p-1.5 rounded-lg text-outline hover:bg-surface-variant hover:text-secondary transition-colors" title="Edit Demographics">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-md py-sm border-t border-surface-dim bg-surface-container-low flex items-center justify-between mt-auto">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Showing <span className="font-semibold text-on-surface">{count > 0 ? startCount : 0}</span> to <span className="font-semibold text-on-surface">{endCount}</span> of <span className="font-semibold text-on-surface">{count}</span> clients
          </span>
          {totalPages > 1 && (
            <div className="flex gap-1">
              {page > 1 ? (
                <Link href={`/clients?page=${page - 1}`} className="px-3 py-1.5 rounded-md border border-outline-variant text-on-surface-variant bg-surface-container-lowest hover:bg-surface-variant font-body-sm text-body-sm flex items-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  Prev
                </Link>
              ) : (
                <button className="px-3 py-1.5 rounded-md border border-outline-variant text-outline font-body-sm text-body-sm flex items-center gap-1 opacity-50 cursor-not-allowed" disabled>
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  Prev
                </button>
              )}

              <div className="hidden sm:flex gap-1 mx-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  // Show current page, first, last, and neighbors
                  if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                    return (
                      <Link
                        key={p}
                        href={`/clients?page=${p}`}
                        className={`w-8 h-8 rounded-md flex items-center justify-center font-body-sm text-body-sm transition-colors ${p === page
                            ? 'border border-secondary bg-secondary text-on-secondary font-medium shadow-card'
                            : 'border border-outline-variant text-on-surface-variant bg-surface-container-lowest hover:bg-surface-variant'
                          }`}
                      >
                        {p}
                      </Link>
                    );
                  }
                  // Ellipsis for gaps
                  if (p === page - 2 || p === page + 2) {
                    return <span key={p} className="w-8 h-8 flex items-center justify-center text-outline">...</span>;
                  }
                  return null;
                })}
              </div>

              {page < totalPages ? (
                <Link href={`/clients?page=${page + 1}`} className="px-3 py-1.5 rounded-md border border-outline-variant text-on-surface-variant bg-surface-container-lowest hover:bg-surface-variant font-body-sm text-body-sm flex items-center gap-1 transition-colors">
                  Next
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              ) : (
                <button className="px-3 py-1.5 rounded-md border border-outline-variant text-outline font-body-sm text-body-sm flex items-center gap-1 opacity-50 cursor-not-allowed" disabled>
                  Next
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
