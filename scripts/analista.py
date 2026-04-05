#!/usr/bin/env python3
"""
Agente Analista - Processa conteúdo e gera relatório estratégico
"""

import sys
import json
from datetime import datetime

# Prompt core do Analista
PROMPT_ANALISTA = """
Você é um analista de estratégia de negócios especializado em automação com IA e crescimento de empresas.

Analise o conteúdo fornecido e gere um relatório estruturado.

## CONTEXTO TOTUM
Empresa: Totum - estruturação de crescimento previsível usando agentes de IA, automação e sistemas.
Modelo: Hub-and-spoke com agentes especializados (TOT, Pablo, Data, Hug, Fignaldo, etc.)

## ESTRUTURA DO RELATÓRIO:

### 1. IDENTIFICAÇÃO
- Título: [do conteúdo]
- Fonte: [tipo/origem]
- Tema: [3 palavras]

### 2. CONTEÚDO CHAVE
- O que foi ensinado: [resumo]
- Ferramentas mencionadas: [lista]
- Recursos citados: [links se houver]

### 3. APLICAÇÃO PARA TOTUM
- Aplica à Totum? [Sim/Não/Parcialmente]
- Como usar: [descrição prática]
- Agente beneficiado: [TOT/Pablo/Data/Hug/Fignaldo/etc]

### 4. CLASSIFICAÇÃO
Escolha UMA:
🔴 IMPLEMENTAR URGENTE - Prioridade máxima
🟡 ESTUDAR/TESTAR - Validar antes
🟢 BACKLOG - Interessante mas não urgente
⚫ IGNORAR - Não aplica ao modelo

### 5. PRÓXIMO PASSO
Ação específica e mensurável para amanhã:

### 6. INSIGHT ÚNICO
O que esse conteúdo tem de especial que outros não têm:

---
CONTEÚDO PARA ANALISAR:
{conteudo}
---
"""


def analisar_conteudo(arquivo_input, arquivo_output=None):
    """Lê conteúdo e gera prompt para análise estratégica."""
    
    # Ler conteúdo do arquivo
    with open(arquivo_input, 'r', encoding='utf-8') as f:
        conteudo = f.read()
    
    # Gerar prompt formatado
    prompt = PROMPT_ANALISTA.format(conteudo=conteudo)
    
    # Definir arquivo de saída
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    if not arquivo_output:
        arquivo_output = f"/tmp/analise_{timestamp}.md"
    
    # Escrever prompt em arquivo
    with open(arquivo_output, 'w', encoding='utf-8') as f:
        f.write(f"# Prompt para Análise - Agente Analista 🔍\n\n")
        f.write(f"**Gerado em:** {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n\n")
        f.write("---\n\n")
        f.write(prompt)
    
    print(f"✅ Prompt gerado: {arquivo_output}")
    print(f"📊 Copie o conteúdo e use com Claude/GPT para obter a análise estratégica")
    
    return arquivo_output


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python3 analista.py <arquivo_input.txt> [arquivo_output.md]")
        print("Exemplo: python3 analista.py /tmp/transcricoes/audio.txt")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    analisar_conteudo(input_file, output_file)
