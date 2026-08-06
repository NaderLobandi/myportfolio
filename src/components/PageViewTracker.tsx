'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageViewTracker() {
  const path = usePathname()

  useEffect(() => {
    // sendBeacon is queued by the browser at low priority, so the page view
    // stops competing with LCP resources the way a plain fetch did.
    const body = JSON.stringify({ event: 'page_view', referrer: document.referrer, path })
    navigator.sendBeacon('/api/analytics', new Blob([body], { type: 'application/json' }))
  }, [path])

  return null
}
