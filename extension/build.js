import { build } from 'esbuild';
import { copyFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isWatch = process.argv.includes('--watch');
const isPackage = process.argv.includes('--package');

const srcDir = join(__dirname, 'src');
const publicDir = join(__dirname, 'public');
const distDir = join(__dirname, 'dist');

async function buildExtension() {
  // Clean dist directory
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true });
  }
  mkdirSync(distDir, { recursive: true });
  mkdirSync(join(distDir, 'icons'), { recursive: true });
  mkdirSync(join(distDir, 'contentScripts'), { recursive: true });

  // Copy manifest
  copyFileSync(join(publicDir, 'manifest.json'), join(distDir, 'manifest.json'));

  // Copy icons
  ['icon-16.svg', 'icon-32.svg', 'icon-48.svg', 'icon-128.svg'].forEach(icon => {
    copyFileSync(join(publicDir, 'icons', icon), join(distDir, 'icons', icon));
  });

  // Copy popup HTML and CSS
  copyFileSync(join(publicDir, 'popup.html'), join(distDir, 'popup.html'));
  copyFileSync(join(publicDir, 'popup.css'), join(distDir, 'popup.css'));

  // Build background script
  await build({
    entryPoints: [join(srcDir, 'background.js')],
    bundle: true,
    outfile: join(distDir, 'background.js'),
    format: 'esm',
    platform: 'node',
    target: 'chrome88',
    sourcemap: isWatch,
    external: ['chrome'],
  });

  // Build content scripts
  const contentScripts = ['leetcode', 'gfg', 'codeforces', 'codechef', 'atcoder'];
  
  for (const script of contentScripts) {
    await build({
      entryPoints: [join(srcDir, 'contentScripts', `${script}.js`)],
      bundle: true,
      outfile: join(distDir, 'contentScripts', `${script}.js`),
      format: 'iife',
      platform: 'browser',
      target: 'chrome88',
      sourcemap: isWatch,
      globalName: `DsaTracker${script.charAt(0).toUpperCase() + script.slice(1)}`,
    });
  }

  // Build popup script
  await build({
    entryPoints: [join(publicDir, 'popup.js')],
    bundle: true,
    outfile: join(distDir, 'popup.js'),
    format: 'iife',
    platform: 'browser',
    target: 'chrome88',
    sourcemap: isWatch,
    globalName: 'DsaTrackerPopup',
  });

  console.log('Extension built successfully!');

  if (isWatch) {
    console.log('Watching for changes...');
  }
  
  if (isPackage) {
    // Create zip for Chrome Web Store
    const { createWriteStream } = await import('fs');
    const { pipeline } = await import('stream/promises');
    const archiver = (await import('archiver')).default;
    
    const output = createWriteStream(join(__dirname, 'dsa-tracker-extension.zip'));
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    await pipeline(archive, output);
    
    archive.directory(distDir, false);
    await archive.finalize();
    
    console.log('Extension packaged as dsa-tracker-extension.zip');
  }
}

buildExtension().catch(() => process.exit(1));