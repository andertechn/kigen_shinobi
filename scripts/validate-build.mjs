/**
 * Valida artefatos mínimos antes da integração / deploy.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const requiredFiles = [
  'index.html',
  'config.js',
  'shared/config.js',
  'shared/auth.js',
  'shared/supabase.js',
  'vercel.json'
];

let failed = false;

for (const rel of requiredFiles) {
  const abs = join(root, rel);
  if (!existsSync(abs)) {
    console.error(`missing required file: ${rel}`);
    failed = true;
  }
}

const shared = readFileSync(join(root, 'shared/config.js'), 'utf8');
if (!shared.includes('SUPABASE_URL') || !shared.includes('SUPABASE_ANON_KEY')) {
  console.error('shared/config.js is missing Supabase keys');
  failed = true;
}

const rootCfg = readFileSync(join(root, 'config.js'), 'utf8');
if (!rootCfg.includes('SUPABASE_CONFIG')) {
  console.error('config.js is missing SUPABASE_CONFIG');
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log('build validation ok');
