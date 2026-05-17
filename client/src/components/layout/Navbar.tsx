import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogOut, Moon, Settings, Sun } from "lucide-react";
import { useThemeStore } from "@/store";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const AVATAR_BASE = "https://api.dicebear.com/9.x/identicon/svg";

const getAvatarUrl = (seed: string) =>
  `${AVATAR_BASE}?seed=${encodeURIComponent(seed)}`;

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  const { signOut } = useAuth();
  const user = useAuthStore((s) => s.user);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarUrl = getAvatarUrl(user?.email ?? user?.name ?? "Felix");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
  };

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="flex h-14 items-center justify-between gap-3 border-b border-line bg-background px-4">
      <div className="min-w-0">
        {title ? (
          <h1 className="truncate text-sm font-semibold text-main">{title}</h1>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-sm px-2.5 min-h-8 border border-line text-xs text-main transition-colors hover:bg-foreground"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className={cn(
              "flex items-center gap-2 rounded-sm border border-line bg-secondary py-1 pl-1 pr-2 transition-colors hover:bg-foreground",
              menuOpen && "bg-foreground",
            )}
          >
            <img
              src={avatarUrl}
              alt=""
              className="h-6 w-6 rounded-sm border border-line bg-background object-cover"
            />
            <span className="hidden max-w-[120px] truncate text-xs font-medium text-main sm:block">
              {user?.name ?? "Account"}
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 text-muted transition-transform",
                menuOpen && "rotate-180",
              )}
            />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-1.5 w-56 border border-line bg-background shadow-lg"
            >
              <div className="border-b border-line px-3 py-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={avatarUrl}
                    alt=""
                    className="size-9 shrink-0 rounded-sm border border-line bg-secondary"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-main">
                      {user?.name ?? "User"}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {user?.email ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-1">
                <Link
                  to="/settings"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-xs text-main transition-colors hover:bg-secondary"
                >
                  <Settings className="size-4 text-muted" />
                  Settings
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-xs text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
