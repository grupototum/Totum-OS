# 🏢 CENTRAL DE CLIENTES - ARQUITETURA DE DADOS
## Sistema unificado de inteligência do cliente para todos os agentes

**Data:** Abril 2026  
**Objetivo:** Criar estrutura completa de dados para agentes trabalharem de forma acertiva  
**Princípio:** "Quanto mais contexto, mais barato e eficiente o trabalho"

---

## 🎯 VISÃO GERAL

A Central de Clientes é o **cérebro da operação**. Todos os agentes acessam esses dados para:
- Personalizar comunicação
- Tomar decisões informadas
- Evitar retrabalho
- Aumentar taxa de acerto

```
┌─────────────────────────────────────────────────────────────┐
│                  CENTRAL DE CLIENTES                        │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  Dados  │  │ Contexto│  │  Key    │  │Inteligência│      │
│  │ Básicos │  │Negócio  │  │ Visual  │  │  de Mercado│      │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
│       └────────────┴────────────┴────────────┘              │
│                    │                                        │
│            ┌───────┴───────┐                                │
│            │ AGENTES TOTUM │                                │
│            │  (todos usam) │                                │
│            └───────────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 SEÇÃO 1: DADOS BÁSICOS DO CLIENTE

### 1.1 Identificação
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| ID único | UUID | Sim | Todos |
| Nome empresa | String | Sim | Todos |
| Nome fantasia | String | Não | Vendedor, Atendente |
| CNPJ/CPF | String | Sim | Controlador |
| Data de fundação | Date | Não | Cartógrafo |
| Porte (MEI/ME/EPP/Outro) | Enum | Não | Controlador |
| Setor de atuação | Enum | Sim | Cartógrafo, Vendedor |
| Website | URL | Não | Todos |
| Blog | URL | Não | Radar |

### 1.2 Contato Principal
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Nome responsável | String | Sim | Todos |
| Cargo | String | Sim | Vendedor |
| E-mail | E-mail | Sim | Todos |
| Telefone | Tel | Sim | Vendedor, Atendente |
| WhatsApp | Tel | Sim | Vendedor, Atendente |
| LinkedIn | URL | Não | Vendedor |
| Instagram pessoal | String | Não | Cartógrafo |
| Preferência de contato | Enum | Sim | Vendedor |
| Melhor horário | String | Não | Vendedor |

### 1.3 Endereço
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| CEP | String | Não | Controlador |
| Logradouro | String | Não | Controlador |
| Cidade | String | Sim | Cartógrafo |
| Estado | String | Sim | Cartógrafo |
| Região | Enum | Auto | Cartógrafo, Tráfego |

---

## 📋 SEÇÃO 2: CONTEXTO DE NEGÓCIO

### 2.1 Produto/Serviço
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Descrição do negócio | Text | Sim | Todos |
| Proposta de valor | Text | Sim | Vendedor, Radar |
| Produtos/serviços oferecidos | Array | Sim | Radar, Criação |
| Preço médio | Number | Sim | Vendedor, Controlador |
| Ticket médio | Number | Sim | Vendedor, Tráfego |
| Formas de pagamento aceitas | Array | Não | Controlador |
| Diferencial competitivo | Text | Sim | Vendedor, Criação |
| Garantia oferecida | Text | Não | Vendedor |

### 2.2 Mercado e Concorrência
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Concorrente direto #1 | String | Sim | Cartógrafo, Criação |
| Instagram concorrente #1 | String | Sim | Cartógrafo |
| Concorrente direto #2 | String | Sim | Cartógrafo, Criação |
| Concorrente direto #3 | String | Não | Cartógrafo |
| Posicionamento vs concorrência | Text | Sim | Vendedor, Radar |
| Fortaleza única | Text | Sim | Criação, Vendedor |
| Fraqueza que precisa melhorar | Text | Não | Radar |

### 2.3 Situação Atual
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Ponto de dor principal | Text | Sim | Todos |
| O que já tentou que não funcionou | Text | Sim | Vendedor, Radar |
| Investimento atual em marketing | Number | Sim | Controlador |
| Volume de vendas atual (mês) | Number | Sim | Vendedor |
| Número de funcionários | Number | Não | Controlador |
| Faturamento mensal estimado | Number | Não | Controlador |
| Objetivo com a Totum | Enum | Sim | Todos |
| Meta de crescimento (%/mês) | Number | Não | Miguel |

---

## 📋 SEÇÃO 3: PÚBLICO-ALVO (MAPA SEMÂNTICO)

### 3.1 Segmentação Demográfica
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Idade mínima | Number | Sim | Cartógrafo, Tráfego |
| Idade máxima | Number | Sim | Cartógrafo, Tráfego |
| Gênero predominante | Enum | Sim | Criação, Tráfego |
| Classe social (A/B/C/D) | Enum | Sim | Vendedor, Tráfego |
| Escolaridade | Enum | Não | Criação |
| Profissão típica | String | Sim | Cartógrafo, Radar |
| Estado civil | Enum | Não | Criação |
| Tem filhos? | Boolean | Não | Criação |

### 3.2 Segmentação Geográfica
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Raio de atuação (km) | Number | Sim | Tráfego |
| Cidades principais | Array | Sim | Tráfego |
| Estados prioritários | Array | Sim | Tráfego |
| Bairros/regiões específicas | Array | Não | Tráfego |

### 3.3 Segmentação Comportamental
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Dores principais (3) | Array | Sim | Criação, Vendedor |
| Desejos/aspirações (3) | Array | Sim | Criação, Vendedor |
| Objeções comuns (3) | Array | Sim | Vendedor, Radar |
| Crenças limitantes | Text | Não | Radar, Criação |
| Gatilhos emocionais | Array | Sim | Criação |
| Momento de compra | Enum | Sim | Vendedor |
| Valores importantes | Array | Não | Criação |
| Medos relacionados ao produto | Array | Não | Radar |

### 3.4 Jornada do Cliente
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Onde descobre o produto? | Array | Sim | Tráfego, Radar |
| Onde pesquisa antes de comprar? | Array | Sim | Radar |
| Quanto tempo leva para decidir? | Enum | Sim | Vendedor |
| Quem influencia a decisão? | Text | Não | Vendedor |
| Maior fonte de leads atual | Enum | Sim | Tráfego |
| Canal de comunicação preferido | Enum | Sim | Atendente |

### 3.5 Digital do Público
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Redes sociais que usa | Array | Sim | Radar, Tráfego |
| Influenciadores que segue (5) | Array | Sim | Cartógrafo |
| Hashtags relevantes (10) | Array | Sim | Radar, Tráfego |
| Comunidades online (grupos) | Array | Não | Radar |
| Apps que usa frequentemente | Array | Não | Radar |
| Horários de pico online | String | Não | Radar |
| Dispositivo principal | Enum | Sim | Criação |

---

## 📋 SEÇÃO 4: KEY VISUAL E IDENTIDADE

### 4.1 Assets Visuais
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Logo principal (SVG/PNG) | File | Sim | Diretor Arte, Todos |
| Logo alternativa | File | Não | Diretor Arte |
| Ícone/favicon | File | Não | Diretor Arte |
| Manual de marca | File | Não | Diretor Arte |
| Fotos do produto | Files | Não | Diretor Arte |
| Fotos do serviço sendo feito | Files | Sim | Diretor Arte |
| Fotos do time | Files | Não | Diretor Arte |
| Fotos do fundador | File | Sim | Diretor Arte |
| Vídeos institucionais | Files | Não | Diretor Arte |
| Vídeos de depoimentos | Files | Não | Diretor Arte |
| Banco de imagens próprio | Files | Não | Diretor Arte |
| Mockups de produto | Files | Não | Diretor Arte |

### 4.2 Paleta e Tipografia
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Cor primária (hex) | Color | Sim | Diretor Arte |
| Cor secundária (hex) | Color | Sim | Diretor Arte |
| Cor de destaque (hex) | Color | Sim | Diretor Arte |
| Cores que NÃO podem usar | Array | Não | Diretor Arte |
| Fonte títulos | String | Sim | Diretor Arte |
| Fonte corpo | String | Sim | Diretor Arte |
| Restrições de tipografia | Text | Não | Diretor Arte |

### 4.3 Tom de Voz e Estilo
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Personalidade da marca (3 adjetivos) | Array | Sim | Diretor Arte, Radar |
| Tom de voz | Enum | Sim | Radar, Criação |
| Palavras que a marca usa | Array | Sim | Radar |
| Palavras que a marca NUNCA usa | Array | Sim | Radar |
| Frases de efeito próprias | Array | Não | Radar |
| Slugans/taglines | Array | Não | Radar |
| Formato preferido de conteúdo | Enum | Não | Radar |
| Formato que NÃO funciona | Text | Não | Radar |

### 4.4 Inspirações e Restrições
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Marcas referência visuais | Array | Não | Diretor Arte |
| Links Pinterest/Behance | Array | Não | Diretor Arte |
| Estética que quer evitar | Text | Não | Diretor Arte |
| Restrições culturais/religiosas | Text | Não | Diretor Arte |
| Estações/épocas especiais | Text | Não | Radar |

---

## 📋 SEÇÃO 5: CONTEXTO OPERACIONAL

### 5.1 Marketing Atual
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Já investe em tráfego pago? | Boolean | Sim | Tráfego |
| Plataformas de anúncio usadas | Array | Não | Tráfego |
| Investimento mensal em ads | Number | Sim | Controlador |
| ROI atual de campanhas | Number | Não | Tráfego |
| Já trabalha com conteúdo orgânico? | Boolean | Sim | Radar |
| Frequência de postagem atual | String | Não | Radar |
| Rede social com melhor performance | Enum | Não | Radar |
| Rede social que quer crescer | Enum | Não | Radar |
| Estratégia de e-mail marketing? | Boolean | Não | Especialista CRM |
| Frequência de envio de e-mail | String | Não | Especialista CRM |
| Tamanho da base de e-mails | Number | Não | Especialista CRM |

### 5.2 Vendas e CRM
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| CRM utilizado | Enum | Não | Especialista CRM |
| Processo de vendas atual | Text | Sim | Vendedor |
| Origem da maioria das vendas | Enum | Sim | Tráfego |
| Taxa de conversão atual (%) | Number | Não | Vendedor |
| Ticket médio de venda | Number | Sim | Vendedor |
| LTV estimado do cliente | Number | Não | Vendedor |
| Ciclo médio de vendas (dias) | Number | Sim | Vendedor |
| Objeções mais comuns | Array | Sim | Vendedor |
| Argumentos que funcionam | Array | Sim | Vendedor |
| Depoimentos de clientes | Files | Não | Vendedor, Criação |
| Cases de sucesso documentados | Text | Não | Vendedor |

### 5.3 Dados Técnicos
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Acesso ao Instagram Business | Boolean | Sim | Especialista CRM |
| Acesso ao Meta Business | Boolean | Sim | Tráfego |
| Acesso ao Google Ads | Boolean | Não | Tráfego |
| Pixel do Meta instalado? | Boolean | Sim | Especialista CRM |
| Google Analytics configurado? | Boolean | Não | Especialista CRM |
| Domínio próprio? | Boolean | Sim | Diretor Arte |
| Site em qual plataforma? | Enum | Não | Diretor Arte |
| Integrações atuais | Array | Não | Especialista CRM |
| APIs disponíveis | Array | Não | Especialista CRM |

### 5.4 Equipe e Processos
| Campo | Tipo | Obrigatório | Quem usa |
|-------|------|-------------|----------|
| Quem cria conteúdo hoje? | Text | Não | Radar |
| Quem responde clientes? | Text | Não | Atendente |
| Quem faz vendas? | Text | Sim | Vendedor |
| Quem aprova campanhas? | Text | Não | Miguel |
| Horário de funcionamento | String | Sim | Atendente |
| Dias de maior movimento | Array | Não | Atendente |
| Tempo de resposta atual | String | Não | Atendente |
| SLA interno desejado | String | Não | Liz |

---

## 📋 SEÇÃO 6: HISTÓRICO E INTERAÇÕES

### 6.1 Histórico com a Totum
| Campo | Tipo | Quem atualiza |
|-------|------|---------------|
| Data de primeiro contato | Date | Auto |
| Origem do lead | Enum | Auto |
| Agente que fechou | String | Vendedor |
| Data de fechamento | Date | Auto |
| Valor do contrato | Number | Controlador |
| Pacote contratado | Enum | Controlador |
| Data de início | Date | Controlador |
| Data de renovação | Date | Controlador |
| Status atual | Enum | Liz |
| NPS última pesquisa | Number | Atendente |

### 6.2 Timeline de Interações
| Campo | Tipo | Quem atualiza |
|-------|------|---------------|
| Data/hora | DateTime | Auto |
| Tipo | Enum | Auto |
| Agente envolvido | String | Auto |
| Descrição | Text | Agente |
| Arquivos anexos | Files | Agente |
| Status | Enum | Auto |
| Próxima ação | Text | Agente |
| Data próxima ação | Date | Agente |

### 6.3 Documentos e Contratos
| Campo | Tipo | Quem atualiza |
|-------|------|---------------|
| Contrato assinado | File | Controlador |
| Propostas enviadas | Files | Vendedor |
| Briefings aprovados | Files | Radar |
| Relatórios mensais | Files | Todos |
| Notas fiscais | Files | Controlador |
| Alvarás/certidões | Files | Controlador |

---

## 📋 SEÇÃO 7: INTELIGÊNCIA GERADA (Auto-preenchido)

### 7.1 Análise Cartógrafo (Mapa Semântico)
| Campo | Tipo | Quem atualiza |
|-------|------|---------------|
| Nichos identificados | JSON | Cartógrafo |
| Sentimento da audiência | JSON | Cartógrafo |
| Termos emergentes | Array | Cartógrafo |
| Hashtags performáticas | Array | Cartógrafo |
| Horários de pico | String | Cartógrafo |
| Conteúdos mais engajados | Array | Cartógrafo |

### 7.2 Performance de Campanhas
| Campo | Tipo | Quem atualiza |
|-------|------|---------------|
| Campanhas ativas | Array | Tráfego |
| Métricas por campanha | JSON | Tráfego |
| Criativos vencedores | Array | Tráfego |
| Públicos que convertem | JSON | Tráfego |
| CPL por canal | JSON | Tráfego |
| ROAS histórico | JSON | Tráfego |

### 7.3 Insights dos Agentes
| Campo | Tipo | Quem atualiza |
|-------|------|---------------|
| Aprendizados da operação | Text | Todos |
| O que funcionou | Array | Todos |
| O que não funcionou | Array | Todos |
| Recomendações futuras | Array | Todos |
| Alertas e observações | Text | Todos |

---

## 🔄 FLUXO DE ATUALIZAÇÃO

```
CADASTRO INICIAL (Cliente preenche)
           │
           ▼
