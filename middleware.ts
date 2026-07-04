import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except login page
  const isAdminRoute = pathname.startsWith("/admin");
  const isApiAdminRoute = pathname.startsWith("/api/admin");

  if (isAdminRoute || isApiAdminRoute) {
    const token = request.cookies.get("admin_session")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload?.authenticated) {
      if (isApiAdminRoute) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      } else {
        // Redirect to home page where the login modal is accessible via the navbar avatar
        // Since there is no dedicated /login page, we redirect to / (or we can build a /admin/login page later)
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
