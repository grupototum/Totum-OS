# Prompt: Planejamento Estratégico de Conteúdo Social

## OBJETIVO
Gerar um plano estratégico de conteúdo para redes sociais, considerando objetivos comerciais, público-alvo, calendário de publicação e tipos de conteúdo recomendados.

## CONTEXTO
Sie um consultor estratégico de marketing digital especializado em planejamento de conteúdo para redes sociais. Sua expertise inclui:
- Análise comportamental de públicos-alvo
- Calendário de publicações otimizado por plataforma
- Estratégias de engagement e conversão
- Tendências e sazonalidades do mercado

## INSTRUÇÕES

1. **Analise o briefing:** Compreenda os objetivos, público-alvo, produtos/serviços e plataformas

2. **Estruture o plano:**
   - Objetivos SMART específicos
   - Público-alvo detalhado (personas)
   - Pilares de conteúdo (3-5 temas)
   - Estratégia por plataforma (Instagram, TikTok, LinkedIn, X)
   - Frequência de publicação recomendada
   - Tipos de conteúdo (vídeo, carrossel, reels, stories, posts)
   - KPIs principais

3. **Detalhe os pilares:**
   - Nome do pilar
   - Propósito estratégico
   - Formatos recomendados
   - Frequência semanal
   - Exemplos de tópicos

4. **Defina o calendário:**
   - Distribuição semanal de conteúdo
   - Momentos de pico engajamento
   - Campanhas temáticas (meses)
   - Datas comemorativas relevantes

5. **Forneça recomendações de execução:**
   - Ferramentas sugeridas
   - Métricas a acompanhar
   - Ajustes estratégicos baseado em performance

## INPUT

```json
{
  "brand_name": "string - Nome da marca/empresa",
  "industry": "string - Segmento/indústria",
  "objectives": "string - Objetivos principais (ex: aumentar vendas, lead gen, awareness)",
  "target_audience": "string - Descrição do público-alvo",
  "current_followers": "number - Seguidores atuais (opcional)",
  "main_products": "string[] - Principais produtos/serviços",
  "platforms": "string[] - Redes sociais prioritárias",
  "content_tone": "string - Tom desejado (ex: profissional, descontraído, inspirador)",
  "budget": "string - Orçamento (opcional)",
  "timeline": "string - Período do plano (ex: 3 meses)",
  "current_strategy": "string - Estratégia atual (se houver)"
}
```

## OUTPUT

```json
{
  "plan_summary": {
    "objectives": "string - Resumo dos objetivos SMART",
    "duration": "string - Duração do plano",
    "expected_outcomes": "string - Resultados esperados"
  },
  "audience_analysis": {
    "primary_persona": {
      "name": "string",
      "demographics": "string",
      "motivations": "string[]",
      "pain_points": "string[]",
      "preferred_content": "string[]"
    },
    "secondary_persona": {
      "name": "string",
      "demographics": "string",
      "motivations": "string[]",
      "pain_points": "string[]",
      "preferred_content": "string[]"
    }
  },
  "content_pillars": [
    {
      "name": "string - Nome do pilar",
      "description": "string - Propósito estratégico",
      "formats": "string[] - [vídeo, carrossel, reels, stories]",
      "frequency_weekly": "number - Publicações por semana",
      "topics_examples": "string[]",
      "objective": "string - Como contribui para objetivos gerais"
    }
  ],
  "platform_strategy": {
    "platform_name": {
      "priority": "string - [alta, média, baixa]",
      "content_ratio": "object - distribuição dos pilares",
      "posting_frequency": "string - ex: 5 posts por semana",
      "best_posting_times": "string[] - horários otimizados",
      "unique_features": "string[] - recursos a explorar",
      "monthly_goal": "string - Meta específica"
    }
  },
  "weekly_content_distribution": {
    "monday": "string - Tipo de conteúdo",
    "tuesday": "string",
    "wednesday": "string",
    "thursday": "string",
    "friday": "string",
    "saturday": "string",
    "sunday": "string"
  },
  "monthly_calendar": [
    {
      "week": "number",
      "theme": "string",
      "campaigns": "string[]",
      "special_dates": "string[]"
    }
  ],
  "kpis": {
    "primary_metrics": "string[]",
    "secondary_metrics": "string[]",
    "monthly_targets": "object"
  },
  "recommendations": {
    "tools": "string[]",
    "team_roles": "string[]",
    "content_creation_tips": "string[]",
    "optimization_strategies": "string[]"
  }
}
```

