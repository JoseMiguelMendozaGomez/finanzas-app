"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

interface DashboardShellProps {
  children: React.ReactNode;
}

/**
 * Shell del dashboard — gestiona el estado del sidebar mobile.
 * Es el único componente cliente en la cadena del layout.
 */
export default function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Área derecha: topbar + contenido */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardTopbar onMenuClick={() => setMobileOpen(true)} />

        {/* Scroll container del contenido */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
