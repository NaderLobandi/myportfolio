import Image from 'next/image'

/** Square org mark on a white tile, so dark logos stay visible in dark mode.
 *  No logo file → first-letter monogram instead of a broken image. */
export default function OrgLogo({ src, name, size = 40 }: { src?: string; name: string; size?: number }) {
  const box = { width: size, height: size }

  if (!src) {
    return (
      <span
        style={box}
        className="shrink-0 inline-flex items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent font-semibold text-sm"
        aria-hidden="true"
      >
        {name.trim().charAt(0).toUpperCase()}
      </span>
    )
  }

  return (
    <span style={box} className="shrink-0 relative inline-block rounded-lg bg-white border border-edge overflow-hidden">
      {/* unoptimized: tiny files, and SVGs skip the optimizer anyway.
          Logo files are trimmed to their content and centered on a square,
          so one small uniform padding gives an equal margin on every edge. */}
      <Image src={src} alt={`${name} logo`} fill unoptimized className="object-contain p-[3px]" />
    </span>
  )
}

/** content.json entries carry `logo` only sometimes; JSON typing makes it a union. */
export function logoOf(entry: object): string | undefined {
  return 'logo' in entry && typeof entry.logo === 'string' ? entry.logo : undefined
}
