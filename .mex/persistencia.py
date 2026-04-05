#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SISTEMA DE PERSISTÊNCIA ALEXANDRIA
Salva contexto em 5 lugares automaticamente
"""

import os
import sys
import json
import hashlib
from datetime import datetime
from pathlib import Path

# Configurações
WORKSPACE = Path("/root/.openclaw/workspace")
ALEXANDRIA = WORKSPACE / "alexandria"
MEX_DIR = WORKSPACE / ".mex"
LOG_FILE = WORKSPACE / "logs" / "persistencia.log"

# Criar diretórios
(ALEXANDRIA / "contextos" / "ativas").mkdir(parents=True, exist_ok=True)
(ALEXANDRIA / "contextos" / "persistidas").mkdir(parents=True, exist_ok=True)
(ALEXANDRIA / "contextos" / "recusados").mkdir(parents=True, exist_ok=True)
(ALEXANDRIA / "sync").mkdir(parents=True, exist_ok=True)
(WORKSPACE / "logs").mkdir(parents=True, exist_ok=True)
(MEX_DIR / "decisions").mkdir(parents=True, exist_ok=True)
(MEX_DIR / "patterns").mkdir(parents=True, exist_ok=True)

class ContextoManager:
    """Gerencia persistência de contexto em múltiplos destinos"""
    
    def __init__(self):
        self.ts = datetime.now()
        self.id_base = self.ts.strftime("%Y%m%d_%H%M%S")
        
    def salvar(self, tipo: str, conteudo: str, categoria: str, origem: str) -> dict:
        """
        Salva contexto temporário (pendente confirmação)
        
        Args:
            tipo: decisao, erro, aprendizado, tarefa, ideia
            conteudo: texto do contexto
            categoria: agente, sistema, projeto, negocio
            origem: nome do agente ou sistema
        """
        # Gerar ID único
        hash_conteudo = hashlib.md5(conteudo.encode()).hexdigest()[:8]
        contexto_id = f"ctx_{self.id_base}_{hash_conteudo}"
        
        # Metadados
        meta = {
            "id": contexto_id,
            "tipo": tipo,
            "categoria": categoria,
            "origem": origem,
            "data": self.ts.isoformat(),
            "status": "pendente",
            "hash": hashlib.md5(conteudo.encode()).hexdigest(),
            "tamanho": len(conteudo)
        }
        
        # Arquivo temporário (VPS - Local)
        arquivo = ALEXANDRIA / "contextos" / "ativas" / f"{contexto_id}.md"
        
        # Conteúdo formatado
        markdown = f"""---
{json.dumps(meta, indent=2, ensure_ascii=False)}
---

# 📝 Contexto: {tipo.upper()} - {categoria.upper()}

**Origem:** {origem}  
**Data:** {self.ts.strftime('%Y-%m-%d %H:%M:%S')}  
**Status:** ⏳ Pendente de confirmação

## 📋 Conteúdo

{conteudo}

---

## 🔗 Destinos de Persistência

- [ ] VPS Local (ativo)
- [ ] Supabase (pending)
- [ ] GitHub (pending)
- [ ] Google Drive (pending)
- [ ] Servidor Dedicado (pending)

## 📝 Notas

