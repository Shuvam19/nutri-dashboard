"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

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
    name: "Diet Plans",
    href: "/diet-plans",
    icon: CalendarIcon,
    children: [
      { name: "Plan Builder", href: "/diet-plans/new" },
      { name: "Templates", href: "/diet-plans" },
    ],
  },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

export function Sidebar() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="flex h-full min-h-screen flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 w-20 hover:w-64 group relative z-50">
      <div className="flex items-center h-16 px-4 shrink-0 border-b border-gray-100">
        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-lg">N</span>
        </div>
        <span className="ml-4 font-bold text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
          NutriCRM
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
        {navigation.map((item) => {
          const isOpen = openSection === item.name;
          return (
            <div key={item.name} className="flex flex-col">
              <button
                onClick={(e) => {
                  if (item.children) {
                    e.preventDefault();
                    setOpenSection(isOpen ? null : item.name);
                  } else {
                    window.location.href = item.href;
                  }
                }}
                className="flex items-center w-full px-3 py-3 text-gray-600 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors group/item"
              >
                <item.icon className="w-6 h-6 shrink-0" aria-hidden="true" />
                <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden flex-1 text-left">
                  {item.name}
                </span>
                {item.children && (
                  <ChevronDownIcon
                    className={`w-4 h-4 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Sub-navigation */}
              {item.children && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out pl-12 pr-4 ${
                    isOpen && "group-hover:block"
                  } ${isOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
                >
                  <div className="flex flex-col space-y-1 py-1 hidden group-hover:flex border-l-2 border-primary-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="pl-4 py-2 text-sm font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-r-lg transition-colors whitespace-nowrap"
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

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
          <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden whitespace-nowrap">
            <p className="text-sm font-medium text-gray-900">Dr. Consultant</p>
            <p className="text-xs text-gray-500">Dietitian</p>
          </div>
        </div>
      </div>
    </div>
  );
}
