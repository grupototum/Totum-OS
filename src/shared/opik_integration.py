"""
🔄 OPIK INTEGRATION - Tracing e Monitoramento Leve
Integração com Opik para rastreamento das chamadas LLM
"""

import os
import logging
from typing import Optional, Dict, Any

# Tentar importar opik
try:
    import opik
    from opik import track
    from opik.api_objects.opik_client import Opik
    OPIK_AVAILABLE = True
except ImportError:
    OPIK_AVAILABLE = False
    logging.warning("⚠️ Opik não instalado. Tracing desabilitado.")

from opik_config import OPIK_PROJECT_NAME, ENABLE_TRACING, TRACE_LLM_CALLS

logger = logging.getLogger(__name__)

class OpikTracker:
    """Gerencia o tracing com Opik"""
    
    def __init__(self):
        self.client = None
        self.enabled = ENABLE_TRACING and OPIK_AVAILABLE
        
        if self.enabled:
            try:
                # Inicializa cliente Opik (cloud - mais leve)
                self.client = Opik(project_name=OPIK_PROJECT_NAME)
                logger.info(f"✅ Opik conectado ao projeto: {OPIK_PROJECT_NAME}")
            except Exception as e:
                logger.warning(f"⚠️ Erro ao conectar Opik: {e}")
                self.enabled = False
    
    def trace_llm_call(self, func):
        """Decorator para rastrear chamadas LLM"""
        if not self.enabled or not TRACE_LLM_CALLS:
            return func
        
        @track(project_name=OPIK_PROJECT_NAME)
        def wrapper(*args, **kwargs):
            # Extrai informações da chamada
            prompt = args[0] if args else kwargs.get('prompt', '')
            
            # Executa função
            result = func(*args, **kwargs)
            
            # Log para debug
            logger.debug(f"📝 LLM Call traced - Prompt: {prompt[:50]}...")
            
            return result
        
        return wrapper
    
    def log_conversation(self, user_id: int, username: str, 
                         mensagem: str, resposta: str, 
                         classificacao: Dict[str, Any]):
        """Loga uma conversa completa"""
        if not self.enabled:
            return
        
        try:
            # Cria um trace para a conversa usando a API correta
            trace = self.client.trace(
                name="telegram_conversation",
                input_data={"mensagem": mensagem},
                output_data={"resposta": resposta},
                metadata={
                    "user_id": user_id,
                    "username": username,
                    "tipo": classificacao.get('tipo', 'desconhecido'),
                    "departamento": classificacao.get('departamento', 'geral'),
                    "urgencia": classificacao.get('urgencia', 3)
                }
            )
            
            # Adiciona scores de feedback
            trace.log_feedback_score("input_length", len(mensagem))
            trace.log_feedback_score("output_length", len(resposta))
            trace.log_feedback_score("satisfacao_estimada", 1.0)
            trace.log_feedback_score("urgencia", float(classificacao.get('urgencia', 3)))
            
            # Finaliza o trace
            trace.end()
            
            logger.debug(f"📊 Conversa logada no Opik - User: {user_id}")
                
        except Exception as e:
            logger.error(f"Erro ao logar conversa: {e}")
    
    def evaluate_response(self, prompt: str, response: str, 
                          metric_name: str = "answer_relevance") -> Optional[float]:
        """Avalia a qualidade da resposta"""
        if not self.enabled:
            return None
        
        try:
            # Métricas simplificadas (sem dependências pesadas)
            if metric_name == "answer_relevance":
                # Heurística simples: verifica se resposta tem tamanho adequado
                score = min(1.0, len(response) / max(1, len(prompt)))
                return score
            
            elif metric_name == "hallucination":
                # Placeholder - em produção usar LLM-as-a-judge
                return 0.5
            
            return None
            
        except Exception as e:
            logger.error(f"Erro na avaliação: {e}")
            return None

# Instância global
tracker = OpikTracker()

# Função helper para facilitar uso
def trace_llm(func):
    """Decorator simplificado para tracing LLM"""
    return tracker.trace_llm_call(func)

__all__ = ['tracker', 'trace_llm', 'OpikTracker', 'OPIK_AVAILABLE']
