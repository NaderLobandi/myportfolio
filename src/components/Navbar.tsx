'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const forceBg = pathname === '/phd' || pathname === '/login'

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
          {NAV_LINKS.map(({ label, href, page, highlight }) =>
            page ? (
              <Link key={href} href={href} className={highlight ? highlightClass : anchorClass}>
                {label}
              </Link>
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
            className="ml-2 text-sm font-medium px-4 py-1.5 rounded-lg bg-[#f97316] hover:bg-[#fb923c] text-white transition-colors duration-200"
          >
            Login
          </Link>
        </nav>

        {/* Mobile: News + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/phd" className={highlightClass}>
            News
          </Link>
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
