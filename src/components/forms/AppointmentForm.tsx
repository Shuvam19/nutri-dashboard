"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { createAppointment } from "@/app/actions/appointment";
import { getClientsList } from "@/app/actions/dietPlan";

export function AppointmentForm() {
  const [state, formAction, isPending] = useActionState(createAppointment, null);
  const [clients, setClients] = useState<{id: string; full_name: string}[]>([]);

  useEffect(() => {
    getClientsList().then(setClients);
  }, []);

  return (
    <form action={formAction} className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden max-w-3xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-surface-variant bg-surface">
        <h2 className="font-h2 text-h2 text-on-surface">Book New Appointment</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Schedule a consultation or follow-up with a client.
        </p>
      </div>

      <div className="p-6 space-y-6">
        {state?.success === false && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm">
            {state.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Selection */}
          <div className="md:col-span-2 space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
              Client <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                person
              </span>
              <select
                name="client_id"
                required
                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
              >
                <option value="">Select a client...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
              Date & Time <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                event
              </span>
              <input
                type="datetime-local"
                name="appointment_date"
                required
                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
              Duration (Minutes) <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                schedule
              </span>
              <input
                type="number"
                name="duration_minutes"
                defaultValue={30}
                min={15}
                step={15}
                required
                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
              Appointment Type <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                category
              </span>
              <select
                name="appointment_type"
                required
                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
              >
                <option value="initial_consultation">Initial Consultation</option>
                <option value="follow_up" selected>Follow Up</option>
                <option value="check_in">Quick Check-in</option>
              </select>
            </div>
          </div>

          {/* Meeting Link */}
          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
              Meeting Link (Optional)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                link
              </span>
              <input
                type="url"
                name="meeting_link"
                placeholder="https://zoom.us/j/..."
                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="md:col-span-2 space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Any preparatory notes or goals for this session..."
              className="w-full p-4 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-6 border-t border-surface-variant bg-surface-container-lowest flex items-center justify-end gap-4">
        <Link
          href="/appointments"
          className="px-6 py-2.5 rounded-lg font-label-caps text-label-caps text-secondary border border-secondary hover:bg-secondary-fixed transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-lg font-label-caps text-label-caps text-on-primary bg-primary hover:bg-surface-tint transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          {isPending ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              Booking...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">event_available</span>
              Book Appointment
            </>
          )}
        </button>
      </div>
    </form>
  );
}
