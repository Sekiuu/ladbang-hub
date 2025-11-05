"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthButton from "../AuthButton";
import { useSession } from "next-auth/react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaWallet } from "react-icons/fa";
import { User } from "lucide-react";

export default function Navbar(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="border-b border-sky-100 shadow-sm bg-white/100 flex items-center justify-center fixed w-full z-20">
      <div className="w-[94vw]">
        <div className="w-full flex h-16 items-center px-2 sm:px-4 lg:px-6">
          <div className="flex-1 flex items-center justify-start">
            <Link
              href="/landing"
              className="flex items-center gap-2 text-xl font-light text-slate-700 hover:text-sky-600 transition"
            >
              <FaWallet className="w-5 h-5 text-sky-500" />
              <span>Ladbang</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session && (
              <Link
                href="/profile"
                className="flex items-center gap-2 text-base font-light text-slate-700 hover:text-sky-600 transition"
              >
                <User className="w-4 h-4" />
                <span>{session?.user?.username}</span>
              </Link>
            )}

            {!session ? (
              <div className="hidden md:block">
                <AuthButton />
              </div>
            ) : null}

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
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="md:hidden border-t border-sky-100 bg-white/100">
          {!session ? (
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <AuthButton />
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
