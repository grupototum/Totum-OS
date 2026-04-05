# ✅ IMPLEMENTAÇÃO COMPLETA - SISTEMA DE TOKENS

## 📁 Arquivos Criados no Apps_Totum

```
Apps_Oficial/
├── src/
│   ├── services/
│   │   └── tokenService.ts          ✅ NOVO - Lógica de estimativa
│   ├── components/
│   │   └── chat/
│   │       ├── TokenEstimator.tsx   ✅ NOVO - Componente visual
│   │       ├── TokenEstimator.css   ✅ NOVO - Estilos
│   │       └── TokenDashboard.tsx   ✅ NOVO - Dashboard admin
│   └── ...
└── supabase/
    └── migrations/
        └── 20260405_token_system.sql ✅ NOVO - Schema do banco
```

---

## 🚀 COMO USAR

### 1. Aplicar Migration no Supabase

```bash
# No diretório do projeto
supabase migration up

# Ou copiar o conteúdo de supabase/migrations/20260405_token_system.sql
# e colar no SQL Editor do Supabase Dashboard
```

### 2. Importar Componente no Chat

```tsx
// No arquivo onde está o input de chat (ex: AgentChatLayout.tsx ou ChatInput.tsx)

import { TokenEstimator } from "./TokenEstimator";
import "./TokenEstimator.css";

// ... dentro do componente

function ChatInput() {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  return (
    <div className="chat-input-wrapper">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
      />
      
      {/* Componente de estimativa */}
      <TokenEstimator 
        text={message} 
        model={selectedModel} 
      />
      
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}
```

### 3. Registrar Uso Real Após Resposta da API

```tsx
import { registerTokenUsage, calculateActualCost } from "@/services/tokenService";

async function sendMessage(message: string, model: string) {
  // 1. Estimar antes de enviar
  const estimate = estimateTokens(message, model);
  
  // 2. Confirmar se custo alto
  if (estimate.estimatedTotalCostBRL > 0.50) {
    const confirmed = confirm(`⚠️ Esta mensagem pode custar ~R$ ${estimate.estimatedTotalCostBRL.toFixed(2)}. Continuar?`);
    if (!confirmed) return;
  }
  
  // 3. Enviar para API
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, model })
  });
  
  const data = await response.json();
  
  // 4. Registrar uso real
  if (data.usage) {
    await registerTokenUsage({
      sessionId: currentSessionId,
      model,
      inputTokens: data.usage.input_tokens,
      outputTokens: data.usage.output_tokens,
      estimatedInput: estimate.estimatedInputTokens,
      actualCostUSD: calculateActualCost(data.usage.input_tokens, data.usage.output_tokens, model).usd,
      actualCostBRL: calculateActualCost(data.usage.input_tokens, data.usage.output_tokens, model).brl,
    });
  }
}
```

### 4. Adicionar Dashboard na Página Admin

```tsx
// Em alguma página de administração

import { TokenDashboard } from "@/components/chat/TokenDashboard";

export function AdminPage() {
  return (
    <div>
      <h1>Painel Administrativo</h1>
      
      <TokenDashboard />
      
      {/* ... resto do conteúdo */}
    </div>
  );
}
```

---

## 📊 FUNCIONALIDADES

### Estimativa em Tempo Real
- Mostra tokens estimados enquanto digita
- Calcula custo em R$
- Modelos Ollama mostram "GRÁTIS"
- Alerta visual se custo > R$ 0,10

### Cálculo de Tokens
- 1 token ≈ 4 caracteres (português)
- Estimativa de saída = 2× entrada
- Preços configuráveis por modelo

### Modelos Suportados
| Modelo | Preço Input | Preço Output | Local |
|--------|-------------|--------------|-------|
| gpt-4o | $0.0025/1K | $0.01/1K | ❌ |
| gpt-4o-mini | $0.00015/1K | $0.0006/1K | ❌ |
| claude-3-5-sonnet | $0.003/1K | $0.015/1K | ❌ |
| kimik-k2p5 | $0.002/1K | $0.008/1K | ❌ |
| ollama-* | GRÁTIS | GRÁTIS | ✅ |
| gemini-2.0-flash | $0.00035/1K | $0.0014/1K | ❌ |

### Dashboard
- Total de tokens usados
- Custo total acumulado
- Uso de hoje
- Contagem de mensagens

---

## 🔧 PERSONALIZAÇÃO

### Adicionar Novo Modelo

```typescript
// src/services/tokenService.ts

const MODEL_PRICING: Record<string, { input: number; output: number; isLocal: boolean }> = {
  // ... modelos existentes
  "seu-modelo-novo": { input: 0.001, output: 0.005, isLocal: false },
};
```

### Alterar Taxa de Conversão

```typescript
// src/services/tokenService.ts
const USD_TO_BRL = 5.0;  // Atualizar conforme cotação atual
```

### Ajustar Estimativa de Saída

```typescript
// src/services/tokenService.ts
// Na função estimateTokens:
const estimatedOutputTokens = Math.ceil(estimatedInputTokens * 2);  // 2x = completo
// ou
const estimatedOutputTokens = Math.ceil(estimatedInputTokens * 1.5);  // 1.5x = conciso
```

---

## 🧪 TESTAR

```bash
# Instalar dependências (se necessário)
cd Apps_Oficial
npm install

# Rodar em desenvolvimento
npm run dev

# Verificar se componente aparece
# Abrir http://localhost:5173 (ou porta configurada)
# Digitar no chat e ver se aparece estimativa
```

---

## 📱 PRÓXIMOS PASSOS

1. [ ] Aplicar migration no Supabase
2. [ ] Integrar TokenEstimator no componente de chat
3. [ ] Testar com diferentes modelos
4. [ ] Adicionar TokenDashboard na página admin
5. [ ] Configurar webhook para registrar uso real

---

*Documentação criada em: 2026-04-05*  
*Sistema: Apps_Totum Token Estimator*