// middleware.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Get current session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Define which routes require authentication
  const protectedPaths = [
    '/review',
    '/profile', 
    '/settings',
    '/admin'
  ]
  
  // Check if current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )
  
  // Redirect to signin if accessing protected route without auth
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/signin', req.url))
  }
  
  // Redirect to dashboard if already logged in and trying to access auth pages
  if (session && (req.nextUrl.pathname === '/signin' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
