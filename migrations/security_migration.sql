-- =============================================================
-- MIGRAÇÃO DE SEGURANÇA — Frota+
-- Execute este script no Supabase SQL Editor (Dashboard → SQL)
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- PASSO 0 (manual, fora do SQL):
--   Antes de executar este script, acesse:
--   Supabase Dashboard → Authentication → Providers → Email
--   → Desative "Confirm email"
--   Isso permite que novos usuários criados pelo gestor façam
--   login imediatamente sem precisar confirmar e-mail.
-- ─────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────
-- PASSO 1: Criar os usuários existentes no Supabase Auth
--   Para cada usuário já cadastrado na tabela `usuarios`,
--   acesse: Dashboard → Authentication → Users → Add User
--   Use o mesmo e-mail e a senha atual (que está em texto puro
--   na tabela agora). Após confirmar o login pelo app, apague
--   o campo senha conforme o Passo 4.
--
--   Alternativamente, execute via API (requer service_role key):
--   POST https://<projeto>.supabase.co/auth/v1/admin/users
--   Authorization: Bearer <service_role_key>
--   Body: { "email": "...", "password": "...", "email_confirm": true }
-- ─────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────
-- PASSO 2: Remover políticas RLS permissivas (anon acessa tudo)
-- ─────────────────────────────────────────────────────────────

-- Remove todas as políticas existentes nas tabelas principais
DROP POLICY IF EXISTS "allow_all" ON usuarios;
DROP POLICY IF EXISTS "allow_all_anon" ON usuarios;
DROP POLICY IF EXISTS "Permitir acesso total anon" ON usuarios;

DROP POLICY IF EXISTS "allow_all" ON veiculos;
DROP POLICY IF EXISTS "allow_all_anon" ON veiculos;
DROP POLICY IF EXISTS "Permitir acesso total anon" ON veiculos;

DROP POLICY IF EXISTS "allow_all" ON movimentacoes;
DROP POLICY IF EXISTS "allow_all_anon" ON movimentacoes;
DROP POLICY IF EXISTS "Permitir acesso total anon" ON movimentacoes;

DROP POLICY IF EXISTS "allow_all" ON evidencias_movimentacao;
DROP POLICY IF EXISTS "allow_all_anon" ON evidencias_movimentacao;
DROP POLICY IF EXISTS "Permitir acesso total anon" ON evidencias_movimentacao;

-- ─────────────────────────────────────────────────────────────
-- PASSO 3: Criar novas políticas — apenas usuários autenticados
--   (role = 'authenticated' = usuário com sessão Supabase Auth válida)
--   Usuários não autenticados (anon) não terão NENHUM acesso.
-- ─────────────────────────────────────────────────────────────

-- USUARIOS
CREATE POLICY "usuarios_select_auth" ON usuarios
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "usuarios_insert_auth" ON usuarios
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "usuarios_update_auth" ON usuarios
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "usuarios_delete_auth" ON usuarios
  FOR DELETE TO authenticated USING (true);

-- VEICULOS
CREATE POLICY "veiculos_select_auth" ON veiculos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "veiculos_insert_auth" ON veiculos
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "veiculos_update_auth" ON veiculos
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "veiculos_delete_auth" ON veiculos
  FOR DELETE TO authenticated USING (true);

-- MOVIMENTACOES
CREATE POLICY "movimentacoes_select_auth" ON movimentacoes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "movimentacoes_insert_auth" ON movimentacoes
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "movimentacoes_update_auth" ON movimentacoes
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "movimentacoes_delete_auth" ON movimentacoes
  FOR DELETE TO authenticated USING (true);

-- EVIDENCIAS
CREATE POLICY "evidencias_select_auth" ON evidencias_movimentacao
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "evidencias_insert_auth" ON evidencias_movimentacao
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "evidencias_update_auth" ON evidencias_movimentacao
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "evidencias_delete_auth" ON evidencias_movimentacao
  FOR DELETE TO authenticated USING (true);

-- ─────────────────────────────────────────────────────────────
-- PASSO 4: Remover coluna senha (APENAS após confirmar que
--   TODOS os usuários conseguem fazer login via Supabase Auth)
-- ─────────────────────────────────────────────────────────────

-- ALTER TABLE usuarios DROP COLUMN IF EXISTS senha;

-- ─────────────────────────────────────────────────────────────
-- PASSO 5 (opcional / futuro): Adicionar constraints de validação
-- ─────────────────────────────────────────────────────────────

-- Garante que km_final >= km_inicial ao finalizar uma viagem
-- NOT VALID = só valida novos registros, não verifica linhas históricas
ALTER TABLE movimentacoes DROP CONSTRAINT IF EXISTS chk_km_final_valido;
ALTER TABLE movimentacoes
  ADD CONSTRAINT chk_km_final_valido
  CHECK (km_final IS NULL OR km_final >= km_inicial)
  NOT VALID;

-- Garante que data_fim >= data_inicio
ALTER TABLE movimentacoes DROP CONSTRAINT IF EXISTS chk_data_fim_valida;
ALTER TABLE movimentacoes
  ADD CONSTRAINT chk_data_fim_valida
  CHECK (data_fim IS NULL OR data_fim >= data_inicio)
  NOT VALID;

-- =============================================================
-- FIM DA MIGRAÇÃO
-- =============================================================
