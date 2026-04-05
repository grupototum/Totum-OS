"""
🤖 AGENTE CURADOR
Especialista em recuperar e sintetizar contexto
"""

from typing import List, Dict, Any, Optional
from core.vector_store import ContextHub, ContextEntry

class CuratorAgent:
    """
    Agente especializado em:
    1. Analisar queries de contexto
    2. Buscar informações relevantes
    3. Sintetizar respostas contextualizadas
    4. Aprender com feedback
    """
    
    def __init__(self, context_hub: ContextHub):
        self.hub = context_hub
        
    def retrieve_context(self, query: str, source: str = "unknown",
                         context_types: Optional[List[str]] = None,
                         n_results: int = 5) -> Dict[str, Any]:
        """
        Recupera contexto relevante para uma query
        
        Args:
            query: O que o usuário está perguntando
            source: Qual IA está fazendo a pergunta
            context_types: Tipos de contexto preferidos
            n_results: Quantos resultados retornar
        """
        # Buscar em todas as coleções
        results = self.hub.query_all(query, n_results=n_results * 2)
        
        # Filtrar por tipo se especificado
        if context_types:
            results = [
                r for r in results 
                if r["metadata"].get("type") in context_types
            ]
        
        # Ordenar por importância e relevância
        results = self._rank_results(results)
        
        # Sintetizar contexto
        synthesized = self._synthesize(query, results[:n_results])
        
        return {
            "query": query,
            "source": source,
            "results_count": len(results),
            "context": synthesized,
            "raw_results": results[:n_results],
            "confidence": self._calculate_confidence(results)
        }
    
    def _rank_results(self, results: List[Dict]) -> List[Dict]:
        """Ranqueia resultados por relevância e importância"""
        def score(r):
            similarity = r.get("similarity", 0)
            importance = r["metadata"].get("importance", 3)
            # Fórmula: similaridade * (importância / 3)
            return similarity * (importance / 3)
        
        return sorted(results, key=score, reverse=True)
    
    def _synthesize(self, query: str, results: List[Dict]) -> str:
        """Sintetiza os resultados em contexto útil"""
        if not results:
            return "Nenhum contexto relevante encontrado."
        
        parts = []
        
        for i, result in enumerate(results, 1):
            content = result["content"].split("\n\nTags:")[0]  # Remove metadata
            source = result["metadata"].get("source", "desconhecido")
            relevance = result.get("similarity", 0)
            
            parts.append(
                f"[{i}] {content}\n"
                f"    (Fonte: {source}, Relevância: {relevance:.2f})"
            )
        
        return "\n\n".join(parts)
    
    def _calculate_confidence(self, results: List[Dict]) -> float:
        """Calcula nível de confiança nos resultados"""
        if not results:
            return 0.0
        
        # Confiança baseada no score do melhor resultado
        best_score = results[0].get("similarity", 0)
        
        # Normalizar para 0-1
        if best_score >= 0.8:
            return 0.9
        elif best_score >= 0.6:
            return 0.7
        elif best_score >= 0.4:
            return 0.5
        else:
            return 0.3
    
    def answer_with_context(self, query: str, source: str = "unknown") -> Dict[str, Any]:
        """
        Gera uma resposta completa baseada no contexto
        """
        context_data = self.retrieve_context(query, source)
        
        response = {
            "query": query,
            "has_context": context_data["results_count"] > 0,
            "confidence": context_data["confidence"],
            "context": context_data["context"],
            "raw_results": context_data["raw_results"],
            "suggested_action": self._suggest_action(context_data)
        }
        
        return response
    
    def _suggest_action(self, context_data: Dict) -> str:
        """Sugere ação baseada no contexto encontrado"""
        confidence = context_data["confidence"]
        count = context_data["results_count"]
        
        if confidence >= 0.8 and count >= 3:
            return "use_context_directly"
        elif confidence >= 0.6:
            return "use_context_with_caution"
        elif count > 0:
            return "ask_for_clarification"
        else:
            return "no_context_available"
    
    def cross_reference(self, entry_id: str, collection: str) -> List[Dict]:
        """Encontra contextos relacionados a uma entrada"""
        entry = self.hub.get_by_id(entry_id, collection)
        if not entry:
            return []
        
        # Usar o conteúdo para buscar relacionados
        content = entry["content"].split("\n\nTags:")[0]
        related = self.hub.query_all(content, n_results=5)
        
        # Excluir a própria entrada
        related = [r for r in related if r["id"] != entry_id]
        
        return related

# Instância global
curator = CuratorAgent(context_hub)

__all__ = ['CuratorAgent', 'curator']
