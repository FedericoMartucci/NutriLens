/**
 * Mobile brand strip shown above the page content (<768px).
 * Sidebar is hidden on mobile; this gives users the brand anchor.
 */
import { Icon } from '@/components/ui/Icon';

export function MobileTopBar() {
  return (
    <div className="flex items-center gap-3 px-4 pt-2 md:hidden">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
        <Icon name="scan-eye" strokeWidth={2} />
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-bold text-[var(--color-text)]">NutriLens</span>
        <span className="text-[10px] text-[var(--color-text-muted)]">MVP · v0.1</span>
      </div>
    </div>
  );
}
