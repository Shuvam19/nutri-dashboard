import { getRolePermissions } from "@/app/actions/permissions";
import RolePermissionMatrix from "@/components/settings/RolePermissionMatrix";

export const dynamic = "force-dynamic";

export default async function RolePermissionsPage() {
  const permissions = await getRolePermissions();

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container/30">
          <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
            Feature Permission Matrix
          </h2>
        </div>
        <div className="p-6">
          <RolePermissionMatrix initialPermissions={permissions} />
        </div>
      </div>
    </div>
  );
}
