'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// react-markdown + the remark/micromark pipeline it drags in is ~36 KB gzipped.
// next/dynamic alone still fetches it at hydration, so gate the mount too.
const ChatAssistant = dynamic(() => import('./ChatAssistant'), { ssr: false })

const IDLE_FALLBACK_MS = 2500

export default function ChatAssistantLazy() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const show = () => setReady(true)

    const events = ['pointerdown', 'keydown', 'scroll'] as const
    events.forEach((e) => window.addEventListener(e, show, { once: true, passive: true }))

    const hasIdle = typeof requestIdleCallback === 'function'
    const idle: number = hasIdle
      ? requestIdleCallback(show, { timeout: IDLE_FALLBACK_MS })
      : window.setTimeout(show, IDLE_FALLBACK_MS)

    return () => {
      events.forEach((e) => window.removeEventListener(e, show))
      if (hasIdle) cancelIdleCallback(idle)
      else clearTimeout(idle)
    }
  }, [])

  return ready ? <ChatAssistant /> : null
}
