import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

// const titles: Record<string, string> = {
//   "/dashboard": "Dashboard",
//   "/projects": "Projects",
//   "/ping-logs": "Ping logs",
//   "/settings": "Settings",
// };

export function DashboardLayout() {
  // const { pathname } = useLocation();
  // const base =
  //   Object.entries(titles).find(([path]) => pathname.startsWith(path))?.[1] ??
  //   "Workspace";
  // const title =
  //   pathname.startsWith("/projects/") && pathname !== "/projects"
  //     ? "Project details"
  //     : base;

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col h-dvh overflow-y-scroll hide-scrollbar">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
