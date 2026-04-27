import Link from "next/link";

export default function ClientsPage() {
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
              <tr className="hover:bg-surface-container transition-colors group">
                <td className="px-md py-sm whitespace-nowrap">
                  <div className="flex items-center gap-sm">
                    <img alt="Emma Watson" className="w-10 h-10 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIraHBVFmuOQlGdhsDCsVbgJCm_-JpMrH7jMZtk1Y39MHMbuagV2MK9Z6DfKs9_P-ajNrFq6gEBZFRTHyMnPq0YdQ85_zVKrfBybbuLH7JSpbzmu_Xumr2EOWodtKObasMk-c4eOwXGkNmlYSqywiFcw1kQjaD0GnjCDHB3JYKmYUpP3NU6IAcm4Bf0j5chNPpJs_HwzS48xI9aBKwhkNlX3J_hxd_X04-JYZTP_v2ubBqv3B0vzI5jfIKUz1-Vk6RpnPjvhAT86k" />
                    <div>
                      <div className="font-data-tabular text-data-tabular text-on-surface font-semibold">Emma Watson</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">emma.w@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-md py-sm whitespace-nowrap font-data-tabular text-data-tabular text-on-surface-variant">Dr. Sarah Jenkins</td>
                <td className="px-md py-sm whitespace-nowrap">
                  <div className="font-data-tabular text-data-tabular text-on-surface">Oct 12, 2023</div>
                  <div className="font-body-sm text-body-sm text-outline mt-0.5 text-[12px]">2 days ago</div>
                </td>
                <td className="px-md py-sm whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps text-label-caps border border-secondary-fixed-dim">Vegan</span>
                </td>
                <td className="px-md py-sm whitespace-nowrap text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-label-caps gap-1.5 border border-primary-fixed-dim">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Active
                  </span>
                </td>
                <td className="px-md py-sm whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/clients/1" className="p-1.5 rounded-lg text-outline hover:bg-surface-variant hover:text-secondary transition-colors" title="View Patient File">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </Link>
                    <button className="p-1.5 rounded-lg text-outline hover:bg-surface-variant hover:text-secondary transition-colors" title="Edit Demographics">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr className="hover:bg-surface-container transition-colors group">
                <td className="px-md py-sm whitespace-nowrap">
                  <div className="flex items-center gap-sm">
                    <img alt="Michael Chang" className="w-10 h-10 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBybtU14VjlDo9tOGvW7MyZVZsQlv2Jy2y6ts6jhuuG3BjpIkfGuqgAJN55tXcXDnD3KOARzD4hIJDLYU07jibIrDHJ_-bjabKFbDhTABx-iFszYOt_2lbYE6xclf3-mNSK7K0mblcZOdpRHG80Ct3h7__6AwGX8AGcsszKHsbJgH_vX2lIVRvY43SrTpvcKx6UWpTpJHXo0uvex8_EkihnrF2NGouuCwU5b_aUERTsRm1LMOxBsUk_rc6QTbpQBSPHx28iCd0khWE" />
                    <div>
                      <div className="font-data-tabular text-data-tabular text-on-surface font-semibold">Michael Chang</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">m.chang88@mail.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-md py-sm whitespace-nowrap font-data-tabular text-data-tabular text-on-surface-variant">Dr. Smith</td>
                <td className="px-md py-sm whitespace-nowrap">
                  <div className="font-data-tabular text-data-tabular text-on-surface">Sep 28, 2023</div>
                  <div className="font-body-sm text-body-sm text-outline mt-0.5 text-[12px]">2 weeks ago</div>
                </td>
                <td className="px-md py-sm whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-caps text-label-caps border border-tertiary-fixed-dim">Low FODMAP</span>
                </td>
                <td className="px-md py-sm whitespace-nowrap text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-caps text-label-caps gap-1.5 border border-outline-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Maintenance
                  </span>
                </td>
                <td className="px-md py-sm whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/clients/2" className="p-1.5 rounded-lg text-outline hover:bg-surface-variant hover:text-secondary transition-colors" title="View Patient File">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </Link>
                    <button className="p-1.5 rounded-lg text-outline hover:bg-surface-variant hover:text-secondary transition-colors" title="Edit Demographics">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr className="hover:bg-surface-container transition-colors group">
                <td className="px-md py-sm whitespace-nowrap">
                  <div className="flex items-center gap-sm">
                    <img alt="Sarah O'Connor" className="w-10 h-10 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvjjIyiG5Lxi3EnO_HJIV6s4QCj2vcyLfzAnLIXYNMkW5O_kNY1VSgN71PzZkAja4aooudU2ROyy1uRjLLGgcbTDibPv0RhRBtOyQysJkDWARsjitT5aXaHA9WJDqaJC_gI__H9vK2tdFf_6T8D2umA-ENWJeHJsX-L-GQyu5Dav68Smivz2yEZKCG_Wonwrb4TWHZTksZVYurs-CZEA_EUOsz5dUB3onOm7tTE51yvw8MzrSKXMO4NSju6WsjxRBqAUUeOJmnclw" />
                    <div>
                      <div className="font-data-tabular text-data-tabular text-on-surface font-semibold">Sarah O'Connor</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">sarah.oc@company.net</div>
                    </div>
                  </div>
                </td>
                <td className="px-md py-sm whitespace-nowrap font-data-tabular text-data-tabular text-on-surface-variant">Mark Thompson (RD)</td>
                <td className="px-md py-sm whitespace-nowrap">
                  <div className="font-data-tabular text-data-tabular text-on-surface">Aug 05, 2023</div>
                  <div className="font-body-sm text-body-sm text-outline mt-0.5 text-[12px]">2 months ago</div>
                </td>
                <td className="px-md py-sm whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-surface-variant text-on-surface-variant font-label-caps text-label-caps border border-outline-variant">None</span>
                </td>
                <td className="px-md py-sm whitespace-nowrap text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-caps text-label-caps gap-1.5 border border-error-container">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Inactive
                  </span>
                </td>
                <td className="px-md py-sm whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/clients/3" className="p-1.5 rounded-lg text-outline hover:bg-surface-variant hover:text-secondary transition-colors" title="View Patient File">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </Link>
                    <button className="p-1.5 rounded-lg text-outline hover:bg-surface-variant hover:text-secondary transition-colors" title="Edit Demographics">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr className="hover:bg-surface-container transition-colors group">
                <td className="px-md py-sm whitespace-nowrap">
                  <div className="flex items-center gap-sm">
                    <img alt="David Kim" className="w-10 h-10 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8olfnr-8PH52NC4qZp4IS1UjSPSUyTb3cv0L4ZeyH0iOizWtnjwQs-oimlfjCphNdmS0Vn6q-wq_1gixMTZqsC4MNT9QnGYkg0HLekpJqZNMbgNT5EohoSOy4T7rpk3DvA3omdarkB8kv1gCmvOnKKFBdRKJl7BkGFUkYvipe3LM_ECpVl594MgFpmZaZaZSfwb-5GEdWOsnDHtFQakzdwAVqs88tygy_21uu2nLBswxuokkDVEwMmpUhiVjEw_0SSgYoOPFWchs" />
                    <div>
                      <div className="font-data-tabular text-data-tabular text-on-surface font-semibold">David Kim</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">dkim_athlete@sports.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-md py-sm whitespace-nowrap font-data-tabular text-data-tabular text-on-surface-variant">Dr. Smith</td>
                <td className="px-md py-sm whitespace-nowrap">
                  <div className="font-data-tabular text-data-tabular text-on-surface">Oct 14, 2023</div>
                  <div className="font-body-sm text-body-sm text-outline mt-0.5 text-[12px]">Today</div>
                </td>
                <td className="px-md py-sm whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps text-label-caps border border-secondary-fixed-dim">Ketogenic</span>
                </td>
                <td className="px-md py-sm whitespace-nowrap text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-label-caps gap-1.5 border border-primary-fixed-dim">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Active
                  </span>
                </td>
                <td className="px-md py-sm whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/clients/4" className="p-1.5 rounded-lg text-outline hover:bg-surface-variant hover:text-secondary transition-colors" title="View Patient File">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </Link>
                    <button className="p-1.5 rounded-lg text-outline hover:bg-surface-variant hover:text-secondary transition-colors" title="Edit Demographics">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-md py-sm border-t border-surface-dim bg-surface-container-low flex items-center justify-between mt-auto">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Showing <span className="font-semibold text-on-surface">1</span> to <span className="font-semibold text-on-surface">4</span> of <span className="font-semibold text-on-surface">128</span> clients</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 rounded-md border border-outline-variant text-outline font-body-sm text-body-sm flex items-center gap-1 opacity-50 cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              Prev
            </button>
            <div className="hidden sm:flex gap-1 mx-2">
              <button className="w-8 h-8 rounded-md border border-secondary bg-secondary text-on-secondary font-body-sm text-body-sm flex items-center justify-center font-medium shadow-card">1</button>
              <button className="w-8 h-8 rounded-md border border-outline-variant text-on-surface-variant bg-surface-container-lowest hover:bg-surface-variant font-body-sm text-body-sm flex items-center justify-center transition-colors">2</button>
              <button className="w-8 h-8 rounded-md border border-outline-variant text-on-surface-variant bg-surface-container-lowest hover:bg-surface-variant font-body-sm text-body-sm flex items-center justify-center transition-colors">3</button>
              <span className="w-8 h-8 flex items-center justify-center text-outline">...</span>
              <button className="w-8 h-8 rounded-md border border-outline-variant text-on-surface-variant bg-surface-container-lowest hover:bg-surface-variant font-body-sm text-body-sm flex items-center justify-center transition-colors">12</button>
            </div>
            <button className="px-3 py-1.5 rounded-md border border-outline-variant text-on-surface-variant bg-surface-container-lowest hover:bg-surface-variant font-body-sm text-body-sm flex items-center gap-1 transition-colors">
              Next
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
