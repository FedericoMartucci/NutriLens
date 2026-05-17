/**
 * `/` — Home (US-07, spec `docs/specs/E01-onboarding-y-upload.md §8`).
 *
 * Server Component: counts persisted products via the shared
 * `getHistorialCount()` helper so the page + the AppShell sidebar share a
 * single roundtrip (React.cache dedupes per-request).
 */
import { HomeView } from '@/components/home/HomeView';
import { getHistorialCount } from '@/lib/products/count';

// History count depends on persisted state; opting out of static rendering
// avoids serving a stale "0 productos" card on prod after a successful upload.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const historyCount = await getHistorialCount();
  return <HomeView historyCount={historyCount} />;
}
