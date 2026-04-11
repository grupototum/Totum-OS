# Configuração do Supabase para Autenticação

## 1. Configurar Redirect URLs

Acesse: https://app.supabase.com/project/cgpkfhrqprqptvehatad/auth/url-configuration

Adicione estas URLs em "Redirect URLs":
- `https://apps.grupototum.com/**`
- `https://apps.grupototum.com/reset-password`
- `http://localhost:5173/**` (para desenvolvimento)

## 2. Configurar E-mail SMTP (Opcional)

Para o "Esqueci minha senha" funcionar com e-mails, configure um SMTP:

Acesse: https://app.supabase.com/project/cgpkfhrqprqptvehatad/auth/providers

Na seção "SMTP Settings", configure:
- Host: smtp.gmail.com (ou seu servidor SMTP)
- Port: 587
- Username: seu-email@gmail.com
- Password: sua-senha-de-app

Ou use o e-mail padrão do Supabase (limitado).

## 3. Obter Service Role Key (Para reset de senha via API)

Acesse: https://app.supabase.com/project/cgpkfhrqprqptvehatad/settings/api

Copie a "service_role key" (SECRET) e adicione ao arquivo `.env` na VPS:

```bash
cd ~/Apps_totum_Oficial
echo "SUPABASE_SERVICE_KEY=sua-chave-aqui" >> .env
docker compose up -d --force-recreate
```

⚠️ **ATENÇÃO**: A service_role key tem permissões totais! Nunca a exponha no frontend.

## 4. Criar Usuário Master (Alternativa)

Se não quiser configurar SMTP, crie o usuário manualmente:

1. Acesse: https://app.supabase.com/project/cgpkfhrqprqptvehatad/auth/users
2. Clique em "Add user" → "Create new user"
3. Preencha:
   - Email: totumpersonalizados@gmail.com
   - Password: Totum@Apps120103
   - ✅ Auto-confirm email: ON
4. Clique "Create user"

## 5. Redefinir Senha via API (Requer Service Role Key)

Com a Service Role Key configurada, você pode redefinir senhas via API:

```bash
curl -X POST https://apps.grupototum.com/api/admin/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","newPassword":"nova_senha_123"}'
```

## Solução de Problemas

### "Esqueci minha senha" não envia e-mail
- Verifique se configurou o SMTP ou está usando o limite do Supabase
- Verifique se o domínio está nas Redirect URLs
- Verifique os logs: `docker compose logs -f`

### "Link inválido ou expirado" no reset
- Verifique se o domínio está nas Redirect URLs do Supabase
- O link expira em 1 hora

### Erro "No API key found"
- Verifique se as variáveis de ambiente estão configuradas no docker-compose.yml
- Reinicie o container: `docker compose up -d --force-recreate`
