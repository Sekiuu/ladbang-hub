// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { api } from "./app/api";
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/profile");
  const isHomePage =
    req.nextUrl.pathname === "/" ||
    req.nextUrl.pathname.startsWith("/dashboard/") ||
    req.nextUrl.pathname.startsWith("/ai/") ||
    req.nextUrl.pathname.startsWith("/addrecord/");
  const isLandingPage = req.nextUrl.pathname === "/landing";
  const isUserSettingPage = req.nextUrl.pathname === "/usersetting";
  const isLoginPage =
    req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signin";
  // ถ้าไม่มี token และกำลังจะเข้า route ที่ต้อง login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (!token && isHomePage) {
    return NextResponse.redirect(new URL("/landing", req.url));
  }
  if (token) {
    console.log("token:" + token.id);
    const res = await api.get("/usersettings", { user_id: token.id });
    console.log(res);
    if (!res?.success) {
      return NextResponse.redirect(new URL("/usersetting", req.url));
    } else if (isUserSettingPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (isLandingPage || isLoginPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/landing", "/", "/login", "/signin"],
};
