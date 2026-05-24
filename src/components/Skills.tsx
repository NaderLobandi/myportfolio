'use client'

import { motion } from 'framer-motion'
import content from '../../data/content.json'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const, delay },
  },
})

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

const fadeRight = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

export default function Skills() {
  const { skills } = content

  return (
    <section id="skills" className="bg-[#0a0a0a] py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Heading */}
        <motion.h2
          className="text-3xl font-bold text-[#ededed] text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Skills
        </motion.h2>

        {/* Tier 1 — Skill categories */}
        <div>
          <p className="text-[#ededed]/40 text-xs uppercase tracking-widest mb-6 text-center">
            By Domain
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {skills.categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                className="rounded-xl border border-white/[0.06] bg-[#111] p-5 hover:border-[#f97316]/30 transition-colors duration-300"
                variants={fadeUp(i * 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
              >
                <h3 className="text-[#f97316] text-sm font-semibold mb-4 tracking-wide">
                  {cat.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[#f97316]/10 px-3 py-1 text-xs text-[#f97316] font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tier 2 — Strong skills */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          <p className="text-[#ededed]/40 text-xs uppercase tracking-widest mb-6 text-center">
            Proficient
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {skills.strong.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#f97316]/15 border border-[#f97316]/25 px-4 py-1.5 text-sm text-[#ededed]/80 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Tier 3 — Gaps */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          <p className="text-[#ededed]/40 text-xs uppercase tracking-widest mb-6 text-center">
            Building Toward
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {skills.gaps.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-dashed border-white/15 px-4 py-1.5 text-sm text-[#ededed]/35 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
