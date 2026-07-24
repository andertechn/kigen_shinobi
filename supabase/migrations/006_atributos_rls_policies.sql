-- Libera atributos_personagem para o front (role anon).
-- O app NÃO usa Supabase Auth na ficha; a sessão é só no browser.
-- Sem policy de INSERT, o RLS bloqueia o save de combate.

ALTER TABLE public.atributos_personagem ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "atributos_select_anon" ON public.atributos_personagem;
DROP POLICY IF EXISTS "atributos_insert_anon" ON public.atributos_personagem;
DROP POLICY IF EXISTS "atributos_update_anon" ON public.atributos_personagem;
DROP POLICY IF EXISTS "atributos_select_public" ON public.atributos_personagem;
DROP POLICY IF EXISTS "atributos_insert_public" ON public.atributos_personagem;
DROP POLICY IF EXISTS "atributos_update_public" ON public.atributos_personagem;

-- Leitura pública das fichas
CREATE POLICY "atributos_select_public"
  ON public.atributos_personagem
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Criar linha de atributos (primeiro save de combate)
CREATE POLICY "atributos_insert_public"
  ON public.atributos_personagem
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Atualizar atributos existentes
CREATE POLICY "atributos_update_public"
  ON public.atributos_personagem
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Garante grants de tabela/sequence (RLS + GRANT)
GRANT SELECT, INSERT, UPDATE ON public.atributos_personagem TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
