import { AppointmentForm } from "@/components/forms/AppointmentForm";

export const metadata = {
  title: "Book Appointment | NutriPlan CRM",
};

export default function NewAppointmentPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
      <div className="max-w-container-max mx-auto space-y-6">
        <AppointmentForm />
      </div>
    </div>
  );
}
