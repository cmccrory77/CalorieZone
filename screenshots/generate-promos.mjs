import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const slides = [
  {
    bg: 'bg-1',
    headline: 'Track Calories &<br>Macros Easily',
    subtext: 'Log meals, scan barcodes, and hit your daily goals',
    screenshot: path.resolve(__dirname, 'daily-tracker.png'),
    output: 'promo-1-tracker.png'
  },
  {
    bg: 'bg-2',
    headline: 'Meal Plans Tailored<br>to Your Calorie Target',
    subtext: 'Personalized weekly plans built around your goals',
    screenshot: path.resolve(__dirname, 'meal-planner.png'),
    output: 'promo-2-planner.png'
  },
  {
    bg: 'bg-3',
    headline: 'Smart Recipes &<br>Grocery Lists in Seconds',
    subtext: 'AI-powered recipes matched to your nutrition needs',
    screenshot: path.resolve(__dirname, 'recipes.png'),
    output: 'promo-3-recipes.png'
  }
];

async function generate() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1290, height: 2796, deviceScaleFactor: 1 });

  const templatePath = `file://${path.resolve(__dirname, 'promo-template.html')}`;
  
  for (const slide of slides) {
    await page.goto(templatePath, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    await page.evaluate((s) => {
      document.getElementById('slide').className = `slide ${s.bg}`;
      document.getElementById('headline').innerHTML = s.headline;
      document.getElementById('subtext').textContent = s.subtext;
    }, slide);

    await page.evaluate((imgPath) => {
      return new Promise((resolve) => {
        const img = document.getElementById('screenshot');
        img.onload = resolve;
        img.onerror = resolve;
        img.src = imgPath;
      });
    }, `file://${slide.screenshot}`);

    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({
      path: path.resolve(__dirname, slide.output),
      clip: { x: 0, y: 0, width: 1290, height: 2796 }
    });
    console.log(`Generated: ${slide.output}`);
  }

  await browser.close();
  console.log('All promo screenshots generated!');
}

generate().catch(e => { console.error(e); process.exit(1); });
