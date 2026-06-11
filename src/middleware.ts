import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userLockedCookie = request.cookies.get("user-locked");
  const userLocked = userLockedCookie?.value;

  if (userLocked === "true") {
    if (pathname !== "/login") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "locked");
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("user-role");
      response.cookies.delete("user-id");
      response.cookies.delete("user-locked");
      return response;
    }
  }

  if (pathname.startsWith("/admin")) {
    const userRoleCookie = request.cookies.get("user-role");
    const userRole = userRoleCookie?.value;

    if (!userRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/checkout/:path*"],
};
