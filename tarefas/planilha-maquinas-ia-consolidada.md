# 📊 PLANILHA CONSOLIDADA - Máquinas Recomendadas para IA Local

**Data:** 2026-04-03  
**Para:** Apresentação aos sócios (Miguel, Liz, Jarvis)  
**Objetivo:** Planejamento de aquisição de hardware para IA local

---

## 🖥️ OPÇÃO 1: Até R$ 2.000 (Entry Level)

| Componente | Especificação | Preço Estimado |
|------------|---------------|----------------|
| CPU | Ryzen 5 5600G (6 cores, 12 threads) | R$ 700 |
| RAM | 32GB DDR4 (2x16GB) | R$ 600 |
| Placa-mãe | B450/B550 | R$ 500 |
| SSD | 512GB NVMe | R$ 250 |
| Fonte | 500W | R$ 200 |
| **TOTAL** | | **R$ 2.250** |

### ⚡ IAs que rodam nesta máquina:

| IA/Ferramenta | Tamanho | Performance | Uso na Totum | Link |
|---------------|---------|-------------|--------------|------|
| **TinyLlama 1.1B** | 800MB | ⚡ Rápido | Chat simples, classificação | [HF](https://huggingface.co/TinyLlama) |
| **Phi-3 Mini 3.8B** | 2.5GB | ⚡ Rápido | Assistente de código leve | [HF](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct) |
| **Whisper Base** | 74MB | ⚡ Tempo real | Transcrição de reuniões | [OpenAI](https://github.com/openai/whisper) |
| **all-MiniLM Embeddings** | 80MB | ⚡ Ultra rápido | Busca semântica em documentos | [HF](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) |
| **Stable Diffusion 1.5 (ONNX)** | 4GB | 🐌 Lento | Geração de imagem (não recomendado) | [HF](https://huggingface.co/runwayml/stable-diffusion-v1-5) |

### ⚠️ Limitações:
- ❌ **Sem GPU dedicada** - Usa integrada do Ryzen
- ❌ Não roda modelos grandes (7B+ com qualidade)
- ❌ Geração de imagem é muito lenta
- ✅ Ideal para: Embeddings, transcrição, classificação

### 💡 Para quem serve:
Começo imediato, orçamento limitado, foco em texto/NLP.

---

## 🖥️ OPÇÃO 2: Até R$ 5.000 (Sweet Spot) ⭐ RECOMENDADO

| Componente | Especificação | Preço Estimado |
|------------|---------------|----------------|
| CPU | Ryzen 5 5600 (6 cores) | R$ 800 |
| GPU | **RTX 3060 12GB** ⭐ | R$ 1.800 |
| RAM | 32GB DDR4 | R$ 600 |
| Placa-mãe | B550 | R$ 600 |
| SSD | 1TB NVMe | R$ 400 |
| Fonte | 600W 80Plus | R$ 350 |
| **TOTAL** | | **R$ 4.550** |

### ⚡ IAs que rodam nesta máquina:

| IA/Ferramenta | Tamanho | Performance | Uso na Totum | Link |
|---------------|---------|-------------|--------------|------|
| **Qwen2.5-7B-Instruct** | 4.5GB (Q4) | 🚀 15-20 tok/s | Chatbot clientes em PT-BR | [Ollama](https://ollama.com/library/qwen2.5) |
| **Llama 3.1 8B** | 4.8GB (Q4) | 🚀 15-20 tok/s | Assistente geral | [Ollama](https://ollama.com/library/llama3.1) |
| **CodeLlama 7B** | 4GB (Q4) | 🚀 15-20 tok/s | Coding assistant para Jarvis | [Ollama](https://ollama.com/library/codellama) |
| **Stable Diffusion 1.5** | 4GB | ✅ 5-10 seg/img | Imagens para posts | [HF](https://huggingface.co/runwayml/stable-diffusion-v1-5) |
| **Whisper Small** | 244MB | ✅ 0.5x real-time | Transcrição de alta qualidade | [OpenAI](https://github.com/openai/whisper) |
| **Embeddings (todos)** | Variável | ⚡ Ultra rápido | Busca em documentos | [HF](https://huggingface.co/sentence-transformers) |

### ✅ Capacidades:
- ✅ **RTX 3060 12GB** - GPU dedicada com VRAM suficiente
- ✅ Roda modelos 7B-13B quantizados com boa performance
- ✅ Geração de imagem viável (SD 1.5)
- ✅ Pode rodar múltiplos modelos simultâneos

### 💡 Para quem serve:
**MELHOR CUSTO-BENEFÍCIO!** Equilíbrio perfeito preço/desempenho.

---

## 🖥️ OPÇÃO 3: Até R$ 10.000 (High-End)

| Componente | Especificação | Preço Estimado |
|------------|---------------|----------------|
| CPU | Ryzen 7 7700X (8 cores) | R$ 1.800 |
| GPU | **RTX 4070 Ti Super 16GB** ⭐ | R$ 5.500 |
| RAM | 64GB DDR5 | R$ 1.200 |
| Placa-mãe | X670 | R$ 1.500 |
| SSD | 2TB NVMe | R$ 600 |
| Fonte | 850W 80Plus Gold | R$ 600 |
| **TOTAL** | | **R$ 11.200** |

*Ajustando para RTX 4070 12GB = R$ 8.500*

### ⚡ IAs que rodam nesta máquina:

| IA/Ferramenta | Tamanho | Performance | Uso na Totum | Link |
|---------------|---------|-------------|--------------|------|
| **Llama 3.1 70B (Q4)** | 40GB | 🚀 5-8 tok/s | Modelo grande, alta qualidade | [Ollama](https://ollama.com/library/llama3.1) |
| **Mixtral 8x7B** | 25GB (Q4) | 🚀 8-10 tok/s | Mistura de especialistas | [Ollama](https://ollama.com/library/mixtral) |
| **Qwen2.5 72B** | 45GB (Q4) | 🚀 4-6 tok/s | Melhor modelo em PT-BR | [Ollama](https://ollama.com/library/qwen2.5) |
| **Stable Diffusion XL** | 6-8GB | ✅ 3-5 seg/img | Imagens de alta qualidade | [HF](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) |
| **Stable Video Diffusion** | 8GB | ✅ Vídeo curto | Geração de vídeo | [HF](https://huggingface.co/stabilityai/stable-video-diffusion-img2vid) |
| **Todos os outros** | - | 🚀 Muito rápido | - | - |

### ✅ Capacidades:
- ✅ **RTX 4070 Ti Super 16GB** - VRAM abundante
- ✅ Roda modelos 70B+ (top de linha)
- ✅ SDXL + geração de vídeo
- ✅ Múltiplos modelos simultâneos sem gargalo

### 💡 Para quem serve:
Empresa em crescimento, muitos clientes, necessidade de alta performance.

---

## 💰 COMPARATIVO: GPU Própria vs Nuvem

### Custo Anual - LLM 7B + Stable Diffusion

| Opção | Setup Inicial | Custo Mensal | Custo Anual | Break-even |
|-------|---------------|--------------|-------------|------------|
| **RunPod** (RTX 3090, 8h/dia) | R$ 0 | R$ 290 | **R$ 3.500** | - |
| **Vast.ai** (RTX 3090, 8h/dia) | R$ 0 | R$ 230 | **R$ 2.800** | - |
| **Google Colab Pro** | R$ 0 | R$ 50 | **R$ 600** | - |
| **Opção 2 Própria** (RTX 3060) | R$ 4.550 | R$ 50* | **R$ 5.150** (ano 1) | 1.5 anos |
| **Opção 3 Própria** (RTX 4070) | R$ 8.500 | R$ 70* | **R$ 9.340** (ano 1) | 2.5 anos |

*Energia estimada

### 📊 Análise Break-even

| Uso diário | Própria vence em |
|------------|------------------|
| 2-4 horas | 3-4 anos |
| 4-8 horas | **1.5-2 anos** ⭐ |
| 8-12 horas | **1 ano** ⭐ |
| 24/7 (servidor) | **8-12 meses** ⭐ |

### 🎯 Recomendação por Cenário

| Cenário | Solução | Porquê |
|---------|---------|--------|
| Testando / Irregular | RunPod/Vast.ai | Paga só quando usa |
| Uso constante (4h+/dia) | **Opção 2 - RTX 3060** | Melhor custo-benefício |
| Profissional/Agência | **Opção 3 - RTX 4070** | Performance máxima |
| Startup crescendo | Opção 2 agora, upgrade depois | Escalabilidade |

---

## 🎯 RESUMO EXECUTIVO PARA SÓCIOS

### Pergunta Central:
> "Vamos rodar IA local 4+ horas por dia?"

**Se SIM:** Máquina própria é mais barato em 1-2 anos.

### Recomendação da TOTUM:

| Prioridade | Opção | Investimento | ROI |
|------------|-------|--------------|-----|
| 🥇 **1ª** | Opção 2 (RTX 3060) | R$ 4.550 | Melhor custo-benefício |
| 🥈 **2ª** | Opção 3 (RTX 4070) | R$ 8.500 | Performance futura |
| 🥉 **3ª** | Opção 1 (sem GPU) | R$ 2.250 | Começo imediato, limitado |

### Próximo Passo:
1. Aprovar investimento
2. Comprar peças (Kabum, TerabyteShop, Pichau)
3. Montar ou contratar técnico
4. Instalar Ollama + modelos
5. Integrar à infraestrutura Totum

---

## 📚 Links Úteis para Referência

| Recurso | Link |
|---------|------|
| Ollama Library | https://ollama.com/library |
| Hugging Face Models | https://huggingface.co/models |
| LLM Benchmarks | https://artificialanalysis.ai/ |
| GPU Comparisons | https://www.tomshardware.com/reviews/gpu-hierarchy,4388.html |

---

*Planilha criada por TOT para Totum*  
*Transformando esforço em estrutura* 🏢
