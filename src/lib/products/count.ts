import { cache } from 'react';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * Returns the total number of persisted products. Used by the AppShell sidebar
 * badge and the home page "Tu historial" CTA. Wrapped in `React.cache` so a
 * single render tree shares one DB roundtrip even when called from multiple
 * Server Components (e.g. the page + the shell layout).
 *
 * Resolves to 0 when the DB is unreachable so the UI stays renderable in dev
 * without docker. The failure is logged but never thrown.
 */
export const getHistorialCount = cache(async (): Promise<number> => {
  try {
    return await prisma.product.count();
  } catch (err) {
    logger.warn('historial.count_failed', {
      message: err instanceof Error ? err.message : String(err),
    });
    return 0;
  }
});
