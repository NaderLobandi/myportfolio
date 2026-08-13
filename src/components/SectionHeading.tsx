/** Shared section header: small accent eyebrow over a left-aligned display
 *  heading. Left alignment is deliberate — every section used to be centered,
 *  which flattened the page into one repeating rhythm. */
export default function SectionHeading({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string
  title: string
  note?: string
}) {
  return (
    <div data-reveal="up" className="mb-14 max-w-2xl">
      <p className="text-accent text-[11px] font-medium uppercase tracking-[0.22em] mb-3">
        {eyebrow}
      </p>
      <h2 className="display text-3xl md:text-4xl font-bold text-fg">{title}</h2>
      {note && <p className="text-fg-subtle text-sm mt-3 leading-relaxed">{note}</p>}
    </div>
  )
}
