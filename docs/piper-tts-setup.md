# Piper TTS - Instalação e Uso

## ✅ Status: INSTALADO E FUNCIONANDO

**Data de instalação:** 2026-04-04  
**Local:** `/opt/piper-tts`  
**Modelo:** Português Brasileiro (Faber - Medium)

---

## 📋 O que é o Piper TTS

Piper é uma ferramenta de Text-to-Speech (TTS) open source desenvolvida pela Mozilla. É rápida, leve e suporta múltiplos idiomas, incluindo **português brasileiro**.

---

## 🔧 Instalação Realizada

### 1. Ambiente Virtual
```bash
# Criar virtual environment
python3 -m venv /opt/piper-tts

# Ativar
source /opt/piper-tts/bin/activate
```

### 2. Instalação do Piper
```bash
pip install piper-tts
```

### 3. Download do Modelo PT-BR
Modelo: `pt_BR-faber-medium`

```bash
mkdir -p /opt/piper-tts/models
cd /opt/piper-tts/models

# Baixar modelo ONNX
curl -L -o pt_BR-faber-medium.onnx \
  "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx"

# Baixar configuração JSON
curl -L -o pt_BR-faber-medium.onnx.json \
  "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json"
```

**Arquivos baixados:**
- `pt_BR-faber-medium.onnx` (60.2 MB) - Modelo de voz
- `pt_BR-faber-medium.onnx.json` (4.8 KB) - Configuração

---

## 🚀 Como Usar

### Uso Rápido (Linha de Comando)

```bash
# Ativar o ambiente
source /opt/piper-tts/bin/activate

# Sintetizar texto simples
echo "Olá, sou Chaplin, criador de vídeos" | piper \
  -m /opt/piper-tts/models/pt_BR-faber-medium.onnx \
  -f /tmp/saida.wav
```

### Parâmetros do CLI

```bash
piper -m <modelo> -f <arquivo_saida> [opções]

Opções:
  -m, --model          Caminho do modelo ONNX
  -c, --config         Caminho do arquivo JSON (opcional)
  -f, --output-file    Arquivo de saída WAV
  --length-scale       Velocidade da fala (1.0 = normal, 0.8 = mais rápido)
  --noise-scale        Variação de tom (0.0-1.0)
  --noise-w            Variação de duração (0.0-1.0)
  --speaker            ID do speaker (para modelos multi-speaker)
```

### Exemplos

#### Velocidade diferente
```bash
# Mais rápido
echo "Texto para sintetizar" | piper \
  -m /opt/piper-tts/models/pt_BR-faber-medium.onnx \
  -f /tmp/rapido.wav \
  --length-scale 0.8

# Mais devagar
echo "Texto para sintetizar" | piper \
  -m /opt/piper-tts/models/pt_BR-faber-medium.onnx \
  -f /tmp/devagar.wav \
  --length-scale 1.2
```

#### Usar arquivo de texto
```bash
piper -m /opt/piper-tts/models/pt_BR-faber-medium.onnx \
  -f /tmp/audio.wav < texto.txt
```

---

## 📝 Uso em Python

```python
#!/opt/piper-tts/bin/python3
from piper import PiperVoice
import wave

# Carregar modelo
voice = PiperVoice.load("/opt/piper-tts/models/pt_BR-faber-medium.onnx")

# Texto para sintetizar
text = "Olá, sou Chaplin, criador de vídeos"

# Gerar áudio
with wave.open("/tmp/output.wav", "wb") as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(22050)
    
    for audio_chunk in voice.synthesize(text):
        # audio_chunk é um objeto AudioChunk
        wav_file.writeframes(bytes(audio_chunk))

print("Áudio gerado!")
```

---

## ✅ Teste Realizado

**Arquivo de teste:** `/tmp/piper_test.wav`

**Texto sintetizado:** `"Olá, sou Chaplin, criador de vídeos"`

**Especificações do áudio:**
- Formato: WAV (RIFF PCM)
- Code:c: PCM 16-bit little-endian
- Sample rate: 22050 Hz
- Canais: Mono (1)
- Duração: ~2.29 segundos
- Tamanho: ~98 KB

**Verificação:**
```bash
file /tmp/piper_test.wav
# Saída: RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz
```

---

## 🔊 Outros Modelos Disponíveis

Os modelos estão disponíveis em: https://huggingface.co/rhasspy/piper-voices

**Qualidades disponíveis:**
- `low` (~10-20 MB) - Mais rápido, menor qualidade
- `medium` (~50-70 MB) - Equilíbrio qualidade/velocidade ✓ (usado)
- `high` (~100+ MB) - Melhor qualidade, mais lento

**Outras vozes PT-BR:**
- `faber` (masculina) ✓ (usada)
- `edresson` (masculina)
- `multispeaker` (várias vozes)

---

## 🛠️ Troubleshooting

### "command not found: piper"
```bash
# Ativar o ambiente virtual
source /opt/piper-tts/bin/activate
```

### Erro ao carregar modelo
Verifique se os arquivos `.onnx` e `.onnx.json` estão no mesmo diretório.

### Áudio com ruído
Ajuste os parâmetros `--noise-scale` e `--noise-w` para valores menores.

---

## 📁 Estrutura de Arquivos

```
/opt/piper-tts/
├── bin/                          # Executáveis
│   ├── piper                     # CLI principal
│   ├── python3 -> python3.12
│   └── ...
├── lib/python3.12/site-packages/ # Pacotes Python
│   ├── piper/
│   └── ...
├── models/                       # Modelos de voz
│   ├── pt_BR-faber-medium.onnx
│   └── pt_BR-faber-medium.onnx.json
└── test_piper.py                 # Script de teste Python
```

---

## 🎯 Status para Reunião

**✅ FUNCIONANDO 100%**  
Data da reunião: 2026-04-05 às 09:00

O Piper TTS está totalmente operacional e pronto para uso em produção.

---

## 📚 Referências

- Repositório: https://github.com/rhasspy/piper
- Modelos: https://huggingface.co/rhasspy/piper-voices
- Documentação: https://github.com/rhasspy/piper/blob/master/README.md
