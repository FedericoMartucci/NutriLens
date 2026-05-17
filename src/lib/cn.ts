/**
 * Tiny className combiner — drops falsy values, joins the rest with a space.
 *
 * Same shape as `clsx` for the common case, but with zero dependencies. If we
 * ever need Tailwind-class conflict resolution (`p-4` + `!p-6`) reach for
 * `tailwind-merge` then; for now this is enough.
 */
export function cn(...inputs: ReadonlyArray<string | number | false | null | undefined>): string {
  return inputs.filter(Boolean).join(' ');
}
