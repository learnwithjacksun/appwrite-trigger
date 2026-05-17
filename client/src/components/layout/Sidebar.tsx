import { NavLink } from "react-router-dom";
import {
  Activity,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/useUiStore";
import { Button } from "../ui";
import { useAuth } from "@/hooks";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/ping-logs", label: "Ping logs", icon: Activity },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const { signOut } = useAuth();

  return (
    <aside
      className={cn(
        "flex h-dvh flex-col border-r border-line bg-primary text-white transition-[width] duration-200",
        sidebarOpen ? "w-56" : "w-16",
      )}
    >
      <div className="flex h-14 items-center justify-between gap-2 border-b border-white/20 px-2">
        <div
          className={
            sidebarOpen
              ? "opacity-100 block"
              : "opacity-0 overflow-hidden hidden"
          }
        >
          <p className="text-white">A-Trigger ⚡</p>
        </div>
        <button
          type="button"
          className="h-10 w-10 center rounded-full text-white bg-white/20 shrink-0 p-0"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose size={20} className=" shrink-0 text-white " />
          ) : (
            <PanelLeftOpen size={20} className=" shrink-0" />
          )}
        </button>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2 [&_a]:no-underline">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-sm border border-transparent px-2 py-2 text-sm transition-colors",
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )
            }
          >
            <Icon className="shrink-0 text-current" size={20} />
            {sidebarOpen ? (
              <span className="truncate text-current">{label}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
          className="h-14 w-full bg-primary text-white border-t border-white/20"
        >
          <LogOut className="size-4" />
         {sidebarOpen && <span>Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}
