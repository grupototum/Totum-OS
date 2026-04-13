# 📋 PROMPT PASSO 2 — KIMI CODE

**O COMPROMISSO DO ISRAEL**: Terminar PASSO 1 COMPLETO antes de iniciar PASSO 2

---

## 🎯 OBJETIVO DO PASSO 2

Construir a **interface visual completa** (Dashboard + Editor) e integrar com **Telegram** para que o sistema seja funcional end-to-end.

**Resultado esperado**: 
- ✅ Dashboard em `/agents` lista agentes
- ✅ Editor em `/agents/[id]/edit` com 6 abas
- ✅ Telegram bot responde mensagens
- ✅ Sistema pronto para usar em produção

**Tempo estimado**: 8-10 horas  
**Pré-requisito**: PASSO 1 100% completo

---

## 🚀 ORDEM DE EXECUÇÃO — 5 FASES

### **FASE 1: Frontend Hooks (30 min)**

**Objetivo**: Preparar lógica de comunicação com API

```bash
# 1. Hooks já foram copiados no PASSO 1, mas verificar
ls -la src/hooks/

# Deve ter:
# ✓ useAgents.ts (listar, deletar, reiniciar agentes)
# ✓ useAgentForm.ts (criar/editar agente)
```

**Se faltar algum arquivo**:
```bash
cp totum-agents-elizaos/frontend/hooks/useAgents.ts src/hooks/
cp totum-agents-elizaos/frontend/hooks/useAgentForm.ts src/hooks/
```

**Verificar tipos**:
```bash
npx tsc --noEmit
# Não deve ter erros de import de hooks
```

**Checkpoint**: Hooks importam sem erro? Se SIM → Continue. Se NÃO → Debugar imports.

---

### **FASE 2: Dashboard — Página Inicial (2-3 horas)**

**Objetivo**: Criar página `/agents` com grid de agentes

#### **ETAPA 2.1: Copiar componentes base**

```bash
# 1. Verificar componentes
ls -la src/components/agents/Dashboard/

# Deve ter:
# ✓ AgentCard.tsx (card individual do agente)

# Se faltar:
cp totum-agents-elizaos/frontend/components/AgentCard.tsx src/components/agents/Dashboard/
```

#### **ETAPA 2.2: Copiar página Dashboard**

```bash
# 1. Verificar página
ls -la src/app/agents/

# Deve ter:
# ✓ page.tsx (Dashboard)

# Se faltar:
cp totum-agents-elizaos/frontend/pages/agents-page.tsx src/app/agents/page.tsx
```

#### **ETAPA 2.3: Testar Dashboard**

```bash
# 1. Rodar servidor (se não estiver rodando)
npm run dev

# 2. Abrir navegador
open http://localhost:3000/agents

# 3. Verificar:
#    ✓ Página carrega sem erro
#    ✓ Mostra título "Nave-Mãe" (ou similar)
#    ✓ Mostra cards de templates
#    ✓ Mostra "Nenhum agente encontrado" (estado vazio)
#    ✓ Botão "Novo Agente" existe
```

**Se houver erro**:
```bash
# Ver console do navegador
# DevTools → Console tab
# Procurar por erros vermelhos

# Ver logs do servidor
# Terminal onde rodou npm run dev
# Procurar por erros
```

**Checkpoint**: Dashboard abre sem erro? Se SIM → Continue. Se NÃO → Debugar.

---

### **FASE 3: Editor de Agente (3-4 horas)**

**Objetivo**: Criar página `/agents/[id]/edit` com 6 abas

#### **ETAPA 3.1: Criar estrutura base do Editor**

```bash
# 1. Criar pastas
mkdir -p src/app/agents/\[id\]/edit

# 2. Criar arquivo base
touch src/app/agents/\[id\]/edit/page.tsx
```

#### **ETAPA 3.2: Implementar as 6 abas**

O arquivo `page.tsx` deve ter estas 6 abas:

