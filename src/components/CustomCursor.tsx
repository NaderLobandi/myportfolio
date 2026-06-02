'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  const rawX = useMotionValue(-200)
  const rawY = useMotionValue(-200)

  // Dot follows cursor tightly
  const dotX = useSpring(rawX, { stiffness: 800, damping: 50 })
  const dotY = useSpring(rawY, { stiffness: 800, damping: 50 })

  // Ring lags behind for a trailing feel
  const ringX = useSpring(rawX, { stiffness: 200, damping: 28 })
  const ringY = useSpring(rawY, { stiffness: 200, damping: 28 })

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return
    setMounted(true)

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      setVisible(true)
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovering(!!t.closest('a, button, [role="button"], input, textarea'))
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [rawX, rawY])

  if (!mounted) return null

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Dot — snappy, always on top */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full bg-[#f97316]"
          animate={{
            width:   hovering ? 10 : 6,
            height:  hovering ? 10 : 6,
            opacity: visible  ? 1  : 0,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* Ring — lags, subtle */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full border border-[#f97316]"
          animate={{
            width:   hovering ? 48 : 32,
            height:  hovering ? 48 : 32,
            opacity: visible  ? (hovering ? 0.55 : 0.3) : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  )
}
