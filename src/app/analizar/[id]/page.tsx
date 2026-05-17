/**
 * `/analizar/[id]` — Result placeholder, wrapped by the global AppShell so the
 * sidebar (Inicio / Analizar / Historial / Chat) stays visible after the
 * redirect from the upload flow.
 *
 * The full result UI lands in US-08/09/14/19 (E02/E03) — this is just a
 * landing target so the redirect doesn't 404.
 */
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { getHistorialCount } from '@/lib/products/count';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Resultado · NutriLens',
};

export const dynamic = 'force-dynamic';

export default async function AnalizarResultPage({ params }: PageProps) {
  const { id } = await params;
  const historialCount = await getHistorialCount();
  return (
    <AppShell active="analizar" historialCount={historialCount}>
      <div className="flex flex-col gap-6 px-4 py-2 md:px-6 md:py-6">
        <header className="flex flex-col gap-1">
          <h1
            className="text-[26px] font-bold leading-tight text-[var(--color-text)]"
            data-testid="result-heading"
          >
            Análisis completado
          </h1>
          <p className="text-[13px] text-[var(--color-text-muted)]">
            La pantalla detallada llega en las siguientes stories del MVP.
          </p>
        </header>

        <Card padding="md" rounded="md">
          <p className="text-sm text-[var(--color-text-muted)]">
            ID del producto: <code className="font-mono text-[var(--color-text)]">{id}</code>
          </p>
        </Card>

        <footer className="mt-auto pt-4">
          <Disclaimer />
        </footer>
      </div>
    </AppShell>
  );
}
