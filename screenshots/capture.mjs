import puppeteer from 'puppeteer';

const URL = 'https://b5252e75-7d72-4a27-a063-837869a7ea78-00-1fypdustfwrn6.kirk.replit.dev';
const IPHONE_WIDTH = 393;
const IPHONE_HEIGHT = 852;

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: IPHONE_WIDTH, height: IPHONE_HEIGHT, deviceScaleFactor: 3 });

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Dismiss Replit preview banner
  await page.evaluate(() => {
    const els = document.querySelectorAll('div, aside, section');
    for (const el of els) {
      if (el.textContent?.includes('temporary development preview')) {
        const btn = el.querySelector('button');
        if (btn) btn.click();
      }
    }
  });
  await new Promise(r => setTimeout(r, 500));

  // Screenshot 1: Daily Tracker (top of page)
  await page.screenshot({ path: 'screenshots/daily-tracker.png' });
  console.log('Captured: Daily Tracker');

  // Screenshot 2: Meal Planner - click Plan tab and scroll to the top of the card
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="mobile-nav-plan"]');
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    // Find the Meal Planner card heading  
    const allText = document.querySelectorAll('h2, h3, span, p');
    for (const el of allText) {
      if (el.textContent?.trim() === 'Meal Planner') {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy(0, -60);
        return;
      }
    }
    // Fallback: just use the scroll from the tab click
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/meal-planner.png' });
  console.log('Captured: Meal Planner');

  // Screenshot 3: Recipes - click Recipes tab and scroll to top of recommended section
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="mobile-nav-recipes"]');
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const allText = document.querySelectorAll('h2, h3, span, p');
    for (const el of allText) {
      if (el.textContent?.includes('Recommended') || el.textContent?.includes('Discover') || el.textContent?.includes('Today\'s Recipes')) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy(0, -60);
        return;
      }
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/recipes.png' });
  console.log('Captured: Recipes');

  await browser.close();
  console.log('Done!');
}

capture().catch(e => { console.error(e); process.exit(1); });
