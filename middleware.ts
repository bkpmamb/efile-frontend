// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect admin ke /admin jika akses /dashboard
    if (path.startsWith("/dashboard") && token?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Redirect user ke /dashboard jika akses /admin
    if (path.startsWith("/admin") && token?.role === "user") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
