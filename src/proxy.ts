import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-key-for-development'
const encodedKey = new TextEncoder().encode(secretKey)

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Check if it's an admin path
  if (path.startsWith('/admin')) {
    const session = req.cookies.get('session')?.value

    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    try {
      // Verify session
      await jwtVerify(session, encodedKey, {
        algorithms: ['HS256'],
      })
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware session verification failed:', error)
      // Invalid session, redirect to login and clear cookie
      const response = NextResponse.redirect(new URL('/login', req.url))
      response.cookies.delete('session')
      return response
    }
  }

  // Redirect /login to /admin if already logged in
  if (path === '/login') {
    const session = req.cookies.get('session')?.value
    if (session) {
      try {
        await jwtVerify(session, encodedKey, {
          algorithms: ['HS256'],
        })
        return NextResponse.redirect(new URL('/admin', req.url))
      } catch (error) {
        // Just proceed to login if token is invalid
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
