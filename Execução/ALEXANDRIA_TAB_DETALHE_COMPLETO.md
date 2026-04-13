# 🧠 Aba Alexandria — Detalhe Técnico Completo

**Context**: Esta é a aba mais crítica do editor. Ela transforma o agente de "bot genérico" para "especialista em Totum".

---

## 📐 Componente: AlexandriaTab.tsx

```typescript
// src/components/agents/Editor/AlexandriaTab.tsx

import { useState, useEffect } from 'react';
import { Brain, Check, AlertCircle, Zap } from 'lucide-react';
import { TotumAgentConfig } from '@/types/agents-elizaos';
import { useAlexandria } from '@/hooks/useAlexandria';

interface Props {
  agent: TotumAgentConfig;
  onChange: (agent: TotumAgentConfig) => void;
}

export default function AlexandriaTab({ agent, onChange }: Props) {
  const { documents, loading, error } = useAlexandria.getAvailableDocuments();
  const [selectedDocs, setSelectedDocs] = useState<string[]>(agent.knowledge_sources || []);
  const [ragMode, setRagMode] = useState<'static' | 'dynamic'>(agent.rag_mode || 'static');
  const [learningMode, setLearningMode] = useState(false);

  useEffect(() => {
    onChange({
      ...agent,
      knowledge_sources: selectedDocs,
      rag_mode: ragMode,
      knowledge_enabled: selectedDocs.length > 0,
    });
  }, [selectedDocs, ragMode]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <Brain size={24} className="text-purple-400" />
        <div>
          <h2 className="font-semibold text-lg">Alexandria Intelligence</h2>
          <p className="text-sm text-gray-400">
            Conecte documentos para transformar este agente em especialista
          </p>
        </div>
      </div>

      {/* STATUS */}
      {selectedDocs.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-300">
          <Check size={16} />
          {selectedDocs.length} documento{selectedDocs.length !== 1 ? 's' : ''} conectado{selectedDocs.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* MODO RAG */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-3">Modo de Acesso</label>
          <div className="grid grid-cols-2 gap-3">
            {/* Static Mode */}
            <button
              onClick={() => setRagMode('static')}
              className={`p-4 rounded-lg border-2 transition text-left ${
                ragMode === 'static'
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              <div className="font-semibold flex items-center gap-2 mb-1">
                <Zap size={16} className="text-yellow-400" />
                Cache Estático (MVP)
              </div>
              <p className="text-xs text-gray-400">
                Documentos carregados uma vez. Rápido, previsível.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                ✓ Mais rápido | ✗ Sem atualizações dinâmicas
              </p>
            </button>

            {/* Dynamic Mode */}
            <button
              onClick={() => setRagMode('dynamic')}
              disabled // Desabilitado em MVP
              className="p-4 rounded-lg border-2 border-gray-700 bg-gray-800 opacity-50 cursor-not-allowed text-left"
            >
              <div className="font-semibold flex items-center gap-2 mb-1">
                <Brain size={16} className="text-cyan-400" />
                RAG Dinâmico (V2)
              </div>
              <p className="text-xs text-gray-400">
                Busca em tempo real. Inteligente, mais lento.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                ✓ Atualizações ao vivo | ✗ Mais caro em tokens
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* SELETOR DE DOCUMENTOS */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold">Documentos Acessíveis</label>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-300">
            <AlertCircle size={16} />
            Erro ao carregar documentos: {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-center text-gray-400">
            Nenhum documento disponível no Alexandria.
            <br />
            <span className="text-xs mt-2 block">Crie ou vincule documentos antes.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <DocumentItem
                key={doc.id}
                doc={doc}
                selected={selectedDocs.includes(doc.id)}
                onToggle={(checked) => {
                  if (checked) {
                    setSelectedDocs([...selectedDocs, doc.id]);
                  } else {
                    setSelectedDocs(selectedDocs.filter(id => id !== doc.id));
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* LEARNING MODE (Future) */}
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={learningMode}
            onChange={(e) => setLearningMode(e.target.checked)}
            disabled // Desabilitado em MVP
            className="w-4 h-4"
          />
          <div>
            <div className="font-semibold text-sm">Modo Aprendizado (V2)</div>
            <p className="text-xs text-gray-400">
              Permitir que este agente salve novas informações no Alexandria
            </p>
          </div>
        </label>
      </div>

      {/* PREVIEW DO PROMPT */}
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <h3 className="text-sm font-semibold mb-3">Preview do Contexto</h3>
        <div className="bg-black/50 p-3 rounded text-xs font-mono text-gray-400 max-h-40 overflow-y-auto">
          {selectedDocs.length === 0 ? (
            <p className="text-gray-500">Nenhum documento selecionado.</p>
          ) : (
            <>
              <p className="text-cyan-400 mb-2">// Sistema injeta este contexto no prompt:</p>
              <p className="mb-2">
                Você tem acesso aos seguintes documentos Alexandria:
              </p>
              <ul>
                {selectedDocs.map((docId) => {
                  const doc = documents.find(d => d.id === docId);
                  return doc ? (
                    <li key={docId} className="text-purple-300">
                      • {doc.title} (POP-{doc.id.slice(0, 4).toUpperCase()})
                    </li>
                  ) : null;
                })}
              </ul>
              <p className="mt-3 text-gray-500">
                Sempre consulte esses documentos antes de responder. Cite-os.
              </p>
            </>
          )}
        </div>
      </div>

      {/* INFO */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-300">
        <p className="font-semibold mb-1">💡 Dica</p>
        <p>
          Em MVP, os documentos são carregados no system prompt direto. Em V2, usaremos
          busca vetorial no Supabase (pgvector) para injetar contexto dinamicamente.
        </p>
      </div>
    </div>
  );
}

// ============================================
// Componente Auxiliar: DocumentItem
// ============================================

interface DocumentItemProps {
  doc: {
    id: string;
    title: string;
    source: string;
    tags: string[];
    updated_at: string;
  };
  selected: boolean;
  onToggle: (checked: boolean) => void;
}

function DocumentItem({ doc, selected, onToggle }: DocumentItemProps) {
  return (
    <label className="flex items-start gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 cursor-pointer transition">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onToggle(e.target.checked)}
        className="w-4 h-4 mt-1"
      />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{doc.title}</div>
        <p className="text-xs text-gray-400 mt-1">{doc.source}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {doc.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Atualizado: {new Date(doc.updated_at).toLocaleDateString('pt-BR')}
        </p>
      </div>
      {selected && (
        <div className="text-green-400 mt-1">
          <Check size={20} />
        </div>
      )}
    </label>
  );
}
```

---

## 🎯 Fluxo de Interação

### Cenário 1: Criar Agente Novo + Alexandria

```
1. Usuário clica "Novo Agente" (Dashboard)
2. Abre /agents/new → Editor (AgentForm)
3. Preenche abas:
   - Identidade: Nome, Bio, Emoji ✓
   - Capacidades: Telegram ✓
   - Canais: Token do Telegram ✓
   - Cérebro: Claude, temp=0.7 ✓
   - Alexandria: ← AQUI
     a) Vê lista de docs em Alexandria
     b) Seleciona "POP-001", "Manual-Clientes", "Guia-Totum"
     c) Mode = "Static Cache"
     d) Preview mostra prompt com contexto
   - Ações: (deixa default)
