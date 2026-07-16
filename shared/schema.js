// ============================================
// Schema REAL de personagens (bate com o PostgREST)
// Campos inventados pelo front NÃO entram aqui.
// ============================================
(function (global) {
  /**
   * Colunas que existem em public.personagens (confirmadas via API).
   * NÃO incluir senha_edicao (secreto).
   */
  const PERSONAGENS_PUBLIC_SELECT = Object.freeze([
    'id',
    'nome_player',
    'numero_player',
    'estilo_vida',
    'nome_personagem',
    'aniversario',
    'pais_vila',
    'idade',
    'genero',
    'tipo_sanguineo',
    'clan',
    'patente_ninja',
    'elemento_basico',
    'nome_guerra',
    'patente_samurai',
    'classe_civil',
    'dinastia',
    'cargo_inicial',
    'descricao',
    'data_criacao',
    'data_aprovacao',
    'motivo_rejeicao',
    'aprovado_por_id',
    'status',
    'aparencia',
    'aparencia_link',
    'foto_capa',
    'ryos',
    'score',
    'hp_max',
    'hp_atual',
    'historico_alteracoes',
    'altura',
    'peso',
    'cabelos',
    'olhos',
    'historia',
    'gosta_de',
    'nao_gosta_de',
    'proposito_1',
    'proposito_2',
    'proposito_3',
    'proposito_4',
    'proposito_5',
    'titulo_1',
    'titulo_2',
    'titulo_3',
    'titulo_4',
    'titulo_5',
    'titulo_6',
    'titulo_7',
    'titulo_9',
    'titulo_10',
    'tecnicas',
    'relacoes',
    'missao_s',
    'missao_a',
    'missao_b',
    'missao_c',
    'missao_d',
    'historico_graduacoes'
  ]);

  /** Mesma lista — usada no update (filtrada no build). */
  const PERSONAGENS_COLUMNS = PERSONAGENS_PUBLIC_SELECT;

  /** Colunas que o front NÃO deve enviar em UPDATE. */
  const PERSONAGENS_READONLY = Object.freeze([
    'id',
    'data_criacao',
    'data_aprovacao',
    'aprovado_por_id',
    'nome_player',
    'numero_player'
  ]);

  const SECRET_COLUMNS = Object.freeze(['senha_edicao']);

  /**
   * Aliases do UI antigo → coluna real no banco.
   * Evita mandar origem_nascimento / local_reside / profissao / cla.
   */
  const PERSONAGEM_ALIASES = Object.freeze({
    cla: 'clan',
    origem_nascimento: 'pais_vila',
    local_reside: 'pais_vila',
    profissao: 'elemento_basico',
    lista_tecnicas: 'tecnicas',
    lista_relacoes: 'relacoes',
    foto_perfil: 'aparencia_link'
  });

  const ATRIBUTOS_COLUMNS = Object.freeze([
    'id',
    'personagem_id',
    'velocidade',
    'taijutsu',
    'ninjutsu',
    'forca',
    'resistencia',
    'genjutsu',
    'selos',
    'inteligencia',
    'fuinjutsu',
    'ningeral',
    'elementos',
    'kenjutsu',
    'shurikenjutsu',
    'combate'
  ]);

  function resolveColumn(key) {
    return PERSONAGEM_ALIASES[key] || key;
  }

  function getPublicSelect(embed) {
    const base = PERSONAGENS_PUBLIC_SELECT.join(',');
    return embed ? `${base},${embed}` : base;
  }

  function readField(row, ...keys) {
    if (!row) return undefined;
    for (const key of keys) {
      const resolved = resolveColumn(key);
      if (row[resolved] !== undefined && row[resolved] !== null && row[resolved] !== '') {
        return row[resolved];
      }
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return row[key];
      }
    }
    return row[resolveColumn(keys[0])] ?? row[keys[0]] ?? null;
  }

  const PATENTE_ALIASES = Object.freeze({
    gennin: 'Genin',
    genin: 'Genin',
    chunin: 'Chunin',
    chuunin: 'Chunin',
    'chūnin': 'Chunin',
    jounin: 'Jounin',
    jonin: 'Jounin',
    'jōnin': 'Jounin',
    anbu: 'ANBU',
    kage: 'Kage',
    'estado-maior': 'Estado-maior',
    'estado maior': 'Estado-maior',
    'estado_maior': 'Estado-maior'
  });

  function normalizePatente(raw) {
    if (raw === null || raw === undefined) return '';
    const trimmed = String(raw).trim();
    if (!trimmed || trimmed === '-') return '';
    return PATENTE_ALIASES[trimmed.toLowerCase()] || trimmed;
  }

  function getPatente(row) {
    return normalizePatente(readField(row, 'patente_ninja', 'patente_samurai', 'patente'));
  }

  function getPatenteBucket(row, knownBuckets) {
    const buckets = knownBuckets || [];
    const pat = getPatente(row);
    if (!pat) return 'Sem Patente';
    if (buckets.includes(pat)) return pat;
    return 'Sem Patente';
  }

  function getClan(row) {
    return readField(row, 'clan', 'cla') || '';
  }

  function buildChangedPayload(nextVals, prevRow, allowedColumns) {
    const allowed = new Set(allowedColumns);
    const readonly = new Set(PERSONAGENS_READONLY);
    const payload = {};

    for (const [rawKey, value] of Object.entries(nextVals)) {
      const key = resolveColumn(rawKey);
      if (!allowed.has(key)) continue;
      if (SECRET_COLUMNS.includes(key)) continue;
      if (readonly.has(key)) continue;
      if (value === undefined) continue;

      const prev = prevRow ? prevRow[key] : undefined;
      const prevNorm = prev === null || prev === undefined ? '' : String(prev);
      const nextNorm = value === null || value === undefined ? '' : String(value);

      if (prevNorm !== nextNorm) {
        payload[key] = value;
      }
    }

    return payload;
  }

  function filterKnownColumns(data, allowedColumns) {
    const allowed = new Set(allowedColumns);
    const secrets = new Set(SECRET_COLUMNS);
    const out = {};
    for (const [rawKey, value] of Object.entries(data)) {
      const key = resolveColumn(rawKey);
      if (secrets.has(key)) continue;
      if (allowed.has(key) && value !== undefined) {
        out[key] = value;
      }
    }
    return out;
  }

  global.KigenSchema = {
    PERSONAGENS_COLUMNS,
    PERSONAGENS_PUBLIC_SELECT,
    PERSONAGENS_READONLY,
    ATRIBUTOS_COLUMNS,
    SECRET_COLUMNS,
    resolveColumn,
    readField,
    normalizePatente,
    getPatente,
    getPatenteBucket,
    getClan,
    getPublicSelect,
    buildChangedPayload,
    filterKnownColumns
  };
})(window);
