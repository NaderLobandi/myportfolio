import Link from 'next/link'
import content from '../../data/content.json'
import SectionHeading from './SectionHeading'
import OrgLogo, { logoOf } from './OrgLogo'
import ProjectVisual from './ProjectVisual'

/** Home-page summary: one line per degree and job, then three projects. Full
 *  detail lives on the /education, /experience, /projects and /publications tabs. */

const HOME_PROJECT_COUNT = 3

/** "2024-01".."2025-03" -> "2024 – 2025"; same year collapses; "Present" -> "Now". */
function years(start: string, end: string): string {
  const from = start.slice(0, 4)
  const to = /^\d{4}/.test(end) ? end.slice(0, 4) : 'Now'
  return from === to ? from : `${from} – ${to}`
}

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-accent text-sm font-medium whitespace-nowrap hover:text-accent-hi transition-colors">
      {children} →
    </Link>
  )
}

/** One summary card. The title and its link share the top row, so every card
 *  lines up the same way whatever its length. `min-w-0` lets truncated text
 *  shrink instead of widening the page on phones. */
function Panel({ title, href, linkLabel, className = '', children }: {
  title: string; href: string; linkLabel: string; className?: string; children: React.ReactNode
}) {
  return (
    <div data-reveal="up" className={`card min-w-0 rounded-2xl p-5 md:p-6 ${className}`}>
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h3 className="text-fg text-lg font-semibold">{title}</h3>
        <MoreLink href={href}>{linkLabel}</MoreLink>
      </div>
      {children}
    </div>
  )
}

function Row({ title, sub, date, logo }: { title: string; sub: string; date: string; logo?: string }) {
  return (
    <li className="flex items-center gap-3 py-3 border-b border-edge-subtle last:border-0 last:pb-0">
      <OrgLogo src={logo} name={sub} size={40} />
      <span className="min-w-0 flex-1">
        <span className="block text-fg text-[15px] md:text-base font-medium leading-snug">{title}</span>
        <span className="block text-fg-subtle text-sm mt-0.5 truncate">{sub}</span>
      </span>
      <span className="text-fg-subtle text-sm whitespace-nowrap">{date}</span>
    </li>
  )
}

export default function AtAGlance() {
  const { experience, education, publications, projects } = content
  const publisherLogos = [...new Set(publications.map(logoOf))]

  return (
    <>
      <section id="glance" className="bg-surface py-12 md:py-16 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="At a glance" title="Background" />

          {/* DOM order is the phone order: Education, Experience, Publications.
              From md up, Education and Publications stack on the left and
              stretch to exactly the height of Experience on the right. */}
          <div className="grid gap-5 md:grid-cols-2 md:grid-rows-[auto_1fr]">
            <Panel title="Education" href="/education" linkLabel="Details">
              <ul>
                {education.map((e) => (
                  <Row
                    key={e.institution}
                    title={e.degree}
                    sub={e.institution.split(',')[0]}
                    date={e.end.slice(0, 4)}
                    logo={logoOf(e)}
                  />
                ))}
              </ul>
            </Panel>

            <Panel title="Experience" href="/experience" linkLabel="Details" className="md:col-start-2 md:row-start-1 md:row-span-2">
              <ul>
                {experience.map((job) => (
                  <Row
                    key={job.company + job.startDate}
                    title={job.title}
                    sub={job.company}
                    date={years(job.startDate, job.end)}
                    logo={logoOf(job)}
                  />
                ))}
              </ul>
            </Panel>

            <Panel title="Publications" href="/publications" linkLabel="Details">
              {/* One row, so this card plus Education matches Experience's height */}
              <div className="flex items-center gap-3 pt-3">
                <div className="flex shrink-0 gap-1.5">
                  {publisherLogos.map((logo) => <OrgLogo key={logo} src={logo} name="Publisher" size={40} />)}
                </div>
                <span className="min-w-0">
                  <span className="block text-fg text-[15px] md:text-base font-medium leading-snug">
                    {publications.length} peer-reviewed papers
                  </span>
                  <span className="block text-fg-subtle text-sm mt-0.5 truncate">IEEE, Elsevier and AIP Publishing</span>
                </span>
              </div>
            </Panel>
          </div>
        </div>
      </section>

      <section id="work" className="bg-surface pb-12 md:pb-16 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Selected work"
            title="Projects"
            action={<MoreLink href="/projects">More projects</MoreLink>}
          />

          {/* Phones: compact rows (thumbnail beside text). md up: three cards. */}
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {projects.slice(0, HOME_PROJECT_COUNT).map((p) => (
              <Link
                key={p.name}
                href="/projects"
                data-reveal="up"
                className="card group flex items-start gap-4 overflow-hidden rounded-2xl p-3 md:block md:p-0"
              >
                <ProjectVisual
                  project={p}
                  sizes="(max-width: 768px) 130px, 380px"
                  className="w-32 shrink-0 rounded-lg md:w-auto md:rounded-none md:border-0 md:border-b"
                />
                <div className="min-w-0 md:p-5">
                  <h3 className="text-fg text-[15px] md:text-base font-semibold leading-snug group-hover:text-accent transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-fg-muted text-xs md:text-sm leading-relaxed mt-1.5 line-clamp-3">{p.tldr}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
