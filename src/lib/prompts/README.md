# Prompts de Marketing para Claude 3.5

Biblioteca de prompts estratégicos e otimizados para Claude 3.5 Sonnet, focados em geração de conteúdo e estratégia de marketing em redes sociais.

## 📋 Prompts Disponíveis

### 1. **Social Planning** (`social_planning.md`)
Planejamento estratégico completo de conteúdo para redes sociais.

**Funcionalidades:**
- Definição de objetivos SMART
- Análise de público-alvo e personas
- Estrutura de pilares de conteúdo
- Calendário de publicação otimizado
- Estratégia por plataforma (Instagram, TikTok, LinkedIn, X)
- KPIs e métricas de acompanhamento

**Ideal para:** Criar planos de 3-6 meses de conteúdo

---

### 2. **Trend Analysis** (`trend_analysis.md`)
Análise de tendências emergentes e oportunidades de posicionamento.

**Funcionalidades:**
- Identificação de tendências relevantes por indústria
- Avaliação de ciclo de vida (nascente, crescimento, pico, declínio)
- Scoring de viralidade e relevância
- Oportunidades de conteúdo viral
- Insights comportamentais e padrões de compartilhamento
- Recomendações estratégicas com timeline

**Ideal para:** Identificar oportunidades de crescimento rápido

---

### 3. **Content Validation** (`content_validation.md`)
Validação de qualidade, efetividade e segurança de conteúdo.

**Funcionalidades:**
- Análise profunda de copy (hook, estrutura, CTA)
- Avaliação visual (composição, acessibilidade, brand consistency)
- Validação de alinhamento estratégico
- Assessment de riscos (compliance, reputação)
- Scoring de qualidade (1-100)
- Previsão de performance esperada

**Ideal para:** QA de conteúdo antes de publicação

---

### 4. **Copywriting** (`copywriting.md`)
Geração de copies persuasivos otimizados para conversão.

**Funcionalidades:**
- 3-5 variações de copy com ângulos diferentes
- Leverage de gatilhos psicológicos (urgência, prova social, autoridade)
- Estrutura Hook → Problema → Solução → CTA
- Estratégia de emojis e formatação
- Sugestões de A/B testing
- Previsão de conversão e engajamento

**Ideal para:** Criar anúncios, CTAs e posts de vendas

---

### 5. **Hashtag Generator** (`hashtag_generator.md`)
Geração estratégica de hashtags otimizadas por plataforma.

**Funcionalidades:**
- Categorização por tamanho (mega, macro, micro, nano)
- Volume de busca e competição por hashtag
- Estratégia de mix adaptada ao objetivo
- Otimização por plataforma (Instagram, TikTok, Twitter, YouTube, LinkedIn)
- Identificação de gaps competitivos
- Alert de risco de shadowban

**Ideal para:** Maximizar alcance com hashtags estratégicas

---

## 🎯 Como Usar

### Estrutura Geral

Cada prompt segue a mesma estrutura:

1. **OBJETIVO** - O que o prompt faz
2. **CONTEXTO** - Expertise e conhecimento do assistente
3. **INSTRUÇÕES** - Passo a passo do que fazer
4. **INPUT** - JSON com os dados necessários
5. **OUTPUT** - JSON com a resposta esperada
6. **EXEMPLOS** - 2 casos práticos com Input/Output

### Integração com TypeScript

```typescript
import fs from 'fs';
import path from 'path';

// Ler um prompt
function getPrompt(promptName: string): string {
  const filePath = path.join(__dirname, 'prompts', `${promptName}.md`);
  return fs.readFileSync(filePath, 'utf-8');
}

// Usar com Claude API
const socialPlanningPrompt = getPrompt('social_planning');

const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  system: socialPlanningPrompt,
  messages: [{ role: 'user', content: JSON.stringify(briefData) }]
});
```

### Exemplo de Uso

