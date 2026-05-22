'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import content from '../../data/content.json'

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
}

export default function Hero() {
  const { hero, meta } = content

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center bg-[#0a0a0a] px-6 py-24"
    >
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-16">

        {/* Photo — top on mobile, right on desktop */}
        <motion.div
          className="order-first md:order-last flex-shrink-0"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
        >
          <div className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden ring-2 ring-[#f97316]/40">
            <Image
              src={hero.profileImage}
              alt={hero.name}
              fill
              sizes="(max-width: 768px) 150px, 200px"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Text — below photo on mobile, left on desktop */}
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
            className="text-4xl md:text-5xl font-bold text-[#ededed] leading-tight mb-1"
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

          <motion.p
            className="text-[#ededed]/70 text-base mb-0.5"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.24}
          >
            {hero.title}
          </motion.p>

          <motion.p
            className="text-[#ededed]/40 text-sm mb-8"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.3}
          >
            {hero.company}
          </motion.p>

          <motion.p
            className="text-[#ededed]/75 text-base leading-relaxed max-w-prose"
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
