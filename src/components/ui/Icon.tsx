/**
 * Centralised icon set. Hand-rolled lucide path data so we don't ship the
 * full `lucide-react` package — every icon used in the app passes through
 * this file. Adding a new one means adding a single entry to `ICON_PATHS`.
 *
 * Pencil designs reference these icons by name (e.g. `iconFontName: "camera"`
 * in the Pencil `Z2rHzQ` bottom nav). Keep the keys aligned with the lucide
 * `kebab-case` slugs so the mapping stays obvious.
 */
import type { SVGProps } from 'react';
import { cn } from '@/lib/cn';

export type IconName =
  | 'home'
  | 'scan-line'
  | 'scan-eye'
  | 'history'
  | 'chat'
  | 'camera'
  | 'image'
  | 'file-text'
  | 'cloud-upload'
  | 'check'
  | 'circle-alert'
  | 'triangle-alert'
  | 'info'
  | 'close'
  | 'shield-check'
  | 'sparkles'
  | 'line-chart'
  | 'arrow-right';

interface IconPathDef {
  paths: ReadonlyArray<string>;
  circles?: ReadonlyArray<{ cx: number; cy: number; r: number }>;
  /** Lines as [x1, y1, x2, y2]. */
  lines?: ReadonlyArray<[number, number, number, number]>;
  /** Strokes that should be `fill="currentColor"` instead of `stroke=`. */
  filled?: boolean;
}

const ICON_PATHS: Record<IconName, IconPathDef> = {
  home: {
    paths: ['M3 11l9-8 9 8', 'M5 10v10h14V10', 'M10 20v-6h4v6'],
  },
  'scan-line': {
    paths: [
      'M3 7V5a2 2 0 0 1 2-2h2',
      'M17 3h2a2 2 0 0 1 2 2v2',
      'M21 17v2a2 2 0 0 1-2 2h-2',
      'M7 21H5a2 2 0 0 1-2-2v-2',
      'M7 12h10',
    ],
  },
  'scan-eye': {
    paths: [
      'M3 7V5a2 2 0 0 1 2-2h2',
      'M17 3h2a2 2 0 0 1 2 2v2',
      'M21 17v2a2 2 0 0 1-2 2h-2',
      'M7 21H5a2 2 0 0 1-2-2v-2',
    ],
    circles: [{ cx: 12, cy: 12, r: 3 }],
  },
  history: {
    paths: ['M3 12a9 9 0 1 0 3-6.7', 'M3 4v5h5', 'M12 7v5l3 2'],
  },
  chat: {
    paths: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  },
  camera: {
    paths: [
      'M14.5 4l1.5 2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l1.5-2h5z',
    ],
    circles: [{ cx: 12, cy: 13, r: 3.5 }],
  },
  image: {
    paths: ['M21 15l-5-5L5 21'],
    circles: [{ cx: 9, cy: 9, r: 2 }],
    // The rect for image is custom — keep it as a path so we don't have to extend the IconPathDef.
    // Below is the rect drawn as a path.
  },
  'file-text': {
    paths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6'],
  },
  'cloud-upload': {
    paths: ['M12 13v8', 'M9 16l3-3 3 3', 'M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25'],
  },
  check: {
    paths: ['M20 6L9 17l-5-5'],
  },
  'circle-alert': {
    paths: [],
    circles: [{ cx: 12, cy: 12, r: 10 }],
    lines: [
      [12, 8, 12, 12],
      [12, 16, 12.01, 16],
    ],
  },
  'triangle-alert': {
    paths: [
      'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
    ],
    lines: [
      [12, 9, 12, 13],
      [12, 17, 12.01, 17],
    ],
  },
  info: {
    paths: [],
    circles: [{ cx: 12, cy: 12, r: 10 }],
    lines: [
      [12, 16, 12, 12],
      [12, 8, 12.01, 8],
    ],
  },
  close: {
    paths: [],
    lines: [
      [18, 6, 6, 18],
      [6, 6, 18, 18],
    ],
  },
  'shield-check': {
    paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M9 12l2 2 4-4'],
  },
  sparkles: {
    paths: [
      'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z',
      'M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z',
      'M5 17l.5 1.5 1.5.5-1.5.5L5 21l-.5-1.5L3 19l1.5-.5z',
    ],
  },
  'line-chart': {
    paths: ['M3 3v18h18', 'M7 16l4-6 4 3 5-8'],
  },
  'arrow-right': {
    paths: ['M5 12h14', 'M13 5l7 7-7 7'],
  },
};

// `image` icon needs a rect; rather than extending IconPathDef, we paint it
// as a separate node when name === 'image'. Keeping the special-case here
// avoids polluting the shape for every other icon.
const IMAGE_RECT = { x: 3, y: 3, w: 18, h: 18, rx: 2 } as const;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox'> {
  name: IconName;
  /** Stroke width override. Defaults to 2. */
  strokeWidth?: number;
  /** Override the className with custom Tailwind sizing classes (e.g. `h-6 w-6`). */
  className?: string;
}

export function Icon({ name, strokeWidth = 2, className, ...rest }: IconProps) {
  const def = ICON_PATHS[name];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={def.filled ? 'currentColor' : 'none'}
      stroke={def.filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-5 w-5', className)}
      {...rest}
    >
      {name === 'image' && (
        <rect
          x={IMAGE_RECT.x}
          y={IMAGE_RECT.y}
          width={IMAGE_RECT.w}
          height={IMAGE_RECT.h}
          rx={IMAGE_RECT.rx}
        />
      )}
      {def.paths.map((d) => (
        <path key={d} d={d} />
      ))}
      {def.circles?.map((c) => (
        <circle key={`${c.cx}-${c.cy}-${c.r}`} cx={c.cx} cy={c.cy} r={c.r} />
      ))}
      {def.lines?.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </svg>
  );
}
