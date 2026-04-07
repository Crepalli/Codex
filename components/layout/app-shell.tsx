import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
