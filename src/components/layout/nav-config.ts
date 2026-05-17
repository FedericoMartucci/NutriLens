/**
 * Single source of truth for the app navigation. Both the desktop Sidebar
 * (`iLsWo` Pencil component) and the mobile BottomNav (`Z2rHzQ`) consume
 * this list. To add a route, append a new entry here and nothing else.
 */
import type { IconName } from '@/components/ui/Icon';

export type ActiveNavItem = 'inicio' | 'analizar' | 'historial' | 'chat';

export interface NavItem {
  id: ActiveNavItem;
  href: string;
  icon: IconName;
  label: string;
}

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { id: 'inicio', href: '/', icon: 'home', label: 'Inicio' },
  { id: 'analizar', href: '/analizar', icon: 'scan-line', label: 'Analizar' },
  { id: 'historial', href: '/historial', icon: 'history', label: 'Historial' },
  { id: 'chat', href: '/chat', icon: 'chat', label: 'Chat' },
];
