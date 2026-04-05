# 🤖 Agente: Designer Automático (Social Media)

## Descrição
Agente de produção de postagens para redes sociais. Recebe templates visuais + conteúdo de planilha + assets do cliente e gera peças finais automaticamente (posts únicos e carrosséis).

---

## 📥 Inputs

### 1. Key Visual / Templates
- **Formato:** PSD (Photoshop), Canva ou PNG base
- **Estrutura:** Templates com camadas nomeadas (`{{titulo}}`, `{{texto}}`, `{{cta}}`, `{{logo}}`)
- **Formatos de saída:** 
  - Feed: 1080x1350px
  - Stories: 1080x1920px
  - Carrossel: 1080x1350px (múltiplos slides)

### 2. Planilha de Conteúdo (CSV)
```csv
cliente_id,tipo,titulo,texto_principal,cta,tom_cor,imagem_fundo,quantidade_slides
cliente_01,feed,"Novo Produto","Chegou o novo serviço...","Saiba mais",azul,foto_produto.jpg,1
cliente_01,carrossel,"5 Dicas","Dica 1: ...","Link na bio",verde,dica_bg.jpg,5
```

### 3. Assets do Cliente
- Logos (PNG com transparência)
- Fotos de produto/serviço
- Paleta de cores da marca
- Fontes específicas (TTF/OTF)

---

## 🔄 Fluxo de Trabalho

```
[Planilha CSV] + [Templates] + [Assets]
           ↓
   [Parser de Conteúdo] → Valida dados obrigatórios
           ↓
   [Template Engine] → Aplica conteúdo nos templates
           ↓
   [Render Engine]
       ├── Post único: 1 imagem
       └── Carrossel: 3-10 slides sequenciais
           ↓
   [Exportador] → PNG/JPG organizado por cliente/data
           ↓
   [Entrega] → Google Drive / Pasta local / Upload direto
```

---

## 🛠️ Stack Técnico (Opções)

### Opção A: Photoshop + Python ⭐ RECOMENDADA
- **Orquestração:** n8n ou script Python
- **Render:** `photoshop-python-api` ou `psd-tools`
- **Vantagem:** Preserva camadas, fontes, efeitos profissionais
- **Requisito:** Photoshop instalado no servidor (ou usar cloud com Photoshop)

### Opção B: Pillow/OpenCV (Sem Photoshop)
- **Biblioteca:** Python Pillow (PIL) + OpenCV
- **Templates:** PNG base com áreas de texto pré-definidas
- **Vantagem:** Mais rápido, sem licença Adobe
- **Limitação:** Menos flexibilidade com efeitos complexos

### Opção C: Canva API (Limitada)
- **API:** Canva Connect API (beta)
- **Automação:** Playwright/Puppeteer para interação
- **Vantagem:** Templates já no Canva
- **Limitação:** API limitada, pode ser instável

---

## 📁 Estrutura de Pastas Sugerida

```
/agents/designer/
├── templates/
│   ├── cliente_01/
│   │   ├── feed_template.psd
│   │   ├── stories_template.psd
│   │   └── carrossel_template.psd
│   └── cliente_02/
├── assets/
│   ├── cliente_01/
│   │   ├── logo.png
│   │   ├── fontes/
│   │   └── fotos/
│   └── cliente_02/
├── input/           # Planilhas CSV
├── output/          # Imagens geradas
│   ├── 2026-04-05_cliente_01/
│   └── 2026-04-05_cliente_02/
└── logs/            # Registro de jobs
```

---

## 🚀 Próximos Passos (TODO)

- [ ] Definir qual stack usar (A, B ou C)
- [ ] Padronizar nomenclatura de camadas nos templates PSD
- [ ] Criar template de planilha CSV
- [ ] Desenvolver script base Python
- [ ] Integrar com n8n para automação
- [ ] Testar com 1 cliente piloto

---

## 💡 Notas

- **Status:** Ideia arquivada - aguardando priorização
- **Complexidade:** Média-Alta
- **Dependências:** Templates padronizados, estrutura de dados definida
- **Potencial:** Alto - elimina trabalho manual repetitivo de design

---

_Criado em: 2026-04-05_
_Contexto: Conversa sobre automação de postagens para Totum_
