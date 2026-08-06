import content from '../../data/content.json'

export default function Projects() {
  const { projects } = content

  return (
    <section id="projects" className="bg-surface py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">

        <h2 data-reveal="up" className="text-3xl font-bold text-fg text-center mb-16">
          Projects
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => (
            <div
              key={project.name}
              data-reveal="up"
              style={{ '--reveal-delay': `${(i % 2) * 100}ms` } as React.CSSProperties}
              className="flex flex-col rounded-xl border border-edge bg-card p-6 hover:border-[#f97316]/30 hover:-translate-y-[3px] transition duration-300"
            >
              <div className="mb-4">
                {'award' in project && project.award && (
                  <span className="inline-block text-xs font-medium text-[#f97316] bg-[#f97316]/10 border border-[#f97316]/20 rounded-full px-3 py-1 mb-3">
                    🏆 {project.award}
                  </span>
                )}
                <h3 className="text-fg font-semibold text-base leading-snug">
                  {project.name}
                </h3>
              </div>

              <p className="text-fg-muted text-sm leading-relaxed flex-1">
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
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
