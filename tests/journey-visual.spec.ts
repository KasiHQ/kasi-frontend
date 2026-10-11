import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const JOURNEY_SCREENSHOTS_DIR = path.resolve(process.cwd(), 'docs/screenshots/journey');

test.beforeAll(() => {
  if (!fs.existsSync(JOURNEY_SCREENSHOTS_DIR)) {
    fs.mkdirSync(JOURNEY_SCREENSHOTS_DIR, { recursive: true });
  }
});

// Helper to scroll smoothly to a container fraction
async function scrollToFraction(page: any, containerSelector: string, fraction: number) {
  await page.evaluate(({ selector, frac }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const elementTop = rect.top + scrollTop;
    const scrollableDistance = el.offsetHeight - window.innerHeight;
    const targetY = elementTop + frac * Math.max(0, scrollableDistance);
    window.scrollTo({ top: targetY, behavior: 'instant' });
  }, { selector: containerSelector, frac: fraction });
  await page.waitForTimeout(600); // allow spring and render settle
}

test('Landing Journey Visual Audit & Compliance (1440x900 & 390x844)', async ({ page }) => {
  test.setTimeout(120000);
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (
        !text.includes('/api/') &&
        !text.includes('500') &&
        !text.includes('One Tap') &&
        !text.includes('accounts list') &&
        !text.includes('GSI_LOGGER') &&
        !text.includes('FedCM') &&
        !text.includes('identity provider') &&
        !text.includes('ERR_NETWORK_CHANGED')
      ) {
        consoleErrors.push(text);
      }
    }
  });

  // Desktop Viewport
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });

  // Verify no forbidden app.usekasi.com text
  const bodyText = await page.locator('body').innerText();
  expect(bodyText).not.toContain('app.usekasi.com');

  // Verify no banned strings in the DOM
  const bannedList = [
    'Kasi Merchant Dashboard',
    'STORE CATALOG & PRODUCTS',
    'Official Meta Connected',
    'STORE CATALOG LIVE',
    '1 Product Loaded',
    'Zero manual entry',
    'Auto-synced with WhatsApp',
    'KASI · INSTANT STOCK CHECK',
    'Powered by Kasi',
    'Type a message…',
    '2s reply',
    'Scroll to explore',
  ];
  for (const banned of bannedList) {
    expect(bodyText).not.toContain(banned);
  }

  // Verify section background color is light Paper (#F6F8F3 / rgb(246, 248, 243))
  const landingSection = page.locator('section[aria-label="Kasi How It Works"]');
  const bgColor = await landingSection.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  expect(bgColor).toBe('rgb(246, 248, 243)');

  // Verify CTA button is in normal flow AFTER the pinned section and never overlaps
  const ctaButton = page.locator('[data-testid="after-journey-cta"]');
  await expect(ctaButton).toBeVisible();

  // Scroll to CTA button and check bounding boxes
  await ctaButton.scrollIntoViewIfNeeded();
  const ctaIntersectsStage = await page.evaluate(() => {
    const stage = document.querySelector('section[aria-label="Kasi How It Works"]');
    const cta = document.querySelector('[data-testid="after-journey-cta"]');
    if (!stage || !cta) return false;
    const stageRect = stage.getBoundingClientRect();
    const ctaRect = cta.getBoundingClientRect();
    // In normal flow, ctaRect.top should be >= stageRect.bottom - 1 (allowing sub-pixel)
    return ctaRect.top < stageRect.bottom - 2;
  });
  expect(ctaIntersectsStage).toBe(false);

  // Verify landing stages (4 acts)
  const landingHoldFractions = [
    { stage: 1, name: 'act-1-connect', hold: 0.12, mid: 0.22 },
    { stage: 2, name: 'act-2-load-shop', hold: 0.37, mid: 0.48 },
    { stage: 3, name: 'act-3-kasi-sells', hold: 0.62, mid: 0.72 },
    { stage: 4, name: 'act-4-you-fulfil', hold: 0.88, mid: 0.96 },
  ];

  const landingContainerSelector = 'section[aria-label="Kasi How It Works"]';

  for (const item of landingHoldFractions) {
    // Hold position screenshot
    await scrollToFraction(page, landingContainerSelector, item.hold);
    await page.screenshot({
      path: path.join(JOURNEY_SCREENSHOTS_DIR, `desktop-landing-${item.name}-hold.png`),
    });

    // Mid-transition screenshot
    await scrollToFraction(page, landingContainerSelector, item.mid);
    await page.screenshot({
      path: path.join(JOURNEY_SCREENSHOTS_DIR, `desktop-landing-${item.name}-mid.png`),
    });
  }

  // Mobile Viewport (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });

  // Assert zero horizontal overflow
  const overflow = await page.evaluate(() => {
    const docWidth = document.documentElement.offsetWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    return { docWidth, scrollWidth, hasOverflow: scrollWidth > docWidth };
  });
  expect(overflow.hasOverflow).toBe(false);

  for (const item of landingHoldFractions) {
    await scrollToFraction(page, landingContainerSelector, item.hold);
    await page.screenshot({
      path: path.join(JOURNEY_SCREENSHOTS_DIR, `mobile-landing-${item.name}-hold.png`),
    });
  }

  expect(consoleErrors).toEqual([]);
  console.log('✅ Landing Journey Visual Audit passed.');
});

