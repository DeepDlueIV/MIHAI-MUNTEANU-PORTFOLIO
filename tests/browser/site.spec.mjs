import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('qa', { recursive: true });
function difference(a, b) {
  const first = PNG.sync.read(a), second = PNG.sync.read(b);
  let sum = 0;
  for (let i = 0; i < first.data.length; i += 4)
    sum += Math.abs(first.data[i] - second.data[i]) + Math.abs(first.data[i + 1] - second.data[i + 1]) + Math.abs(first.data[i + 2] - second.data[i + 2]);
  return sum / (first.width * first.height * 3);
}
async function waitForScene(page) {
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-renderer', 'webgl', { timeout: 15000 });
  await expect(page.locator('.hero-canvas')).toBeVisible();
}

test('actual GPU pixels move, geometry is visible, assets and runtime stay clean', async ({ page }) => {
  const errors = [], failedAssets = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('response', response => { if (response.status() >= 400) failedAssets.push(`${response.status()} ${response.url()}`); });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/'); await waitForScene(page);
  await page.waitForTimeout(650);
  const first = await page.locator('.hero-canvas').screenshot({ path: 'qa/scene-a.png' });
  await page.waitForTimeout(2300);
  const second = await page.locator('.hero-canvas').screenshot({ path: 'qa/scene-b.png' });
  expect(difference(first, second)).toBeGreaterThan(.12);
  const pixels = PNG.sync.read(first);
  let bright = 0;
  for (let i = 0; i < pixels.data.length; i += 4) if (pixels.data[i] > 100 && pixels.data[i + 1] > 100) bright++;
  expect(bright / (pixels.width * pixels.height)).toBeGreaterThan(.03);
  await page.screenshot({ path: 'qa/hero-desktop.png' });
  await page.screenshot({ path: 'qa/desktop.png', fullPage: true });
  expect(errors).toEqual([]); expect(failedAssets).toEqual([]);
  await writeFile('qa/gpu-evidence.json', JSON.stringify({ meanPixelDifference: difference(first, second), brightGeometryPixels: bright, errors, failedAssets }, null, 2));
});

test('system reduce, persisted Full override, smooth anchors and Off all work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  await page.getByLabel('Motion mode').selectOption('full');
  await page.reload(); await waitForScene(page);
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  const a = await page.locator('.hero-canvas').screenshot({ path: 'qa/override-a.png' });
  await page.waitForTimeout(1450);
  const b = await page.locator('.hero-canvas').screenshot({ path: 'qa/override-b.png' });
  expect(difference(a, b)).toBeGreaterThan(.12);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('smooth');
  await page.getByLabel('Motion mode').selectOption('off');
  await page.waitForTimeout(550);
  const c = await page.locator('.hero-canvas').screenshot();
  await page.waitForTimeout(1000);
  const d = await page.locator('.hero-canvas').screenshot();
  expect(difference(c, d)).toBe(0);
  await page.locator('nav a[href="#work"]').click();
  await expect(page).toHaveURL(/#work$/);
  const top = await page.locator('#work').evaluate(element => element.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(65); expect(top).toBeLessThan(160);
});

test('showcase auto plays, respects manual selection, and has stable keyboard controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#work');
  await page.mouse.move(5, 5);
  await expect(page.locator('#study-1')).toBeVisible({ timeout: 9500 });
  const tabs = page.getByRole('tab');
  const before = await tabs.nth(0).boundingBox();
  await tabs.nth(1).click();
  await tabs.nth(1).press('ArrowRight');
  await expect(page.locator('#study-2')).toBeVisible();
  await page.waitForTimeout(6500);
  await expect(page.locator('#study-2')).toBeVisible();
  const after = await tabs.nth(0).boundingBox();
  expect(Math.abs(before.y - after.y)).toBeLessThan(2);
  expect(Math.abs(before.height - after.height)).toBeLessThan(2);
});

test('responsive composition, real mobile menu, and readable enlarged layout', async ({ page }) => {
  for (const width of [360, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/');
    await page.getByLabel('Motion mode').selectOption('off');
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.locator('img').count()).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    if (width < 701) {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await expect(page.locator('nav')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('nav')).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
    }
    await page.screenshot({ path: `qa/width-${width}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 720, height: 500 });
  // CSS zoom is a layout stress test, not a claim of testing browser chrome zoom or a physical device.
  await page.evaluate(() => document.body.style.zoom = '2');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.screenshot({ path: 'qa/zoom-layout.png', fullPage: true });
});

test('no JavaScript keeps navigation, all concept projects and the same visual', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.locator('.study:visible')).toHaveCount(3);
  await expect(page.locator('nav a:visible')).toHaveCount(4);
  await expect(page.locator('[data-model]')).toBeAttached();
  expect(await page.locator('[data-model]').evaluate(element => getComputedStyle(element).visibility)).toBe('visible');
  await page.screenshot({ path: 'qa/no-javascript.png', fullPage: true });
  await context.close();
});

test('unavailable WebGL and storage retain usable 3D, navigation and manual controls', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) { return type.includes('webgl') ? null : original.call(this, type, ...args); };
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage denied'); } });
  });
  await page.goto('/');
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-renderer', 'css3d');
  await page.getByLabel('Motion mode').selectOption('full');
  const first = await page.locator('[data-scene]').screenshot({ path: 'qa/fallback-a.png' });
  await page.waitForTimeout(1400);
  const second = await page.locator('[data-scene]').screenshot({ path: 'qa/fallback-b.png' });
  expect(difference(first, second)).toBeGreaterThan(.1);
  await page.getByLabel('Motion mode').selectOption('off');
  await page.locator('nav a[href="#work"]').click();
  await page.getByRole('tab').nth(1).click();
  await expect(page.locator('#study-1')).toBeVisible();
});

test('contact copies the real address without inventing a mail form', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#contact');
  await page.locator('[data-copy]').click();
  await expect(page.locator('.copy-status')).toHaveText('Copied to clipboard.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('47 rue Vivienne, 75002 Paris, France');
  await expect(page.locator('form')).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
});

test('Firefox style controls, visible progress, and Play resume under a mouse pointer', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#work');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  const control = page.getByLabel('Motion mode');
  await expect(control).toHaveValue('full');
  expect(await control.evaluate(e => getComputedStyle(e).colorScheme)).toBe('dark');
  await page.locator('[data-showcase]').hover();
  const progress = page.locator('.project-tabs button[aria-selected=true] .tab-progress');
  const before = parseFloat(await progress.evaluate(e => e.style.width));
  await page.waitForTimeout(1200);
  const after = parseFloat(await progress.evaluate(e => e.style.width));
  expect(after).toBeGreaterThan(before);
  const play = page.locator('.autoplay-button');
  await play.click(); await expect(play).toHaveAttribute('aria-pressed', 'true');
  await play.click(); await expect(play).toHaveAttribute('aria-pressed', 'false');
  const resumed = parseFloat(await progress.evaluate(e => e.style.width));
  await page.waitForTimeout(1100);
  expect(parseFloat(await progress.evaluate(e => e.style.width))).toBeGreaterThan(resumed);
});
