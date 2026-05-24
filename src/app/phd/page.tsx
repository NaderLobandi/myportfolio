'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import content from '../../../data/content.json'

// ── helpers ────────────────────────────────────────────────────────────────

function stableHash(text: string): number {
  let h = 0
  for (const c of text) h = ((h << 5) - h + c.charCodeAt(0)) | 0
  return Math.abs(h)
}

function wordStyle(text: string, weight: number, tier: string): React.CSSProperties {
  const h = stableHash(text)
  const rotation = (h % 25) - 12
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
    transform:  `rotate(${rotation}deg)`,
    margin:     `${my}px ${mx}px`,
    fontWeight: tier === 'major' ? 700 : tier === 'secondary' ? 500 : 400,
    lineHeight: 1.2,
    cursor:     'default',
  }
}

const typeConfig: Record<string, { label: string; color: string; dot: string }> = {
  award:       { label: 'Award',       color: '#f97316', dot: '#f97316' },
  conference:  { label: 'Conference',  color: '#3b82f6', dot: '#3b82f6' },
  publication: { label: 'Publication', color: '#22c55e', dot: '#22c55e' },
  milestone:   { label: 'Milestone',   color: '#a855f7', dot: '#a855f7' },
}

function formatDate(ym: string): string {
  const [year, month] = ym.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
    month: 'short', year: 'numeric',
  })
}

type Paper = { title: string; authors: string; venue: string; url: string; added: string; myTake: string }

// ── page ───────────────────────────────────────────────────────────────────

export default function PhDJourneyPage() {
  const { phd } = content
  const papers = phd.papers as unknown as Paper[]
  const activePapers = papers.filter((p) => p.title.trim() !== '')

  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

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
          <motion.div
            className="flex flex-wrap justify-center items-center py-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.035 } },
            }}
          >
            {phd.researchAreas.map((area) => (
              <motion.span
                key={area.text}
                style={wordStyle(area.text, area.weight, area.tier)}
                variants={{
                  hidden: { opacity: 0, scale: 0.5 },
                  show:   { opacity: 1, scale: 1, transition: { duration: 0.38, ease: 'easeOut' as const } },
                }}
                whileHover={{ scale: 1.18, transition: { duration: 0.18 } }}
              >
                {area.text}
              </motion.span>
            ))}
          </motion.div>

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
              {phd.milestones.map((m, i) => {
                const cfg        = typeConfig[m.type] ?? typeConfig.milestone
                const hasPhoto   = 'photo' in m && m.photo
                const caption    = 'photoCaption' in m ? m.photoCaption : ''
                const advisorUrl = 'advisorUrl'   in m ? m.advisorUrl   : ''
                const photoSrc   = hasPhoto ? (m as { photo: string }).photo : ''
                const isPoster   = photoSrc.toLowerCase().endsWith('.png')

                return (
                  <motion.div
                    key={i}
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, ease: 'easeOut' as const, delay: i * 0.09 }}
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

                      <p className="text-[#ededed]/50 text-sm leading-relaxed">{m.description}</p>

                      {hasPhoto && (
                        <button
                          onClick={() => setLightbox({ src: photoSrc, alt: caption || m.title })}
                          className="group relative mt-4 rounded-lg overflow-hidden w-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/50"
                          aria-label="View full image"
                        >
                          <div className={`relative w-full ${isPoster ? 'h-72 bg-white/[0.03]' : 'h-56'}`}>
                            <Image
                              src={photoSrc}
                              alt={caption || m.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 800px"
                              className={isPoster ? 'object-contain' : 'object-cover object-top'}
                            />
                          </div>
                          {/* hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                              View full size
                            </span>
                          </div>
                          {caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/55 backdrop-blur-sm px-3 py-2">
                              <p className="text-[#ededed]/75 text-xs text-left">{caption}</p>
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
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
                <motion.div
                  key={i}
                  className="rounded-xl border border-white/[0.06] bg-[#111] p-6 hover:border-white/[0.12] transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, ease: 'easeOut' as const, delay: i * 0.07 }}
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
                </motion.div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* ── Lightbox ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full max-h-[90vh]"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.2 }}
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
              <div className="relative w-full" style={{ maxHeight: '85vh' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightbox.src}
                  alt={lightbox.alt}
                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                />
              </div>

              {lightbox.alt && (
                <p className="text-white/50 text-sm text-center mt-3">{lightbox.alt}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
