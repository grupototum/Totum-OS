# Sistema de Estimativa de Tokens - Apps_Totum

## Estrutura do Sistema

### 1. Tabela no Banco de Dados (`data/totum_claw.db`)

```sql
-- Tabela para histórico de tokens
CREATE TABLE IF NOT EXISTS token_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER,
    output_tokens INTEGER,
    estimated_input INTEGER,
    actual_cost_usd REAL,
    actual_cost_brl REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para preços por modelo
CREATE TABLE IF NOT EXISTS model_pricing (
    model TEXT PRIMARY KEY,
    input_price_per_1k REAL,
    output_price_per_1k REAL,
    provider TEXT,
    is_local BOOLEAN DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dados iniciais de preços
INSERT OR REPLACE INTO model_pricing (model, input_price_per_1k, output_price_per_1k, provider, is_local) VALUES
('gpt-4o', 0.0025, 0.01, 'openai', 0),
('gpt-4o-mini', 0.00015, 0.0006, 'openai', 0),
('claude-3-5-sonnet', 0.003, 0.015, 'anthropic', 0),
('claude-3-opus', 0.015, 0.075, 'anthropic', 0),
('kimi-k2p5', 0.002, 0.008, 'moonshot', 0),
('ollama-llama3', 0, 0, 'ollama', 1),
('ollama-mistral', 0, 0, 'ollama', 1),
('ollama-qwen', 0, 0, 'ollama', 1);
```

### 2. API Endpoint - Estimativa Pré-Envio

```typescript
// src/api/tokens.ts

interface TokenEstimate {
  text: string;
  model: string;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedTotalCostUSD: number;
  estimatedTotalCostBRL: number;
  isFree: boolean;
  display: string;
}

// Constante: 1 token ≈ 4 caracteres em português
const CHARS_PER_TOKEN = 4;
const USD_TO_BRL = 5.0;

export function estimateTokens(text: string, model: string): TokenEstimate {
  // Estimativa de input (mensagem do usuário)
  const estimatedInputTokens = Math.ceil(text.length / CHARS_PER_TOKEN);
  
  // Estimativa de output (resposta da IA) - assume 2x o input
  const estimatedOutputTokens = Math.ceil(estimatedInputTokens * 2);
  
  // Buscar preço do modelo
  const pricing = getModelPricing(model);
  
  const isLocal = pricing.is_local || model.includes('ollama');
  
  if (isLocal) {
    return {
      text,
      model,
      estimatedInputTokens,
      estimatedOutputTokens,
      estimatedTotalCostUSD: 0,
      estimatedTotalCostBRL: 0,
      isFree: true,
      display: `~${estimatedInputTokens} tokens | 🆓 GRÁTIS (local)`
    };
  }
  
  // Calcular custo
  const inputCost = (estimatedInputTokens / 1000) * pricing.input_price_per_1k;
  const outputCost = (estimatedOutputTokens / 1000) * pricing.output_price_per_1k;
  const totalCostUSD = inputCost + outputCost;
  const totalCostBRL = totalCostUSD * USD_TO_BRL;
  
  return {
    text,
    model,
    estimatedInputTokens,
    estimatedOutputTokens,
    estimatedTotalCostUSD: totalCostUSD,
    estimatedTotalCostBRL: totalCostBRL,
    isFree: false,
    display: `~${estimatedInputTokens} tokens | ~R$ ${totalCostBRL.toFixed(4)}`
  };
}

function getModelPricing(model: string) {
  // Buscar do banco de dados
  // Fallback para valores padrão
  const defaults = {
    input_price_per_1k: 0.002,
    output_price_per_1k: 0.008,
    is_local: 0
  };
  
  // Query: SELECT * FROM model_pricing WHERE model = ?
  return defaults;
}

export function formatTokenDisplay(estimate: TokenEstimate): string {
  if (estimate.isFree) {
    return `🆓 ~${estimate.estimatedInputTokens} tokens (local)`;
  }
  
  const cost = estimate.estimatedTotalCostBRL;
  
  if (cost < 0.01) {
    return `💰 ~${estimate.estimatedInputTokens} tokens | < R$ 0,01`;
  } else if (cost < 0.10) {
    return `💰 ~${estimate.estimatedInputTokens} tokens | ~R$ ${cost.toFixed(2)}`;
  } else {
    return `⚠️ ~${estimate.estimatedInputTokens} tokens | ~R$ ${cost.toFixed(2)}`;
  }
}
```

### 3. Componente React - Input com Estimativa

```tsx
// src/components/ChatInput.tsx
import { useState, useEffect } from 'react';
import { estimateTokens, formatTokenDisplay } from '../api/tokens';

interface ChatInputProps {
  model: string;
  onSend: (message: string) => void;
}

export function ChatInput({ model, onSend }: ChatInputProps) {
  const [text, setText] = useState('');
  const [estimate, setEstimate] = useState<TokenEstimate | null>(null);
  
  useEffect(() => {
    if (text.trim().length > 0) {
      const est = estimateTokens(text, model);
      setEstimate(est);
    } else {
      setEstimate(null);
    }
  }, [text, model]);
  
  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
      setEstimate(null);
    }
  };
  
  return (
    <div className="chat-input-container">
      <div className="input-wrapper">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite sua mensagem..."
          rows={3}
        />
        
        {estimate && (
          <div className={`token-estimate ${estimate.isFree ? 'free' : ''}`}>
            <span className="estimate-icon">💬</span>
            <span className="estimate-text">
              {formatTokenDisplay(estimate)}
            </span>
            {!estimate.isFree && (
              <span className="estimate-details">
                (entrada: ~{estimate.estimatedInputTokens}, saída: ~{estimate.estimatedOutputTokens})
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="input-actions">
        <button 
          onClick={handleSend}
          disabled={!text.trim()}
          className="send-button"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
```

