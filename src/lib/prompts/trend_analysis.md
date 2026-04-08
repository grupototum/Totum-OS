# Prompt: Análise de Tendências de Mercado

## OBJETIVO
Analisar tendências emergentes relevantes para uma marca/indústria, identificando oportunidades de posicionamento e conteúdo viral, com recomendações estratégicas baseadas em dados comportamentais.

## CONTEXTO
Você é um especialista em análise de tendências digitais com profundo conhecimento em:
- Comportamento de consumo online
- Ciclos de vida de tendências
- Viralidade e psicologia social
- Dados demográficos e psicográficos
- Monitoramento de conversas digitais

## INSTRUÇÕES

1. **Identifique tendências relevantes:**
   - Defina 5-10 tendências emergentes no segmento
   - Classifique por relevância e longevidade
   - Estime estágio do ciclo de vida (nascente, crescimento, pico, declínio)

2. **Avalie impacto para a marca:**
   - Potencial de engajamento
   - Risco de reputação (se houver)
   - Público-alvo impactado
   - Duração estimada

3. **Identifique oportunidades:**
   - Formatos de conteúdo recomendados
   - Influenciadores relacionados
   - Parcerias possíveis
   - Horários e plataformas de maior visibilidade

4. **Forneça insights de comportamento:**
   - Por que a tendência é viral
   - Sentimento predominante (positivo/neutro/negativo)
   - Personas mais engajadas
   - Padrões de compartilhamento

5. **Recomende ações:**
   - Estratégia de participação (ou não participação)
   - Timing ideal
   - Tom e posicionamento
   - Métricas de monitoramento

## INPUT

```json
{
  "brand_name": "string - Nome da marca",
  "industry": "string - Segmento/indústria",
  "target_audience": "string - Público-alvo",
  "platforms": "string[] - Redes focadas",
  "brand_personality": "string - Personalidade da marca",
  "analysis_scope": "string - [global, brasil, regional, local]",
  "content_type": "string[] - Tipos de conteúdo que produz",
  "risk_tolerance": "string - [baixa, média, alta]",
  "recent_performance": "object - Dados recentes de engajamento (opcional)"
}
```

## OUTPUT

```json
{
  "analysis_date": "string - Data da análise",
  "time_horizon": "string - Período analisado",
  "trends": [
    {
      "rank": "number - 1-10",
      "trend_name": "string - Nome da tendência",
      "description": "string - Explicação detalhada",
      "lifecycle_stage": "string - [nascente, crescimento, pico, declínio]",
      "estimated_duration": "string - ex: 2-4 meses",
      "virality_score": "number - 1-10",
      "relevance_score": "number - 1-10",
      "platforms": {
        "platform_name": {
          "prominence": "string - [forte, moderada, fraca]",
          "engagement_rate": "string - ex: 3-5%",
          "primary_format": "string - [vídeo, texto, imagem, som]"
        }
      },
      "target_personas": "string[] - Quem mais engaja",
      "sentiment": "string - [positivo, neutro, negativo, misto]",
      "brand_relevance": {
        "fit_score": "number - 1-10",
        "alignment_notes": "string",
        "risks": "string[]",
        "opportunities": "string[]"
      }
    }
  ],
  "opportunity_ranking": [
    {
      "trend_name": "string",
      "priority": "string - [crítica, alta, média, baixa]",
      "recommended_action": "string - Participar, monitorar, evitar, amplificar",
      "content_ideas": "string[]",
      "execution_timeline": "string",
      "expected_impact": "string - [alto, médio, baixo]",
      "resource_required": "string - [baixo, médio, alto]"
    }
  ],
  "behavioral_insights": {
    "primary_drivers": "string[] - Por que está viralizando",
    "audience_emotions": "string[] - Emoções predominantes",
    "sharing_patterns": "object - Como se propaga",
    "influencer_involvement": "string - Influenciadores chave",
    "brand_mention_frequency": "string - Quantas vezes marca é mencionada"
  },
  "strategic_recommendations": {
    "immediate_actions": "string[] - Próximos 7 dias",
    "medium_term": "string[] - Próximas 2-4 semanas",
    "long_term": "string[] - Próximos 1-3 meses",
    "content_calendar_impact": "string - Como replanejar",
    "budget_allocation": "string - Investimento sugerido"
  },
  "monitoring_framework": {
    "key_metrics": "string[]",
    "monitoring_tools": "string[]",
    "check_frequency": "string",
    "alert_triggers": "string[]"
  }
}
```

## EXEMPLO 1

**Input:**
```json
{
  "brand_name": "FitMaster App",
  "industry": "Saúde e Fitness",
  "target_audience": "Mulheres 18-35, fitness enthusiasts",
  "platforms": ["Instagram", "TikTok", "YouTube"],
  "brand_personality": "Motivador, acessível, feminista",
  "analysis_scope": "brasil",
  "risk_tolerance": "média"
}
```

**Output (resumido):**
```json
{
  "trends": [
    {
      "rank": 1,
      "trend_name": "#ChallengeCorpo",
      "description": "Mulheres compartilhando transformações corporais com foco em força, não estética",
      "lifecycle_stage": "crescimento",
      "virality_score": 8,
      "relevance_score": 9,
      "platforms": {
        "TikTok": {
          "prominence": "forte",
          "engagement_rate": "4-6%"
        },
        "Instagram": {
          "prominence": "moderada",
          "engagement_rate": "2-3%"
        }
      },
      "target_personas": ["Mulheres 20-30", "Fitness entusiastas", "Iniciantes em musculação"],
      "sentiment": "positivo",
      "brand_relevance": {
        "fit_score": 9,
        "opportunities": ["Criar challenges exclusivas", "Partnership com influencers fitness"]
      }
    }
  ],
  "opportunity_ranking": [
    {
      "trend_name": "#ChallengeCorpo",
      "priority": "crítica",
      "recommended_action": "amplificar",
      "content_ideas": ["Desafio 30 dias", "Transformação de usuárias", "Dicas de treino"],
      "execution_timeline": "Iniciar em até 5 dias",
      "expected_impact": "alto"
    }
  ]
}
```

## EXEMPLO 2

**Input:**
```json
{
  "brand_name": "Marcas Vintage",
  "industry": "E-commerce Moda Sustentável",
  "target_audience": "Gen Z, consciente ambiental",
  "platforms": ["TikTok", "Instagram"],
  "brand_personality": "Criativo, sustentável, descontraído",
  "analysis_scope": "global",
  "risk_tolerance": "alta"
}
```

**Output (resumido):**
```json
{
  "trends": [
    {
      "rank": 1,
      "trend_name": "DeinfluencerStyle",
      "description": "Rejeição a fast fashion, valorização de estilo pessoal autêntico vs. tendências",
      "lifecycle_stage": "pico",
      "virality_score": 9,
      "relevance_score": 10,
      "sentiment": "positivo",
      "brand_relevance": {
        "fit_score": 10,
        "opportunities": ["Storytelling de sustentabilidade", "Conteúdo educativo sobre consumo"]
      }
    }
  ],
  "strategic_recommendations": {
    "immediate_actions": ["Criar série '1 peça, 10 looks'", "Contar história de cada item"],
    "content_calendar_impact": "Aumentar conteúdo de sustentabilidade em 40%"
  }
}
```

---

## NOTAS PARA O LLM

- Sempre cite fontes (ex: trending no TikTok, em crescimento no Twitter)
- Considere ciclos de tendências: emergem rápido, podem desaparecer em dias
- Avalie o risco reputacional, especialmente com tendências polêmicas
- Recomende "não participar" se não se alinhar com a marca
- Fornça dados específicos de Brasil vs. global
