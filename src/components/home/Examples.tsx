/**
 * "Ejemplos válidos" — 3 thumbnails (US-07, spec E01 §8).
 *
 * Responsive (E06 §6.3): mobile uses horizontal scroll carousel with snap;
 * desktop renders a 3-column grid. All examples are decorative illustrations
 * (SVG), no real product imagery in the MVP.
 */
import { Card } from '@/components/ui/Card';

interface Example {
  id: 'frente' | 'ingredientes' | 'tabla';
  title: string;
  description: string;
}

const EXAMPLES: ReadonlyArray<Example> = [
  {
    id: 'frente',
    title: 'Frente del producto',
    description: 'La cara visible, con el nombre y los sellos negros.',
  },
  {
    id: 'ingredientes',
    title: 'Lista de ingredientes',
    description: 'El texto en letra chica con la receta y aditivos.',
  },
  {
    id: 'tabla',
    title: 'Tabla nutricional',
    description: 'La grilla con valores por porción y por 100 g.',
  },
];

export function Examples() {
  return (
    <section aria-labelledby="examples-title" className="flex flex-col gap-4">
      <header className="flex flex-col gap-0.5">
        <h2 id="examples-title" className="text-[18px] font-bold text-[var(--color-text)]">
          Ejemplos válidos
        </h2>
        <p className="text-[13px] text-[var(--color-text-muted)]">
          Cualquiera de estas tres tomas alcanza para arrancar.
        </p>
      </header>

      {/* Mobile: horizontal scroll snap carousel. Desktop: 3-col grid. */}
      <ul
        data-testid="examples-list"
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0"
      >
        {EXAMPLES.map((example) => (
          <li
            key={example.id}
            className="w-[80%] min-w-[260px] flex-none snap-start md:w-auto md:min-w-0"
          >
            <Card padding="sm" className="flex h-full flex-col gap-2.5">
              <div className="flex h-28 items-center justify-center rounded-[10px] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <ExampleIllustration kind={example.id} />
              </div>
              <div className="flex flex-col gap-0.5 px-1 pb-1">
                <h3 className="text-[14px] font-bold text-[var(--color-text)]">{example.title}</h3>
                <p className="text-[12px] leading-relaxed text-[var(--color-text-muted)]">
                  {example.description}
                </p>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExampleIllustration({ kind }: { kind: Example['id'] }) {
  const common = {
    'aria-hidden': true,
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'h-16 w-16',
  } as const;

  if (kind === 'frente') {
    return (
      <svg {...common}>
        <rect x="14" y="10" width="36" height="44" rx="6" />
        <path d="M22 22h20" />
        <circle cx="32" cy="36" r="6" />
        <rect x="20" y="46" width="8" height="4" rx="1" fill="currentColor" />
      </svg>
    );
  }
  if (kind === 'ingredientes') {
    return (
      <svg {...common}>
        <rect x="12" y="8" width="40" height="48" rx="4" />
        <path d="M20 20h24" />
        <path d="M20 28h24" />
        <path d="M20 36h18" />
        <path d="M20 44h22" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="10" y="10" width="44" height="44" rx="4" />
      <path d="M10 22h44" />
      <path d="M10 34h44" />
      <path d="M10 46h44" />
      <path d="M32 10v44" />
    </svg>
  );
}
