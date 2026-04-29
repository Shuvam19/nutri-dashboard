"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DietPlan, Appointment } from "@/lib/types/database";

type Tab = "diet-plans" | "appointments";

export default function ClientTabs({ 
  dietPlans, 
  appointments 
}: { 
  dietPlans: DietPlan[], 
  appointments: Appointment[] 
}) {
  const [activeTab, setActiveTab] = useState<Tab>("diet-plans");

  const now = new Date();
  const upcomingAppointments = appointments.filter(app => new Date(app.appointment_date) > now).sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());
  const pastAppointments = appointments.filter(app => new Date(app.appointment_date) <= now).sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime());

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden">
      <div className="flex border-b border-surface-container-highest">
        <button 
          onClick={() => setActiveTab("diet-plans")}
          className={`flex-1 py-4 text-center font-label-caps text-label-caps border-b-2 transition-all ${
            activeTab === "diet-plans" 
              ? "border-primary text-primary bg-surface-container-low" 
              : "border-transparent text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          DIET PLANS
        </button>
        <button 
          onClick={() => setActiveTab("appointments")}
          className={`flex-1 py-4 text-center font-label-caps text-label-caps border-b-2 transition-all ${
            activeTab === "appointments" 
              ? "border-primary text-primary bg-surface-container-low" 
              : "border-transparent text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          APPOINTMENTS
        </button>
      </div>

      <div className="p-2">
        {activeTab === "diet-plans" && (
          <div className="divide-y divide-surface-container">
            {dietPlans.length > 0 ? (
              dietPlans.map(plan => (
                <div key={plan.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-surface-container-low rounded-lg transition-colors group gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      plan.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      <span className="material-symbols-outlined">restaurant_menu</span>
                    </div>
                    <div>
                      <p className="font-body-md text-body-md font-semibold">{plan.title}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Created on {new Date(plan.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full font-label-caps text-[10px] ${
                      plan.status === 'active' ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      {plan.status.toUpperCase()}
                    </span>
                    <Link href={`/diet-plans/${plan.id}`}>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors cursor-pointer">
                        chevron_right
                      </span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-on-surface-variant">
                No diet plans assigned yet.
              </div>
            )}
          </div>
        )}

        {activeTab === "appointments" && (
          <div>
            {/* Upcoming Appointments Section */}
            <div className="px-4 pb-2 pt-4 border-b border-surface-container-highest flex justify-between items-center">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant">UPCOMING APPOINTMENTS</h4>
            </div>
            <div className="divide-y divide-surface-container mb-6">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(app => {
                  const d = new Date(app.appointment_date);
                  return (
                    <div key={app.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low rounded-lg transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-secondary-container text-on-secondary-container rounded-lg shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {d.toLocaleDateString("en-US", { month: 'short' })}
                          </span>
                          <span className="text-xl font-bold leading-none">
                            {d.getDate()}
                          </span>
                        </div>
                        <div>
                          <p className="font-body-md text-body-md font-semibold">{app.appointment_type.replace(/_/g, ' ')}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })} • {app.status}
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors cursor-pointer">calendar_today</span>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-sm text-on-surface-variant">
                  No upcoming appointments.
                </div>
              )}
            </div>

            {/* Past Appointments Section */}
            <div className="px-4 pb-2 pt-4 border-b border-surface-container-highest flex justify-between items-center">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant">APPOINTMENT HISTORY</h4>
            </div>
            <div className="divide-y divide-surface-container">
              {pastAppointments.length > 0 ? (
                pastAppointments.map(app => {
                  const d = new Date(app.appointment_date);
                  return (
                    <div key={app.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low rounded-lg transition-colors group opacity-80 hover:opacity-100">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-surface-container-high text-on-surface-variant rounded-lg shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {d.toLocaleDateString("en-US", { month: 'short' })}
                          </span>
                          <span className="text-xl font-bold leading-none">
                            {d.getDate()}
                          </span>
                        </div>
                        <div>
                          <p className="font-body-md text-body-md font-semibold">{app.appointment_type.replace(/_/g, ' ')}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })} • {app.status}
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors cursor-pointer">calendar_today</span>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-sm text-on-surface-variant">
                  No past appointments.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
