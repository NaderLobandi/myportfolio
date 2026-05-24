'use client'

import { motion } from 'framer-motion'
import content from '../../data/content.json'

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

const ScholarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
  </svg>
)

const links = [
  {
    href: (c: typeof content) => c.hero.contact.linkedin,
    label: 'LinkedIn',
    sub: 'linkedin.com/in/naderlobandi',
    icon: <LinkedInIcon />,
    color: '#0077b5',
  },
  {
    href: (c: typeof content) => c.hero.contact.github,
    label: 'GitHub',
    sub: 'github.com/NaderLobandi',
    icon: <GitHubIcon />,
    color: '#ededed',
  },
  {
    href: (c: typeof content) => c.hero.contact.scholar,
    label: 'Google Scholar',
    sub: '4 publications',
    icon: <ScholarIcon />,
    color: '#4285f4',
  },
  {
    href: (c: typeof content) => `mailto:${c.hero.contact.email}`,
    label: 'Email',
    sub: (c: typeof content) => c.hero.contact.email,
    icon: <MailIcon />,
    color: '#f97316',
  },
]

export default function About() {
  const { hero } = content

  return (
    <section id="about" className="bg-[#0a0a0a] py-24 px-6 border-t border-white/[0.05] scroll-mt-20">
      <div className="max-w-5xl mx-auto">

        <motion.h2
          className="text-3xl font-bold text-[#ededed] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          About
        </motion.h2>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-center">

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: 'easeOut' as const }}
          >
            <p className="text-[#ededed]/70 text-base leading-relaxed mb-4">
              {hero.pitch}
            </p>
            <p className="text-[#ededed]/40 text-sm">
              {hero.credentials} · {hero.company}
            </p>
          </motion.div>

          {/* Links 2×2 grid */}
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: 'easeOut' as const, delay: 0.1 }}
          >
            {links.map(({ href, label, sub, icon, color }) => {
              const url = typeof href === 'function' ? href(content) : href
              const subtitle = typeof sub === 'function' ? sub(content) : sub
              const isExternal = !url.startsWith('mailto:')
              return (
                <a
                  key={label}
                  href={url}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  style={{ '--link-color': color } as React.CSSProperties}
                  className="group flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-[#111] px-4 py-4 hover:border-[var(--link-color)]/40 hover:bg-[var(--link-color)]/5 transition-all duration-300"
                >
                  <span
                    style={{ color }}
                    className="group-hover:scale-110 transition-transform duration-300 w-fit"
                  >
                    {icon}
                  </span>
                  <div>
                    <p className="text-[#ededed] text-sm font-medium leading-snug">{label}</p>
                    <p className="text-[#ededed]/35 text-xs mt-0.5 truncate">{subtitle}</p>
                  </div>
                </a>
              )
            })}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