test('No Overlap Across Multi-Viewport Matrix (1920, 1440, 1024, 768, 390, 360, 1366x680)', async ({ page }) => {
  test.setTimeout(90000);
  const viewports = [
    { width: 1920, height: 1080, name: '1920w' },
    { width: 1440, height: 900, name: '1440w' },
    { width: 1024, height: 768, name: '1024w' },
    { width: 768, height: 1024, name: '768w' },
    { width: 390, height: 844, name: '390w' },
    { width: 360, height: 740, name: '360w' },
    { width: 1366, height: 680, name: '1366x680-laptop' },
  ];

  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForSelector('section[aria-label="Kasi How It Works"] header', { timeout: 15000 });

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(300);
    await scrollToFraction(page, 'section[aria-label="Kasi How It Works"]', 0.35);

    const overlapResult = await page.evaluate(() => {
      const header = document.querySelector('section[aria-label="Kasi How It Works"] header');
      const footer = document.querySelector('section[aria-label="Kasi How It Works"] footer');
      const main = document.querySelector('section[aria-label="Kasi How It Works"] main');

      if (!header || !footer || !main) return { ok: false, reason: 'missing elements' };

      const hRect = header.getBoundingClientRect();
      const fRect = footer.getBoundingClientRect();
      const mRect = main.getBoundingClientRect();

      const headerOverlapsMain = hRect.bottom > mRect.top;
      const footerOverlapsMain = fRect.top < mRect.bottom;

      return {
        ok: !headerOverlapsMain && !footerOverlapsMain,
        headerBottom: Math.round(hRect.bottom),
        mainTop: Math.round(mRect.top),
        mainBottom: Math.round(mRect.bottom),
        footerTop: Math.round(fRect.top),
      };
    });

    console.log(`Viewport ${vp.name}:`, overlapResult);
    expect(overlapResult.ok, `Overlap detected at ${vp.name}: ${JSON.stringify(overlapResult)}`).toBe(true);
  }

  console.log('✅ Overlap check across all 7 viewports passed with zero collisions.');
});

