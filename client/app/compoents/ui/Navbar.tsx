"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Navbar(): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="border-b"
      style={{
        background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
        color: "#ffffff",
      }}
    >
      <div className="w-full">
        <div className="w-full flex h-16 items-center px-2 sm:px-4 lg:px-6">
          <div className="flex-1 flex items-center">
            <Link href="/" className="text-lg font-semibold" style={{ color: "#fff" }}>
              Ladbang
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-end">
            <div className="hidden md:block">
              <Link href="/login" className="text-lg font-semibold" style={{ color: "#fff" }}>
                Login
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {open ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="md:hidden border-t" style={{ borderTopColor: 'rgba(255,255,255,0.12)' }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">

            <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium" style={{ color: '#fff' }}>
              Login
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
