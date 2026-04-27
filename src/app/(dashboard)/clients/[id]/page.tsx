import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Client Profile | NutriCRM",
};

// Next.js 15 requires `params` to be an asynchronous promise in Server Components
type Params = Promise<{ id: string }>;

export default async function ClientProfilePage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  // Stub data fetching - ready for Supabase backend
  // const client = await getClientById(id);
  // if (!client) notFound();

  // Mocking the data for now based on the design
  const client = {
    id: `VIT-${id.padStart(4, "0")}`,
    firstName: "Emma",
    lastName: "Watson",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvGAE6I5Ec0kq0gozWNxNofOHB75o61NP9TewIIDYOhU4g8ZV6eq46h6s9qvIgU3LI2EaCOtdRFXcLuqnjpdy0D5qqYJOScBhhNCb5qbpuwRax54LU9CiIMl9FjkAtcz6xTmAmbKwxh4iD45hJYu9ZK3VbWc704EJ6DSrBUDNWZkFo60bt12kG2C0iHXkQDZKhUxjBwTbJZshvM4B_KFK1ZxI-5z_4gFkq2rz726C09M0cvTOeii7NOJnm8kqIzlm31BrmnYZjQt4",
    status: "Active",
    memberSince: "Jan 2024",
    stats: {
      age: 28,
      gender: "F",
      height: 165,
      weight: 58,
      bmi: 21.3,
      bmiStatus: "Healthy",
    },
    medical: {
      restrictions: ["Vegan", "Gluten-Free", "Lactose Intolerant"],
      history: "Iron Deficiency",
      activeDiseases: "None",
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-4 py-6 md:px-margin w-full">
      {/* Profile Header Section */}
      <section className="bg-surface-container-lowest rounded-xl p-6 shadow-card mb-md">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative shrink-0">
            <img 
              alt={`${client.firstName} ${client.lastName}`}
              className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover shadow-sm border-2 border-surface-container" 
              src={client.avatar}
            />
            <span className="absolute -bottom-2 -right-2 bg-primary text-on-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border-2 border-surface-container-lowest">
              {client.status}
            </span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-h2 text-h2 mb-1">{client.firstName} {client.lastName}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Client ID: #{client.id} • Member since {client.memberSince}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <button className="bg-surface-container text-secondary font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                EDIT PROFILE
              </button>
              <button className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-primary-container transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                CREATE DIET PLAN
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid for Stats and Medical Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-md">
        {/* Quick Stats Card */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-h3 text-h3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Quick Stats
            </h3>
            <span className="bg-surface-container-high text-on-surface-variant font-data-tabular text-data-tabular px-3 py-1 rounded-full">Last updated: Today</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-surface-container-low rounded-lg text-center">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">AGE</p>
              <p className="font-h3 text-h3 text-primary">{client.stats.age}</p>
            </div>
            <div className="p-4 bg-surface-container-low rounded-lg text-center">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">GENDER</p>
              <p className="font-h3 text-h3 text-primary">{client.stats.gender}</p>
            </div>
            <div className="p-4 bg-surface-container-low rounded-lg text-center">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">HEIGHT</p>
              <p className="font-h3 text-h3 text-primary">{client.stats.height}<span className="text-xs font-normal">cm</span></p>
            </div>
            <div className="p-4 bg-surface-container-low rounded-lg text-center">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">WEIGHT</p>
              <p className="font-h3 text-h3 text-primary">{client.stats.weight}<span className="text-xs font-normal">kg</span></p>
            </div>
            <div className="p-4 bg-primary-container text-on-primary-container rounded-lg text-center border-2 border-primary/10">
              <p className="font-label-caps text-label-caps mb-1 opacity-80">BMI</p>
              <p className="font-h2 text-h2 leading-none">{client.stats.bmi}</p>
              <p className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{client.stats.bmiStatus}</p>
            </div>
          </div>
        </div>

        {/* Dietary & Medical Card */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-6 shadow-card">
          <h3 className="font-h3 text-h3 flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-tertiary">medical_services</span>
            Dietary &amp; Medical
          </h3>
          <div className="space-y-6">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">RESTRICTIONS</p>
              <div className="flex flex-wrap gap-2">
                {client.medical.restrictions.map((res, i) => (
                  <span key={i} className="bg-primary-fixed text-on-primary-fixed font-data-tabular text-[12px] px-3 py-1 rounded-full border border-primary/10">
                    {res}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-gutter">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">HISTORY</p>
                <p className="font-body-md text-body-md">{client.medical.history}</p>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">ACTIVE DISEASES</p>
                <p className="font-body-md text-body-md text-outline">{client.medical.activeDiseases}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden">
        <div className="flex border-b border-surface-container-highest">
          <button className="flex-1 py-4 text-center font-label-caps text-label-caps border-b-2 border-primary text-primary bg-surface-container-low transition-all">DIET PLANS</button>
          <button className="flex-1 py-4 text-center font-label-caps text-label-caps border-b-2 border-transparent text-on-surface-variant hover:bg-surface-container transition-all">APPOINTMENTS</button>
        </div>
        <div className="p-2">
          {/* Diet Plans Sub-section */}
          <div className="divide-y divide-surface-container">
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-surface-container-low rounded-lg transition-colors group gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">restaurant_menu</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md font-semibold">Weight Loss Phase 1</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Created on Sep 28, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-caps text-[10px]">ACTIVE</span>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors cursor-pointer">chevron_right</span>
              </div>
            </div>
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-surface-container-low rounded-lg transition-colors group gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">fitness_center</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md font-semibold">Muscle Gain</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Created on Jul 15, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px]">COMPLETED</span>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors cursor-pointer">chevron_right</span>
              </div>
            </div>
          </div>

          {/* Appointments Title */}
          <div className="mt-8 px-4 pb-2 border-b border-surface-container-highest flex justify-between items-center">
            <h4 className="font-label-caps text-label-caps text-on-surface-variant">UPCOMING APPOINTMENTS</h4>
            <button className="text-secondary font-label-caps text-[10px] hover:underline">VIEW ALL</button>
          </div>
          <div className="divide-y divide-surface-container">
            <div className="p-4 flex items-center justify-between hover:bg-surface-container-low rounded-lg transition-colors group">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-secondary-container text-on-secondary-container rounded-lg shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-tighter">OCT</span>
                  <span className="text-xl font-bold leading-none">12</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md font-semibold">Initial Consultation</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">10:00 AM • Video Call</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors cursor-pointer">calendar_today</span>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-surface-container-low rounded-lg transition-colors group">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-surface-container-high text-on-surface-variant rounded-lg shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-tighter">OCT</span>
                  <span className="text-xl font-bold leading-none">26</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md font-semibold">Check-in</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">02:30 PM • In-Person</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors cursor-pointer">calendar_today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
