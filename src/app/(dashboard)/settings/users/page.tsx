import { getUsers } from "@/app/actions/settings";
import UserManager from "@/components/settings/UserManager";

export const dynamic = "force-dynamic";

export default async function UserManagementPage() {
  const result = await getUsers();

  if (!result.success) {
    return (
      <div className="bg-error-container/20 text-error p-6 rounded-xl border border-error/20">
        <h3 className="font-h3 mb-2">Error Loading Users</h3>
        <p>{result.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container/30 flex justify-between items-center">
          <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">group</span>
            Staff Directory
          </h2>
        </div>
        <div className="p-6">
          <UserManager users={result.data || []} />
        </div>
      </div>
    </div>
  );
}
