import { NextResponse } from 'next/server'

const COOKIE = 'auth-token'

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
}

export async function POST(request: Request) {
  const body = await request.json()
  const { password } = body

  if (typeof password !== 'string' || password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE, 'authenticated', {
    ...cookieOptions,
    maxAge: 86400,
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE, '', {
    ...cookieOptions,
    maxAge: 0,
  })
  return response
}
