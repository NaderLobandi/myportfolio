import { kv } from '@vercel/kv'

const isReady = () =>
  !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)

function cleanSource(ref: string): string {
  if (!ref) return 'Direct'
  try {
    return new URL(ref).hostname.replace(/^www\./, '') || 'Direct'
  } catch {
    return 'Unknown'
  }
}

export async function trackPageView(referrer: string, path: string) {
  if (!isReady()) return
  try {
    const day = new Date().toISOString().slice(0, 10)
    const p = kv.pipeline()
    p.incr('pv:total')
    p.hincrby('pv:daily', day, 1)
    p.hincrby('pv:paths', path || '/', 1)
    p.hincrby('pv:sources', cleanSource(referrer), 1)
    await p.exec()
  } catch {}
}

export async function trackSectionDwell(section: string, seconds: number) {
  if (!isReady()) return
  try {
    const p = kv.pipeline()
    p.hincrby('sec:visits', section, 1)
    p.hincrby('sec:seconds', section, Math.round(seconds))
    await p.exec()
  } catch {}
}

export async function trackChatOpen() {
  if (!isReady()) return
  try {
    await kv.incr('chat:opens')
  } catch {}
}

export async function trackChatQuery(query: string) {
  if (!isReady()) return
  try {
    await kv.lpush('chat:queries', { q: query, t: Date.now() })
    await kv.ltrim('chat:queries', 0, 299)
    await kv.incr('chat:total')
  } catch {}
}

export type AnalyticsSummary = {
  pvTotal: number
  pvDaily: Record<string, number>
  pvPaths: Record<string, number>
  pvSources: Record<string, number>
  secVisits: Record<string, number>
  secSeconds: Record<string, number>
  chatOpens: number
  chatTotal: number
  chatQueries: Array<{ q: string; t: number }>
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary | null> {
  if (!isReady()) return null
  try {
    const [pvTotal, pvDaily, pvPaths, pvSources, secVisits, secSeconds, chatOpens, chatTotal, rawQueries] =
      await Promise.all([
        kv.get<number>('pv:total'),
        kv.hgetall<Record<string, number>>('pv:daily'),
        kv.hgetall<Record<string, number>>('pv:paths'),
        kv.hgetall<Record<string, number>>('pv:sources'),
        kv.hgetall<Record<string, number>>('sec:visits'),
        kv.hgetall<Record<string, number>>('sec:seconds'),
        kv.get<number>('chat:opens'),
        kv.get<number>('chat:total'),
        kv.lrange<{ q: string; t: number }>('chat:queries', 0, 49),
      ])

    const chatQueries = rawQueries ?? []

    return {
      pvTotal: pvTotal ?? 0,
      pvDaily: pvDaily ?? {},
      pvPaths: pvPaths ?? {},
      pvSources: pvSources ?? {},
      secVisits: secVisits ?? {},
      secSeconds: secSeconds ?? {},
      chatOpens: chatOpens ?? 0,
      chatTotal: chatTotal ?? 0,
      chatQueries,
    }
  } catch {
    return null
  }
}
