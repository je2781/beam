import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  //   return NextResponse.redirect(new URL('/home', request.url))
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path === "/signup" ;

  const token = request.cookies.get("access_token")?.value;

  if (!token && isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url), {
      status: 302,
    });
  }

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
    "/login",
    "/signup",
  ],
};
