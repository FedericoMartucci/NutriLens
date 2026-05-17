/**
 * "Tu historial" card — rendered only when the user already has products
 * analyzed (US-07 escenario 2). Links to `/historial`.
 */
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export interface HistoryCardProps {
  count: number;
}

export function HistoryCard({ count }: HistoryCardProps) {
  const subtitle = formatSubtitle(count);

  return (
    <Card
      padding="md"
      className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon name="history" className="h-5 w-5" />
        </span>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[14px] font-bold text-[var(--color-text)]">Tu historial</h3>
          <p className="text-[12px] text-[var(--color-text-muted)]">{subtitle}</p>
        </div>
      </div>
      <Link
        href="/historial"
        data-testid="history-cta"
        className="inline-flex items-center justify-center gap-1.5 self-start rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-[13px] font-bold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 md:self-auto"
      >
        Ver historial
        <Icon name="arrow-right" className="h-4 w-4" />
      </Link>
    </Card>
  );
}

function formatSubtitle(count: number): string {
  if (count === 1) return 'Ya analizaste 1 producto.';
  return `Ya analizaste ${count} productos.`;
}
