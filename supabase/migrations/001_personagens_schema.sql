-- Kigen Shinobi — schema de referência + correções
-- Execute no SQL Editor do Supabase (Dashboard → SQL).

-- 1) Garante coluna clan (nome correto; NÃO usar "cla")
ALTER TABLE public.personagens
  ADD COLUMN IF NOT EXISTS clan text;

-- Se existir coluna legada "cla", migra e remove
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'personagens'
      AND column_name = 'cla'
  ) THEN
    UPDATE public.personagens
    SET clan = COALESCE(clan, cla)
    WHERE clan IS NULL AND cla IS NOT NULL;

    ALTER TABLE public.personagens DROP COLUMN cla;
  END IF;
END $$;

-- 2) Colunas comuns usadas pelo app (idempotente)
ALTER TABLE public.personagens
  ADD COLUMN IF NOT EXISTS patente text,
  ADD COLUMN IF NOT EXISTS patente_ninja text,
  ADD COLUMN IF NOT EXISTS patente_samurai text,
  ADD COLUMN IF NOT EXISTS elemento_basico text,
  ADD COLUMN IF NOT EXISTS nome_guerra text,
  ADD COLUMN IF NOT EXISTS classe_civil text,
  ADD COLUMN IF NOT EXISTS dinastia text,
  ADD COLUMN IF NOT EXISTS cargo_inicial text,
  ADD COLUMN IF NOT EXISTS origem_nascimento text,
  ADD COLUMN IF NOT EXISTS local_reside text,
  ADD COLUMN IF NOT EXISTS profissao text,
  ADD COLUMN IF NOT EXISTS aparencia text,
  ADD COLUMN IF NOT EXISTS altura text,
  ADD COLUMN IF NOT EXISTS peso text,
  ADD COLUMN IF NOT EXISTS cabelos text,
  ADD COLUMN IF NOT EXISTS olhos text,
  ADD COLUMN IF NOT EXISTS historia text,
  ADD COLUMN IF NOT EXISTS gosta_de text,
  ADD COLUMN IF NOT EXISTS nao_gosta_de text,
  ADD COLUMN IF NOT EXISTS proposito_1 text,
  ADD COLUMN IF NOT EXISTS proposito_2 text,
  ADD COLUMN IF NOT EXISTS proposito_3 text,
  ADD COLUMN IF NOT EXISTS proposito_4 text,
  ADD COLUMN IF NOT EXISTS proposito_5 text,
  ADD COLUMN IF NOT EXISTS foto_capa text,
  ADD COLUMN IF NOT EXISTS foto_perfil text,
  ADD COLUMN IF NOT EXISTS aparencia_link text,
  ADD COLUMN IF NOT EXISTS hp_atual integer,
  ADD COLUMN IF NOT EXISTS hp_max integer,
  ADD COLUMN IF NOT EXISTS chakra_atual integer,
  ADD COLUMN IF NOT EXISTS chakra_max integer,
  ADD COLUMN IF NOT EXISTS score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ryos integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'em_analise',
  ADD COLUMN IF NOT EXISTS senha_edicao text;

-- 3) Após alterar schema, o PostgREST recarrega sozinho;
--    se o erro "schema cache" continuar, rode:
-- NOTIFY pgrst, 'reload schema';

-- 4) RLS recomendado (ativar quando migrar para Supabase Auth)
-- ALTER TABLE public.personagens ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "leitura publica aprovados"
--   ON public.personagens FOR SELECT
--   USING (status = 'aprovado' OR auth.role() = 'authenticated');
