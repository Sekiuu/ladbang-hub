// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isProtectedRoute = req.nextUrl.pathname.startsWith("/profile") || req.nextUrl.pathname.startsWith("/dashboard");
  const isHomePage = req.nextUrl.pathname === "/";
  const isLandingPage = req.nextUrl.pathname === "/landing";
  const isLoginPage =
    req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signin";
  // ถ้าไม่มี token และกำลังจะเข้า route ที่ต้อง login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!token && isHomePage) {
    return NextResponse.redirect(new URL("/landing", req.url));
  }
  // if (token && isLandingPage) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/landing", "/", "/login", "/signin", "/dashboard/:path*"],
};