```typescript
// src/app/agents/[id]/edit/page.tsx

export default function AgentEditorPage({ params: { id } }) {
  const [activeTab, setActiveTab] = useState('identity');

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Formulário esquerda */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="identity">Identidade</TabsTrigger>
          <TabsTrigger value="channels">Canais</TabsTrigger>
          <TabsTrigger value="brain">Cérebro</TabsTrigger>
          <TabsTrigger value="alexandria">Alexandria</TabsTrigger>
          <TabsTrigger value="actions">Ações</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* TAB 1: Identidade */}
        <TabsContent value="identity">
          {/* Nome, Bio, Emoji, Lore, Adjectives */}
        </TabsContent>

        {/* TAB 2: Canais */}
        <TabsContent value="channels">
          {/* Telegram (checkbox + token input) */}
          {/* Discord (checkbox + token input) */}
        </TabsContent>

        {/* TAB 3: Cérebro */}
        <TabsContent value="brain">
          {/* Tier selector (1, 2, 3) */}
          {/* Model override */}
          {/* Temperature slider */}
          {/* Max tokens */}
          {/* System prompt textarea com Monaco */}
        </TabsContent>

        {/* TAB 4: Alexandria */}
        <TabsContent value="alexandria">
          {/* List de documentos disponíveis */}
          {/* Checkbox para selecionar */}
          {/* Toggle RAG mode (static/dynamic) */}
          {/* Preview de conteúdo injetado */}
        </TabsContent>

        {/* TAB 5: Ações */}
        <TabsContent value="actions">
          {/* Skills disponibilizadas (MVP: mock) */}
          {/* Webhook config (MVP: mock) */}
        </TabsContent>

        {/* TAB 6: Preview */}
        <TabsContent value="preview">
          {/* Chat de teste (envia mensagem, recebe resposta) */}
        </TabsContent>
      </Tabs>

      {/* Live Preview direita */}
      <div className="col-span-1">
        {/* Chat preview aqui */}
      </div>
    </div>
  );
}
```

#### **ETAPA 3.3: Detalhes de cada aba**

**TAB 1: Identidade**
```typescript
<div className="space-y-4">
  <Input label="Nome" value={form.name} onChange={...} required />
  <Textarea label="Bio" value={form.bio} onChange={...} required />
  <Input label="Emoji" value={form.emoji} onChange={...} />
  <Textarea label="Lore" value={form.lore} onChange={...} />
  <Input label="Adjectives (comma-separated)" value={form.adjectives} onChange={...} />
</div>
```

**TAB 2: Canais**
```typescript
<div className="space-y-4">
  {/* Telegram */}
  <div className="border p-4 rounded">
    <label className="flex items-center gap-2">
      <Switch 
        checked={form.channels.find(c => c.type === 'telegram')?.enabled}
        onChange={(enabled) => updateChannel('telegram', enabled)}
      />
      <span>Telegram</span>
    </label>
    {form.channels.find(c => c.type === 'telegram')?.enabled && (
      <Input 
        label="Bot Token"
        placeholder="123456:ABCxyz..."
        value={form.channels.find(c => c.type === 'telegram')?.config?.token}
      />
    )}
  </div>

  {/* Discord (similar) */}
  <div className="border p-4 rounded">
    <label className="flex items-center gap-2">
      <Switch disabled /> {/* Disabled para MVP */}
      <span>Discord (V2)</span>
    </label>
  </div>
</div>
```

**TAB 3: Cérebro**
```typescript
<div className="space-y-4">
  {/* Tier */}
  <div>
    <label>Tier</label>
    <div className="flex gap-2">
      {[1, 2, 3].map(tier => (
        <button
          key={tier}
          onClick={() => setForm({...form, tier})}
          className={form.tier === tier ? 'bg-blue-500' : 'bg-gray-500'}
        >
          {tier === 1 ? 'Lab (Claude)' : tier === 2 ? 'Mid (Groq)' : 'Fab (Ollama)'}
        </button>
      ))}
    </div>
  </div>

  {/* Temperature */}
  <div>
    <label>Temperature: {form.temperature}</label>
    <input 
      type="range" 
      min="0" 
      max="1" 
      step="0.1"
      value={form.temperature}
      onChange={(e) => setForm({...form, temperature: parseFloat(e.target.value)})}
    />
  </div>

  {/* Max Tokens */}
  <Input 
    label="Max Tokens"
    type="number"
    value={form.max_tokens}
    onChange={(e) => setForm({...form, max_tokens: parseInt(e.target.value)})}
  />

  {/* System Prompt */}
  <Textarea
    label="System Prompt"
    value={form.system_prompt}
    onChange={(e) => setForm({...form, system_prompt: e.target.value})}
    rows={10}
  />
</div>
```

