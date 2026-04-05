# 🤖 POP - FIGNALDO (Agente de Design System)

**Nome:** Fignaldo  
**Tipo:** Agente de Design/Prototipagem  
**Nível:** N1 (Subagente de TOT)  
**Emoji:** 🎨  
**Status:** Em planejamento

---

## 🎯 OBJETIVO
Criar protótipos a partir de Design Systems existentes, atuando como agente de prototipagem rápida.

---

## 📝 DESCRIÇÃO
Fignaldo recebe um Design System (cores, tipografia, componentes) e gera protótipos funcionais de telas/páginas sem necessidade de conversa chat. Interface direta de seleção e geração.

---

## 🚀 FUNCIONALIDADES PRINCIPAIS

### 1. Input: Design System
- Cores (hex codes)
- Tipografia (fontes, tamanhos)
- Componentes base (botões, inputs, cards)
- Exemplos de telas de referência

### 2. Processamento
- Análise do Design System
- Seleção de padrões aplicáveis
- Geração de estrutura HTML/CSS

### 3. Output: Protótipo
- HTML/CSS funcional
- Preview visual
- Código exportável
- Link temporário para cliente visualizar

---

## 🛠️ STACK TECNOLÓGICO SUGERIDO

| Componente | Tecnologia |
|------------|------------|
| Interface | React + Tailwind |
| Geração | Claude API (para código) |
| Preview | iframe dinâmico |
| Export | HTML/CSS puro ou React |

---

## 🔄 WORKFLOW

```
Usuário faz upload do Design System
         ↓
Fignaldo analisa (cores, fontes, componentes)
         ↓
Usuário seleciona tipo de tela (landing, dashboard, etc)
         ↓
Fignaldo gera protótipo em segundos
         ↓
Preview ao vivo + código para copiar
         ↓
Link temporário para cliente aprovar
```

---

## 💡 CASOS DE USO

1. **Cliente manda identidade visual** → Fignaldo gera landing page em 2 min
2. **Novo produto** → Protótipo de app para validação
3. **Redesign** → Novas telas mantendo consistência do DS

---

## ⚠️ LIMITAÇÕES

- Não substitui designer (é ferramenta de aceleração)
- Cliente precisa aprovar antes de produção
- Código é base para desenvolvedor refinar

---

## 📋 PRÓXIMOS PASSOS

- [ ] Definir Design System de exemplo (Totum)
- [ ] Criar interface de upload/seleção
- [ ] Integrar com Claude API
- [ ] Testar com caso real

---

**Criado por:** TOT  
**Data:** 2026-04-04  
**Status:** POP criado, aguardando implementação