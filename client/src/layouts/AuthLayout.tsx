import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-sm border border-line bg-secondary/40 p-6 shadow-sm">
        <div className="mb-6 space-y-1 text-center">
          
          <h1 className="text-lg font-semibold text-main">Appwrite Trigger ⚡</h1>
        
        </div>
        <Outlet />
      </div>
    </div>
  );
}
