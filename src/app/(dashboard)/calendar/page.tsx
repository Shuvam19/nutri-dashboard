import React from "react";

export const metadata = {
  title: "Calendar | NutriCRM",
};

export default function CalendarPage() {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-theme(spacing.16))] overflow-hidden bg-surface">
      {/* Page Header */}
      <header className="px-gutter py-md flex items-center justify-between border-b border-surface-variant bg-surface-container-lowest z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-md">
          <h1 className="font-h2 text-h2 text-on-surface">Appointments</h1>
          <div className="hidden sm:flex items-center gap-2 bg-surface-container p-1 rounded-lg">
            <button className="px-3 py-1.5 text-body-sm font-body-sm font-medium bg-surface-container-lowest text-on-surface shadow-sm rounded-md">Month</button>
            <button className="px-3 py-1.5 text-body-sm font-body-sm font-medium text-on-surface-variant hover:text-on-surface rounded-md transition-colors">Week</button>
            <button className="px-3 py-1.5 text-body-sm font-body-sm font-medium text-on-surface-variant hover:text-on-surface rounded-md transition-colors">Day</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <span className="font-h3 text-h3 text-on-surface w-36 text-center">October 2023</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
          <button className="bg-primary text-on-primary hover:opacity-90 font-body-sm text-body-sm font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">Schedule Client</span>
          </button>
        </div>
      </header>

      {/* Content Grid Area */}
      <div className="flex-1 flex overflow-hidden p-gutter gap-gutter bg-surface">
        {/* Calendar Main View */}
        <div className="hidden lg:flex flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-card flex-col overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-low shrink-0">
            <div className="py-3 text-center font-label-caps text-label-caps text-on-surface-variant">MON</div>
            <div className="py-3 text-center font-label-caps text-label-caps text-on-surface-variant">TUE</div>
            <div className="py-3 text-center font-label-caps text-label-caps text-on-surface-variant">WED</div>
            <div className="py-3 text-center font-label-caps text-label-caps text-on-surface-variant">THU</div>
            <div className="py-3 text-center font-label-caps text-label-caps text-on-surface-variant">FRI</div>
            <div className="py-3 text-center font-label-caps text-label-caps text-on-surface-variant">SAT</div>
            <div className="py-3 text-center font-label-caps text-label-caps text-on-surface-variant">SUN</div>
          </div>
          
          {/* Calendar Grid */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto bg-outline-variant gap-px">
            <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer">
              <span className="text-body-sm font-body-sm text-on-surface-variant opacity-50">25</span>
            </div>
            <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer">
              <span className="text-body-sm font-body-sm text-on-surface-variant opacity-50">26</span>
            </div>
            <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer flex flex-col gap-1">
              <span className="text-body-sm font-body-sm text-on-surface font-semibold">27</span>
              {/* Appointment Card: Confirmed */}
              <div className="bg-surface-container p-1.5 rounded-md border border-surface-variant flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface truncate">Sarah Jenkins</span>
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                </div>
                <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">schedule</span> 09:00 AM
                </span>
              </div>
            </div>
            <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer">
              <span className="text-body-sm font-body-sm text-on-surface font-semibold">28</span>
            </div>
            <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer flex flex-col gap-1 ring-2 ring-primary ring-inset">
              <span className="text-body-sm font-body-sm text-primary font-bold flex items-center justify-between w-full">
                29
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
              </span>
              {/* Appointment Card: Initial Consult (Blue) */}
              <div className="bg-secondary-fixed p-1.5 rounded-md border border-secondary-fixed-dim flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-secondary-fixed truncate">Marcus Doe</span>
                </div>
                <span className="text-[10px] text-on-secondary-fixed-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">schedule</span> 11:30 AM
                </span>
              </div>
              {/* Appointment Card: Follow Up */}
              <div className="bg-surface-container p-1.5 rounded-md border border-surface-variant flex flex-col gap-0.5 mt-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface truncate">Elena Rostova</span>
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                </div>
              </div>
            </div>
            
            {/* Empty slots for demo */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer">
                <span className="text-body-sm font-body-sm text-on-surface font-semibold">{(i + 30) % 31 + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel: Upcoming Appointments */}
        <div className="w-full lg:w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-card flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-bright shrink-0">
            <h2 className="font-h3 text-h3 text-on-surface">Agenda</h2>
            <button className="text-primary hover:text-primary-fixed-dim transition-colors">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Agenda Date Group */}
            <div>
              <div className="font-label-caps text-label-caps text-on-surface-variant mb-2">TODAY, OCT 29</div>
              
              {/* Agenda Card */}
              <div className="bg-surface border border-surface-variant rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer mb-2 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
                <div className="flex justify-between items-start mb-1 pl-2">
                  <h4 className="font-body-md text-body-md font-semibold text-on-surface">Marcus Doe</h4>
                  <span className="text-on-surface-variant text-body-sm font-body-sm shrink-0">11:30 AM</span>
                </div>
                <div className="pl-2 flex items-center gap-1 text-on-surface-variant text-body-sm font-body-sm">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  Initial Consult
                </div>
              </div>

              {/* Agenda Card */}
              <div className="bg-surface border border-surface-variant rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer mb-2 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div className="flex justify-between items-start mb-1 pl-2">
                  <h4 className="font-body-md text-body-md font-semibold text-on-surface">Elena Rostova</h4>
                  <span className="text-on-surface-variant text-body-sm font-body-sm shrink-0">02:00 PM</span>
                </div>
                <div className="pl-2 flex items-center gap-1 text-on-surface-variant text-body-sm font-body-sm">
                  <span className="material-symbols-outlined text-[14px]">monitor_weight</span>
                  Check-in (Week 4)
                </div>
              </div>
            </div>

            {/* Agenda Date Group */}
            <div className="pt-2">
              <div className="font-label-caps text-label-caps text-on-surface-variant mb-2">TOMORROW, OCT 30</div>
              
              {/* Agenda Card */}
              <div className="bg-surface border border-surface-variant rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer mb-2 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary-container"></div>
                <div className="flex justify-between items-start mb-1 pl-2">
                  <h4 className="font-body-md text-body-md font-semibold text-on-surface">David Kim</h4>
                  <span className="text-on-surface-variant text-body-sm font-body-sm shrink-0">09:15 AM</span>
                </div>
                <div className="pl-2 flex items-center gap-1 text-on-surface-variant text-body-sm font-body-sm">
                  <span className="material-symbols-outlined text-[14px]">restaurant_menu</span>
                  Meal Plan Review
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
