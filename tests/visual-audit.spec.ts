import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'docs/screenshots');

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
});

// Helper to scroll page and trigger lazy images
async function autoScrollAndLoad(page: any) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0); // scroll back to top
          resolve();
        }
      }, 50);
    });
  });
  // Wait a short moment for images to decode
  await page.waitForTimeout(500);
}

test('desktop visual audit (1440x900)', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore backend proxy 500s (no backend running in static preview) and Google One Tap
      if (
        !text.includes('/api/') &&
        !text.includes('500') &&
        !text.includes('One Tap') &&
        !text.includes('accounts list')
      ) {
        consoleErrors.push(text);
      }
    }
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });

  // Scroll to trigger lazy loading of all images
  await autoScrollAndLoad(page);

  // Assert zero page runtime error crashes
  expect(consoleErrors).toEqual([]);

  // Check all images rendered on page have naturalWidth > 0
  const images = page.locator('img');
  const imageCount = await images.count();
  console.log(`Checking ${imageCount} images on desktop...`);

  for (let i = 0; i < imageCount; i++) {
    const img = images.nth(i);
    const isVisible = await img.isVisible();
    if (isVisible) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      const src = await img.getAttribute('src');
      expect(naturalWidth, `Desktop image "${src}" failed to load (naturalWidth === 0)`).toBeGreaterThan(0);
    }
  }

  // Full page screenshot
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'desktop-full.png'),
    fullPage: true,
  });

  // Verify key sections are visible
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('text=Selling on social was never the problem')).toBeVisible();
  await expect(page.locator('text=One assistant. The whole shop.')).toBeVisible();
  await expect(page.locator('text=Live Chats + AI summary')).toBeVisible();
  await expect(page.locator('text=Made for shops with real volume.')).toBeVisible();
  await expect(page.locator('text=I stopped losing customers at midnight.')).toBeVisible();
  await expect(page.locator('text=Your next customer is already typing.')).toBeVisible();
  await expect(page.locator('text=Kasi is a product of Endogenous Technologies.')).toBeVisible();

  console.log('✅ Desktop visual audit passed.');
});

test('mobile visual audit (390x844) & zero horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });

  // Assert zero horizontal overflow at 390px
  const overflow = await page.evaluate(() => {
    const docWidth = document.documentElement.offsetWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    return { docWidth, scrollWidth, hasOverflow: scrollWidth > docWidth };
  });

  expect(
    overflow.hasOverflow,
    `Mobile has horizontal overflow: scrollWidth (${overflow.scrollWidth}) > docWidth (${overflow.docWidth})`
  ).toBe(false);

  // Scroll to trigger lazy loading
  await autoScrollAndLoad(page);

  // Check images on mobile
  const images = page.locator('img');
  const imageCount = await images.count();
  for (let i = 0; i < imageCount; i++) {
    const img = images.nth(i);
    const isVisible = await img.isVisible();
    if (isVisible) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      const src = await img.getAttribute('src');
      expect(naturalWidth, `Mobile image "${src}" failed to load`).toBeGreaterThan(0);
    }
  }

  // Mobile full page screenshot
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'mobile-full.png'),
    fullPage: true,
  });

  console.log('✅ Mobile visual audit & zero overflow passed.');
});
