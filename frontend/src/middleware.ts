import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  //   return NextResponse.redirect(new URL('/home', request.url))
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/auth/login" ||
    path === "/auth/register" ;

  const token = request.cookies.get("access_token")?.value;

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/wallet", request.nextUrl), {
      status: 302,
    });
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl), {
      status: 302,
    });
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/wallet",
    "/auth/login",
    "/auth/register",
  ],
};