```typescript
import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic();

const briefData = {
  brand_name: "TechFlow Solutions",
  industry: "SaaS",
  objectives: "Aumentar leads qualificados",
  target_audience: "Gerentes de projetos",
  platforms: ["LinkedIn", "Twitter"],
  content_tone: "Profissional e inspirador",
  timeline: "3 meses"
};

const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  system: getPrompt('social_planning'),
  messages: [{
    role: 'user',
    content: `Analise este briefing e crie um plano estratégico de conteúdo:\n\n${JSON.stringify(briefData, null, 2)}`
  }]
});

console.log(response.content[0].type === 'text' ? response.content[0].text : '');
```

---

## 📊 Formatos de Output

Todos os prompts retornam respostas estruturadas em JSON, facilitando a integração com aplicações.

**Exemplo de Output (Social Planning):**

```json
{
  "plan_summary": {
    "objectives": "Gerar 150+ leads qualificados",
    "duration": "3 meses",
    "expected_outcomes": "500k+ impressões"
  },
  "content_pillars": [
    {
      "name": "Produtividade",
      "frequency_weekly": 2,
      "formats": ["vídeo", "carrossel"]
    }
  ],
  "platform_strategy": {
    "LinkedIn": {
      "priority": "alta",
      "posting_frequency": "4 posts por semana"
    }
  }
}
```

---

## 🎨 Características Técnicas

### Otimizado para Claude 3.5
- ✅ Instruções estruturadas e claras
- ✅ Exemplos específicos e realistas
- ✅ Suporte a respostas JSON complexas
- ✅ Tokens otimizados (~2000-3000 por prompt)

### Linguagem
- 🇧🇷 Português do Brasil
- 📝 Tom profissional e estratégico
- 🎯 Contextualizado para marketing

### Qualidade
- ✅ 2 exemplos práticos por prompt
- ✅ Input/Output bem definidos
- ✅ Instruções detalhadas passo a passo
- ✅ Adaptável por plataforma e objetivo

---

## 💡 Casos de Uso

| Caso | Prompt Recomendado | Resultado |
|------|-------------------|-----------|
| Criar campanha do zero | Social Planning | Plano completo 3 meses |
| Encontrar tendências | Trend Analysis | 10 oportunidades priorizadas |
| Verificar qualidade post | Content Validation | Score + recomendações |
| Criar copy vendas | Copywriting | 5 variações com A/B tests |
| Otimizar alcance | Hashtag Generator | 30+ hashtags + estratégia |

---

## ⚙️ Configuração Recomendada

### Parâmetros de Claude API

```typescript
{
  model: "claude-3-5-sonnet-20241022", // Modelo otimizado
  max_tokens: 4096,                    // Aumentar conforme necessário
  temperature: 0.7,                    // Criatividade moderada
  top_p: 0.95                          // Diversidade
}
```

### Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...
MODEL_NAME=claude-3-5-sonnet-20241022
MAX_TOKENS=4096
```

---

## 📈 Métricas de Sucesso

Cada prompt é projetado para fornecer insights mensuráveis:

- **Social Planning:** Leads gerados, reach, engajamento
- **Trend Analysis:** Viralidade, relevância, longevidade
- **Content Validation:** Score 1-100, engagement rate estimada
- **Copywriting:** Conversion probability, predicted ROAS
- **Hashtag Generator:** Alcance potencial, dificuldade de ranking

---

## 🔄 Versionamento

- **v1.0** - Prompts iniciais (7 de Abril de 2026)
- Otimizados para Claude 3.5 Sonnet
- Base para estratégia de marketing 2026

---

## 📚 Referências

### Integração com Totum OS

Recomendação: Criar hooks React que consumem esses prompts:

```typescript
// hooks/useMarketingPrompt.ts
export function useMarketingPrompt(promptName: string, inputData: object) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    executePrompt(promptName, inputData);
  }, [promptName]);

  const executePrompt = async (name: string, data: object) => {
    setLoading(true);
    try {
      const response = await fetch('/api/marketing/prompt', {
        method: 'POST',
        body: JSON.stringify({ prompt: name, data })
      });
      const result = await response.json();
      setResult(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error };
}
```

---

## 📞 Suporte

Para melhorias ou novos prompts, consulte o time de Agentes.

**Última atualização:** 7 de Abril de 2026
