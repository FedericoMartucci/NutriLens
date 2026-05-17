'use client';

/**
 * Route-level error boundary for the whole app (Next.js convention).
 * Triggered when a Server Component or Client Component throws during render.
 *
 * The shell-less rendering is intentional: if the AppShell itself broke we
 * still want the recovery affordance to show without depending on the sidebar.
 */
import { useEffect } from 'react';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { ErrorState } from '@/components/ui/ErrorState';
import { logger } from '@/lib/logger';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('app.error_boundary', {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-stretch justify-center gap-6 px-4 py-10">
      <ErrorState
        icon="!"
        title="Algo salió mal"
        description="Tuvimos un problema cargando la pantalla. Probá de nuevo en unos segundos."
        primaryAction={{ label: 'Reintentar', onClick: reset }}
        secondaryAction={{
          label: 'Volver al inicio',
          onClick: () => {
            window.location.href = '/';
          },
        }}
      />
      <Disclaimer />
    </main>
  );
}
