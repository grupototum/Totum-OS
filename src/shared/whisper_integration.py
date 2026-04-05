"""
🎙️ WHISPER INTEGRATION - Transcrição de Áudio
Transcreve mensagens de voz do Telegram usando Whisper (Ollama ou OpenAI)
"""

import os
import logging
import tempfile
import requests
from typing import Optional

logger = logging.getLogger(__name__)

# Configurações
USE_LOCAL_WHISPER = os.getenv("USE_LOCAL_WHISPER", "true").lower() == "true"
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

class AudioTranscriber:
    """Transcreve áudio usando Whisper"""
    
    def __init__(self):
        self.use_local = USE_LOCAL_WHISPER and not OPENAI_API_KEY
        
    async def transcribe_audio(self, file_path: str, file_format: str = "ogg") -> Optional[str]:
        """
        Transcreve arquivo de áudio
        
        Args:
            file_path: Caminho para o arquivo de áudio
            file_format: Formato do arquivo (ogg, mp3, wav)
            
        Returns:
            Texto transcrito ou None se falhar
        """
        try:
            if self.use_local:
                return await self._transcribe_local(file_path, file_format)
            elif OPENAI_API_KEY:
                return await self._transcribe_openai(file_path, file_format)
            else:
                logger.warning("Nenhum método de transcrição configurado")
                return None
                
        except Exception as e:
            logger.error(f"Erro na transcrição: {e}")
            return None
    
    async def _transcribe_local(self, file_path: str, file_format: str) -> Optional[str]:
        """Transcreve usando Whisper via Ollama"""
        try:
            # Verificar se modelo whisper está disponível
            response = requests.get(f"{OLLAMA_URL}/api/tags", timeout=10)
            if "whisper" not in response.text.lower():
                logger.warning("Modelo Whisper não encontrado no Ollama")
                logger.info("Execute: ollama pull whisper")
                return None
            
            # Preparar arquivo para envio
            with open(file_path, 'rb') as f:
                files = {'file': f}
                data = {
                    'model': 'whisper',
                    'prompt': 'Transcreva este áudio para português do Brasil'
                }
                
                response = requests.post(
                    f"{OLLAMA_URL}/api/generate",
                    files=files,
                    data=data,
                    timeout=120
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result.get('response', '').strip()
                else:
                    logger.error(f"Erro Ollama: {response.status_code}")
                    return None
                    
        except Exception as e:
            logger.error(f"Erro transcrição local: {e}")
            return None
    
    async def _transcribe_openai(self, file_path: str, file_format: str) -> Optional[str]:
        """Transcreve usando OpenAI Whisper API"""
        try:
            import openai
            openai.api_key = OPENAI_API_KEY
            
            with open(file_path, 'rb') as audio_file:
                transcript = openai.Audio.transcribe(
                    model="whisper-1",
                    file=audio_file,
                    language="pt"
                )
                
                return transcript.get('text', '').strip()
                
        except Exception as e:
            logger.error(f"Erro OpenAI Whisper: {e}")
            return None
    
    def check_availability(self) -> dict:
        """Verifica disponibilidade dos métodos de transcrição"""
        status = {
            "local_available": False,
            "openai_available": bool(OPENAI_API_KEY),
            "recommended_method": None
        }
        
        if self.use_local:
            try:
                response = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
                if "whisper" in response.text.lower():
                    status["local_available"] = True
                    status["recommended_method"] = "local"
                else:
                    status["recommended_method"] = "install_whisper"
            except:
                status["recommended_method"] = "ollama_offline"
        
        if OPENAI_API_KEY and not status["local_available"]:
            status["recommended_method"] = "openai"
            
        return status

# Instância global
transcriber = AudioTranscriber()

async def transcribe_audio(file_path: str, file_format: str = "ogg") -> Optional[str]:
    """Função helper para transcrição"""
    return await transcriber.transcribe_audio(file_path, file_format)

def check_transcription_available() -> bool:
    """Verifica se transcrição está disponível"""
    status = transcriber.check_availability()
    return status["local_available"] or status["openai_available"]

__all__ = ['transcriber', 'transcribe_audio', 'check_transcription_available']
