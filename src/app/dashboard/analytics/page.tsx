import Link from 'next/link'
import { getAnalyticsSummary } from '@/lib/analytics'

function timeAgo(ms: number): string {
  const diff = Date.now() - ms
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function sortedDesc(obj: Record<string, number>): [string, number][] {
  return Object.entries(obj).sort((a, b) => b[1] - a[1])
}

function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111] p-5">
      <p className="text-[#ededed]/40 text-xs uppercase tracking-widest mb-2">{label}</p>
      <p className="text-[#ededed] text-3xl font-bold">{value}</p>
      {sub && <p className="text-[#ededed]/30 text-xs mt-1">{sub}</p>}
    </div>
  )
}

function Bar({ pct, color = '#f97316' }: { pct: number; color?: string }) {
  return (
    <div className="w-full bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 2)}%`, background: color }} />
    </div>
  )
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsSummary()

  if (!data) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard" className="text-[#ededed]/30 hover:text-[#ededed]/70 text-sm transition-colors">
            ← Dashboard
          </Link>
          <div className="mt-16 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-8 text-center">
            <p className="text-yellow-400 font-semibold text-lg mb-3">KV Store Not Connected</p>
            <p className="text-[#ededed]/50 text-sm leading-relaxed mb-6">
              Analytics storage isn&apos;t configured yet. Set it up in ~2 minutes:
            </p>
            <ol className="text-left text-[#ededed]/60 text-sm space-y-2 max-w-md mx-auto">
              <li>1. Go to <strong className="text-[#ededed]/80">vercel.com → your project → Storage</strong></li>
              <li>2. Click <strong className="text-[#ededed]/80">Create Database → KV</strong></li>
              <li>3. Name it anything (e.g. <code className="text-[#f97316]">portfolio-analytics</code>)</li>
              <li>4. Click <strong className="text-[#ededed]/80">Connect Project</strong> — env vars auto-populate</li>
              <li>5. Redeploy from your terminal with <code className="text-[#f97316]">vercel --prod</code></li>
            </ol>
          </div>
        </div>
      </main>
    )
  }

  const days = last7Days()
  const maxDayCount = Math.max(...days.map((d) => Number(data.pvDaily[d] ?? 0)), 1)

  const totalSources = Object.values(data.pvSources).reduce((a, b) => a + b, 0) || 1
  const sources = sortedDesc(data.pvSources).slice(0, 8)

  const sectionOrder = ['Hero', 'Experience', 'Education', 'Projects', 'Skills', 'Contact']
  const sectionRows = sectionOrder
    .map((s) => ({
      name: s,
      visits: data.secVisits[s] ?? 0,
      avg: data.secVisits[s] ? Math.round((data.secSeconds[s] ?? 0) / data.secVisits[s]) : 0,
    }))
    .filter((r) => r.visits > 0)

  const maxVisits = Math.max(...sectionRows.map((r) => r.visits), 1)

  const topSource = sources[0]?.[0] ?? '—'
  const uniquePaths = Object.keys(data.pvPaths).length

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-20">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-[#ededed]/30 hover:text-[#ededed]/70 text-sm transition-colors">
              ← Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[#ededed] mt-3 mb-1">Analytics</h1>
            <p className="text-[#ededed]/35 text-sm">Live portfolio intelligence</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Page Views" value={data.pvTotal.toLocaleString()} sub="all time" />
          <StatCard label="Unique Pages" value={uniquePaths} sub="paths visited" />
          <StatCard label="Chat Opens" value={data.chatOpens.toLocaleString()} sub="AI Twin activations" />
          <StatCard label="Messages Sent" value={data.chatTotal.toLocaleString()} sub={`top source: ${topSource}`} />
        </div>

        {/* 7-day trend */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111] p-6">
          <p className="text-[#ededed]/40 text-xs uppercase tracking-widest mb-6">7-Day Page Views</p>
          <div className="flex items-end gap-2 h-24">
            {days.map((day) => {
              const count = Number(data.pvDaily[day] ?? 0)
              const pct = (count / maxDayCount) * 100
              const label = day.slice(5)
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[#ededed]/35 text-[10px]">{count || ''}</span>
                  <div className="w-full flex items-end" style={{ height: '56px' }}>
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${Math.max(pct, count > 0 ? 4 : 0)}%`,
                        background: count > 0 ? '#f97316' : 'rgba(255,255,255,0.04)',
                        minHeight: count > 0 ? '4px' : '0',
                      }}
                    />
                  </div>
                  <span className="text-[#ededed]/25 text-[10px]">{label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sources + Section engagement */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Traffic sources */}
          <div className="rounded-xl border border-white/[0.06] bg-[#111] p-6">
            <p className="text-[#ededed]/40 text-xs uppercase tracking-widest mb-6">Traffic Sources</p>
            {sources.length === 0 ? (
              <p className="text-[#ededed]/25 text-sm italic">No data yet</p>
            ) : (
              <div className="space-y-4">
                {sources.map(([source, count]) => {
                  const pct = Math.round((count / totalSources) * 100)
                  return (
                    <div key={source}>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-[#ededed]/70 text-sm">{source}</span>
                        <span className="text-[#ededed]/40 text-xs">{count} · {pct}%</span>
                      </div>
                      <Bar pct={pct} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Section engagement */}
          <div className="rounded-xl border border-white/[0.06] bg-[#111] p-6">
            <p className="text-[#ededed]/40 text-xs uppercase tracking-widest mb-6">Section Engagement</p>
            {sectionRows.length === 0 ? (
              <p className="text-[#ededed]/25 text-sm italic">No data yet</p>
            ) : (
              <div className="space-y-4">
                {sectionRows.map((r) => (
                  <div key={r.name}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-[#ededed]/70 text-sm">{r.name}</span>
                      <span className="text-[#ededed]/40 text-xs">
                        {r.visits} visit{r.visits !== 1 ? 's' : ''} · avg {r.avg}s
                      </span>
                    </div>
                    <Bar pct={(r.visits / maxVisits) * 100} color="#3b82f6" />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* AI Twin queries */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111] p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[#ededed]/40 text-xs uppercase tracking-widest">AI Twin — Recent Queries</p>
            <span className="text-[#ededed]/25 text-xs">{data.chatTotal} total</span>
          </div>
          {data.chatQueries.length === 0 ? (
            <p className="text-[#ededed]/25 text-sm italic">No queries yet</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {data.chatQueries.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-4 py-2.5 border-b border-white/[0.04] last:border-0"
                >
                  <p className="text-[#ededed]/70 text-sm leading-relaxed flex-1">{entry.q}</p>
                  <span className="text-[#ededed]/25 text-xs whitespace-nowrap shrink-0 pt-0.5">
                    {timeAgo(entry.t)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
