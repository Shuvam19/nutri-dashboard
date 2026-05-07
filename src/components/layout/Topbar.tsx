import React from 'react';

export function Topbar() {
    return (
        <header className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16 w-full sticky top-0 z-40 bg-surface-container-lowest border-b border-surface-dim shadow-[0_4px_20px_rgba(0,0,0,0.04)] font-manrope antialiased">
            {/* Left side: spacer for hamburger on mobile + search on desktop */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Spacer for the hamburger button on mobile */}
                <div className="w-10 lg:hidden shrink-0" />
                <div className="relative flex-1 hidden md:block max-w-md text-primary-container font-semibold">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">search</span>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 bg-surface border border-surface-dim rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-on-surface-variant placeholder-outline-variant transition-colors"
                        placeholder="Search NutriCore CRM..."
                    />
                </div>
            </div>
            <div className="flex items-center justify-end gap-1.5 md:gap-2 text-on-surface-variant shrink-0">
                <button className="p-2 rounded-full hover:bg-surface-container transition-colors active:opacity-80 duration-200 relative">
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">notifications</span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest"></span>
                </button>
                <button className="p-2 rounded-full hover:bg-surface-container transition-colors active:opacity-80 duration-200 hidden sm:flex">
                    <span className="material-symbols-outlined">help</span>
                </button>
                <div className="h-8 w-px bg-surface-dim mx-1 md:mx-2 hidden sm:block"></div>
                <button className="flex items-center gap-2 hover:bg-surface-container transition-colors active:opacity-80 duration-200 p-1 pr-2 md:pr-3 rounded-full border border-surface-dim">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9eag-HEQ4xS-VJYSv8lhH2y1EGi96D0c-lcFf71xD7RjCZxCWRRKeZJNF3NygMVEg7Tlj1-3ZcBXcDMLJVRKfKQj5VwpIaCtUfTT0AfgtHhMNcoYrrgZ-zgqtllHm1H7r2F6kQT3kBRt-dT1dIlTaTuksbnckoSzVg7u__wdUiQtJaPvz0yljmG6y0IKMXW8X33dTbpq4mkCMgjbQC4RAT8cCRLewgoPYJf9ZTZQbUfQaOpddTQRnW-unfwrrHImLyqaNsIXGBXk"
                        alt="Nutritionist profile"
                        className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-on-surface hidden md:block">Dr. Smith</span>
                    <span className="material-symbols-outlined text-[18px] text-outline-variant hidden sm:block">expand_more</span>
                </button>
            </div>
        </header>
    );
}
