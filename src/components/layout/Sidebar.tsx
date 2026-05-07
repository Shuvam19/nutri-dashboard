"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FEATURE_NAV_MAP } from "@/lib/permissions";
import { getMyPermissions } from "@/app/actions/permissions";
import { RolePermission } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";

type NavItem = {
  name: string;
  href: string;
  icon: any;
  children?: { name: string; href: string }[];
};

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  {
    name: "Clients",
    href: "/clients",
    icon: UsersIcon,
    children: [
      { name: "All Clients", href: "/clients" },
      { name: "Onboard Client", href: "/clients/new" },
    ],
  },
  {
    name: "Food Bucket",
    href: "/food-bucket",
    icon: BookOpenIcon,
    children: [
      { name: "Master Database", href: "/food-bucket" },
      { name: "Add Food Item", href: "/food-bucket/new" },
    ],
  },
  {
    name: "Appointments",
    href: "/appointments",
    icon: CalendarIcon,
    children: [
      { name: "View Appointments", href: "/appointments" },
      { name: "Book New", href: "/appointments/new" },
    ],
  },
  {
    name: "Diet Plans",
    href: "/diet-plans",
    icon: BookOpenIcon,
    children: [
      { name: "Plan Builder", href: "/diet-plans/new" },
      { name: "Templates", href: "/diet-plans" },
    ],
  },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

export function Sidebar() {
  // Mobile/tablet: drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);
  // Desktop: expanded or collapsed (icon-only)
  const [desktopExpanded, setDesktopExpanded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [userProfile, setUserProfile] = useState<{ full_name: string; role: string } | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const [perms, supabase] = await Promise.all([
        getMyPermissions(),
        createClient(),
      ]);
      setPermissions(perms);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();
        if (profile) setUserProfile(profile);
      }
    }
    load();
  }, []);

  // Close mobile drawer on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  // Close mobile drawer on route change (link click)
  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    window.location.href = href;
  };

  const filteredNavigation = navigation.filter((item) => {
    const featureKey = FEATURE_NAV_MAP[item.href];
    if (!featureKey) return true; // Default to visible if not mapped
    const perm = permissions.find((p) => p.feature === featureKey);
    return perm ? perm.is_enabled : true; // Default to true if permission record missing (admin usually)
  });

  const isExpanded = mobileOpen || desktopExpanded;

  return (
    <>
      {/* ── MOBILE HAMBURGER BUTTON ─────────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-[60] lg:hidden w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
        aria-label="Open sidebar"
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      {/* ── BACKDROP (Mobile/Tablet only) ────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[69] bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <div
        ref={sidebarRef}
        className={`
          flex h-full min-h-screen flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 z-[70]
          
          /* Mobile: fixed drawer, slide in/out */
          fixed lg:relative
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 lg:translate-x-0"}
          
          /* Desktop: collapsed by default, expand on hover or click */
          ${!mobileOpen ? (desktopExpanded ? "lg:w-64" : "lg:w-20 lg:hover:w-64") : ""}
        `}
        onMouseEnter={() => {
          // Only apply hover expand on desktop
          if (window.innerWidth >= 1024 && !mobileOpen) {
            setDesktopExpanded(true);
          }
        }}
        onMouseLeave={() => {
          // Only apply hover collapse on desktop
          if (window.innerWidth >= 1024 && !mobileOpen) {
            setDesktopExpanded(false);
            setOpenSection(null);
          }
        }}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 shrink-0 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className={`ml-4 font-bold text-gray-800 transition-opacity duration-300 whitespace-nowrap overflow-hidden
              ${isExpanded ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"}`}>
              NutriCRM
            </span>
          </div>
          {/* Close button on mobile */}
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isOpen = openSection === item.name;
            return (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={(e) => {
                    if (item.children) {
                      e.preventDefault();
                      setOpenSection(isOpen ? null : item.name);
                    } else {
                      handleNavClick(item.href);
                    }
                  }}
                  className="flex items-center w-full px-3 py-3 text-gray-600 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors group/item"
                >
                  <item.icon className="w-6 h-6 shrink-0" aria-hidden="true" />
                  <span className={`ml-4 font-medium transition-opacity duration-300 whitespace-nowrap overflow-hidden flex-1 text-left text-sm
                    ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                    {item.name}
                  </span>
                  {item.children && (
                    <ChevronDownIcon
                      className={`w-4 h-4 ml-auto shrink-0 transition-transform duration-200 
                        ${isExpanded ? "opacity-100" : "opacity-0"}
                        ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {/* Sub-navigation */}
                {item.children && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out pl-12 pr-4 ${
                      isOpen && isExpanded ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex flex-col space-y-1 py-1 border-l-2 border-primary-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="pl-4 py-2 text-xs font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-r-lg transition-colors whitespace-nowrap"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom toggle (desktop only) */}
        <div className="p-4 border-t border-gray-100 hidden lg:block">
          <button
            onClick={() => setDesktopExpanded(!desktopExpanded)}
            className="flex items-center w-full px-3 py-3 text-gray-600 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            {desktopExpanded ? (
              <XMarkIcon className="w-6 h-6 shrink-0" />
            ) : (
              <Bars3Icon className="w-6 h-6 shrink-0" />
            )}
            <span className={`ml-4 font-medium transition-opacity duration-300 whitespace-nowrap overflow-hidden
              ${isExpanded ? "opacity-100" : "opacity-0"}`}>
              {desktopExpanded ? "Collapse" : "Expand"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
