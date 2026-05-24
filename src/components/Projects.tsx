'use client'

import { motion } from 'framer-motion'
import content from '../../data/content.json'

export default function Projects() {
  const { projects } = content

  return (
    <section id="projects" className="bg-[#0a0a0a] py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">

        <motion.h2
          className="text-3xl font-bold text-[#ededed] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Projects
        </motion.h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              className="flex flex-col rounded-xl border border-white/[0.06] bg-[#111] p-6 hover:border-[#f97316]/30 transition-colors duration-300"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, ease: 'easeOut' as const, delay: (i % 2) * 0.1 }}
            >
              <div className="mb-4">
                {'award' in project && project.award && (
                  <span className="inline-block text-xs font-medium text-[#f97316] bg-[#f97316]/10 border border-[#f97316]/20 rounded-full px-3 py-1 mb-3">
                    🏆 {project.award}
                  </span>
                )}
                <h3 className="text-[#ededed] font-semibold text-base leading-snug">
                  {project.name}
                </h3>
              </div>

              <p className="text-[#ededed]/55 text-sm leading-relaxed flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-[#f97316]/10 px-2.5 py-1 text-xs text-[#f97316]/80 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
