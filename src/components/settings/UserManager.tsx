"use client";

import React, { useState } from "react";
import { UserRole } from "@/lib/types/database";
import { createUser, updateUserRole, toggleUserActive } from "@/app/actions/settings";

interface UserWithAuth {
  id: string;
  full_name: string;
  role: UserRole;
  email: string;
  is_active: boolean;
  avatar_url?: string | null;
  last_sign_in?: string;
  created_at: string;
}

interface UserManagerProps {
  users: UserWithAuth[];
}

export default function UserManager({ users }: UserManagerProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setIsPending(true);
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      setMessage({ type: "success", text: "User role updated." });
    } else {
      setMessage({ type: "error", text: result.message || "Failed to update role." });
    }
    setIsPending(false);
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    setIsPending(true);
    const result = await toggleUserActive(userId, !currentStatus);
    if (result.success) {
      setMessage({ type: "success", text: `User ${!currentStatus ? "activated" : "deactivated"}.` });
    } else {
      setMessage({ type: "error", text: result.message || "Failed to update status." });
    }
    setIsPending(false);
  };

  const handleInviteUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await createUser(formData);
    
    if (result.success) {
      setMessage({ type: "success", text: "Invite sent successfully." });
      setIsInviteModalOpen(false);
    } else {
      setMessage({ type: "error", text: result.message || "Failed to invite user." });
    }
    setIsPending(false);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center justify-between ${
          message.type === "success" ? "bg-primary-container/20 text-primary border border-primary/20" : "bg-error-container/20 text-error border border-error/20"
        }`}>
          <span className="text-sm font-medium">{message.text}</span>
          <button onClick={() => setMessage(null)} className="material-symbols-outlined text-[18px]">close</button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-surface-tint transition-all"
        >
          <span className="material-symbols-outlined">person_add</span>
          Invite New Staff
        </button>
      </div>

      <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Staff Member</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Role</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Last Sign-in</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Status</th>
              <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-container/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.full_name.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-on-surface">{user.full_name}</div>
                      <div className="text-xs text-on-surface-variant">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    disabled={isPending}
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className="bg-transparent border border-outline-variant rounded px-2 py-1 text-sm outline-none focus:border-primary transition-colors"
                  >
                    <option value="admin">Admin</option>
                    <option value="consultant">Consultant</option>
                    <option value="receptionist">Receptionist</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {user.last_sign_in ? new Date(user.last_sign_in).toLocaleDateString() : "Never"}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    disabled={isPending}
                    onClick={() => handleToggleActive(user.id, user.is_active)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                      user.is_active 
                        ? "bg-primary-container/10 border-primary/30 text-primary" 
                        : "bg-error-container/10 border-error/30 text-error"
                    }`}
                  >
                    {user.is_active ? "Active" : "Disabled"}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-outline hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container/30">
              <h3 className="font-h3 text-h3 text-on-surface">Invite Staff Member</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="material-symbols-outlined text-on-surface-variant">close</button>
            </div>
            <form onSubmit={handleInviteUser} className="p-6 space-y-4">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Full Name</label>
                <input
                  name="full_name"
                  required
                  placeholder="e.g., Dr. Jane Doe"
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="jane.doe@example.com"
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Assigned Role</label>
                <select
                  name="role"
                  required
                  defaultValue="consultant"
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="consultant">Consultant (Clinical Access)</option>
                  <option value="receptionist">Receptionist (Front Desk)</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-outline-variant rounded-lg font-medium hover:bg-surface-variant transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-3 bg-primary text-on-primary rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                >
                  {isPending ? "Sending..." : "Send Invite"}
                  {isPending && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
