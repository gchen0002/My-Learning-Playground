import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const distAssets = join(process.cwd(), 'dist', 'assets');
const rootAssets = join(process.cwd(), 'assets');

if (!existsSync(distAssets)) {
  throw new Error('Missing dist/assets. Run vite build before syncing static assets.');
}

const files = readdirSync(distAssets);
const jsBundle = files.find((file) => file.endsWith('.js'));
const cssBundle = files.find((file) => file.endsWith('.css'));

if (!jsBundle || !cssBundle) {
  throw new Error('Could not find built JS and CSS assets.');
}

mkdirSync(rootAssets, { recursive: true });

copyFileSync(join(distAssets, jsBundle), join(distAssets, 'site.js'));
copyFileSync(join(distAssets, cssBundle), join(distAssets, 'app.css'));
copyFileSync(join(distAssets, jsBundle), join(rootAssets, 'site.js'));
copyFileSync(join(distAssets, cssBundle), join(rootAssets, 'app.css'));

for (const file of readdirSync(rootAssets)) {
  if (!['site.js', 'app.css'].includes(file)) {
    rmSync(join(rootAssets, file));
  }
}
