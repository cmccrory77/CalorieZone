import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://b5252e75-7d72-4a27-a063-837869a7ea78-00-1fypdustfwrn6.kirk.replit.dev';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 960 },
  deviceScaleFactor: 3,
});

await page.goto(`${BASE}/app`, { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(5000);

await page.keyboard.press('Escape');
await page.waitForTimeout(1000);
await page.keyboard.press('Escape');
await page.waitForTimeout(1000);

const planTab = page.locator('[data-testid="mobile-nav-plan"]');
if (await planTab.isVisible({ timeout: 3000 }).catch(() => false)) {
  await planTab.click({ force: true });
  await page.waitForTimeout(2000);

  const termsLink = page.locator('[data-testid="link-terms-upgrade"]');
  await termsLink.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(500);

  await page.screenshot({ 
    path: resolve(__dirname, 'iap-review-upgrade.png'),
    fullPage: false 
  });
  console.log('Screenshot saved');
} else {
  console.log('Nav not visible');
  await page.screenshot({ path: resolve(__dirname, 'iap-review-debug.png'), fullPage: false });
}

await browser.close();
console.log('Done!');
