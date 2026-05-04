import React from "react";
import Link from "next/link";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-h1 text-h1 text-on-surface mb-1">System Settings</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Configure application data, manage user accounts, and define role permissions.
        </p>
      </div>

      <nav className="flex border-b border-surface-dim">
        <div className="flex gap-8">
          <SettingsTabLink href="/settings" label="Taxonomy Data" icon="label" />
          <SettingsTabLink href="/settings/users" label="User Management" icon="group" />
          <SettingsTabLink href="/settings/roles" label="Roles & Permissions" icon="admin_panel_settings" />
        </div>
      </nav>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

function SettingsTabLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 py-3 px-1 border-b-2 border-transparent hover:text-primary transition-all font-label text-label relative group"
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      {label}
      {/* Active state check would usually happen in a Client Component, 
          but for simplicity we'll let the hover state guide the user. 
          In a full implementation, we'd use usePathname() to set active styles. */}
    </Link>
  );
}