- Criado automaticamente pelo Sistema de Persistência Alexandria
- Aguardando confirmação para sincronização completa
"""
        
        arquivo.write_text(markdown, encoding='utf-8')
        
        self._log(f"Contexto criado: {contexto_id} ({tipo})")
        
        return {
            "id": contexto_id,
            "arquivo": str(arquivo),
            "meta": meta
        }
    
    def confirmar(self, contexto_id: str) -> dict:
        """Confirma e move para persistidos, inicia sync"""
        arquivo_atual = ALEXANDRIA / "contextos" / "ativas" / f"{contexto_id}.md"
        
        if not arquivo_atual.exists():
            return {"erro": "Contexto não encontrado"}
        
        arquivo_novo = ALEXANDRIA / "contextos" / "persistidas" / f"{contexto_id}.md"
        
        # Ler conteúdo
        conteudo = arquivo_atual.read_text(encoding='utf-8')
        
        # Atualizar status
        conteudo = conteudo.replace('"status": "pendente"', '"status": "confirmado"')
        conteudo = conteudo.replace('⏳ Pendente de confirmação', '✅ Confirmado')
        conteudo = conteudo.replace('- [ ] VPS Local (ativo)', '- [x] VPS Local (ativo)')
        
        # Adicionar timestamp de confirmação
        confirmado_em = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        conteudo += f"\n\n**✅ Confirmado em:** {confirmado_em}\n"
        
        # Salvar novo
        arquivo_novo.write_text(conteudo, encoding='utf-8')
        
        # Remover antigo
        arquivo_atual.unlink()
        
        self._log(f"Contexto confirmado: {contexto_id}")
        
        # Iniciar sync com outros destinos (async)
        self._sync_para_outros(contexto_id, arquivo_novo)
        
        return {
            "id": contexto_id,
            "arquivo": str(arquivo_novo),
            "status": "confirmado"
        }
    
    def recusar(self, contexto_id: str) -> dict:
        """Recusa e move para recusados"""
        arquivo_atual = ALEXANDRIA / "contextos" / "ativas" / f"{contexto_id}.md"
        
        if not arquivo_atual.exists():
            return {"erro": "Contexto não encontrado"}
        
        arquivo_novo = ALEXANDRIA / "contextos" / "recusados" / f"{contexto_id}.md"
        arquivo_atual.rename(arquivo_novo)
        
        self._log(f"Contexto recusado: {contexto_id}")
        
        return {"id": contexto_id, "status": "recusado"}
    
    def listar_pendentes(self) -> list:
        """Lista todos os contextos pendentes"""
        ativas = ALEXANDRIA / "contextos" / "ativas"
        return [f.stem for f in ativas.glob("ctx_*.md")]
    
    def listar_confirmados(self) -> list:
        """Lista todos os contextos confirmados"""
        persistidas = ALEXANDRIA / "contextos" / "persistidas"
        return [f.stem for f in persistidas.glob("ctx_*.md")]
    
    def _sync_para_outros(self, contexto_id: str, arquivo: Path):
        """Inicia sincronização com outros destinos (placeholder)"""
        # TODO: Implementar sync real com Supabase, GitHub, etc.
        self._log(f"Sync iniciado para {contexto_id}")
        
        # Criar job de sync
        job = {
            "contexto_id": contexto_id,
            "arquivo": str(arquivo),
            "destinos": ["supabase", "github", "drive", "servidor"],
            "status": "pendente",
            "criado_em": datetime.now().isoformat()
        }
        
        job_file = ALEXANDRIA / "sync" / f"sync_{contexto_id}.json"
        job_file.write_text(json.dumps(job, indent=2, ensure_ascii=False))
    
    def _log(self, mensagem: str):
        """Escreve no log"""
        ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(f"[{ts}] {mensagem}\n")


# Instância global
manager = ContextoManager()

if __name__ == "__main__":
    # CLI básica
    if len(sys.argv) < 2:
        print("Uso: python persistencia.py [salvar|confirmar|recusar|listar]")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "salvar":
        # Modo interativo para teste
        tipo = input("Tipo (decisao/erro/aprendizado/tarefa): ") or "decisao"
        categoria = input("Categoria (agente/sistema/projeto): ") or "sistema"
        origem = input("Origem (nome do agente): ") or "TOT"
        print("Conteúdo (Ctrl+D para terminar):")
        conteudo = sys.stdin.read()
        
        result = manager.salvar(tipo, conteudo, categoria, origem)
        print(f"\n✅ Contexto salvo: {result['id']}")
        print(f"📁 Arquivo: {result['arquivo']}")
        
    elif cmd == "confirmar":
        contexto_id = sys.argv[2]
        result = manager.confirmar(contexto_id)
        print(json.dumps(result, indent=2))
        
    elif cmd == "listar":
        pendentes = manager.listar_pendentes()
        confirmados = manager.listar_confirmados()
        print(f"⏳ Pendentes: {len(pendentes)}")
        print(f"✅ Confirmados: {len(confirmados)}")
        for p in pendentes[:5]:
            print(f"  - {p}")
    
    else:
        print(f"Comando desconhecido: {cmd}")
