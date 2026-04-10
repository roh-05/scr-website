// src/proxy.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // 1. Initialize Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // --- A. AUTHENTICATION LOGIC (originally from proxy.ts) ---
  const isAuthRoute = pathname.startsWith('/admin/login')
  const isAdminRoute = pathname.startsWith('/admin')

  // Kick unauthenticated users out of the admin area
  if (isAdminRoute && !isAuthRoute && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Prevent authenticated users from seeing the login page again
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // --- B. MAINTENANCE MODE LOGIC ---
  // If we are NOT in the admin area, NOT on the maintenance page, and NOT an admin user...
  if (!isAdminRoute && !pathname.startsWith('/maintenance') && !user) {
    try {
      // Fetch maintenance status directly from Supabase REST API (Edge compatible)
      const settingsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/SiteSettings?id=eq.1&select=maintenanceMode`,
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          next: { revalidate: 10 } 
        }
      );

      const settings = await settingsResponse.json();
      const isMaintenance = settings?.[0]?.maintenanceMode || false;

      if (isMaintenance) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    } catch (error) {
      console.error('Middleware Maintenance Check Error:', error);
      // Fail open: allow traffic if check fails
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
