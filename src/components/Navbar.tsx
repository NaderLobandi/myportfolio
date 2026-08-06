'use client'

import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { typeConfig, formatDate, type MilestonePreview } from '../lib/milestone-style'

const NAV_LINKS = [
  { label: 'Home',        href: '#hero',       page: false, highlight: false },
  { label: 'News',        href: '/phd',        page: true,  highlight: true  },
  { label: 'Experiences', href: '#experience', page: false, highlight: false },
  { label: 'Education',   href: '#education',  page: false, highlight: false },
  { label: 'Projects',    href: '#projects',      page: false, highlight: false },
  { label: 'Publications', href: '#publications', page: false, highlight: false },
  { label: 'Skills',      href: '#skills',       page: false, highlight: false },
  { label: 'Contact',     href: '#about',      page: false, highlight: false },
]

const anchorClass    = 'text-fg-subtle hover:text-fg text-sm px-3 py-1.5 rounded-lg hover:bg-overlay transition-all duration-200'
const highlightClass = 'text-sm font-semibold px-3 py-1.5 rounded-lg bg-[#f97316]/15 border border-[#f97316]/60 dark:border-[#f97316]/30 text-[#f97316] hover:bg-[#f97316]/25 dark:hover:bg-[#f97316]/20 hover:border-[#f97316]/80 dark:hover:border-[#f97316]/55 transition-all duration-200'

const NEWS_SEEN_KEY = 'nl:newsSeen'

const readSeen = () => localStorage.getItem(NEWS_SEEN_KEY)

const subscribeSeen = (onChange: () => void) => {
  window.addEventListener('storage', onChange)
  return () => window.removeEventListener('storage', onChange)
}

function markNewsSeen(latestDate: string) {
  if (localStorage.getItem(NEWS_SEEN_KEY) === latestDate) return
  localStorage.setItem(NEWS_SEEN_KEY, latestDate)
  window.dispatchEvent(new StorageEvent('storage'))  // same-tab: 'storage' only fires cross-tab
}

/** News link: pulsing dot while there's an unseen milestone, plus a hover/focus
 *  preview of the newest entries (desktop only — touch has no hover). */
function NewsPill({
  unseen,
  withCard,
  previews,
}: {
  unseen: boolean
  withCard: boolean
  previews: MilestonePreview[]
}) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const schedule = (next: boolean, delay: number) => {
    if (!withCard) return
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(next), delay)
  }

  // Clicking through to /phd must close the card immediately — a pending open
  // timer would otherwise re-open it over the new page.
  const close = () => {
    if (timer.current) clearTimeout(timer.current)
    setOpen(false)
  }

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div
      className="relative"
      onMouseEnter={() => schedule(true, 120)}
      onMouseLeave={() => schedule(false, 200)}
      onFocus={() => schedule(true, 0)}
      onBlur={() => schedule(false, 200)}
    >
      <Link
        href="/phd"
        className={`${highlightClass} inline-flex items-center gap-2`}
        aria-label={unseen ? 'News — new updates' : undefined}
        onClick={close}
      >
        {unseen && (
          <span className="relative flex w-2 h-2" aria-hidden="true">
            <span className="absolute inline-flex w-full h-full rounded-full bg-[#f97316] opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-[#f97316]" />
          </span>
        )}
        News
      </Link>

      {withCard && (
        <div
          className={`hidden md:block absolute right-0 top-full mt-2 w-72 rounded-xl border border-edge bg-surface/95 backdrop-blur-md p-3 shadow-lg transition-all duration-200 ease-out ${
            open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1.5 pointer-events-none'
          }`}
          aria-hidden={!open}
        >
            <p className="text-fg-subtle text-[10px] uppercase tracking-widest mb-2">Latest</p>
            <ul className="space-y-2">
              {previews.map((m) => (
                <li key={m.date + m.title} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                    style={{ background: (typeConfig[m.type] ?? typeConfig.milestone).dot }}
                  />
                  <span className="min-w-0">
                    <span className="block text-fg text-xs font-medium leading-snug">{m.title}</span>
                    <span className="block text-fg-subtle text-[11px]">{formatDate(m.date)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/phd"
              className="block mt-3 pt-2 border-t border-edge-subtle text-[#f97316] text-xs font-medium hover:text-[#fb923c] transition-colors"
              onClick={close}
            >
              View all news →
            </Link>
        </div>
      )}
    </div>
  )
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Navbar({ previews }: { previews: MilestonePreview[] }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const forceBg = pathname === '/phd' || pathname === '/login'
  const latestDate = previews[0]?.date ?? ''

  // localStorage is client-only, so read it as an external store: SSR and the
  // hydration render both see "seen", then React re-reads on the client.
  const seenDate = useSyncExternalStore(subscribeSeen, readSeen, () => latestDate)
  const newsUnseen = seenDate !== latestDate

  useEffect(() => {
    if (pathname === '/phd') markNewsSeen(latestDate)
  }, [pathname, latestDate])

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    setMenuOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (!el) {
      window.location.href = '/' + href
      return
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || forceBg
          ? 'bg-surface/90 backdrop-blur-md border-b border-edge'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Wordmark + theme toggle */}
        <div className="flex items-center gap-2">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="text-fg font-semibold text-sm tracking-wide hover:text-[#f97316] transition-colors"
          >
            NL
          </a>
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-overlay transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          )}
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href, page }) =>
            page ? (
              <NewsPill key={href} unseen={newsUnseen} withCard previews={previews} />
            ) : (
              <a
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className={anchorClass}
              >
                {label}
              </a>
            )
          )}
          <Link
            href="/login"
            className={`ml-2 ${anchorClass}`}
          >
            Login
          </Link>
        </nav>

        {/* Mobile: News + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <NewsPill unseen={newsUnseen} withCard={false} previews={previews} />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-fg-subtle hover:text-fg p-1.5 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-md border-b border-edge px-6 pb-4">
          {NAV_LINKS.map(({ label, href, page, highlight }) =>
            page ? (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm py-2.5 border-b border-edge-subtle last:border-0 transition-colors ${
                  highlight ? 'text-[#f97316] font-semibold' : 'text-fg-muted hover:text-fg'
                }`}
              >
                {label}
              </Link>
            ) : (
              <a
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="block text-fg-muted hover:text-fg text-sm py-2.5 border-b border-edge-subtle last:border-0 transition-colors"
              >
                {label}
              </a>
            )
          )}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="block text-sm py-2.5 text-fg-muted hover:text-fg transition-colors"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  )
}
