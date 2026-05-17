import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store";

function maskToken(token: string | null) {
  if (!token) return "Not available";
  if (token.length <= 8) return "••••••••";
  return `${token.slice(0, 4)}••••••••${token.slice(-4)}`;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const token = useAuthStore((s) => s.token);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const [revealed, setRevealed] = useState(false);

  const applyTheme = (value: "light" | "dark") => {
    setTheme(value);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(value);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-main">Settings</h1>
        <p className="text-xs text-muted">Account, tokens, and appearance.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-main">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted">Name</span>
            <span>{user?.name ?? "—"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted">Email</span>
            <span>{user?.email ?? "—"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session token</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted">
            Stored locally for API requests. Toggle reveal to audit the suffix.
          </p>
          <div className="rounded-sm border border-line bg-background px-3 py-2 font-mono text-xs text-main">
            {revealed && token ? token : maskToken(token)}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRevealed((value) => !value)}
          >
            {revealed ? "Mask token" : "Reveal token"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted">
            Password changes are not wired yet — UI placeholder only.
          </p>
          <Input
            label="New password"
            type="password"
            disabled
            placeholder="Not available in this build"
          />
          <Input
            label="Confirm password"
            type="password"
            disabled
            placeholder="Not available in this build"
          />
          <Button type="button" variant="secondary" size="sm" disabled>
            Update password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={theme === "dark" ? "secondary" : "outline"}
            size="sm"
            onClick={() => applyTheme("dark")}
          >
            <Moon className="size-4" />
            Dark
          </Button>
          <Button
            type="button"
            variant={theme === "light" ? "secondary" : "outline"}
            size="sm"
            onClick={() => applyTheme("light")}
          >
            <Sun className="size-4" />
            Light
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
