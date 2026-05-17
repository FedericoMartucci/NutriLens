import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/cn';

describe('cn — className combiner', () => {
  it('joins strings with a space', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('drops falsy values (null/undefined/false)', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('drops empty strings', () => {
    expect(cn('a', '', 'b')).toBe('a b');
  });

  it('returns empty string when given only falsy', () => {
    expect(cn(false, null, undefined, '')).toBe('');
  });

  it('supports conditional ternaries inline', () => {
    const active = true;
    expect(cn('base', active && 'active', !active && 'inactive')).toBe('base active');
  });

  it('accepts numbers (e.g. for arbitrary indices)', () => {
    expect(cn('p-', 4)).toBe('p- 4');
  });
});
