import os

file_path = "src/app/(dashboard)/clients/page.tsx"

with open(file_path, "r") as f:
    content = f.read()

# Replace imports and function declaration
old_func = """import Link from "next/link";

export default function ClientsPage() {"""
new_func = """import Link from "next/link";
import { getClients } from "@/app/actions/client";

export default async function ClientsPage() {
  const clients = await getClients();"""

content = content.replace(old_func, new_func)

# We need to replace the <tbody> block. We can use regex to find the <tbody>...</tbody> block.
import re

tbody_pattern = re.compile(r'<tbody className="divide-y divide-surface-dim bg-surface-container-lowest">.*?</tbody>', re.DOTALL)

new_tbody = """<tbody className="divide-y divide-surface-dim bg-surface-container-lowest">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-md py-xl text-center text-on-surface-variant font-body-md">
                    No clients found. Add a new client to get started.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-surface-container transition-colors group">
                    <td className="px-md py-sm whitespace-nowrap">
                      <div className="flex items-center gap-sm">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center font-bold text-on-surface-variant">
                          {client.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-data-tabular text-data-tabular text-on-surface font-semibold">{client.full_name}</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{client.email || 'No email provided'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-sm whitespace-nowrap font-data-tabular text-data-tabular text-on-surface-variant">
                      {client.profiles?.full_name || 'Unassigned'}
                    </td>
                    <td className="px-md py-sm whitespace-nowrap">
                      <div className="font-data-tabular text-data-tabular text-on-surface">{new Date(client.created_at).toLocaleDateString()}</div>
                      <div className="font-body-sm text-body-sm text-outline mt-0.5 text-[12px]">Joined</div>
                    </td>
                    <td className="px-md py-sm whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps text-label-caps border border-secondary-fixed-dim capitalize">
                        {client.dietary_preference.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-md py-sm whitespace-nowrap text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-label-caps gap-1.5 border border-primary-fixed-dim capitalize">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> {client.status}
                      </span>
                    </td>
                    <td className="px-md py-sm whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/clients/${client.id}`} className="p-1.5 rounded-lg text-outline hover:bg-surface-variant hover:text-secondary transition-colors" title="View Patient File">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </Link>
                        <button className="p-1.5 rounded-lg text-outline hover:bg-surface-variant hover:text-secondary transition-colors" title="Edit Demographics">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>"""

content = tbody_pattern.sub(new_tbody, content)

with open(file_path, "w") as f:
    f.write(content)
