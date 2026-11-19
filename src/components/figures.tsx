/** Project cover art. Every cover is a 640×360 SVG on one fixed dark canvas,
 *  so the set reads as a family and behaves like an image (identical in light
 *  and dark mode). Each cover shows the project's own subject: the dataset as
 *  a wall of images, the voice as a waveform, the robot's scene from above. */

const ACCENT = '#f97316'
const INK = '#f4f4f5'
const MUTED = '#a1a1aa'
const LINE = '#3f3f46'
const PANEL = '#18181b'
const BG = '#0c0c0e'
const W = 640
const H = 360

/** Deterministic 0..1 noise, so the art is identical on every render. */
function noise(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const r1 = (n: number) => Math.round(n * 10) / 10

/** Shared canvas: dark ground plus one soft accent glow. `id` namespaces the
 *  gradient ids, because several covers share a page. */
function Canvas({
  id,
  label,
  glow = [0.5, 0],
  children,
}: {
  id: string
  label: string
  glow?: [number, number]
  children: React.ReactNode
}) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid slice" className="block w-full h-full">
      <defs>
        <radialGradient id={`${id}-glow`} cx={glow[0]} cy={glow[1]} r={0.85}>
          <stop offset="0" stopColor={ACCENT} stopOpacity={0.24} />
          <stop offset="1" stopColor={ACCENT} stopOpacity={0} />
        </radialGradient>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="#d4d4d8" />
        </marker>
      </defs>
      <rect width={W} height={H} fill={BG} />
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      {children}
    </svg>
  )
}

function Label({ x, y, size = 17, anchor = 'start', fill = MUTED, weight = 400, children }: {
  x: number; y: number; size?: number; anchor?: 'start' | 'middle' | 'end'; fill?: string; weight?: number; children: React.ReactNode
}) {
  return <text x={x} y={y} fontSize={size} textAnchor={anchor} fill={fill} fontWeight={weight}>{children}</text>
}

/** Four corner brackets around a box: the "detected" mark. */
function Brackets({ x, y, w, h, len = 18 }: { x: number; y: number; w: number; h: number; len?: number }) {
  const d = [
    `M${x} ${y + len} V${y} H${x + len}`,
    `M${x + w - len} ${y} H${x + w} V${y + len}`,
    `M${x + w} ${y + h - len} V${y + h} H${x + w - len}`,
    `M${x + len} ${y + h} H${x} V${y + h - len}`,
  ].join(' ')
  return <path d={d} fill="none" stroke={ACCENT} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
}

// ── E-waste benchmark dataset: the dataset itself, as a wall of images ──────

export function EwasteDatasetFigure() {
  const COLS = 20, ROWS = 12, PITCH = 32, SIZE = 26
  const tiles = []
  for (let i = 0; i < COLS * ROWS; i++) {
    const hot = noise(i + 500) > 0.87
    tiles.push(
      <rect
        key={i}
        x={(i % COLS) * PITCH + 3}
        y={Math.floor(i / COLS) * PITCH - 9}
        width={SIZE}
        height={SIZE}
        rx={5}
        fill={hot ? ACCENT : '#fff'}
        fillOpacity={r1(hot ? 0.3 + noise(i) * 0.5 : 0.04 + noise(i) * 0.1)}
      />,
    )
  }
  return (
    <Canvas id="ewd" glow={[0.8, 0.1]} label="A wall of image tiles standing for more than 1.5 million scraped images, with one hardware part picked out by a detection box">
      <defs>
        <linearGradient id="ewd-fade" x1="0" y1="1" x2="0.75" y2="0.1">
          <stop offset="0" stopColor={BG} stopOpacity={0.97} />
          <stop offset="0.55" stopColor={BG} stopOpacity={0.6} />
          <stop offset="1" stopColor={BG} stopOpacity={0} />
        </linearGradient>
      </defs>
      {tiles}
      <rect width={W} height={H} fill="url(#ewd-fade)" />

      {/* one image pulled out of the wall: a memory module, detected */}
      <rect x={404} y={74} width={164} height={164} rx={14} fill={PANEL} stroke={LINE} strokeWidth={1.5} />
      <rect x={424} y={130} width={124} height={48} rx={4} fill="#2a2a2f" stroke="#52525b" />
      {[0, 1, 2, 3].map((k) => <rect key={k} x={433 + k * 28} y={138} width={20} height={22} rx={2} fill="#0c0c0e" stroke="#52525b" />)}
      {Array.from({ length: 15 }, (_, k) => <rect key={k} x={429 + k * 7.7} y={166} width={4.5} height={12} fill={ACCENT} fillOpacity={0.85} />)}
      <Brackets x={392} y={62} w={188} h={188} len={22} />
      <rect x={392} y={30} width={86} height={24} rx={6} fill={ACCENT} />
      <Label x={435} y={47} size={15} anchor="middle" fill={BG} weight={700}>e-waste</Label>

      <Label x={36} y={292} size={66} fill={INK} weight={700}>1.5M+</Label>
      <Label x={39} y={324} size={18}>images collected by scraping agents</Label>
    </Canvas>
  )
}

