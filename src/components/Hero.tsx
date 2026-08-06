'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const ROLES = [
  'Data Scientist & PhD Researcher',
  'Deep Learning Specialist',
  'Machine Learning Systems Engineer',
]

/** Stagger for the above-the-fold entrance animations (see globals.css). */
const delay = (ms: number) => ({ '--enter-delay': `${ms}ms` }) as React.CSSProperties

/** Only the fields Hero renders — passed in from the server page so the whole
 *  of content.json stays out of the client bundle. */
export type HeroProps = {
  hero: {
    profileImage: string
    name: string
    credentials: string
    company: string
    pitch: string
  }
  meta: { tagline: string }
}

export default function Hero({ hero, meta }: HeroProps) {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center bg-surface px-6 py-24 overflow-hidden"
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.18) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto w-full flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-16">

        {/* Photo */}
        <div className="order-first md:order-last flex-shrink-0 enter-pop" style={delay(150)}>
          <div className="relative">
            {/* Pulsing glow ring */}
            <div className="absolute -inset-3 rounded-full bg-[#f97316]/20 blur-xl glow-pulse" />
            <div className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden ring-2 ring-[#f97316]/50">
              <Image
                src={hero.profileImage}
                alt={hero.name}
                fill
                sizes="(max-width: 768px) 150px, 200px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col items-center text-center md:items-start md:text-left">

          <p className="enter-up text-[#f97316] text-sm font-medium tracking-wide mb-3" style={delay(0)}>
            {meta.tagline}
          </p>

          <h1 className="enter-up text-4xl md:text-5xl font-bold text-fg leading-tight mb-1" style={delay(100)}>
            {hero.name}
          </h1>

          <p className="enter-up text-[#f97316] text-sm font-medium mb-1" style={delay(180)}>
            {hero.credentials}
          </p>

          {/* Cycling role — `key` restarts the CSS fade on each swap */}
          <div className="enter-up h-7 mb-0.5 overflow-hidden" style={delay(240)}>
            <p key={roleIndex} className="fade-swap text-fg-muted text-base">
              {ROLES[roleIndex]}
            </p>
          </div>

          <p className="enter-up text-fg-subtle text-sm mb-8" style={delay(300)}>
            {hero.company}
          </p>

          <p className="enter-up text-fg-muted text-base leading-relaxed max-w-prose" style={delay(380)}>
            {hero.pitch}
          </p>
        </div>
      </div>
    </section>
  )
}
