# 🌐 PASSO B1 — DEPLOY EM PRODUÇÃO (Vercel)

**Tempo Estimado**: 3-5 dias (a maior parte é DNS propagar)  
**Esforço**: 🟢 Baixo  
**Complexidade**: 🟢 Baixa (Vercel automático)  
**Status**: Começar AGORA

---

## 📌 RESUMO EXECUTIVO

Você vai:
1. Fazer build final (5 min)
2. Conectar GitHub ao Vercel (5 min)
3. Configurar variáveis de ambiente (10 min)
4. Deploy automático (2-3 min)
5. Configurar domínio (opcional, 15 min)
6. Testar em produção (10 min)

**Total**: ~1h de trabalho + 24-72h aguardando DNS

---

## 🎯 CHECKLIST PRÉ-DEPLOY

Antes de começar, valide:

```
[ ] Código está limpo (git status vazio)
[ ] Passo 3 foi commitado no GitHub
[ ] npm run build passa sem erro
[ ] npm run dev funciona localmente
[ ] .env.local tem todas as variáveis
[ ] TypeScript validado (npx tsc --noEmit)
```

Se algo falta, volte e corrija ANTES de fazer deploy.

---

## ✅ ETAPA 1: Build Final (5 min)

No seu terminal, na pasta do projeto:

```bash
# 1. Limpar caches antigos
rm -rf .next
rm -rf node_modules/.cache

# 2. Instalar dependências fresh
npm install

# 3. Build final
npm run build

# Você deve ver:
# ✓ Compiled successfully
# ✓ 3828 modules
# ✓ ~4 segundos
# ✓ 0 errors
```

**Checkpoint**: Build passou? [ ] SIM → Continue | [ ] NÃO → Debugar antes

---

## ✅ ETAPA 2: Preparar Variáveis de Ambiente

O Vercel precisa das mesmas variáveis que você tem em `.env.local`.

**Etapa 2a: Listar Variáveis Necessárias**

```bash
# Terminal: Ver que variáveis você está usando
cat .env.local

# Você deve ter algo como:
NEXT_PUBLIC_SUPABASE_URL=https://cgpkfhrqprqptvehatad.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Etapa 2b: Copiar os Valores**

```bash
# NÃO commite .env.local no GitHub (já deve estar em .gitignore)
# Vamos copiar valores manualmente para Vercel

# Abra seu .env.local e copie cada valor:
1. NEXT_PUBLIC_SUPABASE_URL
2. SUPABASE_SERVICE_ROLE_KEY
3. NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Qualquer outra que você tenha adicionado

# Você vai precisar desses valores na próxima etapa
```

**Checkpoint**: Você tem os 3 valores? [ ] SIM → Continue | [ ] NÃO → Copiar do .env.local agora

---

## ✅ ETAPA 3: Conectar GitHub ao Vercel

Vercel vai monitorar seu GitHub e fazer deploy automático a cada push.

**Passo 1: Abra Vercel**

```
1. Abra: https://vercel.com
2. Faça login (ou crie conta grátis)
3. Clique "Add New..." no painel principal
4. Selecione "Project"
```

**Passo 2: Importar Repositório**

```
1. Clique "Import Git Repository"
2. Selecione "GitHub" (você deve autorizar no primeiro uso)
3. Procure: "grupototum/Apps_totum_Oficial"
4. Clique "Import"
```

**Passo 3: Configurar Project**

```
Você verá página de configuração:

Product name: Apps_totum_Oficial (ou pode mudar)

Framework: Next.js (Vercel auto-detecta) ✓

Root Directory: ./ (padrão OK)

Environment Variables: ← IMPORTANTE!
  Adicione as 3 variáveis que você copiou:
  
  NEXT_PUBLIC_SUPABASE_URL = [cole o valor]
  SUPABASE_SERVICE_ROLE_KEY = [cole o valor]
  NEXT_PUBLIC_SUPABASE_ANON_KEY = [cole o valor]

