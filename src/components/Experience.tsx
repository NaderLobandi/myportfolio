import content from '../../data/content.json'
import SectionHeading from './SectionHeading'
import OrgLogo, { logoOf } from './OrgLogo'
import ReadMore from './ReadMore'

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
    <section id="experience" className="bg-surface py-12 md:py-16 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">

        <SectionHeading
          eyebrow="Where I've worked"
          title="Experience"
          note="Four years building and shipping machine learning systems in industry and research."
        />

        {/* One left-aligned timeline: every card starts on the same edge */}
        <ol className="relative ml-1.5 space-y-5 border-l border-accent/25 md:ml-2">
          {experience.map((job, i) => (
            <li key={`${job.company}-${i}`} className="relative pl-6 md:pl-10">
              <span className="absolute -left-[6.5px] top-8 h-3 w-3 rounded-full bg-accent ring-4 ring-surface" aria-hidden="true" />

              <div data-reveal="up" className="card rounded-2xl p-5 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="flex min-w-0 items-start gap-3">
                    <OrgLogo src={logoOf(job)} name={job.company} size={44} />
                    <div className="min-w-0">
                      <h3 className="text-fg font-semibold text-base md:text-lg leading-snug">{job.title}</h3>
                      <p className="text-accent text-sm font-medium mt-0.5">{job.company}</p>
                    </div>
                  </div>
                  <span className="text-fg-subtle text-xs sm:text-sm whitespace-nowrap sm:pt-1">
                    {formatDate(job.startDate)} – {formatDate(job.end)}
                  </span>
                </div>

                <p className="text-fg-muted text-sm md:text-base leading-relaxed mt-4 max-w-3xl">{job.tldr}</p>

                <ReadMore>
                  <ul className="space-y-2 max-w-3xl">
                    {job.bullets.map((bullet, j) => (
                      <li key={j} className="flex gap-2.5 text-sm text-fg-muted leading-relaxed">
                        <span className="text-accent/70 mt-[5px] flex-shrink-0 text-[10px]">▸</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </ReadMore>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
