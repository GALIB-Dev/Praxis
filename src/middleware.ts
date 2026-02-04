import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Redirect logged-in users away from login/signup pages
  const token = request.cookies.get("authToken");
  const pathname = request.nextUrl.pathname;

  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect non-authenticated users trying to access protected routes
  const protectedRoutes = [
    "/dashboard",
    "/upload",
    "/employer/candidates",
    "/employer/jobs",
  ];

  if (
    !token &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
