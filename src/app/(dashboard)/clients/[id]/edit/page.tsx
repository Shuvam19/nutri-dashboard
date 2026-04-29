import React from "react";
import { ClientIntakeForm } from "@/components/forms/ClientIntakeForm";
import { getClientById } from "@/app/actions/client";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Client | NutriCRM",
};

interface EditClientPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <div className="py-base">
      <ClientIntakeForm initialData={client} />
    </div>
  );
}