4. Clica "Publicar"
5. Backend:
   a) Salva agents_config
   b) Insere 3 linhas em agent_knowledge_access
   c) Carrega texto dos 3 docs (static cache)
   d) Injeta no system prompt: 
      "Você tem acesso a: [doc1], [doc2], [doc3]. Sempre consulte."
   e) Gera Character File com knowledge[]
6. Agente vai online
7. Usuário testa no LivePreview
```

### Cenário 2: Editar Agente + Trocar Documentos

```
1. Dashboard → Clica no agente
2. /agents/[id]/edit abre
3. Carrega dados pré-preenchidos
4. Vai para aba Alexandria
5. Documentos selecionados já aparecem marcados
6. Usuário unchecks "Manual-Clientes", adds "FAQ-Técnicas"
7. Preview atualiza em tempo real
8. Clica "Publicar" (ou "Salvar")
9. Backend:
   a) PATCH agents_config
   b) DELETE old agent_knowledge_access rows
   c) INSERT new rows
   d) Regenera Character File
   e) Se hot_reload ativado: POST /webhook/agent/reload
      Senão: Agente pede manual restart (V1)
```

---

## 🗄️ Backend: useAlexandria Hook

```typescript
// src/hooks/useAlexandria.ts

import { useState, useEffect } from 'react';
import { UUID } from 'crypto';

