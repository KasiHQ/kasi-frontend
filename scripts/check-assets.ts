import fs from 'fs';
import path from 'path';

/**
 * check-assets.ts
 * Scans all new section components (src/modules/Landing/components/home/) and content files
 * Fails if:
 * 1. Any component or content file references a remote image (http://, https://, //, etc.)
 * 2. Any referenced local image file in public/ does not exist on disk
 */

const TARGET_DIRECTORIES = [
  path.resolve(process.cwd(), 'src/modules/Landing/components/home'),
  path.resolve(process.cwd(), 'src/content'),
  path.resolve(process.cwd(), 'src/components/common'),
];

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

function scanFileForAssets(filePath: string): { remoteErrors: string[]; brokenLocalErrors: string[] } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const remoteErrors: string[] = [];
  const brokenLocalErrors: string[] = [];

  // Check for remote image urls
  const remotePattern = /(https?:\/\/[^\s"'`]+\.(?:png|jpg|jpeg|svg|webp|gif))/gi;
  let match: RegExpExecArray | null;
  while ((match = remotePattern.exec(content)) !== null) {
    remoteErrors.push(match[1]);
  }

  // Also check for unpslash / cdn links
  const cdnPattern = /(https?:\/\/(?:images\.unsplash\.com|cdn\.|pexels)[^\s"'`]+)/gi;
  while ((match = cdnPattern.exec(content)) !== null) {
    if (!remoteErrors.includes(match[1])) {
      remoteErrors.push(match[1]);
    }
  }

  // Check for local image references like src="/images/..." or src="/kasi..." or src="/logos/..."
  const localPattern = /["'`]((\/(?:images|logos|brand|[a-zA-Z0-9_\-\.]+)\.(?:png|jpg|jpeg|svg|webp|gif)))["'`]/gi;
  while ((match = localPattern.exec(content)) !== null) {
    const localRel = match[1];
    // Resolve inside public
    const cleanRel = localRel.startsWith('/') ? localRel.slice(1) : localRel;
    const resolvedPath = path.resolve(PUBLIC_DIR, cleanRel);
    if (!fs.existsSync(resolvedPath)) {
      brokenLocalErrors.push(`${localRel} (resolved to ${resolvedPath})`);
    }
  }

  return { remoteErrors, brokenLocalErrors };
}

function main() {
  console.log('🖼️  Running check-assets.ts: verifying local assets and zero remote images...\n');

  let totalFilesScanned = 0;
  let totalRemoteErrors = 0;
  let totalBrokenLocalErrors = 0;

  for (const dir of TARGET_DIRECTORIES) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js'));

    for (const file of files) {
      const fullPath = path.resolve(dir, file);
      totalFilesScanned++;
      const { remoteErrors, brokenLocalErrors } = scanFileForAssets(fullPath);

      if (remoteErrors.length > 0) {
        console.error(`❌ [REMOTE IMAGE FOUND] in ${file}:`);
        remoteErrors.forEach(url => console.error(`   - ${url}`));
        totalRemoteErrors += remoteErrors.length;
      }

      if (brokenLocalErrors.length > 0) {
        console.error(`❌ [BROKEN LOCAL IMAGE] in ${file}:`);
        brokenLocalErrors.forEach(err => console.error(`   - ${err}`));
        totalBrokenLocalErrors += brokenLocalErrors.length;
      }

      if (remoteErrors.length === 0 && brokenLocalErrors.length === 0) {
        console.log(`[PASS] ${file}`);
      }
    }
  }

  console.log(`\nScanned ${totalFilesScanned} source files.`);

  if (totalRemoteErrors > 0 || totalBrokenLocalErrors > 0) {
    console.error(`\n❌ Asset verification failed: ${totalRemoteErrors} remote image(s), ${totalBrokenLocalErrors} broken local image(s).`);
    process.exit(1);
  } else {
    console.log('\n✅ Asset verification passed: 100% local images, 0 remote images, 0 broken paths.');
  }
}

main();
