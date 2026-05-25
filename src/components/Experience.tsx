'use client'

import { motion } from 'framer-motion'
import content from '../../data/content.json'

function formatDate(ym: string | undefined): string {
  if (!ym) return 'Present'
  const [year, month] = ym.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export default function Experience() {
  const { experience } = content

  return (
    <section id="experience" className="bg-[#0a0a0a] py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">

        <motion.h2
          className="text-3xl font-bold text-[#ededed] text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Experiences
        </motion.h2>

        <div className="relative">
          {/* Vertical blue line — left edge on mobile, centered on desktop */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-[#f97316]/25 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12">
            {experience.map((job, i) => {
              const isLeft = i % 2 === 0

              return (
                <div key={`${job.company}-${i}`} className="relative flex md:justify-center">

                  {/* Timeline dot */}
                  <div className="absolute left-3 top-6 -translate-x-1/2 z-10 w-3 h-3 rounded-full bg-[#f97316] ring-2 ring-[#0a0a0a] md:left-1/2" />

                  {/* Card — offset from line on mobile, alternating on desktop */}
                  <motion.div
                    className={[
                      'ml-9 w-full md:ml-0 md:w-[46%]',
                      isLeft ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10',
                    ].join(' ')}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <div className="rounded-xl border border-white/[0.06] bg-[#111] p-5 hover:border-[#f97316]/30 transition-colors duration-300">

                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                        <div>
                          <h3 className="text-[#ededed] font-semibold text-base leading-snug">
                            {job.title}
                          </h3>
                          <p className="text-[#f97316] text-sm font-medium mt-0.5">
                            {job.company}
                          </p>
                        </div>
                        <span className="text-[#ededed]/35 text-xs whitespace-nowrap pt-0.5">
                          {formatDate(job.startDate)} – {formatDate(job.end)}
                        </span>
                      </div>

                      {/* Bullets */}
                      <ul className="space-y-2">
                        {job.bullets.map((bullet, j) => (
                          <li key={j} className="flex gap-2.5 text-sm text-[#ededed]/60 leading-relaxed">
                            <span className="text-[#f97316]/70 mt-[5px] flex-shrink-0 text-[10px]">▸</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
