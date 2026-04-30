import React from "react";
import { ClientIntakeForm } from "@/components/forms/ClientIntakeForm";
import { getTaxonomyTagsBatch } from "@/app/actions/taxonomy";

export const metadata = {
  title: "New Client Intake | NutriCRM",
};

export default async function NewClientPage() {
  const tags = await getTaxonomyTagsBatch(["disease", "allergy", "region_tag"]);

  return (
    <div className="py-base">
      <ClientIntakeForm diseases={tags.disease} allergies={tags.allergy} regions={tags.region_tag} />
    </div>
  );
}