┌─────────────────────┐
│  CONTROLADOR valida │
│  dados financeiros  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ CARTÓGRAFO analisa  │
│  redes sociais e    │
│  preenche Seção 7.1 │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Dados disponíveis │
│   para todos os     │
│      agentes        │
└─────────────────────┘
           │
           ▼
ATUALIZAÇÃO CONTÍNUA (Agentes atualizam suas seções)
```

---

## 💾 MODELO DE DADOS (JSON)

```json
{
  "cliente": {
    "id": "uuid-1234",
    "status": "ativo",
    
    "secao1_dados_basicos": {
      "identificacao": {...},
      "contato": {...},
      "endereco": {...}
    },
    
    "secao2_contexto_negocio": {
      "produto": {...},
      "mercado": {...},
      "situacao": {...}
    },
    
    "secao3_publico_alvo": {
      "demografico": {...},
      "geografico": {...},
      "comportamental": {...},
      "jornada": {...},
      "digital": {...}
    },
    
    "secao4_key_visual": {
      "assets": {...},
      "paleta": {...},
      "tom_voz": {...},
      "inspiracoes": {...}
    },
    
    "secao5_contexto_operacional": {
      "marketing": {...},
      "vendas": {...},
      "tecnico": {...},
      "equipe": {...}
    },
    
    "secao6_historico": {
      "totum": {...},
      "timeline": [...],
      "documentos": {...}
    },
    
    "secao7_inteligencia": {
      "cartografo": {...},
      "performance": {...},
      "insights": {...}
    },
    
    "created_at": "2026-04-01",
    "updated_at": "2026-04-01",
    "updated_by": "agente_nome"
  }
}
```

---

## 📊 RESUMO POR AGENTE

| Agente | Seções principais | Inputs críticos |
|--------|------------------|-----------------|
| **Miguel** | 2.2, 2.3, 5.2, 7.2 | Meta, ROI, estratégia |
| **Liz** | 5.4, 6.2 | SLA, processos, timeline |
| **Jarvis** | 5.1, 7.2 | Investimento ads, performance |
| **Cartógrafo** | 3 (todas), 7.1 | Nicho, comportamento, hashtags |
| **Controlador** | 1, 2.1, 5.2, 6.3 | Dados finanças, contratos |
| **Vendedor** | 2.1, 3.2, 3.3, 5.2 | Dores, objeções, cases |
| **Diretor Arte** | 4 (todas) | Logo, paleta, tom voz, refs |
| **Especialista CRM** | 5.1, 5.3 | CRM, integrações, APIs |
| **Radar** | 3.4, 3.5, 4.3, 5.1 | Jornada, redes sociais, tom |
| **Atendente** | 1.2, 5.4 | Contato, horários, SLAs |

---

## 🎯 BENEFÍCIOS ESPERADOS

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Tempo de onboarding | 7 dias | 3 dias | -57% |
| Retrabalho Criação | 40% | 15% | -62% |
| Aprovação 1ª entrega | 50% | 80% | +60% |
| Conversão Vendas | 12% | 18% | +50% |
| Tempo resposta Atend. | 4h | 2h | -50% |
| Custo operacional | Alto | Baixo | -30% |

---

*Arquitetura de dados da Central de Clientes Totum*  
*Abril 2026*
