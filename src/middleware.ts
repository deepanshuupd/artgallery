import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const DEFAULT_ADMIN_EMAIL = "sneha@gmail.com";

function getAllowedAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim() || DEFAULT_ADMIN_EMAIL;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowedAdminEmail = getAllowedAdminEmail();
  const isAllowedAdminUser =
    user?.email?.toLowerCase() === allowedAdminEmail.toLowerCase();

  const isAdminLogin = request.nextUrl.pathname === "/admin/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isAdminLogin && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAdminLogin && isAllowedAdminUser) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
