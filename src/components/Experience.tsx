import content from '../../data/content.json'
import SectionHeading from './SectionHeading'

/** Accepts "YYYY-MM"; anything else (missing, or a literal "Present") is a
 *  label already and passes through unchanged. */
function formatDate(ym: string | undefined): string {
  if (!ym) return 'Present'
  if (!/^\d{4}-\d{2}$/.test(ym)) return ym
  const [year, month] = ym.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export default function Experience() {
  const { experience } = content

  return (
    <section id="experience" className="bg-surface py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">

        <SectionHeading
          eyebrow="Where I've worked"
          title="Experience"
          note="Four years building and shipping machine learning systems in industry and research."
        />

        <div className="relative">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-accent/25 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12">
            {experience.map((job, i) => {
              const isLeft = i % 2 === 0

              return (
                <div key={`${job.company}-${i}`} className="relative flex md:justify-center">

                  <div className="absolute left-3 top-6 -translate-x-1/2 z-10 w-3 h-3 rounded-full bg-accent ring-2 ring-surface md:left-1/2" />

                  <div
                    data-reveal={isLeft ? 'left' : 'right'}
                    className={[
                      'ml-9 w-full md:ml-0 md:w-[46%]',
                      isLeft ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10',
                    ].join(' ')}
                  >
                    <div className="card rounded-2xl p-5">

                      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                        <div>
                          <h3 className="text-fg font-semibold text-base leading-snug">
                            {job.title}
                          </h3>
                          <p className="text-accent text-sm font-medium mt-0.5">
                            {job.company}
                          </p>
                        </div>
                        <span className="text-fg-subtle text-xs whitespace-nowrap pt-0.5">
                          {formatDate(job.startDate)} – {formatDate(job.end)}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {job.bullets.map((bullet, j) => (
                          <li key={j} className="flex gap-2.5 text-sm text-fg-muted leading-relaxed">
                            <span className="text-accent/70 mt-[5px] flex-shrink-0 text-[10px]">▸</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
