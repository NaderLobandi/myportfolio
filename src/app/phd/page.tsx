'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import content from '../../../data/content.json'
import { typeConfig, formatDate, sortedMilestones } from '../../lib/milestones'

// ── helpers ────────────────────────────────────────────────────────────────

function stableHash(text: string): number {
  let h = 0
  for (const c of text) h = ((h << 5) - h + c.charCodeAt(0)) | 0
  return Math.abs(h)
}

function wordStyle(text: string, weight: number, tier: string): React.CSSProperties {
  const h = stableHash(text)
  const mx = (h % 14) + 4
  const my = (h % 10) + 3

  const sizeMap: Record<number, string> = {
    10: '2.9rem', 9: '2.4rem', 8: '2rem',    7: '1.7rem',
    6:  '1.45rem', 5: '1.25rem', 4: '1.05rem', 3: '0.85rem', 2: '0.72rem',
  }

  const color =
    tier === 'major'
      ? weight >= 9 ? '#f97316' : weight >= 7 ? '#fb923c' : '#fdba74'
      : tier === 'secondary'
      ? 'rgba(237,237,237,0.72)'
      : 'rgba(237,237,237,0.28)'

  return {
    fontSize:   sizeMap[weight] ?? '1rem',
    color,
    display:    'inline-block',
    margin:     `${my}px ${mx}px`,
    fontWeight: tier === 'major' ? 700 : tier === 'secondary' ? 500 : 400,
    lineHeight: 1.2,
    cursor:     'default',
  }
}

type Paper = { title: string; authors: string; venue: string; url: string; added: string; myTake: string }

// ── page ───────────────────────────────────────────────────────────────────

