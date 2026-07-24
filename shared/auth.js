// ============================================
// Auth helpers — hashing + sessão (admin / ficha)
// ============================================
(function (global) {
  const LEGACY_PREFIX = 'btoa:';
  const SHA_PREFIX = 'sha256:';

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /** Hash moderno para novas senhas (admin). */
  async function hashPassword(plain) {
    const hex = await sha256Hex(plain);
    return SHA_PREFIX + hex;
  }

  /** Compatível com senhas antigas (btoa) e novas (sha256:...). */
  async function verifyPassword(plain, stored) {
    if (!stored) return false;

    if (stored.startsWith(SHA_PREFIX)) {
      const hex = await sha256Hex(plain);
      return stored === SHA_PREFIX + hex;
    }

    // Legado: password_hash = btoa(senha) sem prefixo
    try {
      if (stored === btoa(plain)) return true;
      if (stored.startsWith(LEGACY_PREFIX) && stored.slice(LEGACY_PREFIX.length) === btoa(plain)) {
        return true;
      }
    } catch (_) {
      /* ignore invalid btoa input */
    }
    return false;
  }

  function isLegacyHash(stored) {
    return stored && !stored.startsWith(SHA_PREFIX);
  }

  function saveAdminSession(user) {
    const key = global.KIGEN_CONFIG.ADMIN_SESSION_KEY;
    sessionStorage.setItem(
      key,
      JSON.stringify({
        id: user.id,
        nome: user.nome,
        savedAt: Date.now()
      })
    );
  }

  function clearAdminSession() {
    sessionStorage.removeItem(global.KIGEN_CONFIG.ADMIN_SESSION_KEY);
  }

  function readAdminSession() {
    try {
      const raw = sessionStorage.getItem(global.KIGEN_CONFIG.ADMIN_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function saveFichaEditSession(personagemId) {
    const key = global.KIGEN_CONFIG.FICHA_EDIT_SESSION_KEY;
    sessionStorage.setItem(
      key,
      JSON.stringify({
        personagemId: Number(personagemId),
        expiresAt: Date.now() + global.KIGEN_CONFIG.EDIT_SESSION_TTL_MS
      })
    );
  }

  function clearFichaEditSession() {
    sessionStorage.removeItem(global.KIGEN_CONFIG.FICHA_EDIT_SESSION_KEY);
  }

  function hasValidFichaEditSession(personagemId) {
    try {
      const raw = sessionStorage.getItem(global.KIGEN_CONFIG.FICHA_EDIT_SESSION_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || data.personagemId !== Number(personagemId)) return false;
      if (Date.now() > data.expiresAt) {
        clearFichaEditSession();
        return false;
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Valida senha_edicao via Edge Function (nunca busca a senha no client).
   * @returns {Promise<{ valido: boolean, erro?: string }>}
   */
  async function verifyFichaPassword(personagemId, senha) {
    const cfg = global.KIGEN_CONFIG;
    if (!cfg?.SWIFT_API_URL) {
      return { valido: false, erro: 'Config de API ausente' };
    }

    const response = await fetch(cfg.SWIFT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        personagem_id: Number(personagemId),
        senha: String(senha)
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { valido: false, erro: result.erro || 'Erro ao autenticar' };
    }
    return { valido: !!result.valido };
  }

  global.KigenAuth = {
    hashPassword,
    verifyPassword,
    isLegacyHash,
    saveAdminSession,
    clearAdminSession,
    readAdminSession,
    saveFichaEditSession,
    clearFichaEditSession,
    hasValidFichaEditSession,
    verifyFichaPassword
  };
})(window);
