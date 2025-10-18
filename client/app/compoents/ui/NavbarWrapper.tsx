"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper(): React.ReactElement | null {
  const pathname = usePathname();

  // Hide navbar on the login page
  if (!pathname) return null;
  if (pathname.startsWith("/login")) return null;

  return <Navbar />;
}
