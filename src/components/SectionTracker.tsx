'use client'

import { useEffect, useRef } from 'react'
import { track } from '@vercel/analytics'

const SECTIONS = ['hero', 'experience', 'education', 'projects', 'skills', 'about'] as const
const LABELS: Record<string, string> = {
  hero: 'Hero', experience: 'Experience', education: 'Education',
  projects: 'Projects', skills: 'Skills', about: 'Contact',
}

export default function SectionTracker() {
  const entryTime = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    function flush(id: string) {
      const start = entryTime.current.get(id)
      if (!start) return
      const seconds = Math.round((Date.now() - start) / 1000)
      if (seconds >= 3) {
        const section = LABELS[id] ?? id
        track('section_dwell', { section, seconds })
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'section_dwell', section, seconds }),
        }).catch(() => {})
      }
      entryTime.current.delete(id)
    }

    for (const id of SECTIONS) {
      const el = document.getElementById(id)
      if (!el) continue
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) entryTime.current.set(id, Date.now())
          else flush(id)
        },
        { threshold: 0.25 },
      )
      obs.observe(el)
      observers.push(obs)
    }

    const onUnload = () => SECTIONS.forEach(flush)
    window.addEventListener('beforeunload', onUnload)

    return () => {
      observers.forEach((o) => o.disconnect())
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [])

  return null
}
