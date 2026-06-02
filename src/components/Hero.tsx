'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import content from '../../data/content.json'

const ROLES = [
  'Data Scientist & PhD Researcher',
  'ML Engineer & AI Builder',
  'Deep Learning Specialist',
  'Machine Learning Systems Engineer',
]

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const, delay },
  }),
}

export default function Hero() {
  const { hero, meta } = content
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
        <motion.div
          className="order-first md:order-last flex-shrink-0"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
        >
          <div className="relative">
            {/* Pulsing glow ring */}
            <motion.div
              className="absolute -inset-3 rounded-full bg-[#f97316]/20 blur-xl"
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />
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
        </motion.div>

        {/* Text */}
        <div className="flex-1 flex flex-col items-center text-center md:items-start md:text-left">

          <motion.p
            className="text-[#f97316] text-sm font-medium tracking-wide mb-3"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
          >
            {meta.tagline}
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-fg leading-tight mb-1"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
          >
            {hero.name}
          </motion.h1>

          <motion.p
            className="text-[#f97316] text-sm font-medium mb-1"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.18}
          >
            {hero.credentials}
          </motion.p>

          {/* Typing/cycling role */}
          <motion.div
            className="h-7 mb-0.5 overflow-hidden"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.24}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={roleIndex}
                className="text-fg-muted text-base"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {ROLES[roleIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <motion.p
            className="text-fg-subtle text-sm mb-8"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.3}
          >
            {hero.company}
          </motion.p>

          <motion.p
            className="text-fg-muted text-base leading-relaxed max-w-prose"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.38}
          >
            {hero.pitch}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
