'use client'

import { motion } from 'framer-motion'
import content from '../../data/content.json'

type Publication = {
  title: string
  authors: string
  venue: string
  year: number
  doi: string
  url?: string
  type: 'journal' | 'conference'
}

const typeColor = { journal: '#22c55e', conference: '#3b82f6' }
const typeLabel = { journal: 'Journal', conference: 'Conference' }

function Authors({ text }: { text: string }) {
  const parts = text.split(/(N\. Lobandi)/)
  return (
    <>
      {parts.map((part, i) =>
        part === 'N. Lobandi' ? (
          <span key={i} className="text-[#f97316] font-semibold">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  )
}

export default function Publications() {
  const pubs = content.publications as unknown as Publication[]

  return (
    <section id="publications" className="bg-surface py-24 px-6 border-t border-edge-subtle scroll-mt-20">
      <div className="max-w-5xl mx-auto">

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-fg mb-3">Publications</h2>
          <p className="text-fg-subtle text-sm">
            4 peer-reviewed papers · IEEE · Biosensors &amp; Bioelectronics · AIP Publishing
          </p>
        </motion.div>

        <div className="space-y-4">
          {pubs.map((pub, i) => {
            const color = typeColor[pub.type]
            const href = pub.url ?? `https://doi.org/${pub.doi}`
            return (
              <motion.div
                key={i}
                className="group flex gap-5 rounded-xl border border-edge bg-card p-6 hover:border-[#f97316]/30 transition-colors duration-300"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
                whileHover={{ y: -3, transition: { duration: 0.2, ease: 'easeOut' } }}
              >
                {/* Number badge */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center mt-0.5">
                  <span className="text-[#f97316] text-xs font-bold">{pubs.length - i}</span>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Type badge + year */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                      style={{ color, background: `${color}1a` }}
                    >
                      {typeLabel[pub.type]}
                    </span>
                    <span className="text-fg-faint text-xs">{pub.year}</span>
                  </div>

                  {/* Title */}
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg font-semibold text-base leading-snug hover:text-[#f97316] transition-colors duration-200 block mb-2"
                  >
                    {pub.title}
                    <span className="ml-1 text-[#f97316]/60 group-hover:text-[#f97316] transition-colors">↗</span>
                  </a>

                  {/* Authors */}
                  <p className="text-fg-muted text-sm leading-relaxed mb-3">
                    <Authors text={pub.authors} />
                  </p>

                  {/* Venue + DOI */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="text-fg-subtle text-xs italic">{pub.venue}</span>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] text-fg-faint hover:text-[#f97316] transition-colors"
                    >
                      doi:{pub.doi}
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Scholar link */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <a
            href="https://scholar.google.com/citations?user=YZKf2ngAAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-fg-subtle hover:text-[#f97316] transition-colors"
          >
            View on Google Scholar ↗
          </a>
        </motion.div>

      </div>
    </section>
  )
}
