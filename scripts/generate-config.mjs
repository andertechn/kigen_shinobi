/**
 * Gera config.js e shared/config.js a partir de variáveis de ambiente.
 * Usado no build (Vercel / CI). Fallbacks permitem rodar local sem .env.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://etojqmmhdciphantyzoa.supabase.co';

// Anon key é pública (RLS). Preferir env na Vercel; fallback só para local/CI sem .env.
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0b2pxbW1oZGNpcGhhbnR5em9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyOTY5OTIsImV4cCI6MjA5ODg3Mjk5Mn0.1_zs_w7E_MZ9O5Iq4F76UQsos6i8zZhvWpjzVtsfxAA';

const SWIFT_API_URL =
  process.env.SWIFT_API_URL || `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/swift-api`;

const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbwmbXtMKSUURqf3l8ZektgF9-CDqHlGECEdEsOc-C6y4rYTH14qh0nBYJL30xLUefw4/exec';

const sharedConfig = `// ============================================
// Configuração central do Kigen Shinobi (gerado por scripts/generate-config.mjs)
// ============================================
window.KIGEN_CONFIG = Object.freeze({
  SUPABASE_URL: ${JSON.stringify(SUPABASE_URL)},
  SUPABASE_ANON_KEY: ${JSON.stringify(SUPABASE_ANON_KEY)},
  SWIFT_API_URL: ${JSON.stringify(SWIFT_API_URL)},
  APPS_SCRIPT_URL: ${JSON.stringify(APPS_SCRIPT_URL)},
  ADMIN_SESSION_KEY: 'kigen_admin_session',
  FICHA_EDIT_SESSION_KEY: 'kigen_ficha_edit_session',
  EDIT_SESSION_TTL_MS: 2 * 60 * 60 * 1000 // 2 horas
});

// Compatibilidade com o painel admin antigo
window.SUPABASE_CONFIG = {
  URL: window.KIGEN_CONFIG.SUPABASE_URL,
  KEY: window.KIGEN_CONFIG.SUPABASE_ANON_KEY
};
`;

const rootConfig = `// ============================================
// CONFIGURAÇÃO SUPABASE (gerado por scripts/generate-config.mjs)
// ============================================

const SUPABASE_CONFIG = {
  URL: ${JSON.stringify(SUPABASE_URL)},
  KEY: ${JSON.stringify(SUPABASE_ANON_KEY)}
};

if (!SUPABASE_CONFIG.URL || !SUPABASE_CONFIG.KEY) {
  console.error('❌ ERRO: Credenciais do Supabase não configuradas em config.js');
}
`;

function write(relPath, contents) {
  const abs = join(root, relPath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, contents, 'utf8');
  console.log(`wrote ${relPath}`);
}

write('shared/config.js', sharedConfig);
write('config.js', rootConfig);
console.log('config generation ok');