Depois de adicionar cada uma:
[ ] NEXT_PUBLIC_SUPABASE_URL adicionada ✓
[ ] SUPABASE_SERVICE_ROLE_KEY adicionada ✓
[ ] NEXT_PUBLIC_SUPABASE_ANON_KEY adicionada ✓

Botão no fim da página: "Deploy"
Clique "Deploy"
```

**Checkpoint**: Você clicou Deploy? [ ] SIM → Continue | [ ] NÃO → Fazer agora

---

## ✅ ETAPA 4: Aguardar Deploy (2-5 min)

Vercel está compilando seu projeto.

Você vai ver página com progresso:

```
Building...
├─ Git Committed
├─ Installing Dependencies
├─ Analyzing source code
├─ Building application
├─ Generating serverless functions
└─ Done! Ready for production

Deployment: https://apps-totum-oficial.vercel.app
```

**Aguarde até ver verde**: "Ready for production" ✓

**Tempo**: Normalmente 2-5 minutos.

Você pode verificar logs se houver problema:
- Clique "View Logs"
- Procure por erros (linhas vermelhas)
- Se houver erro → copie e mande para Claude (chat) debugar

**Checkpoint**: Deployment completou com sucesso? [ ] SIM → Continue | [ ] NÃO → Ver logs

---

## ✅ ETAPA 5: Testar Deploy (10 min)

Agora você tem aplicação live!

**Teste 1: Abra a URL**

```
1. Clique na URL que Vercel forneceu
   Exemplo: https://apps-totum-oficial.vercel.app

2. Você deve ver dashboard carregando

3. Aguarde 3-5 segundos para dados carregarem

4. Se não carrega: 
   - Abra DevTools (F12)
   - Console tab
   - Procure por erros
   - Provavelmente erro de Supabase (variáveis)
```

**Teste 2: Navegue no Dashboard**

```
[ ] Página /agents carrega
[ ] Vejo grid com agentes
[ ] Posso filtrar por nome
[ ] Botão "Novo Agente" existe
```

**Teste 3: Crie um Agente de Teste**

```
[ ] Clico "Novo Agente"
[ ] Vou para /agents/new/edit
[ ] Editor abre com 6 abas
[ ] Preencho dados simples:
    - Nome: "PROD-TEST-001"
    - Bio: "Teste em produção"
    - Tier: 2
[ ] Clico "Publicar"
[ ] Agente aparece no dashboard
```

**Teste 4: Verificar no Supabase**

```
1. Abra Supabase: https://app.supabase.com
2. Projeto: cgpkfhrqprqptvehatad
3. Tables → agents_config
4. Procure por "PROD-TEST-001"
5. Você deve ver o agente que criou em produção ✓
```

**Se tudo OK**: ✅ Deploy sucedido! Continue para próxima etapa.

**Se algo falhou**: 
- Erro comum: Supabase keys erradas
  → Volte para Vercel → Project Settings → Environment Variables
  → Corrija a variável
  → Clique "Redeploy" (botão no topo)

**Checkpoint**: Agente de teste criado em produção? [ ] SIM → Continue | [ ] NÃO → Debugar

---

## ✅ ETAPA 6: Limpar (Opcional)

Deletar agente de teste:

```
1. Dashboard (seu site live)
2. Clique em "PROD-TEST-001"
3. Clique botão "Delete" (ou menu)
4. Confirme
5. Agente deletado ✓
```

---

## ✅ ETAPA 7: Configurar Domínio Personalizado (Opcional)

Seu site está em: `https://apps-totum-oficial.vercel.app`

Mas você pode usar seu próprio domínio (ex: `totum-agents.com`).

**Opção A: Você já tem domínio**

```
1. Vercel Project → Settings → Domains
2. Adicionar domínio customizado
3. Seguir instruções para atualizar DNS
4. Esperar 24-48h para propagar
```

