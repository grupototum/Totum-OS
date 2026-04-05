# Inserção do Agente ANALISTA no Supabase

## SQL para execução:

```sql
INSERT INTO public.agentes (
    nome, 
    descricao, 
    tipo, 
    responsavel, 
    emoji, 
    status
) VALUES (
    'Analista',
    'Processa conteúdo e gera relatórios estratégicos',
    'processamento',
    'Pablo',
    '🔍',
    'ativo'
);
```

## Via Supabase CLI:

```bash
supabase db execute "INSERT INTO public.agentes (nome, descricao, tipo, responsavel, emoji, status) VALUES ('Analista', 'Processa conteúdo e gera relatórios estratégicos', 'processamento', 'Pablo', '🔍', 'ativo');"
```

## Via Python (supabase-py):

```python
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

data = {
    "nome": "Analista",
    "descricao": "Processa conteúdo e gera relatórios estratégicos",
    "tipo": "processamento",
    "responsavel": "Pablo",
    "emoji": "🔍",
    "status": "ativo"
}

result = supabase.table("agentes").insert(data).execute()
print(result)
```

---

## 📋 Resumo do Agente Criado

| Item | Valor |
|------|-------|
| Nome | Analista |
| Emoji | 🔍 |
| Tipo | processamento |
| Responsável | Pablo |
| Status | ativo |
| Script | `/opt/totum-scripts/analista.py` |
| Pipeline | `/opt/totum-scripts/pipeline_conteudo.sh` |

## 🚀 Como Usar

### Análise direta de arquivo:
```bash
python3 /opt/totum-scripts/analista.py conteudo.txt
```

### Pipeline completo (vídeo → transcrição → análise):
```bash
/opt/totum-scripts/pipeline_conteudo.sh "https://youtube.com/watch?v=..."
```

---

*Gerado em: 2026-04-04*
