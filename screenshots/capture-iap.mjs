import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 900, height: 920 } });

await page.goto(`file://${resolve(__dirname, 'iap-review-screenshot.html')}`);
await page.waitForTimeout(1000);

// Screenshot 1: Lifetime purchase modal
const wrapper1 = (await page.$$('.screenshot-wrapper'))[0];
await wrapper1.screenshot({ path: resolve(__dirname, 'iap-review-lifetime.png') });

// Screenshot 2: Subscription / gated features
const wrapper2 = (await page.$$('.screenshot-wrapper'))[1];
await wrapper2.screenshot({ path: resolve(__dirname, 'iap-review-subscription.png') });

await browser.close();
console.log('Screenshots saved: iap-review-lifetime.png, iap-review-subscription.png');