// ── Speech synthesis via search: the cloned voice converging on the target ──

export function SpeechSearchFigure() {
  const N = 70, X0 = 40, STEP = 8, MID = 132
  const bars = []
  for (let i = 0; i < N; i++) {
    const envelope = 0.2 + 0.8 * Math.abs(Math.sin(i * 0.21) * Math.cos(i * 0.07 + 1))
    const target = 8 + envelope * (0.55 + 0.45 * noise(i)) * 78
    // early in the search the clone is far off; by the end it matches
    const mismatch = 0.95 * Math.pow(1 - i / (N - 1), 1.6)
    const clone = Math.max(5, target * (1 + (noise(i + 900) - 0.5) * 2 * mismatch))
    const x = X0 + i * STEP
    bars.push(
      <g key={i}>
        <rect x={x} y={r1(MID - 2 - target)} width={4} height={r1(target)} rx={2} fill="#d4d4d8" fillOpacity={0.55} />
        <rect x={x} y={MID + 2} width={4} height={r1(clone)} rx={2} fill={ACCENT} />
      </g>,
    )
  }
  return (
    <Canvas id="sps" glow={[0.95, 0.9]} label="Two mirrored waveforms: the cloned voice starts far from the target voice and converges on it as the search runs, lifting speaker similarity from 84.95 to 96.61">
      {bars}
      <path d={`M${X0} 244 H596`} stroke={LINE} strokeWidth={1.5} markerEnd="url(#sps-arrow)" />
      <Label x={X0} y={266} size={14}>search starts</Label>
      <Label x={596} y={266} size={14} anchor="end">2,000 evaluations</Label>

      <circle cx={46} cy={309} r={5} fill="#d4d4d8" fillOpacity={0.6} />
      <Label x={60} y={314} size={16}>target voice</Label>
      <circle cx={46} cy={333} r={5} fill={ACCENT} />
      <Label x={60} y={338} size={16}>cloned voice, frozen TTS</Label>

      <text x={600} y={322} textAnchor="end" fontSize={34} fontWeight={700} fill={INK}>
        <tspan fill={MUTED} fontWeight={400}>84.95 → </tspan>96.61
      </text>
      <Label x={600} y={344} size={15} anchor="end">speaker similarity</Label>
    </Canvas>
  )
}

// ── Embodied multiparty AI: the robot's view of a group conversation ────────

function Bust({ x, y, tone }: { x: number; y: number; tone: 'idle' | 'speaking' | 'addressed' }) {
  const stroke = tone === 'speaking' ? ACCENT : tone === 'addressed' ? INK : '#52525b'
  const fill = tone === 'speaking' ? '#3a2112' : '#232327'
  return (
    <g fill={fill} stroke={stroke} strokeWidth={2.5}>
      <path d={`M${x - 42} ${y + 74} q0 -40 42 -40 q42 0 42 40 z`} strokeLinejoin="round" />
      <circle cx={x} cy={y} r={25} />
    </g>
  )
}

