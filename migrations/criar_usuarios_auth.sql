-- =============================================================
-- CRIAR USUÁRIOS NO SUPABASE AUTH A PARTIR DA TABELA usuarios
-- Execute no Supabase Dashboard → SQL Editor
-- =============================================================
-- Este script lê os e-mails e senhas (ainda em texto puro) da
-- tabela `usuarios` e cria as contas correspondentes em auth.users,
-- com a senha devidamente hasheada (bcrypt).
-- Execute ANTES de tentar fazer login pelo app.
-- =============================================================

DO $$
DECLARE
  u   RECORD;
  uid uuid;
BEGIN
  FOR u IN
    SELECT email, senha FROM usuarios
    WHERE email IS NOT NULL AND senha IS NOT NULL
  LOOP
    -- Verifica se já existe em auth.users
    SELECT id INTO uid FROM auth.users WHERE email = lower(u.email);

    IF uid IS NULL THEN
      -- Cria o usuário em auth.users
      uid := gen_random_uuid();

      INSERT INTO auth.users (
        id, instance_id, aud, role, email,
        encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
      ) VALUES (
        uid,
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated',
        lower(u.email),
        crypt(u.senha, gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        NOW(), NOW(),
        '', '', '', ''
      );

      RAISE NOTICE 'Usuário criado em auth.users: %', u.email;
    ELSE
      RAISE NOTICE 'auth.users já existe para: %', u.email;
    END IF;

    -- Cria identity se ainda não existir (necessário para login funcionar)
    IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = uid) THEN
      INSERT INTO auth.identities (
        id, user_id, provider_id, identity_data,
        provider, last_sign_in_at, created_at, updated_at
      ) VALUES (
        uid, uid,
        lower(u.email),
        json_build_object('sub', uid::text, 'email', lower(u.email)),
        'email',
        NOW(), NOW(), NOW()
      );

      RAISE NOTICE 'Identity criada para: %', u.email;
    ELSE
      RAISE NOTICE 'Identity já existe para: %', u.email;
    END IF;

  END LOOP;
END $$;

-- Verificação: lista os usuários criados em auth.users
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;
