import Link from 'next/link'
import content from '../../data/content.json'
import SectionHeading from './SectionHeading'

/** Home-page summary: one line per job and per degree. Full detail lives on
 *  the /experience, /education, /projects and /publications tabs. */

/** "2024-01".."2025-03" -> "2024 – 2025"; same year collapses; "Present" -> "Now". */
function years(start: string, end: string): string {
  const from = start.slice(0, 4)
  const to = /^\d{4}/.test(end) ? end.slice(0, 4) : 'Now'
  return from === to ? from : `${from} – ${to}`
}

function Row({ title, sub, date }: { title: string; sub: string; date: string }) {
  return (
    <li className="flex items-baseline justify-between gap-4 py-3 border-b border-edge-subtle last:border-0">
      <span className="min-w-0">
        <span className="block text-fg text-sm font-medium leading-snug">{title}</span>
        <span className="block text-fg-subtle text-xs mt-0.5 truncate">{sub}</span>
      </span>
      <span className="text-fg-subtle text-xs whitespace-nowrap">{date}</span>
    </li>
  )
}

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-block mt-4 text-accent text-sm font-medium hover:text-accent-hi transition-colors">
      {children} →
    </Link>
  )
}

export default function AtAGlance() {
  const { experience, education, publications, projects } = content

  return (
    <section id="glance" className="bg-surface py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="At a glance" title="Background" />

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div data-reveal="up">
            <p className="text-fg-subtle text-[11px] uppercase tracking-widest mb-1">Experience</p>
            <ul>
              {experience.map((job) => (
                <Row
                  key={job.company + job.startDate}
                  title={job.title}
                  sub={job.company}
                  date={years(job.startDate, job.end)}
                />
              ))}
            </ul>
            <MoreLink href="/experience">Full experience</MoreLink>
          </div>

          <div data-reveal="up" style={{ '--reveal-delay': '100ms' } as React.CSSProperties}>
            <p className="text-fg-subtle text-[11px] uppercase tracking-widest mb-1">Education</p>
            <ul>
              {education.map((e) => (
                <Row
                  key={e.institution}
                  title={e.degree}
                  sub={e.institution.split(',')[0]}
                  date={e.end.slice(0, 4)}
                />
              ))}
            </ul>
            <MoreLink href="/education">Full education</MoreLink>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-10 pt-6 border-t border-edge-subtle">
              <MoreLink href="/projects">{projects.length} projects</MoreLink>
              <MoreLink href="/publications">{publications.length} peer-reviewed publications</MoreLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
