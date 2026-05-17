import { describe, expect, it } from 'vitest';
import { formatFileSize } from '@/lib/format-file-size';

describe('formatFileSize', () => {
  it('formats sub-KB sizes in bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1023)).toBe('1023 B');
  });

  it('switches to KB at >= 1024 bytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(2 * 1024)).toBe('2.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('switches to MB at >= 1 MiB', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatFileSize(2.4 * 1024 * 1024)).toBe('2.4 MB');
  });

  it('rounds to one decimal place', () => {
    expect(formatFileSize(1500)).toBe('1.5 KB');
    expect(formatFileSize(1789)).toBe('1.7 KB');
  });
});
