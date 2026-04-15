"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Folders,
  ShoppingBag,
  Users,
  ClipboardList,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/category", label: "Category", icon: <Folders size={18} /> },
  { href: "/admin/products", label: "Products", icon: <ShoppingBag size={18} /> },
  { href: "/admin/users", label: "Users", icon: <Users size={18} /> },
  { href: "/admin/orders", label: "Orders", icon: <ClipboardList size={18} /> },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 border-r border-gray-200 bg-white shadow-sm flex flex-col">
      <div className="px-5 py-6 border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900 tracking-tight">
          The Fabric People
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-red-50 text-red-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span
                className={`shrink-0 transition-colors duration-150 ${
                  isActive
                    ? "text-red-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {isActive ? (
                <span className="w-1 h-4 rounded-full bg-red-500 -mr-1" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
