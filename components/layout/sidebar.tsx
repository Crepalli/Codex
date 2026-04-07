"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, List, Tag } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transações", icon: List },
  { href: "/categories", label: "Categorias", icon: Tag },
  { href: "/reports", label: "Relatórios", icon: BarChart3 }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 p-4 border-r border-slate-200 bg-white min-h-screen">
      <h2 className="text-xl font-bold mb-8">FinTrack Pro</h2>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className={clsx("flex items-center gap-3 p-3 rounded-xl", pathname.startsWith(link.href) ? "bg-cyan-50 text-cyan-700" : "hover:bg-slate-50")}>
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
