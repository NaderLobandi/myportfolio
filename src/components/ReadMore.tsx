/** Site-wide "TL;DR first" pattern: the short version sits above this and stays
 *  visible; the full text opens on demand. Native <details>, so there is no
 *  state and it works without JavaScript. */
export default function ReadMore({ children }: { children: React.ReactNode }) {
  return (
    <details className="group mt-1">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 py-2 text-xs font-medium text-accent hover:text-accent-hi transition-colors [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">Read more</span>
        <span className="hidden group-open:inline">Show less</span>
        <span aria-hidden="true" className="transition-transform duration-200 group-open:rotate-180">▾</span>
      </summary>
      <div className="mt-1 space-y-3">{children}</div>
    </details>
  )
}
