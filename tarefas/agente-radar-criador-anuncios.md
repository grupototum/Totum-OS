# 🤖 AGENTE: [RADAR DE ANÚNCIOS] + [CRIADOR DE CRIATIVOS]

**Data:** 2026-04-03  
**Criador:** Israel  
**Tipo:** Dupla de Agentes (Radar + Criador)

## Agente 1: RADAR DE ANÚNCIOS
**Nome sugerido:** AdRaptor, SpyCreative, ConcorrentEye
**Função:** Espionar anúncios dos concorrentes

### O que faz
- Coleta anúncios estáticos de concorrentes
- Salva em biblioteca organizada
- Classifica por: plataforma, estilo, engajamento estimado

### Onde pega
- Meta Ads Library
- TikTok Creative Center
- LinkedIn Ads
- Outras fontes públicas

### Output
Banco de anúncios concorrentes → Usado pelo Agente 2

---

## Agente 2: CRIADOR DE CRIATIVOS ESTÁTICOS
**Nome sugerido:** AdAlchemist, CreativeForge
**Função:** Criar anúncios baseados em dados

### Inputs
1. **KV da Totum** (estilo estabelecido)
2. **Anúncios concorrentes** (do Radar)
3. **Insights de performance** (se disponível)

### Outputs (para cada ideia)
- **Opção A:** Baseada no KV da Totum
- **Opção B:** Baseada no que funcionou para concorrentes
- **Opção C:** (opcional) Híbrida

### Lógica
```
Ideia de anúncio
      ↓
   ┌──┴──┐
   │     │
   ▼     ▼
KV    Concorrente
   │     │
   └──┬──┘
      ▼
  2-3 variações
```

---

## Fluxo Completo
```
[Radar] → Coleta anúncios concorrentes → Banco
                                          ↓
[Cliente define KV] → [Criador recebe inputs]
                          ↓
              Análise KV + Concorrentes
                          ↓
              Gera 2-3 opções por ideia
```

## Status
⏳ Aguardando desenvolvimento
