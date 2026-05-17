import { describe, expect, it } from 'vitest';
import { NAV_ITEMS } from '@/components/layout/nav-config';

describe('NAV_ITEMS — single source of truth for app navigation', () => {
  it('has exactly 4 items (Inicio / Analizar / Historial / Chat)', () => {
    expect(NAV_ITEMS).toHaveLength(4);
    expect(NAV_ITEMS.map((i) => i.id)).toEqual(['inicio', 'analizar', 'historial', 'chat']);
  });

  it('every item maps to a unique href', () => {
    const hrefs = NAV_ITEMS.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('every item has a label and an icon name', () => {
    for (const item of NAV_ITEMS) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.icon.length).toBeGreaterThan(0);
    }
  });

  it('Inicio points to /', () => {
    expect(NAV_ITEMS.find((i) => i.id === 'inicio')?.href).toBe('/');
  });

  it('Analizar points to /analizar', () => {
    expect(NAV_ITEMS.find((i) => i.id === 'analizar')?.href).toBe('/analizar');
  });
});
