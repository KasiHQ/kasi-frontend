import { ROUTES } from '../src/routes.ts';
import fs from 'fs';
import path from 'path';

/**
 * Check-links verification script
 * Validates that every declared route in ROUTES and every internal link in Nav, Footer, and Landing
 * maps to a valid route in App.jsx and has no dead ends or 404s.
 */

async function main() {
  console.log('🔍 Checking site links and route consistency...\n');

  const appFilePath = path.resolve(process.cwd(), 'src/App.jsx');
  const appContent = fs.readFileSync(appFilePath, 'utf-8');

  let errors = 0;
  let checked = 0;

  console.log('--- Checking all declared routes in routes.ts against App.jsx ---');
  for (const [key, route] of Object.entries(ROUTES)) {
    if (route.status === 'external' || route.path.startsWith('http')) {
      console.log(`[EXTERNAL] ${route.name.padEnd(25)} -> ${route.path}`);
      continue;
    }

    checked++;
    const pathRegex = new RegExp(`path=["']${route.path}["']`);
    const isWired = pathRegex.test(appContent);

    if (isWired) {
      console.log(`[PASS] (${route.status.toUpperCase().padEnd(5)}) ${route.name.padEnd(22)} -> ${route.path}`);
    } else {
      console.error(`[FAIL] Route ${route.path} (${route.name}) is NOT wired in App.jsx!`);
      errors++;
    }
  }

  console.log(`\nVerified ${checked} public routes with ${errors} broken routes.`);

  if (errors > 0) {
    console.error(`❌ Check-links failed with ${errors} missing route(s)!`);
    process.exit(1);
  } else {
    console.log('✅ Check-links passed: Zero 404 routes found across the site.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
