-- =============================================================
-- NOTIFICAÇÕES — Frota+
-- Execute no Supabase Dashboard → SQL Editor
-- =============================================================

-- PASSO 1: Adicionar coluna de push token na tabela usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS expo_push_token TEXT;

-- =============================================================
-- PASSO 2: Deploy da Edge Function (via terminal, 1 única vez)
-- =============================================================
-- Instale o Supabase CLI se não tiver:
--   npm install -g supabase
--
-- Faça login e linke o projeto:
--   supabase login
--   supabase link --project-ref qnwpqmwuyhnsyzwjmdle
--
-- Deploy da função:
--   supabase functions deploy check-open-trips --no-verify-jwt
--
-- =============================================================
-- PASSO 3: Agendar o disparo diário às 17h30 (horário de Brasília)
--          17h30 BRT = 20h30 UTC
-- Execute este bloco no SQL Editor após fazer o deploy da função:
-- =============================================================

-- Habilita a extensão pg_cron (se ainda não estiver ativa)
-- Acesse: Dashboard → Database → Extensions → pg_cron → Enable

-- Habilita a extensão pg_net (necessária para chamadas HTTP)
-- Acesse: Dashboard → Database → Extensions → pg_net → Enable

-- Agenda o job (rode após ativar as extensões acima)
SELECT cron.schedule(
  'alerta-viagem-aberta-17h30',   -- nome do job (único)
  '30 20 * * *',                  -- cron: 20:30 UTC = 17:30 BRT, todos os dias
  $$
    SELECT net.http_post(
      url     := 'https://qnwpqmwuyhnsyzwjmdle.supabase.co/functions/v1/check-open-trips',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer sb_publishable_RtTygttIwekWTyKqhtA0oA_08HOMOBq'
      ),
      body    := '{}'::jsonb
    );
  $$
);

-- Para verificar se o job foi criado:
-- SELECT * FROM cron.job;

-- Para remover o job (se precisar reconfigurar):
-- SELECT cron.unschedule('alerta-viagem-aberta-17h30');

-- =============================================================
-- FIM
-- =============================================================
