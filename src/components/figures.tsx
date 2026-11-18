/** Theme-aware 16:9 SVG figures for projects without a photo. Strokes use
 *  currentColor (inherits text-fg-*) and the accent token, so they read in
 *  light and dark mode. Shared viewBox: 320×180. */

const ACCENT = 'var(--accent)'
const BOX = { fill: 'none', stroke: 'currentColor', strokeOpacity: 0.35, strokeWidth: 1.2 }
const LABEL = { fill: 'currentColor', fontSize: 9, fontFamily: 'inherit' }

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label={label} className="w-full h-full text-fg-muted">
      {children}
    </svg>
  )
}

function Person({ x, y, active = false }: { x: number; y: number; active?: boolean }) {
  const c = active ? ACCENT : 'currentColor'
  return (
    <g fill="none" stroke={c} strokeWidth={1.6} opacity={active ? 1 : 0.6}>
      <circle cx={x} cy={y} r={8} />
      <path d={`M${x - 14} ${y + 28} q14 -22 28 0`} />
    </g>
  )
}

function Step({ x, y, w, text, hot = false }: { x: number; y: number; w: number; text: string; hot?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={24} rx={6} {...BOX} stroke={hot ? ACCENT : 'currentColor'} strokeOpacity={hot ? 1 : 0.35} />
      <text x={x + w / 2} y={y + 15.5} textAnchor="middle" {...LABEL} fill={hot ? ACCENT : 'currentColor'}>{text}</text>
    </g>
  )
}

function Arrow({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.2} markerEnd="url(#arrow)" />
}

const ArrowDef = () => (
  <defs>
    <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L8 4 L0 8 z" fill="currentColor" fillOpacity={0.55} />
    </marker>
  </defs>
)

export function MultipartyFigure() {
  return (
    <Frame label="Diagram: a microphone array estimates sound direction and is fused with camera video to find who is speaking and who is addressed">
      <ArrowDef />
      {/* mic array */}
      <rect x={18} y={84} width={56} height={12} rx={6} {...BOX} />
      {[28, 40, 52, 64].map((cx) => <circle key={cx} cx={cx} cy={90} r={3} fill={ACCENT} />)}
      <text x={46} y={114} textAnchor="middle" {...LABEL}>mic array</text>
      {/* direction-of-arrival arcs */}
      {[18, 30, 42].map((r) => (
        <path key={r} d={`M${74 + r * 0.2} ${90 - r} a${r} ${r} 0 0 1 0 ${r * 2}`} fill="none" stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.2} />
      ))}
      <Arrow d="M124 90 H150" />
      {/* camera frame */}
      <rect x={156} y={28} width={148} height={124} rx={8} {...BOX} />
      <text x={164} y={42} {...LABEL} opacity={0.7}>camera view</text>
      <Person x={190} y={82} />
      <Person x={230} y={78} active />
      <Person x={270} y={82} />
      <rect x={209} y={118} width={42} height={14} rx={7} fill={ACCENT} />
      <text x={230} y={128} textAnchor="middle" fontSize={8} fill="#fff">speaking</text>
      <text x={280} y={128} textAnchor="middle" fontSize={8} fill="currentColor">addressed</text>
      <path d="M246 74 q12 -14 22 -4" fill="none" stroke={ACCENT} strokeDasharray="3 2" strokeWidth={1.2} markerEnd="url(#arrow)" />
    </Frame>
  )
}

export function SpeechSearchFigure() {
  // Only the two real endpoints are data; the curve between them is illustrative.
  const y = (v: number) => 150 - ((v - 80) / 20) * 100
  const [x0, y0, x1, y1] = [192, y(84.95), 302, y(96.61)]
  return (
    <Frame label="Diagram: search loop over a frozen text-to-speech model raises speaker similarity from 84.95 to 96.61 in 2,000 evaluations">
      <ArrowDef />
      <Step x={14} y={30} w={74} text="candidate" />
      <Step x={98} y={30} w={74} text="frozen TTS" hot />
      <Step x={98} y={122} w={74} text="similarity" />
      <Step x={14} y={122} w={74} text="search step" />
      <Arrow d="M88 42 H96" />
      <Arrow d="M135 54 V120" />
      <Arrow d="M98 134 H90" />
      <Arrow d="M51 122 V56" />
      {/* curve */}
      <line x1={190} y1={150} x2={306} y2={150} stroke="currentColor" strokeOpacity={0.3} />
      <line x1={190} y1={50} x2={190} y2={150} stroke="currentColor" strokeOpacity={0.3} />
      <path d={`M${x0} ${y0} Q${x0 + 30} ${y1} ${x1} ${y1}`} fill="none" stroke={ACCENT} strokeWidth={2} />
      <circle cx={x0} cy={y0} r={2.5} fill={ACCENT} />
      <circle cx={x1} cy={y1} r={2.5} fill={ACCENT} />
      <text x={198} y={y0 + 14} {...LABEL}>84.95</text>
      <text x={302} y={y(96.61) - 8} textAnchor="end" {...LABEL} fill={ACCENT} fontWeight={600}>96.61</text>
      <text x={248} y={166} textAnchor="middle" {...LABEL} opacity={0.7}>2,000 evaluations</text>
    </Frame>
  )
}

