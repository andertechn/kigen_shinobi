/**
 * Type Check pragmático para o monólito HTML/JS:
 * - syntax check (node --check) nos módulos compartilhados
 * - valida shape tipada das variáveis de ambiente exigidas no build
 */
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** @type {{ name: string, required: boolean }[]} */
const envShape = [
  { name: 'SUPABASE_URL', required: false },
  { name: 'SUPABASE_ANON_KEY', required: false },
  { name: 'SWIFT_API_URL', required: false },
  { name: 'APPS_SCRIPT_URL', required: false },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', required: false }
];

for (const { name } of envShape) {
  const value = process.env[name];
  if (value !== undefined && typeof value !== 'string') {
    console.error(`env ${name} must be a string`);
    process.exit(1);
  }
}

const files = [
  'shared/config.js',
  'shared/auth.js',
  'shared/supabase.js',
  'shared/schema.js',
  'config.js',
  'scripts/generate-config.mjs',
  'scripts/validate-build.mjs',
  'scripts/typecheck.mjs'
];

for (const rel of files) {
  const result = spawnSync(process.execPath, ['--check', join(root, rel)], {
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || `syntax error in ${rel}`);
    process.exit(result.status || 1);
  }
  console.log(`syntax ok: ${rel}`);
}

console.log('typecheck ok');