**TAB 4: Alexandria**
```typescript
<div className="space-y-4">
  {/* Lista de documentos (mock por enquanto) */}
  <div>
    <label className="font-semibold mb-2 block">Documentos Disponíveis</label>
    {mockDocuments.map(doc => (
      <label key={doc.id} className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          checked={form.knowledge_sources?.includes(doc.id)}
          onChange={(e) => updateKnowledge(doc.id, e.target.checked)}
        />
        <span>{doc.title}</span>
      </label>
    ))}
  </div>

  {/* RAG Mode */}
  <div>
    <label className="font-semibold mb-2 block">RAG Mode</label>
    <select value={form.rag_mode || 'static'} onChange={(e) => setForm({...form, rag_mode: e.target.value})}>
      <option value="static">Static Cache (MVP)</option>
      <option value="dynamic" disabled>Dynamic (V2)</option>
    </select>
  </div>

  {/* Preview */}
  <div className="bg-slate-900 p-4 rounded text-sm">
    <p className="text-slate-400 mb-2">Conteúdo a ser injetado no prompt:</p>
    <pre className="text-slate-200 text-xs overflow-auto max-h-32">
      {/* Mostrar conteúdo dos documentos selecionados */}
    </pre>
  </div>
</div>
```

**TAB 5: Ações** (MVP: mock)
```typescript
<div className="space-y-4">
  <p className="text-slate-400">Recursos de ações virão na V2</p>
  <p className="text-sm">Nesta versão, agentes podem:</p>
  <ul className="list-disc list-inside text-sm">
    <li>Responder mensagens no Telegram</li>
    <li>Usar Alexandria como contexto</li>
    <li>Exportar character.json</li>
  </ul>
</div>
```

**TAB 6: Preview**
```typescript
<div className="flex flex-col h-full">
  {/* Chat messages */}
  <div className="flex-1 overflow-y-auto bg-slate-900 rounded p-4 mb-4 space-y-2">
    {chatMessages.map((msg, i) => (
      <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
        <div className={msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-200'} style={{display: 'inline-block', padding: '8px 12px', borderRadius: '8px', maxWidth: '80%'}}>
          {msg.content}
        </div>
      </div>
    ))}
  </div>

  {/* Input */}
  <div className="flex gap-2">
    <input
      type="text"
      value={previewInput}
      onChange={(e) => setPreviewInput(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && sendPreviewMessage()}
      placeholder="Teste a mensagem aqui..."
      className="flex-1 bg-slate-800 text-white px-3 py-2 rounded"
    />
    <button onClick={sendPreviewMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
      Enviar
    </button>
  </div>
</div>
```

#### **ETAPA 3.4: Adicionar botões de ação**

No topo do formulário, adicionar:

```typescript
<div className="flex gap-2 mb-4">
  <button onClick={saveAgent} className="bg-green-500 text-white px-4 py-2 rounded">
    Publicar
  </button>
  <button onClick={goBack} className="bg-gray-500 text-white px-4 py-2 rounded">
    Cancelar
  </button>
  <button onClick={cloneAgent} className="text-blue-500 px-4 py-2 rounded border border-blue-500">
    Clonar
  </button>
  <button onClick={exportJSON} className="text-green-500 px-4 py-2 rounded border border-green-500">
    Exportar JSON
  </button>
</div>
```

#### **ETAPA 3.5: Testar Editor**

```bash
# 1. Abrir navegador
open http://localhost:3000/agents

# 2. Clicar "Novo Agente"
# Deve ir para /agents/new/edit

# 3. Preencher formulário
# - Nome: "LOKI-TEST"
# - Bio: "Teste de agente LOKI"
# - Emoji: "🦊"
# - System Prompt: "Você é LOKI, especialista em vendas"

# 4. Selecionar Telegram
# - Token: "fake_token_123" (para teste)

# 5. Selecionar Tier 2

# 6. Clicar "Publicar"

# 7. Deve voltar ao Dashboard
# 8. Novo agente deve aparecer na lista
```

