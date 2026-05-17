import { StrictMode, useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import useThemeStore from "@/store/useThemeStore";

function readStoredTheme(): "light" | "dark" {
  try {
    const raw = localStorage.getItem("theme");
    if (!raw) return "dark";
    const parsed = JSON.parse(raw) as { state?: { theme?: string } };
    return parsed.state?.theme === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

const bootstrapTheme = readStoredTheme();
document.documentElement.classList.remove("light", "dark");
document.documentElement.classList.add(bootstrapTheme);
useThemeStore.setState({ theme: bootstrapTheme });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
    mutations: { retry: 0 },
  },
});

function ThemeHydration() {
  const theme = useThemeStore((s) => s.theme);

  useLayoutEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeHydration />
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
