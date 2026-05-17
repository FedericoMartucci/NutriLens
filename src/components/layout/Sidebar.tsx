/**
 * Desktop sticky sidebar. Pencil ref: `iLsWo` Component/Desktop/Sidebar
 * (240px white card, padding 20, cornerRadius 20, ink-200 border).
 */
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { NAV_ITEMS, type ActiveNavItem, type NavItem } from './nav-config';

export interface SidebarProps {
  active?: ActiveNavItem;
  historialCount?: number;
}

export function Sidebar({ active, historialCount }: SidebarProps) {
  return (
    <aside
      data-testid="app-sidebar"
      className="sticky top-4 hidden h-[calc(100vh-2rem)] w-60 flex-shrink-0 flex-col gap-1.5 rounded-3xl border border-[var(--color-border)] bg-white p-5 md:flex"
    >
      <BrandBlock />
      <nav className="flex flex-col gap-1.5 pt-2" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => (
          <SidebarNavLink
            key={item.id}
            item={item}
            active={active === item.id}
            badge={item.id === 'historial' ? historialCount : undefined}
          />
        ))}
      </nav>
      <div className="mt-auto">
        <TeamCard />
      </div>
    </aside>
  );
}

function BrandBlock() {
  return (
    <div className="flex items-center gap-3 pb-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
        <Icon name="scan-eye" strokeWidth={2} />
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-base font-bold text-[var(--color-text)]">NutriLens</span>
        <span className="text-[10px] text-[var(--color-text-muted)]">MVP · v0.1</span>
      </div>
    </div>
  );
}

interface SidebarNavLinkProps {
  item: NavItem;
  active: boolean;
  badge: number | undefined;
}

function SidebarNavLink({ item, active, badge }: SidebarNavLinkProps) {
  return (
    <Link
      href={item.href}
      data-testid={`nav-${item.id}`}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition-colors',
        active
          ? 'bg-[var(--color-primary-soft)] font-bold text-[var(--color-primary-strong)]'
          : 'text-[var(--color-text)]/80 hover:bg-[var(--color-surface)]',
      )}
    >
      <Icon name={item.icon} strokeWidth={active ? 2.25 : 2} className="h-[18px] w-[18px]" />
      <span className="flex-1">{item.label}</span>
      {typeof badge === 'number' && badge > 0 && (
        <span className="rounded-full bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-text-muted)]">
          {badge}
        </span>
      )}
    </Link>
  );
}

function TeamCard() {
  return (
    <div className="flex items-center gap-2.5 rounded-[10px] bg-[var(--color-bg)] p-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-xs font-bold text-[var(--color-primary-strong)]">
        F
      </span>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-[11px] font-bold text-[var(--color-text)]">
          Equipo NutriLens
        </span>
        <span className="truncate text-[10px] text-[var(--color-text-muted)]">4 · UNLaM</span>
      </div>
    </div>
  );
}
