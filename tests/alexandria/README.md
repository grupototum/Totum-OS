# 🧪 Testes - Alexandria Ingestion Service

> Testes para validar o `ingestionService.ts` do Manus

---

## 📁 Arquivos de Teste

```
tests/alexandria/
├── POP-001-teste.md           # Documento de teste simples
├── POP-002-complexo.md        # Documento com hierarquia profunda
├── test-ingestion.js          # Script de teste
└── README.md                  # Este arquivo
```

---

## 1. Documento de Teste Simples (POP-001-teste.md)

```markdown
# POP-001: Atendimento ao Cliente

## Objetivo
Padronizar o atendimento inicial.

## Procedimento

### Passo 1: Saudação
Saudar o cliente em até 30 segundos.

### Passo 2: Identificação
Verificar nome e CPF no sistema.

## Checklist
- [ ] Cliente saudado
- [ ] Identificação confirmada
- [ ] SLA de 2 horas informado

## Referências
- SLA-001: Tempo de resposta
- Email: suporte@totum.com
```

**Esperado:** 4-6 chunks  
**Path hierárquico:** `POP-001 > Atendimento > Passo 1`

---

## 2. Documento Complexo (POP-002-complexo.md)

```markdown
# POP-002: Integração CRM

## Visão Geral
Configurar integração entre sistema e CRM.

## Configuração Técnica

### API Keys
Obter chaves em https://api.totum.com

### Webhooks
Configurar endpoint: https://webhook.totum.com/crm

### Mapeamento de Campos
| Campo Totum | Campo CRM |
|-------------|-----------|
| nome        | name      |
| email       | email     |

## Troubleshooting

### Erro 404
Verificar URL do endpoint.

### Erro 500
Verificar API Key.

## Código de Exemplo
```javascript
const response = await fetch('/api/crm', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer TOKEN' }
});
```

## Valores
- Setup: R$ 1.500,00
- Mensalidade: R$ 299,90
```

**Esperado:** 8-12 chunks  
**Teste:** Tabelas, código, valores monetários

---

## 3. Script de Teste (test-ingestion.js)

```javascript
const { IngestionService } = require('../src/ingestionService');
const path = require('path');

// Configuração
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

const service = new IngestionService(SUPABASE_URL, SUPABASE_KEY, GEMINI_KEY);

async function runTests() {
  console.log('🧪 Iniciando testes de ingestão\n');
  
  // Teste 1: Documento simples
  console.log('Teste 1: POP-001 (simples)');
  const result1 = await service.ingestDocument(
    path.join(__dirname, 'POP-001-teste.md'),
    { docId: 'POP-001', dominio: 'atendimento' }
  );
  console.log('Resultado:', result1);
  
  // Validações
  if (result1.processed > 0 && result1.processed <= 6) {
    console.log('✅ Teste 1 PASSOU\n');
  } else {
    console.log('❌ Teste 1 FALHOU\n');
  }
  
  // Teste 2: Idempotência (mesmo arquivo)
  console.log('Teste 2: Idempotência (mesmo arquivo)');
  const result2 = await service.ingestDocument(
    path.join(__dirname, 'POP-001-teste.md'),
    { docId: 'POP-001', dominio: 'atendimento' }
  );
  
  if (result2.skipped > 0 && result2.processed === 0) {
    console.log('✅ Teste 2 PASSOU - Hash cache funcionando\n');
  } else {
    console.log('❌ Teste 2 FALHOU\n');
  }
  
  // Teste 3: Documento complexo
  console.log('Teste 3: POP-002 (complexo)');
  const result3 = await service.ingestDocument(
    path.join(__dirname, 'POP-002-complexo.md'),
    { docId: 'POP-002', dominio: 'tecnico' }
  );
  console.log('Resultado:', result3);
  
  if (result3.processed >= 8) {
    console.log('✅ Teste 3 PASSOU\n');
  } else {
    console.log('❌ Teste 3 FALHOU\n');
  }
  
  // Teste 4: Verificar metadados
  console.log('Teste 4: Verificando metadados no Supabase');
  // TODO: Query no Supabase para validar hierarchical_path, entities
  
  console.log('🎉 Testes concluídos!');
}

runTests().catch(console.error);
```

---

## 4. Checklist de Validação

### Funcionalidade
- [ ] Chunks gerados corretamente
- [ ] Hierarquia preservada no metadata
- [ ] Overlap de 20% aplicado
- [ ] Hash único por chunk
- [ ] Idempotência funcionando (2ª ingestão = skipped)

### Performance
- [ ] Batches de 50 chunks
- [ ] 1 segundo entre batches
- [ ] Embeddings gerados sem erro 429
- [ ] Retry funciona em caso de falha

### Dados
- [ ] Entities extraídas (siglas, códigos, emails)
- [ ] Tags inferidas corretamente
- [ ] Valores monetários (R$) detectados
- [ ] Código preservado intacto

---

## 5. Comandos para Executar

```bash
# 1. Criar arquivos de teste
mkdir -p tests/alexandria
cd tests/alexandria

# 2. Criar POP-001-teste.md (colar conteúdo acima)
# 3. Criar POP-002-complexo.md (colar conteúdo acima)

# 4. Configurar variáveis
export SUPABASE_URL="https://..."
export SUPABASE_ANON_KEY="eyJ..."
export GEMINI_API_KEY="..."

# 5. Rodar testes
node tests/alexandria/test-ingestion.js
```

---

## 6. Métricas Esperadas

| Métrica | Esperado | Aceitável |
|---------|----------|-----------|
| Chunks gerados (POP-001) | 4-6 | 3-8 |
| Chunks gerados (POP-002) | 8-12 | 6-15 |
| Tempo de ingestão | <30s | <60s |
| Taxa de erro | 0% | <5% |
| Idempotência | 100% skipped | >90% skipped |

---

*Criado para validar entrega do Manus*  
*Data: 2026-04-05*
