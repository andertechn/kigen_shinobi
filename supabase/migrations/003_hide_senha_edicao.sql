-- ============================================================
-- Esconde senha_edicao do cliente (anon / authenticated)
-- A validação deve ser só via Edge Function (service_role).
-- ============================================================

REVOKE SELECT (senha_edicao) ON TABLE public.personagens FROM anon;
REVOKE SELECT (senha_edicao) ON TABLE public.personagens FROM authenticated;
REVOKE UPDATE (senha_edicao) ON TABLE public.personagens FROM anon;
REVOKE UPDATE (senha_edicao) ON TABLE public.personagens FROM authenticated;

-- Confirmação: depois deste SQL, isto DEVE falhar com a anon key:
--   GET /rest/v1/personagens?select=senha_edicao
--
-- select=* também falha (por incluir a coluna). O app usa select explícito.
--
-- NOTIFY pgrst, 'reload schema';
