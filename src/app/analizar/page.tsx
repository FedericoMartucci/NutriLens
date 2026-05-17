/**
 * `/analizar` — Upload screen wrapped by the global AppShell so the sidebar
 * stays visible (sticky) and navigation back to `/` is always one click away.
 * See `docs/specs/E01-onboarding-y-upload.md §7`.
 */
import { AppShell } from '@/components/layout/AppShell';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { UploadFlow } from '@/components/upload/UploadFlow';
import { getHistorialCount } from '@/lib/products/count';

export const metadata = {
  title: 'Analizar etiqueta · NutriLens',
};

export const dynamic = 'force-dynamic';

export default async function AnalizarPage() {
  const historialCount = await getHistorialCount();
  return (
    <AppShell active="analizar" historialCount={historialCount}>
      <div className="flex flex-col gap-6 px-4 py-2 md:px-6 md:py-6">
        <header className="hidden flex-col gap-1 md:flex">
          <p className="text-[13px] text-[var(--color-text-muted)]">Hola</p>
          <h1 className="text-[26px] font-bold leading-tight text-[var(--color-text)]">
            ¿Qué vamos a analizar hoy?
          </h1>
        </header>

        <section aria-label="Cargar etiqueta">
          <UploadFlow />
        </section>

        <footer className="mt-auto pt-4">
          <Disclaimer />
        </footer>
      </div>
    </AppShell>
  );
}
