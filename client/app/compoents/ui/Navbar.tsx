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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-semibold" style={{ color: "#fff" }}>
              Ladbang
            </Link>
          </div>
        
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Link href="/login"className="text-lg font-semibold" style={{ color: "#fff" }}>
                Login
              </Link>
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
