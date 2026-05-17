/**
 * "Cómo funciona" — 3-step block (US-07, spec E01 §8).
 * Pure presentational. Renders a row on desktop, stacked column on mobile.
 */
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: IconName;
}

const STEPS: ReadonlyArray<Step> = [
  {
    number: 1,
    title: 'Sacá una foto',
    description: 'Subí una imagen del frente, ingredientes o tabla nutricional.',
    icon: 'camera',
  },
  {
    number: 2,
    title: 'Esperá unos segundos',
    description: 'NutriLens analiza la etiqueta con IA multimodal.',
    icon: 'sparkles',
  },
  {
    number: 3,
    title: 'Mirá el análisis',
    description: 'Riesgo, alérgenos y sellos explicados en lenguaje claro.',
    icon: 'line-chart',
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="flex flex-col gap-4">
      <header className="flex flex-col gap-0.5">
        <h2 id="how-it-works-title" className="text-[18px] font-bold text-[var(--color-text)]">
          Cómo funciona
        </h2>
        <p className="text-[13px] text-[var(--color-text-muted)]">
          En tres pasos sin tener que escribir nada.
        </p>
      </header>

      <ol className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.number} className="h-full">
            <Card padding="md" className="flex h-full flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Icon name={step.icon} className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--color-primary-strong)]">
                  Paso {step.number}
                </span>
              </div>
              <h3 className="text-[15px] font-bold text-[var(--color-text)]">{step.title}</h3>
              <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                {step.description}
              </p>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}
