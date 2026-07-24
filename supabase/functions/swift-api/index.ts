-- Edge Function de referência (Deno) — deploy no Supabase:
--   supabase functions deploy swift-api
--
-- Secrets: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
-- Nunca use a anon key aqui para ler senha_edicao.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { personagem_id, senha } = await req.json();

    if (!personagem_id || !senha) {
      return new Response(
        JSON.stringify({ valido: false, erro: 'Dados incompletos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    );

    const { data, error } = await supabase
      .from('personagens')
      .select('id, senha_edicao')
      .eq('id', personagem_id)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ valido: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const valido = data.senha_edicao === senha;

    // Nunca devolva a senha na resposta
    return new Response(
      JSON.stringify({ valido, personagem_id: valido ? data.id : null }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (_) {
    return new Response(
      JSON.stringify({ valido: false, erro: 'Erro interno' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
