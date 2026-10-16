import type { GarmentArt as GarmentArtSpec, GarmentKind } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

/**
 * A flat illustration of a garment in its colourway.
 *
 * The demo catalogue draws these in photo slots that don't have a photograph
 * yet, so a grid reads as a grid of clothes rather than a grid of grey
 * boxes. Drawn on a 400 × 500 canvas — the 4:5 shape of a product card — and
 * scaled to whatever frame it sits in.
 */
export function GarmentArt({
  art,
  className,
  title,
}: {
  art: GarmentArtSpec;
  className?: string;
  title?: string;
}) {
  const { kind, color, view } = art;
  const dark = isDark(color);
  // Seams and trims: a shade darker on light cloth, lighter on dark cloth.
  const detail = dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.22)';
  const edge = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.16)';
  const id = `ga-${kind}-${view}-${color.replace(/[^a-z0-9]/gi, '')}`;
  const draw = SHAPES[kind];

  return (
    <svg
      viewBox="0 0 400 500"
      className={cn('h-full w-full', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={dark ? 0.1 : 0.22} />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={dark ? 0.25 : 0.08} />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="462" rx="150" ry="12" fill="rgba(0,0,0,0.06)" />
      <g
        strokeLinejoin="round"
        strokeLinecap="round"
        transform={view === 'back' && MIRROR_BACK.has(kind) ? 'translate(400 0) scale(-1 1)' : undefined}
      >
        {draw({ fill: color, shade: `url(#${id})`, detail, edge, back: view === 'back' })}
      </g>
    </svg>
  );
}

interface Paint {
  fill: string;
  /** Gradient overlay for a little depth. */
  shade: string;
  detail: string;
  edge: string;
  back: boolean;
}

/** Accessories have no "back" worth drawing — they are shown mirrored. */
const MIRROR_BACK = new Set<GarmentKind>(['cap', 'bucket', 'socks', 'tote', 'belt']);

/** Fill the silhouette, then lay the shading over it. */
function Body({ d, p }: { d: string; p: Paint }) {
  return (
    <>
      <path d={d} fill={p.fill} stroke={p.edge} strokeWidth="2" />
      <path d={d} fill={p.shade} />
    </>
  );
}

function Line({ d, p, w = 2.5, dash }: { d: string; p: Paint; w?: number; dash?: string }) {
  return <path d={d} fill="none" stroke={p.detail} strokeWidth={w} strokeDasharray={dash} />;
}

// ——— Silhouettes ———————————————————————————————————————————————————

const SHORT_SLEEVE =
  'M160 74 Q200 96 240 74 L292 90 L348 162 L312 196 L284 170 L288 436 Q200 446 112 436 L116 170 L88 196 L52 162 L108 90 Z';

const LONG_SLEEVE =
  'M163 78 L116 94 L80 204 L60 396 L102 402 L124 222 L122 440 Q200 450 278 440 L276 222 L298 402 L340 396 L320 204 L284 94 L237 78 Q200 98 163 78 Z';

const sleeveCuffs = (p: Paint) => (
  <>
    <Line p={p} d="M64 378 L100 383" />
    <Line p={p} d="M300 383 L336 378" />
  </>
);

const hemRib = (p: Paint) => <Line p={p} d="M124 420 Q200 430 276 420" />;

const SHAPES: Record<GarmentKind, (p: Paint) => JSX.Element> = {
  tee: (p) => (
    <>
      <Body p={p} d={SHORT_SLEEVE} />
      <Line p={p} d={p.back ? 'M162 76 Q200 86 238 76' : 'M164 78 Q200 106 236 78'} w={3} />
      <Line p={p} d="M60 170 L94 194" />
      <Line p={p} d="M306 194 L340 170" />
      {p.back && <rect x="190" y="84" width="20" height="10" rx="1" fill={p.detail} />}
    </>
  ),

  polo: (p) => (
    <>
      <Body p={p} d={SHORT_SLEEVE} />
      <Line p={p} d="M60 170 L94 194" w={4} />
      <Line p={p} d="M306 194 L340 170" w={4} />
      {p.back ? (
        <path
          d="M158 74 Q200 60 242 74 L242 86 Q200 74 158 86 Z"
          fill={p.fill}
          stroke={p.detail}
          strokeWidth="2"
        />
      ) : (
        <>
          <rect x="190" y="92" width="20" height="84" fill="none" stroke={p.detail} strokeWidth="2" />
          {[116, 138, 160].map((cy) => (
            <circle key={cy} cx="200" cy={cy} r="3.5" fill={p.detail} />
          ))}
          <path d="M160 74 L146 104 L196 124 L200 92 Z" fill={p.fill} stroke={p.detail} strokeWidth="2" />
          <path d="M240 74 L254 104 L204 124 L200 92 Z" fill={p.fill} stroke={p.detail} strokeWidth="2" />
        </>
      )}
      <Line p={p} d="M112 424 L130 404" />
      <Line p={p} d="M288 424 L270 404" />
    </>
  ),

  crewneck: (p) => (
    <>
      <Body p={p} d={LONG_SLEEVE} />
      <Line p={p} d={p.back ? 'M163 80 Q200 90 237 80' : 'M166 82 Q200 112 234 82'} w={4} />
      {sleeveCuffs(p)}
      {hemRib(p)}
      {!p.back && <Line p={p} d="M190 108 L200 122 L210 108" w={2} />}
    </>
  ),

  hoodie: (p) =>
    p.back ? (
      <>
        <Body p={p} d={LONG_SLEEVE} />
        <path
          d="M158 80 Q146 12 200 10 Q254 12 242 80 L240 196 Q200 214 160 196 Z"
          fill={p.fill}
          stroke={p.detail}
          strokeWidth="2"
        />
        <Line p={p} d="M200 12 L200 205" w={2} />
        {sleeveCuffs(p)}
        {hemRib(p)}
      </>
    ) : (
      <>
        <path d="M163 82 Q148 18 200 16 Q252 18 237 82 Z" fill={p.fill} stroke={p.edge} strokeWidth="2" />
        <Body p={p} d={LONG_SLEEVE} />
        <path
          d="M163 80 Q150 22 200 20 Q250 22 237 80 Q200 112 163 80 Z"
          fill={p.fill}
          stroke={p.detail}
          strokeWidth="2"
        />
        <path d="M178 80 Q176 42 200 40 Q224 42 222 80 Q200 98 178 80 Z" fill="rgba(0,0,0,0.25)" />
        <Line p={p} d="M188 100 L185 168" />
        <Line p={p} d="M212 100 L215 168" />
        <Line p={p} d="M146 316 L254 316 L274 404 L126 404 Z" />
        {sleeveCuffs(p)}
        {hemRib(p)}
      </>
    ),

  quarterzip: (p) => (
    <>
      <Body p={p} d={LONG_SLEEVE} />
      <path d="M166 60 L234 60 L238 86 L162 86 Z" fill={p.fill} stroke={p.detail} strokeWidth="2" />
      {!p.back && (
        <>
          <Line p={p} d="M200 62 L200 196" w={3} />
          <rect x="195" y="88" width="10" height="20" rx="2" fill={p.detail} />
        </>
      )}
      {sleeveCuffs(p)}
      {hemRib(p)}
    </>
  ),

  jacket: (p) => (
    <>
      <Body
        p={p}
        d="M160 74 L110 92 L76 206 L56 400 L100 406 L120 230 L116 444 L284 444 L280 230 L300 406 L344 400 L324 206 L290 92 L240 74 Q200 90 160 74 Z"
      />
      <path d="M156 72 L146 110 L200 104 L254 110 L244 72 Q200 86 156 72 Z" fill={p.fill} stroke={p.detail} strokeWidth="2" />
      {!p.back && (
        <>
          <Line p={p} d="M200 104 L200 444" />
          {[150, 210, 270, 330, 390].map((cy) => (
            <circle key={cy} cx="212" cy={cy} r="4" fill={p.detail} />
          ))}
          <Line p={p} d="M138 330 L170 316" w={3} />
          <Line p={p} d="M262 316 L294 330" w={3} />
        </>
      )}
      <Line p={p} d="M116 428 L284 428" dash="6 6" w={2} />
      {sleeveCuffs(p)}
    </>
  ),

  gilet: (p) => (
    <>
      <Body
        p={p}
        d="M164 76 L120 92 L108 172 Q132 204 130 236 L126 442 Q200 452 274 442 L270 236 Q268 204 292 172 L280 92 L236 76 Q200 92 164 76 Z"
      />
      <path d="M162 60 L238 60 L240 88 L160 88 Z" fill={p.fill} stroke={p.detail} strokeWidth="2" />
      {[150, 200, 250, 300, 350, 400].map((y) => (
        <Line key={y} p={p} d={`M128 ${y} L272 ${y}`} w={1.8} />
      ))}
      {!p.back && <Line p={p} d="M200 62 L200 446" w={3} />}
    </>
  ),

  pants: (p) => (
    <>
      <Body p={p} d="M124 58 L276 58 L296 452 L214 452 L200 178 L186 452 L104 452 Z" />
      <Line p={p} d="M124 84 L276 84" w={3} />
      {!p.back ? (
        <>
          <Line p={p} d="M192 84 L188 118" w={2} />
          <Line p={p} d="M208 84 L212 118" w={2} />
          <Line p={p} d="M130 96 Q146 128 136 160" w={2} />
          <Line p={p} d="M270 96 Q254 128 264 160" w={2} />
        </>
      ) : (
        <>
          <rect x="140" y="112" width="44" height="40" fill="none" stroke={p.detail} strokeWidth="2" />
          <rect x="216" y="112" width="44" height="40" fill="none" stroke={p.detail} strokeWidth="2" />
        </>
      )}
      <Line p={p} d="M108 430 L184 430" w={2} />
      <Line p={p} d="M216 430 L292 430" w={2} />
    </>
  ),

  shorts: (p) => (
    <>
      <Body p={p} d="M112 128 L288 128 L314 336 L216 348 L200 230 L184 348 L86 336 Z" />
      <Line p={p} d="M112 156 L288 156" w={3} />
      {!p.back && (
        <>
          <Line p={p} d="M192 156 L188 196" w={2} />
          <Line p={p} d="M208 156 L212 196" w={2} />
          <Line p={p} d="M118 168 Q136 200 124 236" w={2} />
          <Line p={p} d="M282 168 Q264 200 276 236" w={2} />
        </>
      )}
    </>
  ),

  skirt: (p) => (
    <>
      <path d="M142 108 L258 108 L258 138 L142 138 Z" fill={p.fill} stroke={p.edge} strokeWidth="2" />
      <Body p={p} d="M142 138 L258 138 L326 388 L74 388 Z" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const top = 152 + i * 16;
        const bottom = 98 + i * 34;
        return <Line key={i} p={p} d={`M${top} 140 L${bottom} 386`} w={1.6} />;
      })}
    </>
  ),

  cap: (p) => (
    <>
      <Body p={p} d="M112 286 Q108 160 200 152 Q292 160 288 286 Z" />
      <Body p={p} d="M100 282 Q200 262 300 282 Q342 316 200 336 Q58 316 100 282 Z" />
      <circle cx="200" cy="156" r="7" fill={p.fill} stroke={p.detail} strokeWidth="2" />
      <Line p={p} d="M200 160 Q170 210 152 282" w={2} />
      <Line p={p} d="M200 160 Q230 210 248 282" w={2} />
      <Line p={p} d="M112 296 Q200 316 288 296" w={1.6} dash="5 5" />
      <circle cx="160" cy="214" r="3" fill={p.detail} />
      <circle cx="240" cy="214" r="3" fill={p.detail} />
    </>
  ),

  bucket: (p) => (
    <>
      <Body p={p} d="M136 196 Q140 146 200 146 Q260 146 264 196 L270 272 L130 272 Z" />
      <Body p={p} d="M130 264 L270 264 L334 334 Q200 356 66 334 Z" />
      <Line p={p} d="M100 316 Q200 334 300 316" w={1.6} dash="5 5" />
      <Line p={p} d="M84 328 Q200 346 316 328" w={1.6} dash="5 5" />
      <Line p={p} d="M134 228 L266 228" w={1.6} dash="5 5" />
    </>
  ),

  socks: (p) => (
    <>
      <g transform="translate(-46 18)" opacity="0.85">
        <Body
          p={p}
          d="M172 60 L240 60 L240 296 Q240 328 262 346 L320 378 Q346 398 332 428 Q316 456 280 446 L192 402 Q166 386 170 350 Z"
        />
      </g>
      <Body
        p={p}
        d="M172 60 L240 60 L240 296 Q240 328 262 346 L320 378 Q346 398 332 428 Q316 456 280 446 L192 402 Q166 386 170 350 Z"
      />
      {[184, 196, 208, 220, 232].map((x) => (
        <Line key={x} p={p} d={`M${x} 64 L${x} 132`} w={1.6} />
      ))}
      <Line p={p} d="M286 372 Q306 394 296 442" w={2} />
    </>
  ),

  tote: (p) => (
    <>
      <path
        d="M146 186 Q146 76 200 76 Q254 76 254 186"
        fill="none"
        stroke={p.fill}
        strokeWidth="16"
      />
      <path
        d="M146 186 Q146 76 200 76 Q254 76 254 186"
        fill="none"
        stroke={p.edge}
        strokeWidth="2"
      />
      <Body p={p} d="M98 180 L302 180 L314 444 L86 444 Z" />
      <Line p={p} d="M100 204 L300 204" w={1.6} dash="5 5" />
    </>
  ),

  belt: (p) => (
    <>
      <path
        d="M70 300 Q60 200 200 196 Q340 200 330 300 Q320 380 200 384 Q80 380 70 300 Z"
        fill="none"
        stroke={p.fill}
        strokeWidth="34"
      />
      <path
        d="M70 300 Q60 200 200 196 Q340 200 330 300 Q320 380 200 384 Q80 380 70 300 Z"
        fill="none"
        stroke={p.edge}
        strokeWidth="1.5"
      />
      <rect x="176" y="356" width="48" height="58" rx="4" fill="none" stroke="#9A9A9A" strokeWidth="7" />
      <Line p={p} d="M200 360 L200 410" w={4} />
      {[110, 130, 150].map((x) => (
        <circle key={x} cx={x} cy={366 - (150 - x) * 0.3} r="3.5" fill={p.detail} />
      ))}
    </>
  ),
};

/** True for a colour dark enough that its trims should be drawn light. */
function isDark(color: string): boolean {
  const m = /^#([0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return false;
  const int = parseInt(m[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 110;
}
