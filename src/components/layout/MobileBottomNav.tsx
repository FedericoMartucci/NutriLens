/**
 * Mobile bottom navigation (<md). Pencil ref: `Z2rHzQ` Component/Mobile/BottomNav.
 * Fixed at the bottom; items mirror NAV_ITEMS so adding a route updates here too.
 */
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { NAV_ITEMS, type ActiveNavItem, type NavItem } from './nav-config';

export interface MobileBottomNavProps {
  active?: ActiveNavItem;
  historialCount?: number;
}

export function MobileBottomNav({ active, historialCount }: MobileBottomNavProps) {
  return (
    <nav
      data-testid="app-bottom-nav"
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-[var(--color-ink-100)] bg-white px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3 md:hidden"
    >
      {NAV_ITEMS.map((item) => (
        <BottomNavItem
          key={item.id}
          item={item}
          active={active === item.id}
          badge={item.id === 'historial' ? historialCount : undefined}
        />
      ))}
    </nav>
  );
}

interface BottomNavItemProps {
  item: NavItem;
  active: boolean;
  badge: number | undefined;
}

function BottomNavItem({ item, active, badge }: BottomNavItemProps) {
  return (
    <Link
      href={item.href}
      data-testid={`bottom-nav-${item.id}`}
      aria-current={active ? 'page' : undefined}
      className="flex flex-1 flex-col items-center gap-1 px-2 py-1.5"
    >
      {/* Wrapper with `relative` so the badge anchors to the icon, not the whole link. */}
      <span
        className={cn(
          'relative flex h-6 w-6 items-center justify-center',
          active ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink-400)]',
        )}
      >
        <Icon name={item.icon} className="h-6 w-6" />
        {typeof badge === 'number' && badge > 0 && (
          <span className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[9px] font-bold leading-none text-white">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </span>
      <span
        className={cn(
          'text-[10px]',
          active
            ? 'font-bold text-[var(--color-primary)]'
            : 'font-medium text-[var(--color-text-muted)]',
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}
