// ============================================
// Configuração central do Kigen Shinobi (gerado por scripts/generate-config.mjs)
// ============================================
window.KIGEN_CONFIG = Object.freeze({
  SUPABASE_URL: "https://etojqmmhdciphantyzoa.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0b2pxbW1oZGNpcGhhbnR5em9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyOTY5OTIsImV4cCI6MjA5ODg3Mjk5Mn0.1_zs_w7E_MZ9O5Iq4F76UQsos6i8zZhvWpjzVtsfxAA",
  SWIFT_API_URL: "https://etojqmmhdciphantyzoa.supabase.co/functions/v1/swift-api",
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwmbXtMKSUURqf3l8ZektgF9-CDqHlGECEdEsOc-C6y4rYTH14qh0nBYJL30xLUefw4/exec",
  ADMIN_SESSION_KEY: 'kigen_admin_session',
  FICHA_EDIT_SESSION_KEY: 'kigen_ficha_edit_session',
  EDIT_SESSION_TTL_MS: 2 * 60 * 60 * 1000 // 2 horas
});

// Compatibilidade com o painel admin antigo
window.SUPABASE_CONFIG = {
  URL: window.KIGEN_CONFIG.SUPABASE_URL,
  KEY: window.KIGEN_CONFIG.SUPABASE_ANON_KEY
};
