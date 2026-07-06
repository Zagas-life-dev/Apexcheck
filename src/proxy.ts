import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-edge";

// Gate every /admin route behind a valid admin session (verified on the edge).
// (Next 16 renamed the "middleware" convention to "proxy".)
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname === "/admin/login") {
    if (session) return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    return NextResponse.next();
  }

  if (!session) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
