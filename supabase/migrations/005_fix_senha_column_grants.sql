-- Reaplica grants públicos sem senha_edicao
REVOKE SELECT, UPDATE ON TABLE public.personagens FROM anon, authenticated;

GRANT SELECT (
  id, nome_player, numero_player, estilo_vida, nome_personagem, aniversario, pais_vila, idade, genero, tipo_sanguineo, clan, patente_ninja, elemento_basico, nome_guerra, patente_samurai, classe_civil, dinastia, cargo_inicial, descricao, data_criacao, data_aprovacao, motivo_rejeicao, aprovado_por_id, status, aparencia, aparencia_link, foto_capa, ryos, score, hp_max, historico_alteracoes, altura, peso, cabelos, olhos, historia, gosta_de, nao_gosta_de, proposito_1, proposito_2, proposito_3, proposito_4, proposito_5, titulo_1, titulo_2, titulo_3, titulo_4, titulo_5, titulo_6, titulo_7, titulo_9, titulo_10, tecnicas, relacoes, hp_atual, patente, origem_nascimento, local_reside, profissao, foto_perfil, chakra_atual, chakra_max, missao_s, missao_a, missao_b, missao_c, missao_d, historico_graduacoes
) ON TABLE public.personagens TO anon, authenticated;

GRANT UPDATE (
  nome_player, numero_player, estilo_vida, nome_personagem, aniversario, pais_vila, idade, genero, tipo_sanguineo, clan, patente_ninja, elemento_basico, nome_guerra, patente_samurai, classe_civil, dinastia, cargo_inicial, descricao, data_aprovacao, motivo_rejeicao, aprovado_por_id, status, aparencia, aparencia_link, foto_capa, ryos, score, hp_max, historico_alteracoes, altura, peso, cabelos, olhos, historia, gosta_de, nao_gosta_de, proposito_1, proposito_2, proposito_3, proposito_4, proposito_5, titulo_1, titulo_2, titulo_3, titulo_4, titulo_5, titulo_6, titulo_7, titulo_9, titulo_10, tecnicas, relacoes, hp_atual, patente, origem_nascimento, local_reside, profissao, foto_perfil, chakra_atual, chakra_max, missao_s, missao_a, missao_b, missao_c, missao_d, historico_graduacoes
) ON TABLE public.personagens TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
