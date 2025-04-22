import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  //   return NextResponse.redirect(new URL('/home', request.url))
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path === "/signup" ;

  const token = request.cookies.get("access_token")?.value;


  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/wallet?page=1", request.nextUrl), {
      status: 302,
    });
  }


  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl), {
      status: 302,
    });
  }
}

