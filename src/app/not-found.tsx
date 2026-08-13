import Link from 'next/link'

export const metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <main id="main" className="bg-surface min-h-[100dvh] flex items-center px-6">
      <div className="max-w-5xl mx-auto w-full">
        <p className="text-accent text-[11px] font-medium uppercase tracking-[0.22em] mb-3">
          404
        </p>
        <h1 className="display text-4xl md:text-5xl font-bold text-fg mb-4">
          This page doesn&apos;t exist
        </h1>
        <p className="text-fg-muted text-base max-w-[62ch] mb-8">
          The link may be outdated, or the page moved. Everything else is still where you left it.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-full bg-accent pl-6 pr-1.5 py-1.5 text-sm font-semibold text-white transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent-hi active:scale-[0.98]"
          >
            Back home
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
              ↗
            </span>
          </Link>
          <Link
            href="/phd"
            className="inline-flex items-center rounded-full border border-edge px-5 py-3 text-sm font-medium text-fg-muted transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-accent/40 hover:text-fg active:scale-[0.98]"
          >
            Research updates
          </Link>
        </div>
      </div>
    </main>
  )
}