interface AlexandriaDocument {
  id: string;
  title: string;
  content: string;
  source: 'pop' | 'manual' | 'guide' | 'other';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const useAlexandria = {
  /**
   * Fetch docs acessíveis a um agente
   */
  getAvailableDocuments: () => {
    const [documents, setDocuments] = useState<AlexandriaDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      fetch('/api/alexandria/documents')
        .then(r => r.json())
        .then(data => {
          // Filtrar apenas docs que o usuário pode acessar
          setDocuments(data.documents);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }, []);

    return { documents, loading, error };
  },

  /**
   * Associar doc a agente
   */
  addKnowledge: async (agentId: string, docIds: string[]) => {
    const response = await fetch(`/api/agents/${agentId}/knowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_ids: docIds }),
    });

    if (!response.ok) throw new Error('Erro ao adicionar conhecimento');
    return response.json();
  },

  /**
   * Get content de um doc (para cache)
   */
  getDocumentContent: async (docId: string) => {
    const response = await fetch(`/api/alexandria/documents/${docId}`);
    if (!response.ok) throw new Error('Doc não encontrado');
    return response.json();
  },
};
```

---

## 🔌 Backend: API Endpoints

### GET /api/alexandria/documents

```typescript
/**
 * Lista documentos disponíveis no Alexandria
 * Filtra por permissões do usuário
 */
GET /api/alexandria/documents
→ Response:
{
  documents: [
    {
      id: "doc-001",
      title: "POP-001: Atendimento",
      source: "pop",
      tags: ["atendimento", "cliente"],
      updated_at: "2025-04-12T10:00:00Z"
    },
    ...
  ]
}
```

### POST /api/agents/:id/knowledge

```typescript
/**
 * Associar documentos a agente
 */
POST /api/agents/:agentId/knowledge
Body:
{
  document_ids: ["doc-001", "doc-002", "doc-003"],
  rag_mode: "static"
}

→ Operações:
1. DELETE FROM agent_knowledge_access WHERE agent_id = :agentId
2. INSERT INTO agent_knowledge_access (agent_id, document_id)
   VALUES (:agentId, :docId) × N
3. UPDATE agents_config 
   SET knowledge_sources = ["doc-001", "doc-002", "doc-003"],
       rag_mode = 'static',
       knowledge_enabled = true
4. FOR EACH doc:
   - GET content from Alexandria
   - Inject in agents_config.system_prompt
5. Regenerate exported_character (JSONB)
6. RETURN { success: true, character: Character }
```

### PATCH /api/agents/:id (parcial para Alexandria)

```typescript
/**
 * Ao editar agente e trocar docs
 */
PATCH /api/agents/:id
Body:
{
  knowledge_sources: ["doc-001", "doc-004"],
  rag_mode: "static"
}

→ Operações (same as POST /knowledge)
→ Se hot_reload enabled:
   POST /webhook/agent/reload
   {
     agent_id: :agentId,
     action: "reload",
     changes: { knowledge_sources, system_prompt }
   }
```

---

## 📊 Database: Fluxo de Persistência

```sql
-- 1. User seleciona docs no editor
-- ["doc-001", "doc-002"]

-- 2. Backend recebe no POST /agents/:id/knowledge
-- 3. Backend deleta acesso anterior
DELETE FROM agent_knowledge_access 
WHERE agent_id = 'uuid-agente';

-- 4. Backend insere novo acesso
INSERT INTO agent_knowledge_access (agent_id, document_id, access_level)
VALUES 
  ('uuid-agente', 'doc-001', 'read'),
  ('uuid-agente', 'doc-002', 'read');

-- 5. Backend atualiza agents_config
UPDATE agents_config
SET 
  knowledge_sources = ARRAY['doc-001', 'doc-002'],
  rag_mode = 'static',
  knowledge_enabled = true,
  system_prompt = 'Você tem acesso a: [DOC-001 content], [DOC-002 content]...',
  exported_character = jsonb_set(exported_character, '{knowledge}', 
    '[{"path": "alexandria:doc-001"}, {"path": "alexandria:doc-002"}]')
WHERE id = 'uuid-agente';

-- 6. Query para testar
SELECT 
  a.id,
  a.name,
  array_agg(ka.document_id) as knowledge_sources,
  a.rag_mode,
  a.knowledge_enabled
FROM agents_config a
LEFT JOIN agent_knowledge_access ka ON a.id = ka.agent_id
WHERE a.id = 'uuid-agente'
GROUP BY a.id;

-- Result:
-- id | name | knowledge_sources | rag_mode | knowledge_enabled
-- uuid-agente | Agente-X | {doc-001,doc-002} | static | true
```

---

## 🎨 UX Details (Melhorias)

### 1. **Validação**
```typescript
// Bloquear publicar sem selecionar canal E sem system prompt
if (!agent.channels.some(c => c.enabled)) {
  showError("Selecione pelo menos 1 canal");
  return;
}

if (!agent.system_prompt) {
  showError("System prompt é obrigatório");
  return;
}

// Knowledge é opcional, mas warn se agent vai usar Alexandria
if (agent.knowledge_enabled && agent.knowledge_sources.length === 0) {
  showWarning("Knowledge habilitado mas nenhum doc selecionado");
}
```

### 2. **Search nos Documentos**
```typescript
// No AlexandriaTab, adicionar input search
const [searchDocs, setSearchDocs] = useState('');

const filtered = documents.filter(d => 
  d.title.toLowerCase().includes(searchDocs.toLowerCase()) ||
  d.tags.some(t => t.toLowerCase().includes(searchDocs.toLowerCase()))
);
```

### 3. **Indicador Visual de Tokens**
```typescript
// Mostrar estimativa de tokens que será gasto com os docs
const tokenCount = selectedDocs.reduce((sum, docId) => {
  const doc = documents.find(d => d.id === docId);
  return sum + (doc?.content.length || 0) / 4; // rough estimate
}, 0);

<p className="text-xs text-gray-500 mt-2">
  Estimado: {Math.round(tokenCount)} tokens
</p>
```

---

## ✅ Success Criteria (Aba Alexandria)

- [ ] Listar documentos do Alexandria
- [ ] Usuário pode selecionar/desselecionar docs (checkbox)
- [ ] Preview mostra o contexto que será injetado
- [ ] Modo "Static" funciona (carrega na publicação)
- [ ] Agente em execução usa os documentos
- [ ] Editar agente → trocar docs → salvar → agente reflete mudança
- [ ] Learning mode está desabilitado no MVP (placeholder para V2)
- [ ] Dynamic RAG está desabilitado (placeholder para V2)
- [ ] Erros são tratados (doc não encontrado, acesso negado)
- [ ] Mobile responsive (aba scrollável)

---

## 🚀 Próximos Passos

1. **Implementar AlexandriaTab.tsx** exatamente como acima
2. **Criar hook useAlexandria** com 3 funções
3. **Criar endpoints** GET /alexandria/documents + POST /agents/:id/knowledge
4. **Testar**: Criar agente → Selecionar docs → Publicar → Testar em preview
5. **QA**: Editar agente → Trocar docs → Verificar se reflete

---

*Este é o coração do diferencial Totum: um agente que "aprende" com a base de conhecimento corporativa.*
