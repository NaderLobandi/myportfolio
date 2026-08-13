import content from '../../data/content.json'
import SectionHeading from './SectionHeading'

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
    <section id="education" className="bg-surface py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">

        <SectionHeading eyebrow="Academic background" title="Education" />

        <div className="space-y-5">
          {education.map((entry, i) => (
            <div
              key={entry.institution}
              data-reveal="up"
              style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
              className="card rounded-2xl p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-fg font-semibold text-base leading-snug">
                    {entry.degree}
                  </h3>
                  <p className="text-accent text-sm font-medium mt-0.5">
                    {entry.institution}
                  </p>
                </div>
                <span className="text-fg-subtle text-xs whitespace-nowrap sm:pt-0.5 shrink-0">
                  {formatYear(entry.start)} – {formatYear(entry.end)}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                {'focus' in entry && entry.focus && (
                  <p className="text-fg-subtle text-sm leading-relaxed w-full">
                    <span className="text-fg-faint text-xs uppercase tracking-wider mr-2">Focus</span>
                    {entry.focus}
                  </p>
                )}
                {'gpa' in entry && entry.gpa && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-fg-subtle">
                    <span className="text-fg-faint uppercase tracking-wider">GPA</span>
                    {entry.gpa}
                  </span>
                )}
                {'honors' in entry && entry.honors && (
                  <p className="text-fg-subtle text-sm leading-relaxed w-full">
                    <span className="text-fg-faint text-xs uppercase tracking-wider mr-2">Honors</span>
                    {entry.honors}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
