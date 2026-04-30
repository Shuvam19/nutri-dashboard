import React from "react";
import { ClientIntakeForm } from "@/components/forms/ClientIntakeForm";
import { getClientById } from "@/app/actions/client";
import { getTaxonomyTagsBatch } from "@/app/actions/taxonomy";
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
  const [client, tags] = await Promise.all([
    getClientById(id),
    getTaxonomyTagsBatch(["disease", "allergy", "region_tag"]),
  ]);

  if (!client) {
    notFound();
  }

  return (
    <div className="py-base">
      <ClientIntakeForm initialData={client} diseases={tags.disease} allergies={tags.allergy} regions={tags.region_tag} />
    </div>
  );
}
