import { getAppointments } from "@/app/actions/appointment";
import { AppointmentCalendar } from "@/components/calendar/AppointmentCalendar";

export const metadata = {
  title: "Appointment Calendar | NutriPlan CRM",
};

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className="flex-1 overflow-y-auto p-2 md:p-8 bg-background min-h-[calc(100vh-4rem)]">
      <div className="max-w-[1600px] mx-auto h-full">
        <AppointmentCalendar appointments={appointments} />
      </div>
    </div>
  );
}
