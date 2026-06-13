import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes: Record<string, string[]> = {
  "/admin": ["admin"],
  "/owner": ["owner"],
  "/user": ["user"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedPrefix = Object.keys(protectedRoutes).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!matchedPrefix) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      const allowedRoles = protectedRoutes[matchedPrefix];
      if (user.role && !allowedRoles.includes(user.role)) {
        const dashboard =
          user.role === "admin"
            ? "/admin/dashboard"
            : user.role === "owner"
              ? "/owner/dashboard"
              : "/user/dashboard";
        return NextResponse.redirect(new URL(dashboard, request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/owner/:path*", "/user/:path*"],
};