**Opção B: Você não tem domínio**

```
1. Compre em: Namecheap, GoDaddy, Hostinger (R$30-50/ano)
2. Depois configure em Vercel (opção A acima)
```

Para esse projeto, você pode deixar `vercel.app` por enquanto.

---

## ✅ ETAPA 8: Configurar Auto-Deploy

Vercel já está configurado para auto-deploy!

**Como funciona:**

```
1. Você fazer git push no GitHub
2. Vercel detecta novo push (webhook automático)
3. Vercel faz npm run build
4. Se compilar ok → deploy automático
5. Seu site está atualizado em 2-5 min

Sem fazer nada manual!
```

**Teste:**

```
1. Abra código localmente
2. Faça mudança mínima (ex: adicione emoji em um lugar)
3. git add -A
4. git commit -m "test: auto-deploy test"
5. git push origin main
6. Abra Vercel → Deployments
7. Você verá novo deployment iniciando
8. Aguarde 2-5 min
9. Seu site atualizado automaticamente ✓
```

---

## 📊 STATUS DO DEPLOY

```
Antes:  System rodando em localhost:3000
        Só você consegue acessar

Agora:  System rodando em produção
        Link: https://apps-totum-oficial.vercel.app
        Qualquer pessoa consegue acessar
        Auto-deploys em cada git push
```

---

## 🎯 PRÓXIMAS ETAPAS

Após este PASSO B1 estar concluído:

**Imediato** (mesma hora):
```
Copiar link de produção
Compartilhar com time
"Sistema está live em: https://apps-totum-oficial.vercel.app"
```

**Próxima Fase** (começar OPÇÃO A - 39 Agentes):
```
Abrir: ONBOARDING_39_AGENTES_ROADMAP.md
Começar inventário dos agentes
```

---

## 🆘 Se Travar

### Erro: "Build failed"
```
Solução:
1. Vercel vai te avisar o erro
2. Ver Logs → procure linha vermelha
3. Erro comum: falta de variável de ambiente
   → Volta em ETAPA 3, adiciona variável
   → Clique "Redeploy"
```

### Erro: "Cannot connect to Supabase"
```
Solução:
1. Verificar variáveis em Vercel Settings
2. NEXT_PUBLIC_SUPABASE_URL deve estar certo
3. SUPABASE_SERVICE_ROLE_KEY não pode estar vazia
4. Se corrigiu: Redeploy
```

### Erro: "Blank page / 404"
```
Solução:
1. Aguarde 5-10 min após deploy
2. Refresh na página (Ctrl+F5 hard refresh)
3. Se continua: Verificar Vercel Logs
```

### Domínio DNS não propaga
```
Solução:
1. DNS demora 24-48h para propagar globalmente
2. Enquanto isso, use: apps-totum-oficial.vercel.app
3. Você pode checar status em: whatsmydns.net
```

---

## ✅ CHECKLIST FINAL PASSO B1

```
[ ] Build rodou sem erro localmente
[ ] Conectei GitHub ao Vercel
[ ] Adicionei 3 variáveis de ambiente
[ ] Deploy completou (verde no Vercel)
[ ] Abri URL e carregou
[ ] Criei agente de teste em produção
[ ] Agente aparece no Supabase
[ ] Deletei agente de teste
[ ] Testei auto-deploy (git push)
[ ] Site atualiza automaticamente ✓
```

**Todos marcados?** [ ] SIM → PASSO B1 COMPLETO! ✅

---

## 🎉 PARABÉNS!

Seu sistema está **LIVE EM PRODUÇÃO**!

**Link**: https://apps-totum-oficial.vercel.app (ou seu domínio)

**Agora**: Continue para OPÇÃO A (39 Agentes)

Abra: `ONBOARDING_39_AGENTES_ROADMAP.md`

---

**Pronto? Começamos Passo B1 agora! 🚀**

