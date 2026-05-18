/**
 * E2E — Responsive audit (US-36, spec E06 §6).
 *
 * Smoke por viewport (mobile 375 / desktop 1280) verificando los
 * elementos clave de cada pantalla:
 *   - Navegación: bottom-bar en mobile, sidebar en desktop.
 *   - Historial: 1 col mobile, 2-3 cols desktop.
 *   - Chat: full-width mobile, max-w 720px centrado desktop.
 *   - Resultado: secciones apiladas mobile, 2 cols desktop.
 *
 * Cada test corre dos veces (uno por viewport) usando `test.describe`
 * con `test.use({ viewport })`.
 */
import { expect, test } from '@playwright/test';

const MOBILE = { width: 375, height: 812 } as const;
const DESKTOP = { width: 1280, height: 800 } as const;

// ---------------------------------------------------------------------------
// Mobile (375px)
// ---------------------------------------------------------------------------

test.describe('Responsive — mobile (375px)', () => {
  test.use({ viewport: MOBILE });

  test('home: bottom nav visible, sidebar oculto', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app-bottom-nav')).toBeVisible();
    await expect(page.getByTestId('app-sidebar')).not.toBeVisible();
  });

  test('home: hero en 1 columna (texto y demo apilados)', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByTestId('hero-cta');
    await expect(hero).toBeVisible();
    // En mobile el hero usa grid-cols-1; la CTA cae en el flujo natural.
    const box = await hero.boundingBox();
    expect(box).not.toBeNull();
    // La CTA no debería estar pegada al borde derecho (margen aire mínimo).
    expect(box!.width).toBeLessThan(MOBILE.width);
  });

  test('historial: lista en 1 columna', async ({ page }) => {
    await page.goto('/historial');
    const grid = page.getByTestId('history-grid');
    // Si la DB está vacía, el spec no se rompe — sólo verifica grid si existe.
    if (await grid.isVisible().catch(() => false)) {
      const cards = page.locator('a[data-testid^="history-item-"]');
      const count = await cards.count();
      if (count >= 2) {
        const a = await cards.first().boundingBox();
        const b = await cards.nth(1).boundingBox();
        expect(a, 'primera card medible').not.toBeNull();
        expect(b, 'segunda card medible').not.toBeNull();
        // En 1 columna, las cards comparten X y se apilan en Y.
        expect(Math.abs(a!.x - b!.x)).toBeLessThan(8);
        expect(b!.y).toBeGreaterThan(a!.y + a!.height - 8);
      }
    }
  });

  test('chat: container full-width (sin restricción de max-w en mobile)', async ({ page }) => {
    await page.goto('/chat');
    const chat = page.getByTestId('chat-container');
    await expect(chat).toBeVisible();
    const box = await chat.boundingBox();
    expect(box).not.toBeNull();
    // En mobile (<720px viewport) el container ocupa casi todo el ancho.
    expect(box!.width).toBeGreaterThan(MOBILE.width * 0.85);
  });

  test('touch targets: bottom nav items ≥ 44px alto', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('[data-testid^="bottom-nav-"]');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const box = await items.nth(i).boundingBox();
      expect(box, `nav item ${i} medible`).not.toBeNull();
      expect(box!.height, `nav item ${i} alto >= 44px`).toBeGreaterThanOrEqual(44);
    }
  });
});

// ---------------------------------------------------------------------------
// Desktop (1280px)
// ---------------------------------------------------------------------------

test.describe('Responsive — desktop (1280px)', () => {
  test.use({ viewport: DESKTOP });

  test('home: sidebar visible, bottom nav oculto', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app-sidebar')).toBeVisible();
    await expect(page.getByTestId('app-bottom-nav')).not.toBeVisible();
  });

  test('historial: grilla en 2 o 3 columnas', async ({ page }) => {
    await page.goto('/historial');
    const grid = page.getByTestId('history-grid');
    if (await grid.isVisible().catch(() => false)) {
      const cards = page.locator('a[data-testid^="history-item-"]');
      const count = await cards.count();
      if (count >= 3) {
        const a = await cards.first().boundingBox();
        const b = await cards.nth(1).boundingBox();
        const c = await cards.nth(2).boundingBox();
        expect(a).not.toBeNull();
        expect(b).not.toBeNull();
        expect(c).not.toBeNull();
        // Primera y segunda card en la misma fila (mismo Y aprox).
        expect(Math.abs(a!.y - b!.y)).toBeLessThan(8);
        // Más de 1 columna: la X de la segunda card debe estar a la derecha.
        expect(b!.x).toBeGreaterThan(a!.x + a!.width / 2);
        // 3 cards visibles en la misma fila (xl:grid-cols-3 en >=1280) o no.
        // No assertamos exactamente 3 porque depende del viewport y datos.
        expect(c).not.toBeNull();
      }
    }
  });

  test('chat: container centrado con max-width ≈ 720px', async ({ page }) => {
    await page.goto('/chat');
    const chat = page.getByTestId('chat-container');
    await expect(chat).toBeVisible();
    const box = await chat.boundingBox();
    expect(box).not.toBeNull();
    // max-w-[720px] significa ancho <= 720px en desktop.
    expect(box!.width).toBeLessThanOrEqual(720 + 1);
    // Y debería estar razonablemente centrado dentro del main.
    const main = await page.locator('main').first().boundingBox();
    expect(main).not.toBeNull();
    const chatCenter = box!.x + box!.width / 2;
    const mainCenter = main!.x + main!.width / 2;
    expect(Math.abs(chatCenter - mainCenter)).toBeLessThan(60);
  });

  test('resultado: imagen y body en 2 columnas (desktop)', async ({ page }) => {
    await page.goto('/historial');
    const grid = page.getByTestId('history-grid');
    if (await grid.isVisible().catch(() => false)) {
      const first = page.locator('a[data-testid^="history-item-"]').first();
      if (await first.isVisible().catch(() => false)) {
        await first.click();
        await page.waitForURL(/\/historial\/[^/]+$/);
        await expect(page.getByTestId('result-view')).toBeVisible();
        // En desktop el grid del result es md:grid-cols-[1fr_1.6fr] → imagen
        // y body lado a lado. Verifico que el ProductImageCard quede a la
        // izquierda del RiskBanner (mismo Y aprox).
        const image = page.locator('[data-testid="result-view"] img').first();
        const risk = page.getByTestId('risk-banner');
        if ((await image.count()) > 0 && (await risk.count()) > 0) {
          const imageBox = await image.boundingBox();
          const riskBox = await risk.boundingBox();
          if (imageBox && riskBox) {
            expect(imageBox.x).toBeLessThan(riskBox.x);
          }
        }
      }
    }
  });
});
