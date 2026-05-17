/**
 * Home hero section (US-07).
 *
 * Pencil reference: M01-Onboarding `obHero` (brand-600 fill, padding 28,
 * gap 24, lens illustration). Sizing aligned with `g4EjCQ`/M01 typography
 * — h1 fontSize 26-30, NOT a 48px display heading.
 */
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export function Hero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative overflow-hidden rounded-[24px] bg-[var(--color-primary)] text-white"
    >
      <div className="grid grid-cols-1 gap-6 px-6 py-8 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-4 md:px-10 md:py-10">
        <div className="flex flex-col gap-4">
          <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-white/80">
            <Icon name="sparkles" className="h-3 w-3" />
            NutriLens
          </p>

          <h1 id="home-hero-title" className="text-[26px] font-bold leading-[1.15] md:text-[32px]">
            Entendé qué comés,
            <br />
            en segundos.
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-white/90 md:text-[15px]">
            Sacale una foto a la etiqueta y NutriLens te muestra alérgenos, sellos y riesgo en un
            lenguaje claro.
          </p>

          <div className="pt-1">
            <Link
              href="/analizar"
              data-testid="hero-cta"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-bold text-[var(--color-primary-strong)] shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] transition-colors hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)]"
            >
              <Icon name="camera" strokeWidth={2.25} className="h-4 w-4" />
              Analizar producto
            </Link>
          </div>
        </div>

        <DecorLens />
      </div>
    </section>
  );
}

/**
 * Contained scanner-lens illustration on the right of the hero.
 * Hidden on mobile to keep the CTA prominent above the fold.
 */
function DecorLens() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none hidden items-center justify-center md:flex"
    >
      <div className="relative h-44 w-44">
        <div className="absolute inset-0 rounded-full bg-white/10" />
        <div className="absolute inset-5 rounded-full bg-white/20" />
        <div className="absolute inset-10 flex items-center justify-center rounded-full bg-white shadow-[0_8px_24px_0_rgba(0,0,0,0.12)]">
          <Icon name="scan-eye" className="h-12 w-12 text-[var(--color-primary)]" />
        </div>
        {/* Sparkle decor — uses the design-system lime token. */}
        <span className="absolute -left-2 top-4 h-5 w-5 text-[var(--color-accent-lime)]">
          <Icon name="sparkles" className="h-5 w-5" strokeWidth={0} fill="currentColor" />
        </span>
        <span className="absolute -right-1 bottom-3 h-4 w-4 text-[var(--color-accent-lime)]">
          <Icon name="sparkles" className="h-4 w-4" strokeWidth={0} fill="currentColor" />
        </span>
      </div>
    </div>
  );
}
