import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientById, getClientDietPlans, getClientAppointments } from "@/app/actions/client";
import ClientTabs from "@/components/clients/ClientTabs";

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

  const [clientData, dietPlans, appointments] = await Promise.all([
    getClientById(id),
    getClientDietPlans(id),
    getClientAppointments(id)
  ]);
  
  if (!clientData) notFound();

  // BMI Calculation
  let bmi: number | string = "--";
  let bmiStatus = "--";
  if (clientData.height_cm && clientData.weight_kg) {
    const heightInMeters = clientData.height_cm / 100;
    const rawBmi = clientData.weight_kg / (heightInMeters * heightInMeters);
    bmi = parseFloat(rawBmi.toFixed(1));
    
    if (bmi < 18.5) bmiStatus = "Underweight";
    else if (bmi < 25) bmiStatus = "Healthy";
    else if (bmi < 30) bmiStatus = "Overweight";
    else bmiStatus = "Obese";
  }

  // Formatting constraints
  const names = clientData.full_name.split(" ");
  const firstName = names[0];
  const lastName = names.slice(1).join(" ");
  
  const formattedDate = new Date(clientData.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short' });
  
  let historyText = "None";
  if (clientData.medical_history && typeof clientData.medical_history === 'object' && Object.keys(clientData.medical_history).length > 0) {
     historyText = JSON.stringify(clientData.medical_history);
  } else if (clientData.medical_history && typeof clientData.medical_history === 'string' && clientData.medical_history !== '{}') {
     historyText = clientData.medical_history;
  }

  const client = {
    id: clientData.id.slice(0, 8).toUpperCase(),
    firstName: firstName,
    lastName: lastName,
    avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(clientData.full_name) + "&background=random",
    status: clientData.status.charAt(0).toUpperCase() + clientData.status.slice(1),
    memberSince: formattedDate,
    stats: {
      age: clientData.age,
      gender: clientData.gender.charAt(0).toUpperCase(),
      height: clientData.height_cm || "--",
      weight: clientData.weight_kg || "--",
      bmi: bmi,
      bmiStatus: bmiStatus,
    },
    medical: {
      restrictions: [
        clientData.dietary_preference.replace("_", " ").toUpperCase(), 
        ...(clientData.allergies || [])
      ].filter(Boolean),
      history: historyText,
      activeDiseases: clientData.active_diseases && clientData.active_diseases.length > 0 
        ? clientData.active_diseases.join(", ") 
        : "None",
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
      <ClientTabs dietPlans={dietPlans} appointments={appointments} />
    </div>
  );
}
