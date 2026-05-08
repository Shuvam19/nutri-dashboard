"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/app/actions/auth";

interface UserProfile {
  full_name: string;
  role: string;
  avatar_url?: string | null;
}

export function Topbar() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email ?? "");
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, role, avatar_url")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }
      }
    }
    loadUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const avatarUrl = profile?.avatar_url
    ? profile.avatar_url
    : profile?.full_name
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=166534&color=fff&size=64`
    : undefined;

  const roleLabel =
    profile?.role === "admin"
      ? "Administrator"
      : profile?.role === "receptionist"
      ? "Receptionist"
      : profile?.role === "consultant"
      ? "Consultant"
      : "";

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16 w-full sticky top-0 z-40 bg-surface-container-lowest border-b border-surface-dim shadow-[0_4px_20px_rgba(0,0,0,0.04)] font-manrope antialiased">
      {/* Left side: spacer for hamburger on mobile + search on desktop */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Spacer for the hamburger button on mobile */}
        <div className="w-10 lg:hidden shrink-0" />
        <div className="relative flex-1 hidden md:block max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surface-dim rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-on-surface-variant placeholder-outline-variant transition-colors"
            placeholder="Search NutriCore CRM..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 md:gap-2 text-on-surface-variant shrink-0">
        <button className="p-2 rounded-full hover:bg-surface-container transition-colors active:opacity-80 duration-200 relative">
          <span className="material-symbols-outlined text-[20px] md:text-[24px]">
            notifications
          </span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest"></span>
        </button>
        <button className="p-2 rounded-full hover:bg-surface-container transition-colors active:opacity-80 duration-200 hidden sm:flex">
          <span className="material-symbols-outlined">help</span>
        </button>

        <div className="h-8 w-px bg-surface-dim mx-1 md:mx-2 hidden sm:block"></div>

        {/* ── User Profile Dropdown ──────────────────────── */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-surface-container transition-colors active:opacity-80 duration-200 p-1 pr-2 md:pr-3 rounded-full border border-surface-dim"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile?.full_name ?? "User"}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold">
                ?
              </div>
            )}
            <span className="text-sm font-medium text-on-surface hidden md:block max-w-[120px] truncate">
              {profile?.full_name ?? "Loading..."}
            </span>
            <span
              className={`material-symbols-outlined text-[18px] text-outline-variant hidden sm:block transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden z-50 animate-in slide-in-from-top-1">
              {/* User Info Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={profile?.full_name ?? "User"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
                      ?
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {profile?.full_name ?? "Loading..."}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {userEmail}
                    </p>
                    {roleLabel && (
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {roleLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <a
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-[20px] text-slate-400">
                    settings
                  </span>
                  Settings
                </a>
                <a
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-[20px] text-slate-400">
                    person
                  </span>
                  My Profile
                </a>
              </div>

              {/* Logout */}
              <div className="border-t border-slate-100 py-1">
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      logout
                    </span>
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