### 4. CSS - Estilização

```css
/* src/styles/tokens.css */

.chat-input-container {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}

.input-wrapper {
  position: relative;
}

.input-wrapper textarea {
  width: 100%;
  border: none;
  resize: none;
  font-size: 14px;
  outline: none;
  padding-bottom: 32px;
}

.token-estimate {
  position: absolute;
  bottom: 8px;
  left: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 4px 10px;
  border-radius: 12px;
}

.token-estimate.free {
  background: #e8f5e9;
  color: #2e7d32;
}

.token-estimate .estimate-icon {
  font-size: 14px;
}

.token-estimate .estimate-text {
  font-weight: 500;
}

.token-estimate .estimate-details {
  color: #999;
  font-size: 11px;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.send-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```

### 5. Integração com Histórico (Pós-Envio)

```typescript
// src/api/chat.ts

export async function sendMessage(
  message: string, 
  model: string,
  sessionId: string
) {
  // 1. Estimar antes de enviar
  const estimate = estimateTokens(message, model);
  
  // 2. Mostrar confirmação se custo > R$ 0,50
  if (estimate.estimatedTotalCostBRL > 0.50) {
    const confirmed = confirm(
      `⚠️ Esta mensagem pode custar ~R$ ${estimate.estimatedTotalCostBRL.toFixed(2)}. Continuar?`
    );
    if (!confirmed) return;
  }
  
  // 3. Enviar para API
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, model, sessionId })
  });
  
  const data = await response.json();
  
  // 4. Registrar uso real no banco
  await registerTokenUsage({
    sessionId,
    model,
    inputTokens: data.usage?.input_tokens || estimate.estimatedInputTokens,
    outputTokens: data.usage?.output_tokens || 0,
    estimatedInput: estimate.estimatedInputTokens,
    actualCostUSD: calculateCost(data.usage, model),
    actualCostBRL: calculateCost(data.usage, model) * USD_TO_BRL
  });
  
  return data;
}

async function registerTokenUsage(usage: TokenUsage) {
  // INSERT INTO token_usage (...)
  await db.run(`
    INSERT INTO token_usage 
    (session_id, model, input_tokens, output_tokens, estimated_input, actual_cost_usd, actual_cost_brl)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    usage.sessionId,
    usage.model,
    usage.inputTokens,
    usage.outputTokens,
    usage.estimatedInput,
    usage.actualCostUSD,
    usage.actualCostBRL
  ]);
}
```

### 6. Dashboard de Uso (Admin)

```tsx
// src/components/TokenDashboard.tsx

export function TokenDashboard() {
  const [stats, setStats] = useState({
    totalTokens: 0,
    totalCostBRL: 0,
    messagesToday: 0,
    costToday: 0
  });
  
  useEffect(() => {
    loadStats();
  }, []);
  
  async function loadStats() {
    // Query do banco
    const result = await db.all(`
      SELECT 
        SUM(input_tokens + output_tokens) as total_tokens,
        SUM(actual_cost_brl) as total_cost,
        COUNT(*) as total_messages
      FROM token_usage
    `);
    
    const today = await db.all(`
      SELECT 
        COUNT(*) as messages_today,
        SUM(actual_cost_brl) as cost_today
      FROM token_usage
      WHERE date(timestamp) = date('now')
    `);
    
    setStats({
      totalTokens: result[0].total_tokens || 0,
      totalCostBRL: result[0].total_cost || 0,
      messagesToday: today[0].messages_today || 0,
      costToday: today[0].cost_today || 0
    });
  }
  
  return (
    <div className="token-dashboard">
      <h2>📊 Uso de Tokens</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total de Tokens</span>
          <span className="stat-value">{stats.totalTokens.toLocaleString()}</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-label">Custo Total</span>
          <span className="stat-value">R$ {stats.totalCostBRL.toFixed(2)}</span>
        </div>
        
        <div className="stat-card today">
          <span className="stat-label">Hoje</span>
          <span className="stat-value">
            {stats.messagesToday} msgs | R$ {stats.costToday.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
```

## Fluxo Completo

```
Usuário digita mensagem
       ↓
Componente calcula estimativa (em tempo real)
       ↓
Mostra: "~45 tokens | ~R$ 0,0023"
       ↓
Usuário clica Enviar
       ↓
Se custo > R$ 0,50 → Mostra confirmação
       ↓
Envia para API
       ↓
Registra uso real no banco
       ↓
Atualiza dashboard
```

## Arquivos para Criar

```
Apps_Totum/
├── src/
│   ├── api/
│   │   ├── tokens.ts      # Lógica de estimativa
│   │   └── chat.ts        # Envio com registro
│   ├── components/
│   │   ├── ChatInput.tsx  # Input com estimativa
│   │   └── TokenDashboard.tsx  # Dashboard admin
│   └── styles/
│       └── tokens.css     # Estilos
└── data/
    └── migrations/
        └── 001_token_system.sql  # Schema do banco
```

## Integração com Lovable

Como o Apps_Totum está no Lovable, você pode:

1. **Adicionar o componente** via interface do Lovable
2. **Conectar ao Supabase** (já integrado) para persistência
3. **Usar Edge Functions** do Supabase para cálculos de tokens

Ou, se preferir código direto, usar o script acima no projeto local e fazer push.
