"""
🧠 CENTRAL DE CONTEXTO TOTUM
Core: Vector Store com ChromaDB
"""

import os
import json
import uuid
from datetime import datetime
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, asdict

import chromadb
from chromadb.config import Settings

CHROMA_PATH = os.getenv("CHROMA_PATH", "./data/chromadb")

@dataclass
class ContextEntry:
    """Entrada de contexto na central"""
    id: str
    source: str           # Origem: kimi-claw, bot-atendente, etc.
    entry_type: str       # Tipo: conversation, document, memory, knowledge
    content: str          # Conteúdo textual
    metadata: Dict[str, Any]  # Metadados flexíveis
    tags: List[str]       # Tags para indexação
    created_at: str
    importance: int = 3   # 1-5 para prioridade
    
    def to_chroma_doc(self) -> str:
        """Converte para formato do ChromaDB"""
        return f"{self.content}\n\nTags: {', '.join(self.tags)}\nSource: {self.source}"

class ContextHub:
    """Hub central de contexto para todas as IAs"""
    
    def __init__(self, persist_directory: str = CHROMA_PATH):
        self.persist_directory = persist_directory
        os.makedirs(persist_directory, exist_ok=True)
        
        # Inicializar ChromaDB
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Coleções principais
        self.collections = {}
        self._ensure_collections()
        
        print(f"✅ ContextHub inicializado em: {persist_directory}")
    
    def _ensure_collections(self):
        """Garante que as coleções existem"""
        collection_names = ["conversas", "documentos", "conhecimento", "projetos", "preferencias"]
        
        for name in collection_names:
            try:
                self.collections[name] = self.client.get_or_create_collection(
                    name=name,
                    metadata={"hnsw:space": "cosine"}
                )
            except Exception as e:
                print(f"⚠️ Erro ao criar coleção {name}: {e}")
    
    def store(self, entry: ContextEntry, collection: str = "conversas") -> str:
        """Armazena uma entrada de contexto"""
        if collection not in self.collections:
            collection = "conversas"
        
        col = self.collections[collection]
        
        # Documento para embedding
        doc = entry.to_chroma_doc()
        
        # Metadados
        metadata = {
            "source": entry.source,
            "type": entry.entry_type,
            "importance": entry.importance,
            "created_at": entry.created_at,
            "tags": json.dumps(entry.tags),
            **entry.metadata
        }
        
        # Adicionar ao ChromaDB
        col.add(
            ids=[entry.id],
            documents=[doc],
            metadatas=[metadata]
        )
        
        return entry.id
    
    def query(self, query_text: str, collection: Optional[str] = None,
              n_results: int = 5, min_score: float = 0.5) -> List[Dict]:
        """Busca semântica no contexto"""
        results = []
        
        collections_to_search = [collection] if collection else self.collections.keys()
        
        for coll_name in collections_to_search:
            if coll_name not in self.collections:
                continue
            
            col = self.collections[coll_name]
            
            try:
                query_results = col.query(
                    query_texts=[query_text],
                    n_results=n_results,
                    include=["documents", "metadatas", "distances"]
                )
                
                # Processar resultados
                if query_results["ids"] and query_results["ids"][0]:
                    for i, doc_id in enumerate(query_results["ids"][0]):
                        distance = query_results["distances"][0][i]
                        similarity = 1 - distance  # Converter distância para similaridade
                        
                        if similarity >= min_score:
                            results.append({
                                "id": doc_id,
                                "content": query_results["documents"][0][i],
                                "metadata": query_results["metadatas"][0][i],
                                "collection": coll_name,
                                "similarity": round(similarity, 3)
                            })
            except Exception as e:
                print(f"⚠️ Erro ao consultar {coll_name}: {e}")
        
        # Ordenar por similaridade
        results.sort(key=lambda x: x["similarity"], reverse=True)
        
        return results[:n_results]
    
    def query_all(self, query_text: str, n_results: int = 5) -> List[Dict]:
        """Busca em todas as coleções"""
        return self.query(query_text, collection=None, n_results=n_results)
    
    def get_by_id(self, entry_id: str, collection: str) -> Optional[Dict]:
        """Recupera entrada específica por ID"""
        if collection not in self.collections:
            return None
        
        col = self.collections[collection]
        
        try:
            result = col.get(
                ids=[entry_id],
                include=["documents", "metadatas"]
            )
            
            if result["ids"]:
                return {
                    "id": result["ids"][0],
                    "content": result["documents"][0],
                    "metadata": result["metadatas"][0],
                    "collection": collection
                }
        except Exception as e:
            print(f"⚠️ Erro ao recuperar {entry_id}: {e}")
        
        return None
    
    def delete(self, entry_id: str, collection: str) -> bool:
        """Deleta uma entrada"""
        if collection not in self.collections:
            return False
        
        col = self.collections[collection]
        
        try:
            col.delete(ids=[entry_id])
            return True
        except Exception as e:
            print(f"⚠️ Erro ao deletar {entry_id}: {e}")
            return False
    
    def list_collections(self) -> List[str]:
        """Lista todas as coleções disponíveis"""
        return list(self.collections.keys())
    
    def get_stats(self) -> Dict:
        """Estatísticas da central de contexto"""
        stats = {}
        total = 0
        
        for name, col in self.collections.items():
            try:
                count = col.count()
                stats[name] = count
                total += count
            except:
                stats[name] = 0
        
        stats["total"] = total
        return stats

# Instância global
context_hub = ContextHub()

__all__ = ['ContextHub', 'ContextEntry', 'context_hub']
