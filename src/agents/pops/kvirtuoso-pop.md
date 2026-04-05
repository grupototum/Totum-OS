# 🤖 POP - KVIRTUOSO (Criador de Postagens)

**Nome:** KVirtuoso  
**Tipo:** Agente de Marketing/Criação de Conteúdo  
**Nível:** N1 (Subagente de TOT)  
**Emoji:** 🎨📱  
**Status:** Em planejamento

---

## 🎯 OBJETIVO
Gerar 100-200 postagens únicas a partir de um Key Visual (KV) + conteúdo escrito + informações do cliente.

---

## 📝 DESCRIÇÃO
KVirtuoso recebe um Key Visual (imagem base da campanha), o conteúdo escrito (textos, legenda), e informações do cliente (tom de voz, cores, elementos visuais). A partir disso, gera dezenas de variações de posts para redes sociais.

---

## 🚀 FUNCIONALIDADES PRINCIPAIS

### 1. Input: Kit de Criação
- **Key Visual** - Imagem base da campanha (KV)
- **Conteúdo Escrito** - Legendas, copy, mensagens
- **Info do Cliente** - Tom de voz, cores, elementos, restrições
- **Formatos** - Feed, Story, Reels, Carrossel

### 2. Variações Geradas
- **Posts únicos** - 100-200 versões diferentes
- **Carrosséis** - Sequências de 3-10 slides
- **Stories** - Formatos 9:16 com interações
- **Reels** - Sugestões de vídeo curto

### 3. Personalização
- Manter identidade visual consistente
- Variações de ângulo, corte, composição
- Adaptações por plataforma (IG, TikTok, LinkedIn)
- Sugestões de legenda para cada post

---

## 🛠️ STACK TECNOLÓGICO SUGERIDO

| Componente | Tecnologia |
|------------|------------|
| Geração de imagem | Leonardo.AI / Ideogram / Adobe Firefly |
| Layout/Composição | Canva API / Figma API |
| Texto/Legendas | Claude / Gemini |
| Organização | Airtable / Notion / Supabase |

---

## 🔄 WORKFLOW

```
Upload do Key Visual (KV)
         ↓
Input de conteúdo escrito
         ↓
Configurar tom de voz do cliente
         ↓
KVirtuoso gera 100+ variações
         ↓
Preview em grade (grid visual)
         ↓
Seleção dos melhores
         ↓
Export em batch (ZIP ou integração direta)
         ↓
Agendamento no Instagram/Facebook
```

---

## 💡 CASOS DE USO

1. **Campanha de lançamento** - 100 posts em 2 dias
2. **Cliente mensal** - Conteúdo para 30 dias
3. **Black Friday** - Variações de promoção
4. **Reutilização de KV** - Maximize um bom visual

---

## 📊 FORMATOS SUPORTADOS

| Formato | Dimensões | Quantidade |
|---------|-----------|------------|
| Feed Instagram | 1080x1080 | 50-80 posts |
| Story Instagram | 1080x1920 | 30-50 stories |
| Reels/TikTok | 1080x1920 | 10-20 sugestões |
| Carrossel | 1080x1080 | 5-10 carrosséis |
| LinkedIn | 1200x627 | 20-30 posts |

---

## ⚠️ LIMITAÇÕES

- Qualidade depende do KV original
- Requer revisão humana antes de publicar
- Geradores de imagem têm limites diários
- Nem toda variação será aprovável (filtro necessário)

---

## 📋 PRÓXIMOS PASSOS

- [ ] Definir KV de exemplo (Totum ou cliente)
- [ ] Escolher ferramenta de geração (Leonardo/Ideogram)
- [ ] Criar template de variações
- [ ] Testar com 1 campanha real
- [ ] Criar sistema de aprovação/rejeição

---

**Criado por:** TOT  
**Data:** 2026-04-04  
**Status:** POP criado, aguardando implementação