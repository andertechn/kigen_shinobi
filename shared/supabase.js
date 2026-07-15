// ============================================
// Cliente Supabase compartilhado
// ============================================
(function (global) {
  let client = null;

  function getSupabaseClient() {
    if (client) return client;
    if (!global.supabase || !global.supabase.createClient) {
      throw new Error('Biblioteca @supabase/supabase-js não carregada');
    }
    if (!global.KIGEN_CONFIG) {
      throw new Error('KIGEN_CONFIG não carregado — inclua shared/config.js');
    }
    client = global.supabase.createClient(
      global.KIGEN_CONFIG.SUPABASE_URL,
      global.KIGEN_CONFIG.SUPABASE_ANON_KEY
    );
    return client;
  }

  global.KigenDB = {
    getClient: getSupabaseClient
  };
})(window);
