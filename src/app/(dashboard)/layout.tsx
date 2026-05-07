import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden font-body-md text-body-md text-on-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar />
        <main className="flex-1 p-4 md:p-gutter flex flex-col gap-md md:gap-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
