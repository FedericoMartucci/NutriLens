/**
 * <Toast> — presentational toast notification.
 * Pencil refs: `GXqpU` Success / `RpXBZ` Error / `gwHlb` Warning / `oyVcr` Info.
 *
 * Variant styling is driven by `data-variant` + CSS variables (see globals.css
 * `.toast-variant-*` selectors). One markup, all variants — easier to test
 * and theme.
 */
import { Icon, type IconName } from './Icon';
import { cn } from '@/lib/cn';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  variant: ToastVariant;
  title: string;
  description?: string;
  onDismiss?: () => void;
}

const VARIANT_ICON: Record<ToastVariant, IconName> = {
  success: 'check',
  error: 'circle-alert',
  warning: 'triangle-alert',
  info: 'info',
};

const VARIANT_CLASSNAME: Record<ToastVariant, string> = {
  success: 'toast-variant-success',
  error: 'toast-variant-error',
  warning: 'toast-variant-warning',
  info: 'toast-variant-info',
};

export function Toast({ variant, title, description, onDismiss }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      data-testid={`toast-${variant}`}
      data-variant={variant}
      className={cn(
        // `w-full` keeps every toast the same width regardless of content —
        // the Toaster container constrains the actual max (max-w-sm on desktop,
        // edge-to-edge on mobile with inset-x-4).
        'flex w-full items-center gap-3 rounded-2xl border bg-white p-4',
        'border-[var(--toast-border)] shadow-[0_8px_24px_0_var(--toast-shadow)]',
        VARIANT_CLASSNAME[variant],
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--toast-bubble-bg)] text-[var(--toast-accent)]"
      >
        <Icon
          name={VARIANT_ICON[variant]}
          strokeWidth={variant === 'success' ? 2.5 : 2}
          className="h-[18px] w-[18px]"
        />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-[14px] font-bold text-[var(--color-text)]">{title}</p>
        {description && (
          <p className="truncate text-[12px] text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar notificación"
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <Icon name="close" strokeWidth={2} className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
