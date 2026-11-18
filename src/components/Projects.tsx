import content from '../../data/content.json'
import SectionHeading from './SectionHeading'
import ProjectVisual from './ProjectVisual'

export default function Projects() {
  const { projects } = content

  return (
    <section id="projects" className="bg-surface py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">

        <SectionHeading eyebrow="Selected work" title="Projects" />

        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => (
            <div
              key={project.name}
              data-reveal="up"
              style={{ '--reveal-delay': `${(i % 2) * 100}ms` } as React.CSSProperties}
              className="card flex flex-col rounded-2xl p-6"
            >
              <ProjectVisual
                project={project}
                sizes="(max-width: 640px) 100vw, 480px"
                className="-mx-6 -mt-6 mb-5 rounded-t-2xl"
              />
              <div className="mb-4">
                {'tag' in project && project.tag && (
                  <span className="inline-block text-xs font-medium text-fg-muted bg-overlay border border-edge rounded-full px-3 py-1 mb-3 mr-2">
                    {project.tag}
                  </span>
                )}
                {'award' in project && project.award && (
                  <span className="inline-block text-xs font-medium text-accent bg-accent/10 border border-accent/20 rounded-full px-3 py-1 mb-3">
                    {project.award}
                  </span>
                )}
                <h3 className="text-fg font-semibold text-base leading-snug">
                  {project.name}
                </h3>
              </div>

              <p className="text-fg-muted text-sm leading-relaxed flex-1">
                {project.description}
              </p>

              {'link' in project && project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-accent hover:text-accent-hi transition-colors"
                >
                  View on GitHub ↗
                </a>
              )}

              <div className="flex flex-wrap gap-1.5 mt-5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent/80 font-medium"
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