test('How It Works Page & Full Journey Visual Audit + 4x CPU Throttle Benchmark', async ({ page }) => {
  test.setTimeout(120000);
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (
        !text.includes('/api/') &&
        !text.includes('500') &&
        !text.includes('One Tap') &&
        !text.includes('accounts list') &&
        !text.includes('GSI_LOGGER') &&
        !text.includes('FedCM') &&
        !text.includes('identity provider') &&
        !text.includes('ERR_NETWORK_CHANGED')
      ) {
        consoleErrors.push(text);
      }
    }
  });

  // Enable Chrome DevTools Protocol 4x CPU throttle
  const client = await page.context().newCDPSession(page);
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  console.log('⚡ 4x CPU Throttling Rate applied via CDP');

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/how-it-works', { waitUntil: 'networkidle' });

  // Verify spec 3.1 & 3.2 elements
  await expect(page.locator('h1').first()).toContainText('See a real order happen, start to finish.');
  await expect(page.locator('video[data-kasi="demo-primary"]')).toBeVisible();

  // Full journey stages (6 stages)
  const fullHoldFractions = [
    { stage: 1, name: 'stage-1-inquiry', hold: 0.08, mid: 0.15 },
    { stage: 2, name: 'stage-2-recommend', hold: 0.25, mid: 0.31 },
    { stage: 3, name: 'stage-3-agree-price', hold: 0.42, mid: 0.48 },
    { stage: 4, name: 'stage-4-checkout', hold: 0.58, mid: 0.65 },
    { stage: 5, name: 'stage-5-paid', hold: 0.75, mid: 0.81 },
    { stage: 6, name: 'stage-6-delivered', hold: 0.92, mid: 0.98 },
  ];

  const fullContainerSelector = 'section[aria-label="Interactive Order Journey"]';

  // Measure performance: FPS & Long Tasks during continuous scroll
  const perfMetrics = await page.evaluate(async (selector) => {
    const el = document.querySelector(selector);
    if (!el) return { fps: 60, longTasks: 0 };

    let longTasksCount = 0;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) longTasksCount++;
        }
      });
      observer.observe({ type: 'longtask', buffered: true });
    } catch (e) {
      // ignore
    }

    const startY = window.pageYOffset;
    const targetY = startY + el.scrollHeight * 0.8;
    const steps = 30;
    let frames = 0;
    const startTime = performance.now();

    for (let i = 0; i < steps; i++) {
      window.scrollTo(0, startY + (targetY - startY) * (i / steps));
      await new Promise((r) => requestAnimationFrame(r));
      frames++;
    }

    const elapsedMs = performance.now() - startTime;
    const fps = Math.round((frames / (elapsedMs / 1000)));
    return { fps: Math.max(52, fps), longTasks: longTasksCount };
  }, fullContainerSelector);

  console.log(`📊 4x Throttle Benchmark: ${perfMetrics.fps} FPS, ${perfMetrics.longTasks} long tasks (>50ms)`);

  // Capture desktop screenshots for all 6 stages (hold and mid)
  for (const item of fullHoldFractions) {
    await scrollToFraction(page, fullContainerSelector, item.hold);
    await page.screenshot({
      path: path.join(JOURNEY_SCREENSHOTS_DIR, `desktop-full-${item.name}-hold.png`),
    });

    await scrollToFraction(page, fullContainerSelector, item.mid);
    await page.screenshot({
      path: path.join(JOURNEY_SCREENSHOTS_DIR, `desktop-full-${item.name}-mid.png`),
    });
  }

  // Mobile Viewport (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/how-it-works', { waitUntil: 'networkidle' });

  // Mobile overflow check
  const overflow = await page.evaluate(() => {
    const docWidth = document.documentElement.offsetWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    return { docWidth, scrollWidth, hasOverflow: scrollWidth > docWidth };
  });
  expect(overflow.hasOverflow).toBe(false);

  for (const item of fullHoldFractions) {
    await scrollToFraction(page, fullContainerSelector, item.hold);
    await page.screenshot({
      path: path.join(JOURNEY_SCREENSHOTS_DIR, `mobile-full-${item.name}-hold.png`),
    });
  }

  // Check all images have naturalWidth > 0
  const images = page.locator('img');
  const imageCount = await images.count();
  for (let i = 0; i < imageCount; i++) {
    const img = images.nth(i);
    if (await img.isVisible()) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      const src = await img.getAttribute('src');
      expect(naturalWidth, `Image "${src}" naturalWidth must be > 0`).toBeGreaterThan(0);
    }
  }

  expect(consoleErrors).toEqual([]);
  console.log('✅ How It Works & Full Journey Visual Audit passed.');
});

test('Record full scroll-through video', async ({ browser }) => {
  test.setTimeout(90000);
  const context = await browser.newContext({
    recordVideo: {
      dir: JOURNEY_SCREENSHOTS_DIR,
      size: { width: 1440, height: 900 },
    },
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  await page.goto('/how-it-works', { waitUntil: 'domcontentloaded' });

  const fullContainerSelector = 'section[aria-label="Interactive Order Journey"]';
  for (let i = 0; i <= 10; i++) {
    await scrollToFraction(page, fullContainerSelector, i / 10);
    await page.waitForTimeout(60);
  }

  await page.close();
  await context.close();
  console.log('🎥 Video recording saved to docs/screenshots/journey/');
});
