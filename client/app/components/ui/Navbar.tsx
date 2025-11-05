"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthButton from "../AuthButton";
import { useSession } from "next-auth/react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaWallet } from "react-icons/fa";
import { User, LayoutDashboard, Sparkles } from "lucide-react";

export default function Navbar(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="border-b border-sky-100 shadow-sm bg-white/100 fixed w-full z-20">
      <div className="max-w-7xl mx-auto">
        <div className="w-full flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex-1 flex items-center justify-start">
            <Link
              href="/landing"
              className="flex items-center gap-2 text-xl font-light text-slate-700 hover:text-sky-600 transition"
            >
              <FaWallet className="w-5 h-5 text-sky-500" />
              <span>Ladbang</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {session && (
              <Link
                href="/profile"
                className="flex items-center gap-2 text-base font-light text-slate-700 hover:text-sky-600 transition"
              >
                <User className="w-4 h-4" />
                <span>{session?.user?.username}</span>
              </Link>
            )}

            {!session && <AuthButton />}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              {open ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-sky-100 bg-white">
            <div className="px-4 pt-2 pb-3 space-y-2">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-3 text-base font-light text-slate-700 hover:bg-sky-50 rounded-xl transition"
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                 
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-3 text-base font-light text-slate-700 hover:bg-sky-50 rounded-xl transition"
                    onClick={() => setOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>{session?.user?.username}</span>
                  </Link>
                </>
              ) : (
                <div onClick={() => setOpen(false)}>
                  <AuthButton />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