**Checkpoint**: Editor funciona e cria agente? Se SIM → Continue. Se NÃO → Debugar.

---

### **FASE 4: Integração Telegram (3-4 horas)**

**Objetivo**: Fazer bot responder mensagens no Telegram

#### **ETAPA 4.1: Criar bot no Telegram**

```bash
# 1. Abrir Telegram
# 2. Procurar por @BotFather
# 3. Enviar /start
# 4. Enviar /newbot
# 5. Seguir instruções:
#    - Nome do bot: "Teste Totum" ou similar
#    - Username: "teste_totum_bot" (deve terminar com _bot)
# 6. BotFather vai retornar token
#    Exemplo: 123456:ABCxyz_DEFGH

# 7. COPIAR token
# 8. Guardar em local seguro
```

#### **ETAPA 4.2: Copiar implementação do Telegram Bot**

```bash
# 1. Verificar arquivo
ls -la totum-agents-elizaos/backend/telegram-bot.ts

# 2. Copiar para projeto
cp totum-agents-elizaos/backend/telegram-bot.ts src/lib/telegram/bot.ts

# 3. Verificar tipos
npx tsc --noEmit
# Não deve ter erros nesse arquivo
```

#### **ETAPA 4.3: Criar API para iniciar/parar bot**

```typescript
// src/app/api/agents/[id]/telegram/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { TelegramBot } from '@/lib/telegram/bot';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(...);
const bots = new Map<string, TelegramBot>();

export async function POST(request: NextRequest, { params: { id } }: any) {
  try {
    const body = await request.json();
    const action = body.action; // 'start' ou 'stop'

    // Buscar agente no banco
    const { data: agent } = await supabase
      .from('agents_config')
      .select('*')
      .eq('id', id)
      .single();

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Pegar token do Telegram
    const telegramChannel = agent.channels.find((c: any) => c.type === 'telegram');
    if (!telegramChannel?.config?.token) {
      return NextResponse.json({ error: 'Telegram token not configured' }, { status: 400 });
    }

    if (action === 'start') {
      // Iniciar bot
      const bot = new TelegramBot(telegramChannel.config.token, agent.system_prompt);
      bots.set(id, bot);
      await bot.start();

      // Atualizar status
      await supabase
        .from('agents_config')
        .update({ status: 'online' })
        .eq('id', id);

      return NextResponse.json({ success: true, message: 'Bot started' });
    } else if (action === 'stop') {
      // Parar bot
      const bot = bots.get(id);
      if (bot) {
        await bot.stop();
        bots.delete(id);
      }

      // Atualizar status
      await supabase
        .from('agents_config')
        .update({ status: 'offline' })
        .eq('id', id);

      return NextResponse.json({ success: true, message: 'Bot stopped' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

#### **ETAPA 4.4: Adicionar botão de iniciar/parar no AgentCard**

```typescript
// No AgentCard.tsx, adicionar:

const [isStartingBot, setIsStartingBot] = useState(false);