export function MultipartyFigure() {
  // unit vector from the speaker toward the robot, for the sound arcs
  const speaker = { x: 500, y: 112 }
  const robot = { x: 320, y: 302 }
  const angle = (Math.atan2(robot.y - speaker.y, robot.x - speaker.x) * 180) / Math.PI
  return (
    <Canvas id="mpa" glow={[0.5, 1]} label="A social robot with a microphone array and camera faces three people; sound direction picks out who is speaking and a gaze line shows who is being addressed">
      {/* camera field of view */}
      <path d={`M${robot.x} ${robot.y} L-10 -20 H650 Z`} fill="#fff" fillOpacity={0.035} />
      <path d={`M${robot.x} ${robot.y} L-10 -20 M${robot.x} ${robot.y} L650 -20`} stroke="#fff" strokeOpacity={0.12} strokeDasharray="4 6" />

      {/* direction of arrival: robot to speaker */}
      <path d={`M${robot.x} ${robot.y} L${speaker.x - 90} ${speaker.y + 99}`} stroke={ACCENT} strokeWidth={2} strokeOpacity={0.7} strokeDasharray="2 7" strokeLinecap="round" />

      <Bust x={140} y={112} tone="addressed" />
      <Bust x={320} y={86} tone="idle" />
      <Bust x={speaker.x} y={speaker.y} tone="speaking" />

      {/* sound leaving the speaker, toward the robot */}
      <g transform={`translate(${speaker.x} ${speaker.y + 8}) rotate(${r1(angle)})`} fill="none" stroke={ACCENT} strokeWidth={3} strokeLinecap="round">
        {[76, 94, 112].map((r, k) => (
          <path key={r} d={`M${r1(r * 0.97)} ${r1(-r * 0.242)} A${r} ${r} 0 0 1 ${r1(r * 0.97)} ${r1(r * 0.242)}`} strokeOpacity={0.95 - k * 0.28} />
        ))}
      </g>

      {/* who is being spoken to */}
      <path d="M472 96 Q320 -34 172 92" fill="none" stroke={INK} strokeOpacity={0.75} strokeWidth={2} strokeDasharray="6 6" markerEnd="url(#mpa-arrow)" />

      <rect x={452} y={200} width={96} height={28} rx={14} fill={ACCENT} />
      <Label x={500} y={219} size={15} anchor="middle" fill={BG} weight={700}>speaking</Label>
      <rect x={90} y={200} width={100} height={28} rx={14} fill="none" stroke={INK} strokeOpacity={0.7} strokeWidth={1.5} />
      <Label x={140} y={219} size={15} anchor="middle" fill={INK}>addressed</Label>

      {/* the robot: mic ring around a camera */}
      <circle cx={robot.x} cy={robot.y} r={36} fill={PANEL} stroke="#52525b" strokeWidth={2.5} />
      {Array.from({ length: 6 }, (_, k) => {
        const a = (k * Math.PI) / 3 + Math.PI / 6
        return <circle key={k} cx={r1(robot.x + Math.cos(a) * 24)} cy={r1(robot.y + Math.sin(a) * 24)} r={4} fill={ACCENT} />
      })}
      <circle cx={robot.x} cy={robot.y} r={9} fill={BG} stroke={MUTED} strokeWidth={2} />
      <Label x={372} y={322} size={15}>robot: mic array + camera</Label>
    </Canvas>
  )
}

// ── Real output from the project, framed in a window ───────────────────────

