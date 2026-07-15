// Reexporta config compartilhada (mantém path antigo do painel)
// Preferir carregar ../shared/config.js diretamente.
(function () {
  if (!window.KIGEN_CONFIG) {
    console.warn('[Kigen] Carregue shared/config.js antes do config legado.');
  }
  window.SUPABASE_CONFIG = window.SUPABASE_CONFIG || {
    URL: window.KIGEN_CONFIG?.SUPABASE_URL,
    KEY: window.KIGEN_CONFIG?.SUPABASE_ANON_KEY
  };
})();
