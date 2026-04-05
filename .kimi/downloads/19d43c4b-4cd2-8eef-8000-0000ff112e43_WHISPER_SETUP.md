# Whisper - Transcrição de Áudio Local

## Status
✅ **INSTALADO E FUNCIONANDO**

## Local de instalação
```
/opt/whisper-env/
```

## Modelos disponíveis

| Modelo | RAM necessária | Velocidade | Qualidade |
|--------|---------------|------------|-----------|
| **tiny** | ~1GB | Muito rápido | Básica |
| **base** | ~2GB | Rápido | Boa |
| **small** | ~3GB | Moderado | Muito boa ⭐ |
| **medium** | ~5GB | Lento | Excelente |
| **large** | ~10GB | Muito lento | Perfeita |

⭐ **Recomendado para Totum: `small`**

## Como usar

### 1. Script rápido (recomendado)
```bash
# Transcrever um áudio
./transcribe.sh meu_audio.mp3

# Usar modelo específico
./transcribe.sh meu_audio.mp3 small
```

### 2. Comando direto
```bash
/opt/whisper-env/bin/whisper audio.mp3 \
    --model small \
    --language Portuguese \
    --output_dir /tmp/whisper-output
```

### 3. API via HTTP (integração)
Ver exemplo em `whisper_api.py`

## Formatos de áudio suportados
- mp3, mp4, m4a, wav, flac, ogg, webm

## Exemplo de integração com Llama 3.2

```python
import subprocess
import json

def transcribe_and_analyze(audio_file):
    # Passo 1: Transcrever com Whisper
    result = subprocess.run([
        '/opt/whisper-env/bin/whisper',
        audio_file,
        '--model', 'small',
        '--language', 'Portuguese',
        '--output_format', 'txt',
        '--verbose', 'False'
    ], capture_output=True, text=True)
    
    # Ler o texto transcrito
    with open(f'/tmp/{audio_file}.txt', 'r') as f:
        transcription = f.read()
    
    # Passo 2: Analisar com Llama 3.2
    response = requests.post('http://localhost:11434/api/generate', json={
        'model': 'llama3.2',
        'prompt': f'Analise este texto e extraia os pontos-chave:\n\n{transcription}',
        'stream': False
    })
    
    analysis = response.json()['response']
    
    return {
        'transcription': transcription,
        'analysis': analysis
    }
```

## Pipeline completo Totum

```
Áudio recebido (WhatsApp/Meet/Gravação)
    ↓
[Whisper local] → Transcrição (R$ 0)
    ↓
[Llama 3.2] → Classificação/Resumo (R$ 0)
    ↓
Se necessário:
    ↓
[Kimi/Miguel/Liz] → Análise estratégica
    ↓
Ação (n8n/CRM/Tarefa)
```

## Custos

| Etapa | Custo |
|-------|-------|
| Transcrição Whisper | R$ 0 |
| Análise Llama 3.2 | R$ 0 |
| **Total** | **R$ 0** |

Comparado com APIs pagas: economia de **R$ 500-2000/mês** para 10h/dia de áudio.

## Comandos úteis

```bash
# Baixar modelo específico (primeira vez)
/opt/whisper-env/bin/whisper --model medium dummy.mp3

# Listar modelos disponíveis
/opt/whisper-env/bin/whisper --help | grep -A 5 "model"

# Transcrever com timestamps
/opt/whisper-env/bin/whisper audio.mp3 --model small --output_format srt

# Verificar uso de recursos
htop
nvidia-smi  # se tiver GPU
```

## Performance esperada (CPU)

| Modelo | Tempo de processamento |
|--------|----------------------|
| tiny | 2-3x tempo do áudio |
| base | 1-2x tempo do áudio |
| small | 0.5-1x tempo do áudio |
| medium | 0.3-0.5x tempo do áudio |

**Exemplo:** Áudio de 10 minutos com modelo `small` leva ~5-10 minutos para transcrever.

## Solução de problemas

### "Out of memory"
→ Use modelo menor (`tiny` ou `base`)

### "ffmpeg not found"
```bash
apt update && apt install -y ffmpeg
```

### Lentidão excessiva
→ Considere usar GPU ou modelo `tiny`/`base`

## Arquivos criados
- `transcribe.sh` - Script de transcrição rápida
- `whisper_api.py` - API HTTP para integração
- `OLLAMA_SETUP.md` - Documentação do Llama 3.2

## Documentação oficial
- https://github.com/openai/whisper
