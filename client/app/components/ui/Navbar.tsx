"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthButton from "../AuthButton";
import { useSession } from "next-auth/react";

export default function Navbar(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header
      className="border-b shadow-sm bg-white flex items-center justify-center"
    >
      <div className="w-[80vw]">
        <div className="w-full flex h-16 items-center px-2 sm:px-4 lg:px-6">

          <div className="flex-1 flex items-center justify-start">
            <Link
              href="/landing"
              className="text-lg font-semibold text-gray-800"

            >
              Ladbang
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session && (
              <Link
                href="/profile"
                className="text-lg font-semibold text-gray-800"
              >
                Profile
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
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {open ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div
          className="md:hidden border-t"
          style={{ borderTopColor: "rgba(255,255,255,0.12)" }}
        >
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