export function EwasteDatasetFigure() {
  const tiles = Array.from({ length: 24 }, (_, i) => i)
  return (
    <Frame label="Diagram: AI agents drive web scrapers that collect over 1.5 million images, which are filtered and labeled into an e-waste benchmark">
      <ArrowDef />
      <Step x={10} y={40} w={64} text="AI agents" hot />
      <Step x={10} y={116} w={64} text="scrapers" />
      <Arrow d="M42 64 V114" />
      <Arrow d="M74 128 H96" />
      {/* image grid */}
      {tiles.map((i) => (
        <rect key={i} x={100 + (i % 6) * 15} y={70 + Math.floor(i / 6) * 15} width={12} height={12} rx={2}
          fill={i % 5 === 0 ? ACCENT : 'currentColor'} fillOpacity={i % 5 === 0 ? 0.8 : 0.18} />
      ))}
      <text x={144} y={58} textAnchor="middle" {...LABEL} fontWeight={600} fill={ACCENT}>1.5M+ images</text>
      <Arrow d="M192 98 H210" />
      <Step x={214} y={86} w={96} text="filter & label" />
      <Arrow d="M262 110 V128" />
      <Step x={214} y={130} w={96} text="benchmark" hot />
    </Frame>
  )
}

export function SentimentBarsFigure() {
  const bars = [
    { label: 'FinBERT · Alpha Vantage', acc: 0.73, f1: 0.74 },
    { label: 'BERT · Yahoo Finance', acc: 0.86, f1: 0.86 },
  ]
  const w = (v: number) => v * 190
  return (
    <Frame label="Bar chart: FinBERT 0.73 accuracy and 0.74 macro-F1 on Alpha Vantage; BERT 0.86 accuracy and 0.86 macro-F1 on Yahoo Finance">
      {bars.map((b, i) => {
        const y0 = 34 + i * 70
        return (
          <g key={b.label}>
            <text x={16} y={y0} {...LABEL}>{b.label}</text>
            <rect x={16} y={y0 + 8} width={w(b.acc)} height={14} rx={3} fill={ACCENT} />
            <text x={22 + w(b.acc)} y={y0 + 19} {...LABEL}>{b.acc.toFixed(2)} acc</text>
            <rect x={16} y={y0 + 26} width={w(b.f1)} height={14} rx={3} fill="currentColor" fillOpacity={0.35} />
            <text x={22 + w(b.f1)} y={y0 + 37} {...LABEL}>{b.f1.toFixed(2)} F1</text>
          </g>
        )
      })}
    </Frame>
  )
}

export function ForecastFigure() {
  // Illustrative shape only — no real data plotted
  const hist = 'M16 120 L40 112 L64 118 L88 100 L112 106 L136 92 L160 96 L184 84'
  return (
    <Frame label="Illustration: a time series with a forecast continuation and a widening confidence band">
      <line x1={16} y1={150} x2={304} y2={150} stroke="currentColor" strokeOpacity={0.3} />
      <path d="M184 84 L304 50 L304 104 Z" fill={ACCENT} fillOpacity={0.15} />
      <path d={hist} fill="none" stroke="currentColor" strokeOpacity={0.7} strokeWidth={2} />
      <path d="M184 84 L224 76 L264 70 L304 66" fill="none" stroke={ACCENT} strokeWidth={2} strokeDasharray="5 3" />
      <line x1={184} y1={40} x2={184} y2={150} stroke="currentColor" strokeOpacity={0.25} strokeDasharray="2 3" />
      <text x={100} y={166} textAnchor="middle" {...LABEL} opacity={0.7}>history</text>
      <text x={244} y={166} textAnchor="middle" {...LABEL} fill={ACCENT}>forecast · up to 2 months</text>
    </Frame>
  )
}

export const FIGURES: Record<string, () => React.JSX.Element> = {
  'multiparty': MultipartyFigure,
  'speech-search': SpeechSearchFigure,
  'ewaste-dataset': EwasteDatasetFigure,
  'sentiment-bars': SentimentBarsFigure,
  'forecast': ForecastFigure,
}
