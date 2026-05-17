import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardRounded = 'md' | 'lg' | 'xl';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Inner padding. Defaults to `md` (16px). */
  padding?: CardPadding;
  /**
   * Border radius. `md`=14px (Pencil card pattern, default), `lg`=16px,
   * `xl`=20px (Pencil panel pattern). Use this instead of `!rounded-[...]`
   * overrides.
   */
  rounded?: CardRounded;
}

const PADDING_CLASS: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const ROUNDED_CLASS: Record<CardRounded, string> = {
  md: 'rounded-[14px]',
  lg: 'rounded-lg',
  xl: 'rounded-[20px]',
};

export function Card({ children, padding = 'md', rounded = 'md', className, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        'border border-[var(--color-border)] bg-white shadow-sm',
        ROUNDED_CLASS[rounded],
        PADDING_CLASS[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
