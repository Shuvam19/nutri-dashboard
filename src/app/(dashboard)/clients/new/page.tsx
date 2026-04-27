import React from "react";
import { ClientIntakeForm } from "@/components/forms/ClientIntakeForm";

export const metadata = {
  title: "New Client Intake | NutriCRM",
};

export default function NewClientPage() {
  return (
    <div className="py-base">
      <ClientIntakeForm />
    </div>
  );
}
