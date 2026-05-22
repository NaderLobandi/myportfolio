import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const expected = process.env.SITE_PASSWORD

  if (token === 'authenticated' && expected) {
    return NextResponse.next()
  }

  const loginUrl = new URL('/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/api/fit-analyzer',
    '/api/resume-tailor',
    '/api/cover-letter',
  ],
}
