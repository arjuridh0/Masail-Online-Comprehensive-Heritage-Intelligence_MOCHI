import { NextResponse, type NextRequest } from "next/server";

// Next.js 16: export function nama 'proxy' (menggantikan 'middleware')
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteksi rute dasbor dan admin
  const isProtectedPath = pathname.startsWith("/dasbor") || pathname.startsWith("/admin");

  if (isProtectedPath) {
    // Cek auth cookie dasar Supabase
    const hasAuthCookie = request.cookies
      .getAll()
      .some((cookie) => cookie.name.includes("-auth-token") || cookie.name.startsWith("sb-"));

    if (!hasAuthCookie) {
      const loginUrl = new URL("/masuk", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Response dengan header keamanan dasar
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");

  return response;
}

export const config = {
  matcher: [
    "/dasbor/:path*",
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