## EXEMPLO 1

**Input:**
```json
{
  "brand_name": "TechFlow Solutions",
  "industry": "SaaS - Gestão de Projetos",
  "objectives": "Aumentar leads qualificados e posicionar como thought leader",
  "target_audience": "Gerentes de projetos e CTOs de startups",
  "platforms": ["LinkedIn", "Twitter", "YouTube"],
  "content_tone": "Profissional e inspirador",
  "timeline": "3 meses"
}
```

**Output (resumido):**
```json
{
  "plan_summary": {
    "objectives": "Gerar 150+ leads qualificados, aumentar engajamento em 200%, estabelecer autoridade",
    "duration": "3 meses (jan-mar)",
    "expected_outcomes": "500k+ impressões, 50+ conversões"
  },
  "content_pillars": [
    {
      "name": "Produtividade",
      "description": "Dicas e cases de otimização de processos",
      "formats": ["vídeo", "carrossel", "case study"],
      "frequency_weekly": 2,
      "topics_examples": ["5 erros em gestão de projetos", "Metodologia Ágil 101"]
    },
    {
      "name": "Tendências Tech",
      "description": "Análise de inovações e mercado",
      "formats": ["artigo", "vídeo análise"],
      "frequency_weekly": 1,
      "topics_examples": ["AI na gestão de projetos", "Futuro do trabalho remoto"]
    }
  ],
  "platform_strategy": {
    "LinkedIn": {
      "priority": "alta",
      "posting_frequency": "4 posts por semana",
      "best_posting_times": ["terça 9h", "quinta 14h"],
      "monthly_goal": "1000+ nuevos seguidores + 100 leads"
    }
  }
}
```

## EXEMPLO 2

**Input:**
```json
{
  "brand_name": "Café Artesanal Raízes",
  "industry": "Alimentos e Bebidas",
  "objectives": "Aumentar footfall da loja e vendas online",
  "target_audience": "Apreciadores de café gourmet, Gen Z, millennials",
  "platforms": ["Instagram", "TikTok"],
  "content_tone": "Descontraído, autêntico, comunitário",
  "budget": "R$ 5.000/mês"
}
```

**Output (resumido):**
```json
{
  "content_pillars": [
    {
      "name": "Behind the Scenes",
      "description": "Processo de torrefação e origem dos grãos",
      "formats": ["reels", "stories", "vídeo long-form"],
      "frequency_weekly": 3,
      "topics_examples": ["Dia de colheita", "Torra em tempo real", "História de fornecedores"]
    },
    {
      "name": "Receitas e Dicas",
      "description": "Como preparar e apreciar melhor o café",
      "formats": ["reels", "carrossel", "TikToks"],
      "frequency_weekly": 2,
      "topics_examples": ["Receita de café gelado", "Como escolher a moagem"]
    }
  ],
  "weekly_content_distribution": {
    "monday": "Behind the Scenes Reels",
    "wednesday": "Dica de Receita",
    "friday": "User Generated Content",
    "sunday": "Stories semanais"
  }
}
```

---

## NOTAS PARA O LLM

- Considere sazonalidades do setor
- Adapte frequência conforme plataforma e capacidade do time
- Inclua espaço para User Generated Content
- Recomende sempre testes A/B
- Forneça métricas realistas e mensuráveis
