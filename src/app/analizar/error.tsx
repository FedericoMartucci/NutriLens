'use client';

/**
 * Route-segment error boundary for `/analizar` and `/analizar/[id]`.
 * Lets the upload flow recover without blowing up the whole page.
 */
import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { logger } from '@/lib/logger';

export default function AnalizarErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('analizar.error_boundary', {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-stretch justify-center gap-6 px-4 py-10">
      <ErrorState
        icon="!"
        title="No pudimos cargar el análisis"
        description="Algo falló al preparar la pantalla. Probá de nuevo o volvé al inicio."
        primaryAction={{ label: 'Reintentar', onClick: reset }}
        secondaryAction={{
          label: 'Volver al inicio',
          onClick: () => {
            window.location.href = '/';
          },
        }}
      />
    </main>
  );
}
