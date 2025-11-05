"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, LayoutDashboard, Sparkles } from "lucide-react";

function VerticalNavbar() {
  const pathname = usePathname();
  
  if (pathname === "/login" || pathname === "/signin") {
    return null;
  }

  const navItems = [
    { href: "/landing", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="hidden md:flex md:flex-col bg-gradient-to-b from-sky-50 to-cyan-50 border-r border-sky-100 md:w-64 p-6 space-y-2 inset-y-0 z-10 shadow-sm">
      <div className="flex flex-col gap-2 pt-24 fixed">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-light ${
                isActive
                  ? "bg-sky-500 text-white shadow-sm"
                  : "text-slate-700 hover:bg-white/60 hover:text-sky-600"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default VerticalNavbar;