async function handleStartBot() {
  setIsStartingBot(true);
  try {
    await fetch(`/api/agents/${agent.id}/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start' })
    });
    // Atualizar status do card
    onRestart(agent.id);
  } finally {
    setIsStartingBot(false);
  }
}

// No botão Reiniciar, adicionar:
<button onClick={handleStartBot} disabled={isStartingBot}>
  {isStartingBot ? 'Iniciando...' : 'Iniciar Bot'}
</button>
```

#### **ETAPA 4.5: Testar Telegram**

```bash
# 1. Abrir Dashboard
open http://localhost:3000/agents

# 2. Clicar em agente existente
# 3. Ir para aba "Canais"
# 4. Colar token do bot em "Telegram Token"
# 5. Clicar "Publicar"
# 6. Voltar ao Dashboard
# 7. Clicar botão "Iniciar Bot" no agente

# 8. Abrir Telegram
# 9. Procurar bot (username)
# 10. Enviar mensagem: "Olá!"

# 11. Bot deve responder conforme system_prompt
```

**Checkpoint**: Bot responde no Telegram? Se SIM → Continue. Se NÃO → Debugar.

---

### **FASE 5: Polimento e QA (1-2 horas)**

#### **ETAPA 5.1: Adicionar mensagens de sucesso/erro**

```bash
# Instalar toast library
npm install sonner

# Adicionar Toast ao Provider
# src/app/layout.tsx
import { Toaster } from 'sonner';

export default function RootLayout(...) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

# Usar em componentes
import { toast } from 'sonner';

async function saveAgent() {
  try {
    await fetch('/api/agents', {...});
    toast.success('Agente publicado!');
  } catch (e) {
    toast.error('Erro ao publicar agente');
  }
}
```

#### **ETAPA 5.2: Validar responsividade**

```bash
# 1. Abrir DevTools (F12)
# 2. Clicar ícone de dispositivo (responsividade)
# 3. Testar em:
#    - iPhone (375px)
#    - iPad (768px)
#    - Desktop (1920px)
```

#### **ETAPA 5.3: Testar dark mode**

```bash
# Verificar se componentes shadcn têm dark mode
# Toda interface deve ficar legível em dark
```

#### **ETAPA 5.4: Testar export character.json**

```bash
# 1. Abrir agente no editor
# 2. Clicar menu → Exportar JSON
# 3. Deve download um arquivo character.json
# 4. Abrir arquivo e verificar:
#    ✓ {
#      "id": "...",
#      "name": "...",
#      "bio": "...",
#      "system": "...",
#      "clients": ["telegram"],
#      ...
#    }
```

**Checkpoint**: Tudo funciona sem erro? Se SIM → Você completou PASSO 2!

---

## ✅ CHECKLIST FINAL DO PASSO 2

Antes de avisar "Passo 2 terminado", verifique:

```
[ ] Dashboard em /agents carrega sem erro
[ ] Cards de templates aparecem
[ ] Botão "Novo Agente" funciona
[ ] Editor em /agents/[id]/edit abre
[ ] Todas 6 abas aparecem e funcionam
[ ] Aba Identidade: nome, bio, emoji, lore, adjectives
[ ] Aba Canais: Telegram com token input
[ ] Aba Cérebro: tier, temperatura, max tokens, system prompt
[ ] Aba Alexandria: lista documentos (mock)
[ ] Aba Ações: placeholder para V2
[ ] Aba Preview: chat de teste
[ ] Formulário salva agente no Supabase
[ ] Agente novo aparece no Dashboard
[ ] Bot Telegram criado (@BotFather)
[ ] Token Telegram configurado no formulário
[ ] Bot inicia e responde mensagens
[ ] Export de character.json funciona
[ ] Toast notifications (sucesso/erro) aparecem
[ ] UI responsiva (mobile, tablet, desktop)
[ ] Dark mode funciona
```

**Se TODOS checkboxes estão ✅**: Você completou PASSO 2!

---

## 📤 QUANDO TERMINAR PASSO 2

Abra NOVO terminal (deixa `npm run dev` rodando) e execute:

```bash
# 1. Status final
git status

# 2. Add mudanças
git add -A

# 3. Commit
git commit -m "feat: passo-2 complete - dashboard, editor 6 abas e integração telegram"

# 4. Push
git push origin main

# 5. Avisar
# "Passo 2 completo! Pronto para conferência final"
```

---

## 🎯 DEFINIÇÃO DE SUCESSO — PASSO 2

Quando você terminar, você consegue:

1. ✅ Abrir Dashboard em `/agents`
2. ✅ Ver agentes em grid com cards
3. ✅ Clicar "Novo Agente" → abrir editor
4. ✅ Preencher 6 abas do formulário
5. ✅ Publicar agente → aparece no Dashboard
6. ✅ Configurar token Telegram
7. ✅ Iniciar bot → responder no Telegram
8. ✅ Exportar character.json

**Isto é o MÍNIMO para MVP estar PRONTO.**

---

**Boa sorte! 🚀**

Avise quando terminar. Depois envio conferência final.

