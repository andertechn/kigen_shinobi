// ============================================
// Whitelist de colunas conhecidas (evita schema cache errors)
// ============================================
(function (global) {
  /** Colunas da tabela personagens usadas no app dinâmico. */
  const PERSONAGENS_COLUMNS = Object.freeze([
    'id',
    'nome_personagem',
    'nome_player',
    'numero_player',
    'estilo_vida',
    'genero',
    'idade',
    'aniversario',
    'tipo_sanguineo',
    'pais_vila',
    'clan',
    'patente',
    'patente_ninja',
    'patente_samurai',
    'elemento_basico',
    'nome_guerra',
    'classe_civil',
    'dinastia',
    'cargo_inicial',
    'titulo_1',
    'score',
    'ryos',
    'origem_nascimento',
    'local_reside',
    'profissao',
    'aparencia',
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
    'foto_capa',
    'foto_perfil',
    'aparencia_link',
    'hp_atual',
    'hp_max',
    'chakra_atual',
    'chakra_max',
    'lista_tecnicas',
    'historico_graduacoes',
    'lista_relacoes',
    'historico_alteracoes',
    'missao_s',
    'missao_a',
    'missao_b',
    'missao_c',
    'missao_d',
    'kenjutsu',
    'taijutsu',
    'forca',
    'resistencia',
    'velocidade',
    'inteligencia',
    'status',
    'descricao',
    'data_aprovacao',
    'aprovado_por_id',
    'senha_edicao'
  ]);

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

  const PERSONAGEM_ALIASES = Object.freeze({
    // Frontend legado → coluna real
    cla: 'clan'
  });

  function resolveColumn(key) {
    return PERSONAGEM_ALIASES[key] || key;
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

  function getPatente(row) {
    return readField(row, 'patente', 'patente_ninja', 'patente_samurai') || '';
  }

  function getClan(row) {
    return readField(row, 'clan', 'cla') || '';
  }

  /**
   * Monta payload de update só com colunas permitidas e valores alterados.
   * @param {object} nextVals - valores novos (podem usar aliases)
   * @param {object} prevRow - linha atual do banco
   * @param {string[]} allowedColumns
   */
  function buildChangedPayload(nextVals, prevRow, allowedColumns) {
    const allowed = new Set(allowedColumns);
    const payload = {};

    for (const [rawKey, value] of Object.entries(nextVals)) {
      const key = resolveColumn(rawKey);
      if (!allowed.has(key)) continue;
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
    const out = {};
    for (const [rawKey, value] of Object.entries(data)) {
      const key = resolveColumn(rawKey);
      if (allowed.has(key) && value !== undefined) {
        out[key] = value;
      }
    }
    return out;
  }

  global.KigenSchema = {
    PERSONAGENS_COLUMNS,
    ATRIBUTOS_COLUMNS,
    resolveColumn,
    readField,
    getPatente,
    getClan,
    buildChangedPayload,
    filterKnownColumns
  };
})(window);
