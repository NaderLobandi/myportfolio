'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * One IntersectionObserver for every `[data-reveal]` element on the page,
 * replacing framer-motion's per-element `whileInView`. Adds `.is-visible` once
 * and stops watching — reveals never re-run.
 */
export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]:not(.is-visible)')
    if (!targets.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -40px 0px' },
    )

    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
