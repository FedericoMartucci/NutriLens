/**
 * <AppShell> — desktop sidebar + mobile bottom nav wrapper.
 *
 * Pencil references:
 *   - `iLsWo` Component/Desktop/Sidebar
 *   - `Z2rHzQ` Component/Mobile/BottomNav
 *   - `h4PArD` D01 layout
 *
 * Composition lives in three sibling files (Sidebar / MobileTopBar /
 * MobileBottomNav). This file is intentionally thin — it only assembles
 * the layout grid + bottom padding for the floating mobile nav.
 */
import type { ReactNode } from 'react';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileTopBar } from './MobileTopBar';
import { Sidebar } from './Sidebar';
import type { ActiveNavItem } from './nav-config';

export type { ActiveNavItem };

export interface AppShellProps {
  active?: ActiveNavItem;
  /** Optional badge count next to the Historial nav item. */
  historialCount?: number;
  children: ReactNode;
}

export function AppShell({ active, historialCount, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-4 pb-24 md:pb-4">
      <div className="mx-auto flex max-w-[1280px] items-start gap-4">
        <Sidebar active={active} historialCount={historialCount} />
        <main className="flex w-full min-w-0 flex-col gap-6 rounded-3xl bg-[var(--color-bg)] md:gap-6 md:p-2">
          <MobileTopBar />
          {children}
        </main>
      </div>
      <MobileBottomNav active={active} historialCount={historialCount} />
    </div>
  );
}