export default function PhDJourneyPage() {
  const { phd } = content
  const papers = phd.papers as unknown as Paper[]
  const activePapers = papers.filter((p) => p.title.trim() !== '')
  const cvpr = phd.cvpr2026

  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  // 34 nodes, each with a hashed inline transform — don't rebuild them every
  // time the lightbox opens or closes.
  const words = useMemo(() => phd.researchAreas.map((area, i) => (
    <span
      key={area.text}
      className="word-in"
      style={{ ...wordStyle(area.text, area.weight, area.tier), '--enter-delay': `${i * 12}ms` } as React.CSSProperties}
    >
      {area.text}
    </span>
  )), [phd.researchAreas])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-28 px-6">
      <div className="max-w-4xl mx-auto space-y-24">

        {/* ── Word cloud ──────────────────────────────────────────────── */}
        <section>
          <h1 className="enter-up text-3xl font-bold text-[#f97316] text-center mb-10">
            Welcome to my PhD Journey!
          </h1>
          <div className="flex flex-wrap justify-center items-center py-4">
            {words}
          </div>

          {/* legend */}
          <div className="flex flex-wrap gap-6 justify-center mt-8">
            {[
              { label: 'Primary focus',    color: '#f97316'               },
              { label: 'Secondary area',   color: 'rgba(237,237,237,0.72)' },
              { label: 'Supporting tools', color: 'rgba(237,237,237,0.28)' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-xs text-[#ededed]/35">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Milestones timeline ─────────────────────────────────────── */}
        <section>
          <p className="text-[#ededed]/30 text-xs uppercase tracking-widest text-center mb-14">
            Milestones
          </p>
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.06]" />
            <div className="space-y-10 pl-8">
              {sortedMilestones().map((m, i) => {
                const cfg        = typeConfig[m.type] ?? typeConfig.milestone
                const hasPhoto   = 'photo' in m && m.photo
                const caption    = 'photoCaption'  in m ? (m as any).photoCaption  : ''
                const hasPhoto2  = 'photo2' in m && (m as any).photo2
                const photo2Src  = hasPhoto2 ? (m as any).photo2 : ''
                const caption2   = 'photoCaption2' in m ? (m as any).photoCaption2 : ''
                const advisorUrl = 'advisorUrl'   in m ? m.advisorUrl   : ''
                const entryLink  = 'link'         in m ? m.link         : ''
                const location   = 'location'     in m ? (m as { location: string }).location : ''
                const photoSrc   = hasPhoto ? (m as { photo: string }).photo : ''
                const paragraphs = m.description.split('\n\n')

                return (
                  <div
                    key={i}
                    data-reveal="x"
                    style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
                    className="relative"
                  >
                    {/* dot */}
                    <div
                      className="absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a0a]"
                      style={{ background: cfg.dot }}
                    />

                    <div className="rounded-xl border border-white/[0.06] bg-[#111] p-5 hover:border-white/[0.12] transition-colors duration-300">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                          style={{ color: cfg.color, background: `${cfg.color}1a` }}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-[#ededed]/30 text-xs">{formatDate(m.date)}</span>
                        {location && (
                          <span className="text-[#ededed]/30 text-xs">· {location}</span>
                        )}
                      </div>

                      <h3 className="text-[#ededed] font-semibold text-base mb-1.5">
                        {m.title}
                        {advisorUrl && (
                          <a
                            href={advisorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-[#f97316]/60 hover:text-[#f97316] text-sm font-normal transition-colors"
                          >
                            (Dr. Mohammad Mahoor ↗)
                          </a>
                        )}
                      </h3>

                      <div className="space-y-3">
                        {paragraphs.map((para, p) => (
                          <p key={p} className="text-[#ededed]/50 text-sm leading-relaxed">{para}</p>
                        ))}
                      </div>

                      {entryLink && (
                        <a
                          href={entryLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#f97316]/70 hover:text-[#f97316] transition-colors"
                        >
                          View project ↗
                        </a>
                      )}

                      {hasPhoto && (
                        <div className={`mt-4 ${hasPhoto2 ? 'grid grid-cols-2 gap-3' : ''}`}>
                          {[
                            { src: photoSrc,  cap: caption,  cover: false },
                            ...(hasPhoto2 ? [{ src: photo2Src, cap: caption2, cover: true }] : []),
                          ].map(({ src, cap, cover }) => (
                            <button
                              key={src}
                              onClick={() => setLightbox({ src, alt: cap || m.title })}
                              className="group relative rounded-lg overflow-hidden w-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/50"
                              aria-label="View full image"
                            >
                              <div className={`relative w-full h-64 ${cover ? '' : 'bg-white/[0.03]'}`}>
                                <Image
                                  src={src}
                                  alt={cap || m.title}
                                  fill
                                  sizes="(max-width: 768px) 50vw, 400px"
                                  className={cover ? 'object-cover object-center' : 'object-contain'}
                                />
                              </div>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                                  View full size
                                </span>
                              </div>
                              {cap && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/55 backdrop-blur-sm px-3 py-2">
                                  <p className="text-[#ededed]/75 text-xs text-left">{cap}</p>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Papers + My Take ────────────────────────────────────────── */}
        <section>
          <p className="text-[#ededed]/30 text-xs uppercase tracking-widest text-center mb-12">
            Papers I&apos;m Reading
          </p>

          {activePapers.length === 0 ? (
            <p className="text-center text-[#ededed]/25 text-sm italic">
              Paper reading log coming soon — check back shortly.
            </p>
          ) : (
            <div className="space-y-6">
              {activePapers.map((paper, i) => (
                <div
                  key={i}
                  data-reveal="up"
                  style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
                  className="rounded-xl border border-white/[0.06] bg-[#111] p-6 hover:border-white/[0.12] transition-colors duration-300"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
                    <h3 className="text-[#ededed] font-semibold text-base leading-snug flex-1">
                      {paper.url ? (
                        <a href={paper.url} target="_blank" rel="noopener noreferrer"
                           className="hover:text-[#f97316] transition-colors">
                          {paper.title} ↗
                        </a>
                      ) : paper.title}
                    </h3>
                    <span className="text-[#ededed]/25 text-xs whitespace-nowrap shrink-0">
                      {formatDate(paper.added)}
                    </span>
                  </div>
                  {(paper.authors || paper.venue) && (
                    <p className="text-[#ededed]/40 text-xs mb-4">
                      {[paper.authors, paper.venue].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {paper.myTake && (
                    <div className="border-l-2 border-[#f97316]/35 pl-4 mt-3">
                      <p className="text-xs text-[#f97316]/55 uppercase tracking-wider mb-1.5">My Take</p>
                      <p className="text-[#ededed]/60 text-sm leading-relaxed italic">{paper.myTake}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── CVPR 2026 takeaways ──────────────────────────────────────── */}
        <section>
          <p className="text-[#ededed]/30 text-xs uppercase tracking-widest text-center mb-3">
            {cvpr.title}
          </p>
          <p className="text-[#ededed]/45 text-sm text-center max-w-2xl mx-auto mb-12">
            {cvpr.intro}
          </p>

          <div className="space-y-6">
            {cvpr.items.map((item, i) => (
              <div
                key={i}
                data-reveal="up"
                style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
                className="rounded-xl border border-white/[0.06] bg-[#111] p-6 hover:border-white/[0.12] transition-colors duration-300"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                    style={{ color: '#3b82f6', background: '#3b82f61a' }}
                  >
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-[#ededed] font-semibold text-base leading-snug mb-2">
                  {item.title}
                </h3>

                <p className="text-[#ededed]/55 text-sm leading-relaxed">{item.summary}</p>

                <p className="text-[#ededed]/30 text-xs mt-3">{item.names}</p>

                {item.papers.length > 0 && (
                  <div className="border-l-2 border-[#3b82f6]/35 pl-4 mt-4">
                    <p className="text-xs text-[#3b82f6]/60 uppercase tracking-wider mb-2">Selected papers</p>
                    <ul className="space-y-1.5">
                      {item.papers.map((paper, p) => (
                        <li key={p} className="text-sm">
                          {paper.url ? (
                            <a
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#ededed]/65 hover:text-[#f97316] transition-colors"
                            >
                              {paper.title} ↗
                            </a>
                          ) : (
                            <span className="text-[#ededed]/45">
                              {paper.title}
                              <span className="text-[#ededed]/25 italic"> · link coming soon</span>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── Lightbox ────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="lightbox-in fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
            <div
              className="lightbox-zoom relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* close button */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors z-10"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* image */}
              <div className="relative w-full" style={{ height: '80vh' }}>
                <Image
                  src={lightbox.src}
                  alt={lightbox.alt}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                />
              </div>

              {lightbox.alt && (
                <p className="text-white/50 text-sm text-center mt-3">{lightbox.alt}</p>
              )}
            </div>
        </div>
      )}
    </main>
  )
}
