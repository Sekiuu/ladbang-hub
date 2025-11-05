"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import VerticalNavbar from "./VerticalNavbar";
/**
 * NavbarWrapper conditionally hides the Navbar on specific auth pages only
 * (login and signin). This keeps the Navbar component and layout imports
 * intact so the Navbar code can be reused elsewhere.
 */
export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement | null {
  const pathname = usePathname();

  if (!pathname) return null;

  // Lock-hide the Navbar only on the login and signin routes so the component
  // remains usable on other pages and can be imported elsewhere.
  if (pathname.startsWith("/login") || pathname.startsWith("/signin"))
    return <>{children}</>;

  return (
    <div className="w-full">
      <Navbar />
      <div className="flex w-full">
        <VerticalNavbar />
        <div className="pt-16 w-full">{children}</div>
      </div>
    </div>
  );
}
