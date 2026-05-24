'use client'

import { motion } from 'framer-motion'
import content from '../../data/content.json'

function formatYear(ym: string): string {
  const [year, month] = ym.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export default function Education() {
  const { education } = content

  return (
    <section id="education" className="bg-[#0a0a0a] py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">

        <motion.h2
          className="text-3xl font-bold text-[#ededed] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Education
        </motion.h2>

        <div className="space-y-5">
          {education.map((entry, i) => (
            <motion.div
              key={entry.institution}
              className="rounded-xl border border-white/[0.06] bg-[#111] p-6 hover:border-[#f97316]/30 transition-colors duration-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, ease: 'easeOut' as const, delay: i * 0.08 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-[#ededed] font-semibold text-base leading-snug">
                    {entry.degree}
                  </h3>
                  <p className="text-[#f97316] text-sm font-medium mt-0.5">
                    {entry.institution}
                  </p>
                </div>
                <span className="text-[#ededed]/35 text-xs whitespace-nowrap sm:pt-0.5 shrink-0">
                  {formatYear(entry.start)} – {formatYear(entry.end)}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                {'focus' in entry && entry.focus && (
                  <p className="text-[#ededed]/50 text-sm leading-relaxed w-full">
                    <span className="text-[#ededed]/25 text-xs uppercase tracking-wider mr-2">Focus</span>
                    {entry.focus}
                  </p>
                )}
                {'gpa' in entry && entry.gpa && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#ededed]/50">
                    <span className="text-[#ededed]/25 uppercase tracking-wider">GPA</span>
                    {entry.gpa}
                  </span>
                )}
                {'honors' in entry && entry.honors && (
                  <p className="text-[#ededed]/50 text-sm leading-relaxed w-full">
                    <span className="text-[#ededed]/25 text-xs uppercase tracking-wider mr-2">Honors</span>
                    {entry.honors}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
