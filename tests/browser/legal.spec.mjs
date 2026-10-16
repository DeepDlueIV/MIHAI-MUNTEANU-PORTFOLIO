import { test, expect, chromium, firefox } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('qa', { recursive: true });

for (const [browserName, browserType] of [['chromium', chromium], ['firefox', firefox]]) {
 test(`Contact and legal pages / ${browserName}: static links, identity and responsive layout`, async () => {
  // Worker-scoped browserName cannot be overridden inside describe. Launch each
  // target explicitly so this focused smoke does not duplicate the WebGL suite.
  const browser = await browserType.launch();
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: 'http://127.0.0.1:4321', viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  try {
   const errors = [], badResponses = [];
   page.on('pageerror', error => errors.push(String(error)));
   page.on('response', response => { if (response.status() >= 400) badResponses.push(response.url()); });
   await page.goto('/');
   await page.locator('.footer-links a[href="/privacy/"]').click();
   await expect(page).toHaveURL(/\/privacy\/$/);
   for (const [path, title] of [['/privacy/', 'Privacy Policy'], ['/terms-of-service/', 'Terms of Service']]) {
    const response = await page.goto(path);
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle(`${title} — Mihai Munteanu`);
    await expect(page.locator('h1')).toHaveText(title);
    await expect(page.locator('.legal-article')).toContainText('47 rue Vivienne, 75002 Paris, France');
    await expect(page.locator('.legal-article')).toContainText('mihai.muntenau@inbox.eu');
    await expect(page.locator('canvas, form, [data-copy], a[href*="github.com"]')).toHaveCount(0);
    await expect(page.locator('.legal-toc a').first()).toBeVisible();
    await page.locator('.legal-toc li a').nth(1).click();
    const targetId = new URL(page.url()).hash.slice(1);
    const targetTop = await page.locator(`#${targetId}`).evaluate(el => el.getBoundingClientRect().top);
    expect(targetTop).toBeGreaterThanOrEqual(65);
    for (const width of [1440, 768, 360]) {
     await page.setViewportSize({ width, height: 950 });
     await page.goto(path);
     expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
     expect(await page.locator('.legal-prose').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
     await page.screenshot({ path: `qa/${browserName}-${path.includes('privacy') ? 'privacy' : 'terms'}-${width}.png` });
    }
    await page.locator('.legal-header-inner .brand').click();
    await expect(page).toHaveURL('http://127.0.0.1:4321/');
   }
   await page.setViewportSize({ width: 390, height: 900 });
   await page.goto('/#contact');
   await expect(page.locator('.contact-email-link')).toHaveAttribute('href', 'mailto:mihai.muntenau%40inbox.eu');
   await expect(page.locator('.contact-email-link')).toBeVisible();
   await expect(page.locator('.footer-links a')).toHaveCount(2);
   expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
   await page.locator('#contact').screenshot({ path: `qa/${browserName}-contact-mobile.png` });
   expect(errors).toEqual([]); expect(badResponses).toEqual([]);
  } catch (error) {
   await page.screenshot({ path: `qa/${browserName}-legal-failure.png`, fullPage: true }).catch(() => {});
   throw error;
  } finally {
   await context.close();
   await browser.close();
  }
 });
}