function ShotFigure({ id, href, w, h, label, glow }: {
  id: string; href: string; w: number; h: number; label: string; glow?: [number, number]
}) {
  const BAR = 26, MAX_W = 548, MAX_H = 296
  const scale = Math.min(MAX_W / w, (MAX_H - BAR) / h)
  const iw = r1(w * scale), ih = r1(h * scale)
  const x = r1((W - iw) / 2), y = r1((H - ih - BAR) / 2)
  return (
    <Canvas id={id} glow={glow} label={label}>
      <defs>
        <clipPath id={`${id}-clip`}><rect x={x} y={y} width={iw} height={ih + BAR} rx={12} /></clipPath>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>
      <rect x={x} y={y} width={iw} height={ih + BAR} rx={12} fill={PANEL} filter={`url(#${id}-shadow)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={x} y={y} width={iw} height={BAR} fill="#222226" />
        {[0, 1, 2].map((k) => <circle key={k} cx={x + 18 + k * 16} cy={y + BAR / 2} r={4.5} fill="#52525b" />)}
        <image href={href} x={x} y={y + BAR} width={iw} height={ih} preserveAspectRatio="xMidYMid slice" />
      </g>
      <rect x={x} y={y} width={iw} height={ih + BAR} rx={12} fill="none" stroke="#fff" strokeOpacity={0.16} />
    </Canvas>
  )
}

export function JobScoutFigure() {
  return <ShotFigure id="jbs" href="/projects/jobscout.jpg" w={800} h={400} glow={[0.15, 0.1]}
    label="JobScout's own banner: 41 job boards scanned, 3 strong matches handed over for your review" />
}

export function SecureFaceIdFigure() {
  return <ShotFigure id="sfi" href="/projects/securefaceid.jpg" w={1000} h={640} glow={[0.85, 0.15]}
    label="SecureFaceID output: ten faces detected with confidence scores, including masked, rotated and partly hidden faces" />
}

// ── E-waste sustainability assistant: photo in, three answers out ──────────

export function EwasteScanFigure() {
  const rows = ['Carbon footprint', 'Recoverable value', 'Disposal action']
  return (
    <Canvas id="ews" glow={[0.1, 0.9]} label="A photo of a circuit board is scanned, and the assistant returns its carbon footprint, recoverable value and disposal action">
      <defs>
        <linearGradient id="ews-scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ACCENT} stopOpacity={0} />
          <stop offset="1" stopColor={ACCENT} stopOpacity={0.4} />
        </linearGradient>
      </defs>
      {/* the photo: a board with one chip */}
      <rect x={44} y={56} width={248} height={248} rx={18} fill="#141417" stroke={LINE} strokeWidth={1.5} />
      <rect x={66} y={78} width={204} height={204} rx={8} fill="#1b2620" />
      <g fill="none" stroke="#3d5a48" strokeWidth={3} strokeLinecap="round">
        <path d="M86 110 H130 V150" /><path d="M250 100 H214 V150" /><path d="M86 250 H120 V220" />
        <path d="M250 258 H206 V222" /><path d="M86 180 H126" /><path d="M250 186 H212" />
      </g>
      {[[86, 110], [250, 100], [86, 250], [250, 258], [86, 180], [250, 186]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={5} fill="#3d5a48" />)}
      <rect x={128} y={148} width={80} height={72} rx={6} fill="#2e2e33" stroke="#71717a" strokeWidth={1.5} />
      <rect x={144} y={164} width={48} height={40} rx={3} fill="#18181b" />
      {/* scan sweep and the detected part */}
      <rect x={66} y={132} width={204} height={62} fill="url(#ews-scan)" />
      <path d="M62 194 H274" stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round" />
      <Brackets x={114} y={134} w={108} h={100} />

      <path d="M300 180 H326" stroke={MUTED} strokeWidth={2} markerEnd="url(#ews-arrow)" />

      {rows.map((text, k) => {
        const y = 66 + k * 80
        return (
          <g key={text}>
            <rect x={340} y={y} width={256} height={64} rx={14} fill={PANEL} stroke={LINE} strokeWidth={1.5} />
            <circle cx={374} cy={y + 32} r={14} fill={ACCENT} fillOpacity={0.16} stroke={ACCENT} strokeWidth={1.5} />
            <path d={`M367 ${y + 32} l5 5 l9 -10`} fill="none" stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            <Label x={402} y={y + 38} size={18} fill={INK}>{text}</Label>
          </g>
        )
      })}
    </Canvas>
  )
}

// ── Financial news sentiment: headlines in, a label out ─────────────────────

export function SentimentFigure() {
  // Example headlines are illustrative; the two scores are the measured results.
  const rows = [
    { text: 'Shares jump after earnings beat', mark: '▲', tag: 'positive', color: '#4ade80' },
    { text: 'Regulator opens probe into lender', mark: '▼', tag: 'negative', color: '#f87171' },
    { text: 'Central bank holds rates steady', mark: '●', tag: 'neutral', color: MUTED },
  ]
  return (
    <Canvas id="fns" glow={[0.9, 0.05]} label="Example news headlines labelled positive, negative and neutral. Measured accuracy: BERT 0.86 on Yahoo Finance, FinBERT 0.73 on Alpha Vantage">
      {rows.map((row, k) => {
        const y = 44 + k * 94
        return (
          <g key={row.tag}>
            <rect x={36} y={y} width={356} height={78} rx={14} fill={PANEL} stroke={LINE} strokeWidth={1.5} />
            <Label x={56} y={y + 33} size={18} fill={INK}>{row.text}</Label>
            <Label x={56} y={y + 59} size={15} fill={row.color} weight={600}>{row.mark} {row.tag}</Label>
          </g>
        )
      })}

      <path d="M418 52 V308" stroke={LINE} strokeWidth={1.5} />
      <Label x={444} y={106} size={54} fill={INK} weight={700}>0.86</Label>
      <Label x={446} y={132} size={15}>accuracy, BERT</Label>
      <Label x={446} y={152} size={15}>on Yahoo Finance</Label>
      <Label x={444} y={244} size={54} fill={INK} weight={700}>0.73</Label>
      <Label x={446} y={270} size={15}>accuracy, FinBERT</Label>
      <Label x={446} y={290} size={15}>on Alpha Vantage</Label>
    </Canvas>
  )
}

// ── Financial time series and document QA ──────────────────────────────────

export function ForecastFigure() {
  // Illustrative shape only: no real prices are plotted.
  const history = [[40, 250], [70, 236], [100, 244], [130, 218], [160, 226], [190, 200], [220, 210], [250, 184], [280, 192], [310, 166], [340, 174], [380, 154]]
  const line = history.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')
  return (
    <Canvas id="fts" glow={[0.85, 0.25]} label="Illustration: a price history continuing into a dashed forecast with a widening range, next to a card for asking questions of a 10-K filing">
      <defs>
        <linearGradient id="fts-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.12} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      {[110, 170, 230, 290].map((y) => <path key={y} d={`M40 ${y} H600`} stroke="#fff" strokeOpacity={0.06} />)}
      <path d={`${line} L380 290 L40 290 Z`} fill="url(#fts-area)" />
      <path d={line} fill="none" stroke="#e4e4e7" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />

      <path d="M380 154 L600 62 L600 156 Z" fill={ACCENT} fillOpacity={0.16} />
      <path d="M380 154 L440 140 L500 126 L560 114 L600 106" fill="none" stroke={ACCENT} strokeWidth={3.5} strokeDasharray="9 7" strokeLinecap="round" />
      <path d="M380 76 V290" stroke="#fff" strokeOpacity={0.3} strokeDasharray="3 5" />
      <circle cx={380} cy={154} r={6} fill={BG} stroke="#e4e4e7" strokeWidth={3} />
      <Label x={380} y={318} size={15} anchor="middle">today</Label>
      <Label x={600} y={318} size={15} anchor="end">forecast, up to 2 months</Label>

      {/* the other half of the tool: questions over filings */}
      <rect x={40} y={36} width={214} height={60} rx={14} fill={PANEL} stroke={LINE} strokeWidth={1.5} />
      <rect x={58} y={50} width={24} height={32} rx={4} fill="none" stroke={ACCENT} strokeWidth={2} />
      <path d="M64 61 H76 M64 68 H76 M64 75 H71" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" />
      <Label x={96} y={72} size={18} fill={INK}>Ask the 10-K</Label>
    </Canvas>
  )
}

export const FIGURES: Record<string, () => React.JSX.Element> = {
  'ewaste-dataset': EwasteDatasetFigure,
  'speech-search': SpeechSearchFigure,
  'multiparty': MultipartyFigure,
  'jobscout': JobScoutFigure,
  'securefaceid': SecureFaceIdFigure,
  'ewaste-scan': EwasteScanFigure,
  'sentiment': SentimentFigure,
  'forecast': ForecastFigure,
}
