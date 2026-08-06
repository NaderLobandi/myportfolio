import content from '../../data/content.json'

export default function Skills() {
  const { skills } = content

  return (
    <section id="skills" className="bg-surface py-24 px-6 border-t border-edge-subtle scroll-mt-20">
      <div className="max-w-5xl mx-auto space-y-16">

        <h2 data-reveal="up" className="text-3xl font-bold text-fg text-center">
          Skills
        </h2>

        {/* Tier 1 — Skill categories with progress bars */}
        <div>
          <p className="text-fg-subtle text-xs uppercase tracking-widest mb-6 text-center">
            By Domain
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {skills.categories.map((cat, i) => (
              <div
                key={cat.name}
                data-reveal="up"
                style={{ '--reveal-delay': `${i * 100}ms` } as React.CSSProperties}
                className="rounded-xl border border-edge bg-card p-5 hover:border-[#f97316]/30 transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#f97316] text-sm font-semibold tracking-wide">
                    {cat.name}
                  </h3>
                  <span className="text-[#f97316] text-xs font-semibold tabular-nums">
                    {'level' in cat ? `${cat.level}%` : ''}
                  </span>
                </div>

                {/* Animated progress bar */}
                {'level' in cat && (
                  <div className="h-1 bg-edge rounded-full mb-4 overflow-hidden">
                    <div
                      data-reveal="bar"
                      style={{
                        width: `${cat.level}%`,
                        '--reveal-delay': `${i * 100 + 200}ms`,
                      } as React.CSSProperties}
                      className="h-full bg-[#f97316] rounded-full"
                    />
                  </div>
                )}

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
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2 — Strong skills */}
        <div data-reveal="left">
          <p className="text-fg-subtle text-xs uppercase tracking-widest mb-6 text-center">
            Proficient
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {skills.strong.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#f97316]/15 border border-[#f97316]/25 px-4 py-1.5 text-sm text-fg-muted font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Tier 3 — Building toward */}
        <div data-reveal="right">
          <p className="text-fg-subtle text-xs uppercase tracking-widest mb-6 text-center">
            Building Toward
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {skills.gaps.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-dashed border-edge px-4 py-1.5 text-sm text-fg-subtle font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
