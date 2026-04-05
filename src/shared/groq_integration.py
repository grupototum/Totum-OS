"""
🚀 GROQ INTEGRATION - Llama via API (Tier Gratuito Generoso)
API ultra-rápida com tier gratuito generoso
"""

import os
import logging
from typing import Optional, Dict, Any

# Tentar importar groq
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False
    logging.warning("⚠️ Groq SDK não instalado")

logger = logging.getLogger(__name__)

# Configurações
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
# Modelo atualizado - llama-3.2-3b foi descontinuado, usando llama-3.1-8b-instant
GROQ_MODEL = "llama-3.1-8b-instant"
USE_GROQ = os.getenv("USE_GROQ", "false").lower() == "true"

# Modelos disponíveis no Groq
GROQ_MODELS = {
    "llama-3.1-8b": "llama-3.1-8b-instant",
    "llama-3.3-70b": "llama-3.3-70b-versatile",
    "mixtral-8x7b": "mixtral-8x7b-32768",
    "gemma-2-9b": "gemma2-9b-it",
}

class GroqHandler:
    """Handler para API Groq (alternativa rápida ao Ollama local)"""
    
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or GROQ_API_KEY
        self.model = model or GROQ_MODEL
        self.client = None
        self.enabled = GROQ_AVAILABLE and bool(self.api_key) and USE_GROQ
        
        if self.enabled:
            try:
                self.client = Groq(api_key=self.api_key)
                logger.info(f"✅ Groq client inicializado (modelo: {self.model})")
            except Exception as e:
                logger.error(f"Erro ao inicializar Groq: {e}")
                self.enabled = False
    
    def generate(self, prompt: str, system: Optional[str] = None, 
                 temperature: float = 0.7, max_tokens: int = 500) -> str:
        """Gera resposta usando Groq API"""
        if not self.enabled or not self.client:
            return "⚠️ Groq não configurado. Use Ollama local ou configure GROQ_API_KEY."
        
        try:
            messages = []
            
            if system:
                messages.append({"role": "system", "content": system})
            
            messages.append({"role": "user", "content": prompt})
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=1,
                stream=False
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Erro na API Groq: {e}")
            return f"⚠️ Erro no Groq: {str(e)}"
    
    def classificar_demanda(self, mensagem: str) -> Dict[str, Any]:
        """Classifica a demanda usando Groq"""
        system_prompt = """Você é um classificador de demandas de atendimento.
Analise a mensagem e classifique em JSON:
{
  "tipo": "duvida|reclamacao|solicitacao|tarefa",
  "departamento": "suporte|comercial|tecnico|financeiro|direcao|geral",
  "urgencia": 1-5,
  "resumo": "breve resumo",
  "responder_direto": true|false,
  "motivo": "por que deve responder direto ou escalar"
}"""
        
        prompt = f"""Classifique esta demanda:
"{mensagem}"

Responda APENAS em JSON válido."""
        
        try:
            resposta = self.generate(prompt, system_prompt, temperature=0.3)
            # Tenta extrair JSON
            import json
            import re
            json_match = re.search(r'\{.*\}', resposta, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except Exception as e:
            logger.error(f"Erro ao classificar com Groq: {e}")
        
        # Fallback
        return {
            "tipo": "duvida",
            "departamento": "geral",
            "urgencia": 3,
            "resumo": mensagem[:50],
            "responder_direto": True,
            "motivo": "fallback"
        }
    
    def get_usage_info(self) -> dict:
        """Retorna informações de uso do tier gratuito"""
        return {
            "model": self.model,
            "enabled": self.enabled,
            "tier": "Gratuito (Generous)",
            "limits": {
                "requests_per_minute": 20,
                "tokens_per_minute": 6000,
                "requests_per_day": 14400
            },
            "speed": "⚡ Ultra-rápido (menos de 1s)",
            "note": "Não consome RAM local - processamento na nuvem Groq",
            "modelos_disponiveis": list(GROQ_MODELS.keys())
        }

# Instância global
groq_handler = GroqHandler()

def get_llm_handler(use_groq: bool = None):
    """Retorna o handler de LLM apropriado (Groq ou Ollama)"""
    if use_groq is None:
        use_groq = USE_GROQ
    
    if use_groq and groq_handler.enabled:
        return groq_handler
    else:
        # Retorna None para usar Ollama local
        return None

__all__ = ['groq_handler', 'GroqHandler', 'get_llm_handler', 'GROQ_AVAILABLE']
