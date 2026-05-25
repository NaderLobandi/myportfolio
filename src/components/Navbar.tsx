'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Home',       href: '#hero',       page: false, highlight: false },
  { label: 'PhD',        href: '/phd',        page: true,  highlight: true  },
  { label: 'Experiences', href: '#experience', page: false, highlight: false },
  { label: 'Education',  href: '#education',  page: false, highlight: false },
  { label: 'Projects',   href: '#projects',   page: false, highlight: false },
  { label: 'Skills',     href: '#skills',     page: false, highlight: false },
  { label: 'Contact',    href: '#about',      page: false, highlight: false },
]

const anchorClass    = 'text-[#ededed]/50 hover:text-[#ededed] text-sm px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all duration-200'
const highlightClass = 'text-sm font-semibold px-3 py-1.5 rounded-lg bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] hover:bg-[#f97316]/20 hover:border-[#f97316]/55 transition-all duration-200'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Wordmark */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="text-[#ededed] font-semibold text-sm tracking-wide hover:text-[#f97316] transition-colors"
        >
          NL
        </a>

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
            className="ml-3 text-sm font-medium px-4 py-1.5 rounded-lg bg-[#f97316] hover:bg-[#fb923c] text-white transition-colors duration-200"
          >
            Login
          </Link>
        </nav>

        {/* Mobile: phd + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/phd"
            className={highlightClass}
          >
            PhD
          </Link>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-[#ededed]/60 hover:text-[#ededed] p-1.5 transition-colors"
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
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.06] px-6 pb-4">
          {NAV_LINKS.map(({ label, href, page, highlight }) =>
            page ? (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm py-2.5 border-b border-white/[0.04] last:border-0 transition-colors ${
                  highlight ? 'text-[#f97316] font-semibold' : 'text-[#ededed]/60 hover:text-[#ededed]'
                }`}
              >
                {label}
              </Link>
            ) : (
              <a
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="block text-[#ededed]/60 hover:text-[#ededed] text-sm py-2.5 border-b border-white/[0.04] last:border-0 transition-colors"
              >
                {label}
              </a>
            )
          )}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="block text-sm py-2.5 text-[#ededed]/60 hover:text-[#ededed] transition-colors"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  )
}
