import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://b5252e75-7d72-4a27-a063-837869a7ea78-00-1fypdustfwrn6.kirk.replit.dev';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});

await page.goto(`${BASE}/app`, { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(5000);

// Dismiss any onboarding dialog by pressing Escape
await page.keyboard.press('Escape');
await page.waitForTimeout(1000);
await page.keyboard.press('Escape');
await page.waitForTimeout(1000);

// Click Plan tab to trigger upgrade modal
const planTab = page.locator('[data-testid="mobile-nav-plan"]');
if (await planTab.isVisible({ timeout: 3000 }).catch(() => false)) {
  await planTab.click({ force: true });
  await page.waitForTimeout(2000);
  
  await page.screenshot({ 
    path: resolve(__dirname, 'iap-review-lifetime.png'),
    fullPage: false 
  });
  console.log('Screenshot 1: Upgrade modal saved');

  // Dismiss upgrade modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // Go to profile
  const profileTab = page.locator('[data-testid="mobile-nav-profile"]');
  await profileTab.click({ force: true });
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: resolve(__dirname, 'iap-review-subscription.png'),
    fullPage: false
  });
  console.log('Screenshot 2: Profile/free plan saved');
} else {
  console.log('Nav not visible, taking page screenshot');
  await page.screenshot({ path: resolve(__dirname, 'iap-review-debug.png'), fullPage: false });
}

await browser.close();
console.log('Done!');
