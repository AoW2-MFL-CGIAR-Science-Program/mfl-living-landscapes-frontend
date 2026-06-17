/**
 * DatasetThumbnail — generative "satellite tile" preview.
 *
 * Renders a deterministic SVG that evokes a remote-sensing / terrain map,
 * colour-coded by MFL theme. No external images or network requests.
 * The same dataset id always produces the same tile.
 */

interface Props {
  id: string
  theme: string
}

interface Palette {
  bg: [string, string]
  patches: string[]
  contour: string
}

const THEME_PALETTE: Record<string, Palette> = {
  'Land cover / land use': {
    bg: ['#1d3a16', '#2f5320'],
    patches: ['#3f6b2a', '#6f9438', '#a3b84e', '#c9b96a', '#4a7a2f', '#7da647'],
    contour: '#cfe0b0',
  },
  'Water / hydrology': {
    bg: ['#0c3a4a', '#114f63'],
    patches: ['#1E6F8E', '#2f8fa8', '#62bdd6', '#3a7a5a', '#8fcfe0', '#256f7e'],
    contour: '#bfe6f0',
  },
  'Biodiversity / ecosystems': {
    bg: ['#14331d', '#1f4a2a'],
    patches: ['#2f7a3a', '#7fae3a', '#d6b94a', '#dd7e32', '#c2452a', '#4a9a45'],
    contour: '#e6e0b0',
  },
  'Degradation / land health': {
    bg: ['#392616', '#54381f'],
    patches: ['#8a5a2f', '#b0814f', '#caa66a', '#dbbb8a', '#9a6b3a', '#c98a4a'],
    contour: '#ecd8b8',
  },
  'Socio-economic / livelihoods': {
    bg: ['#20323a', '#2e4450'],
    patches: ['#3a6b6b', '#4a7f8f', '#6f6f9c', '#8c7c9c', '#5a8a7c', '#7a9aa8'],
    contour: '#d6dde2',
  },
  'Ecosystem condition': {
    bg: ['#14331d', '#1f4a2a'],
    patches: ['#2f7a3a', '#7fae3a', '#a8c25a', '#5a9a55', '#3a8a6a', '#cdbf6a'],
    contour: '#e0e6c0',
  },
}

const DEFAULT_PALETTE: Palette = {
  bg: ['#0D5C6B', '#0A4753'],
  patches: ['#0D5C6B', '#117A8D', '#C97D1B', '#B54D2F', '#3a8a8a', '#d6a35a'],
  contour: '#D6EEF2',
}

function hashSeed(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const W = 320
const H = 240

/** Smooth closed "blob" path around a centre. */
function blobPath(rand: () => number, cx: number, cy: number, baseR: number, spread: number): string {
  const n = 7
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2
    const rr = baseR * (1 - spread / 2 + rand() * spread)
    pts.push([cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr])
  }
  let d = ''
  for (let i = 0; i < n; i++) {
    const next = pts[(i + 1) % n]
    const after = pts[(i + 2) % n]
    const mid = [(pts[i][0] + next[0]) / 2, (pts[i][1] + next[1]) / 2]
    const nmid = [(next[0] + after[0]) / 2, (next[1] + after[1]) / 2]
    if (i === 0) d += `M ${mid[0].toFixed(1)} ${mid[1].toFixed(1)} `
    d += `Q ${next[0].toFixed(1)} ${next[1].toFixed(1)} ${nmid[0].toFixed(1)} ${nmid[1].toFixed(1)} `
  }
  return d + 'Z'
}

/** Open contour line spanning the width at a given y. */
function contourPath(rand: () => number, y: number): string {
  const seg = 4
  let d = `M -10 ${y.toFixed(1)} `
  for (let i = 1; i <= seg; i++) {
    const x = (W / seg) * i
    const cx = x - W / seg / 2
    const cy = y + (rand() - 0.5) * 46
    d += `Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${(y + (rand() - 0.5) * 22).toFixed(1)} `
  }
  return d
}

export function DatasetThumbnail({ id, theme }: Props) {
  const palette = THEME_PALETTE[theme] ?? DEFAULT_PALETTE
  const seed = hashSeed(id)
  const rand = mulberry32(seed)
  const gid = `thumb-grad-${seed.toString(36)}`

  // Scatter 7 organic patches across the tile.
  const patches = Array.from({ length: 7 }, (_, i) => {
    const cx = rand() * W
    const cy = rand() * H
    const r = 34 + rand() * 64
    const fill = palette.patches[i % palette.patches.length]
    const op = 0.55 + rand() * 0.4
    return { d: blobPath(rand, cx, cy, r, 0.7), fill, op }
  })

  // 4 contour lines.
  const contours = [0.28, 0.46, 0.64, 0.82].map((f) => contourPath(rand, H * f))

  return (
    <svg
      className="ds-thumb-svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${theme} dataset preview`}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.bg[0]} />
          <stop offset="100%" stopColor={palette.bg[1]} />
        </linearGradient>
        <clipPath id={`${gid}-clip`}>
          <rect width={W} height={H} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${gid}-clip)`}>
        <rect width={W} height={H} fill={`url(#${gid})`} />

        {patches.map((p, i) => (
          <path key={i} d={p.d} fill={p.fill} opacity={p.op} />
        ))}

        {/* Soft darkening at edges for depth */}
        <rect width={W} height={H} fill="#000" opacity="0.06" />

        {/* Contour lines */}
        <g fill="none" stroke={palette.contour} strokeWidth="1.1">
          {contours.map((d, i) => (
            <path key={i} d={d} opacity={0.18 - i * 0.02} />
          ))}
        </g>

        {/* Faint graticule */}
        <g stroke="#ffffff" strokeWidth="0.5" opacity="0.07">
          <line x1={W * 0.33} y1="0" x2={W * 0.33} y2={H} />
          <line x1={W * 0.66} y1="0" x2={W * 0.66} y2={H} />
          <line x1="0" y1={H * 0.5} x2={W} y2={H * 0.5} />
        </g>
      </g>
    </svg>
  )
}
