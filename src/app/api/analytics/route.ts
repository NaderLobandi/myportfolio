import { NextRequest, NextResponse } from 'next/server'
import { trackPageView, trackSectionDwell, trackChatOpen, getAnalyticsSummary } from '@/lib/analytics'
import { rateLimiter } from '@/lib/rate-limiter'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anon'
  if (rateLimiter.check(`analytics:${ip}`, 120)) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { event } = body

    if (event === 'page_view') {
      await trackPageView(String(body.referrer ?? ''), String(body.path ?? '/'))
    } else if (event === 'section_dwell') {
      const sec = Math.min(Number(body.seconds) || 0, 3600)
      await trackSectionDwell(String(body.section ?? ''), sec)
    } else if (event === 'chat_open') {
      await trackChatOpen()
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value
  if (token !== 'authenticated' || !process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await getAnalyticsSummary()
  if (!data) {
    return NextResponse.json({ error: 'KV not configured' }, { status: 503 })
  }
  return NextResponse.json(data)
}
