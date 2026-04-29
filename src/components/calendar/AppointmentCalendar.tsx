"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getDaysInMonth, isSameDay, isToday, formatTime } from "@/lib/utils/date";

export function AppointmentCalendar({ appointments }: { appointments: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInGrid = useMemo(() => {
    return getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  // Navigate Months
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  // Helper to format month/year header
  const monthYearStr = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Map appointments to days
  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.appointment_date), date));
  };

  // Group upcoming appointments for the Agenda Panel
  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const future = appointments
      .filter(apt => new Date(apt.appointment_date) >= today && apt.status !== "cancelled")
      .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());

    const grouped: Record<string, any[]> = {};
    future.forEach(apt => {
      const date = new Date(apt.appointment_date);
      date.setHours(0, 0, 0, 0); // Normalize to start of day
      const key = date.toISOString();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(apt);
    });

    return grouped;
  }, [appointments]);

  // Color mappings based on Stitch design
  const getTypeColorClass = (type: string) => {
    switch (type) {
      case "initial_consultation": return "bg-secondary";
      case "follow_up": return "bg-primary";
      case "check_in": return "bg-tertiary-container";
      default: return "bg-surface-variant";
    }
  };

  const getCardColorClass = (type: string) => {
    switch (type) {
      case "initial_consultation": return "bg-secondary-fixed border-secondary-fixed-dim text-on-secondary-fixed";
      case "follow_up": return "bg-surface-container border-surface-variant text-on-surface";
      case "check_in": return "bg-tertiary-fixed border-tertiary-fixed-dim text-on-tertiary-fixed";
      default: return "bg-surface border-surface-variant text-on-surface";
    }
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case "initial_consultation": return "psychology";
      case "follow_up": return "restaurant_menu";
      case "check_in": return "monitor_weight";
      default: return "schedule";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-surface -m-6 md:-m-8">
      {/* Page Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-surface-variant bg-surface-container-lowest z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="font-h2 text-h2 text-on-surface">Appointments</h1>
          <div className="hidden md:flex items-center gap-2 bg-surface-container p-1 rounded-lg">
            <button className="px-3 py-1.5 text-body-sm font-body-sm font-medium bg-surface-container-lowest text-on-surface shadow-sm rounded-md">Month</button>
            <button className="px-3 py-1.5 text-body-sm font-body-sm font-medium text-on-surface-variant hover:text-on-surface rounded-md transition-colors opacity-50 cursor-not-allowed">Week</button>
            <button className="px-3 py-1.5 text-body-sm font-body-sm font-medium text-on-surface-variant hover:text-on-surface rounded-md transition-colors opacity-50 cursor-not-allowed">Day</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <span className="font-h3 text-h3 text-on-surface w-36 text-center">{monthYearStr}</span>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
          <Link href="/appointments/new" className="bg-primary text-on-primary hover:opacity-90 font-body-sm text-body-sm font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">Schedule Client</span>
          </Link>
        </div>
      </header>

      {/* Content Grid Area */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6 bg-surface">
        
        {/* Calendar Main View */}
        <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-low shrink-0">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
              <div key={day} className="py-3 text-center font-label-caps text-label-caps text-on-surface-variant">{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 grid grid-cols-7 overflow-y-auto bg-outline-variant gap-px" style={{ gridTemplateRows: `repeat(${daysInGrid.length / 7}, minmax(120px, 1fr))` }}>
            {daysInGrid.map((dayObj, i) => {
              const dayApts = getAppointmentsForDay(dayObj.date);
              const isTodayDate = isToday(dayObj.date);
              
              return (
                <div 
                  key={i} 
                  className={`bg-surface-container-lowest p-2 hover:bg-surface-container-low transition-colors flex flex-col gap-1 overflow-hidden ${isTodayDate ? 'ring-2 ring-primary ring-inset' : ''}`}
                >
                  <span className={`text-body-sm font-body-sm flex items-center justify-between w-full ${!dayObj.isCurrentMonth ? 'text-on-surface-variant opacity-50' : isTodayDate ? 'text-primary font-bold' : 'text-on-surface font-semibold'}`}>
                    {dayObj.date.getDate()}
                    {isTodayDate && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                  </span>
                  
                  {/* Daily Appointments */}
                  <div className="flex-1 overflow-y-auto space-y-1 hide-scrollbar">
                    {dayApts.map((apt, j) => {
                      const colorClass = getCardColorClass(apt.appointment_type);
                      const dotColor = getTypeColorClass(apt.appointment_type);
                      
                      return (
                        <div key={apt.id} className={`${colorClass} p-1.5 rounded-md border flex flex-col gap-0.5`}>
                          <div className="flex items-center justify-between">
                            <span className="font-label-caps text-label-caps truncate">{apt.clients?.full_name}</span>
                            {apt.appointment_type === 'follow_up' && <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>}
                          </div>
                          <span className="text-[10px] opacity-80 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> 
                            {formatTime(new Date(apt.appointment_date))}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel: Upcoming Appointments */}
        <div className="hidden lg:flex w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-bright shrink-0">
            <h2 className="font-h3 text-h3 text-on-surface">Agenda</h2>
            <button className="text-primary hover:text-primary-fixed-dim transition-colors">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {Object.keys(upcomingAppointments).length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px] mb-2 opacity-50">event_available</span>
                <p className="font-body-sm">No upcoming appointments</p>
              </div>
            ) : (
              Object.entries(upcomingAppointments).map(([dateStr, apts]) => {
                const date = new Date(dateStr);
                const isTodayStr = isToday(date) ? "TODAY, " : isSameDay(date, new Date(new Date().setDate(new Date().getDate() + 1))) ? "TOMORROW, " : "";
                const headerText = `${isTodayStr}${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`;
                
                return (
                  <div key={dateStr}>
                    <div className="font-label-caps text-label-caps text-on-surface-variant mb-2">{headerText}</div>
                    
                    {apts.map(apt => (
                      <div key={apt.id} className="bg-surface border border-surface-variant rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer mb-2 relative overflow-hidden group">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${getTypeColorClass(apt.appointment_type)}`}></div>
                        <div className="flex justify-between items-start mb-1 pl-2">
                          <h4 className="font-body-md text-body-md font-semibold text-on-surface truncate pr-2">{apt.clients?.full_name}</h4>
                          <span className="text-on-surface-variant text-body-sm font-body-sm shrink-0">{formatTime(new Date(apt.appointment_date))}</span>
                        </div>
                        <div className="pl-2 flex items-center justify-between text-on-surface-variant text-body-sm font-body-sm">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">{getIconForType(apt.appointment_type)}</span>
                            {apt.appointment_type.replace('_', ' ')}
                          </span>
                          {apt.status === "completed" && (
                            <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
