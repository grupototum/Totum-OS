#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SYNC ALEXANDRIA - Sincronização com Supabase
"""

import os
import json
import sys
from pathlib import Path
from datetime import datetime

# Configurações
WORKSPACE = Path("/root/.openclaw/workspace")
ALEXANDRIA = WORKSPACE / "alexandria"
CONFIG_FILE = WORKSPACE / ".mex" / "supabase.config.json"

def carregar_config():
    """Carrega configuração do Supabase"""
    if CONFIG_FILE.exists():
        return json.loads(CONFIG_FILE.read_text())
    return None

def salvar_config(url: str, key: str):
    """Salva configuração do Supabase"""
    config = {
        "url": url,
        "key": key,
        "criado_em": datetime.now().isoformat()
    }
    CONFIG_FILE.write_text(json.dumps(config, indent=2))
    return config

def preparar_sync(contexto_file: Path) -> dict:
    """Prepara dados para sync"""
    conteudo = contexto_file.read_text(encoding='utf-8')
    
    # Extrair frontmatter
    if conteudo.startswith('---'):
        parts = conteudo.split('---', 2)
        if len(parts) >= 3:
            meta = json.loads(parts[1])
            body = parts[2].strip()
            return {
                "meta": meta,
                "conteudo": body,
                "arquivo": str(contexto_file)
            }
    return None

def sync_supabase(contexto_id: str) -> dict:
    """
    Sincroniza contexto com Supabase
    
    NOTA: Esta é uma implementação placeholder.
    A implementação real requer:
    - pip install supabase-py
    - Configuração de credenciais
    - Criação das tabelas no Supabase
    """
    config = carregar_config()
    
    if not config:
        return {
            "status": "erro",
            "mensagem": "Supabase não configurado. Execute: python sync_supabase.py config"
        }
    
    arquivo = ALEXANDRIA / "contextos" / "persistidas" / f"{contexto_id}.md"
    
    if not arquivo.exists():
        return {"status": "erro", "mensagem": "Arquivo não encontrado"}
    
    dados = preparar_sync(arquivo)
    
    if not dados:
        return {"status": "erro", "mensagem": "Formato inválido"}
    
    # TODO: Implementar inserção real no Supabase
    # from supabase import create_client
    # supabase = create_client(config['url'], config['key'])
    # result = supabase.table('contextos').insert({...}).execute()
    
    # Por enquanto, apenas simula
    return {
        "status": "simulado",
        "mensagem": "Sync simulado (implementar API real)",
        "contexto_id": contexto_id,
        "supabase_url": config['url'],
        "dados": dados['meta']
    }

def configurar():
    """Interface para configurar Supabase"""
    print("🔧 Configuração do Supabase")
    print("=" * 50)
    print("")
    print("Por favor, forneça as credenciais do Supabase:")
    print("")
    
    url = input("URL do Supabase (ex: https://xxxx.supabase.co): ").strip()
    key = input("API Key (service_role): ").strip()
    
    if not url or not key:
        print("❌ URL e Key são obrigatórios!")
        sys.exit(1)
    
    config = salvar_config(url, key)
    print("")
    print("✅ Configuração salva!")
    print(f"📁 Arquivo: {CONFIG_FILE}")

def status():
    """Mostra status do sync"""
    config = carregar_config()
    
    print("📊 Status do Sync Supabase")
    print("=" * 50)
    
    if config:
        print(f"✅ Configurado: {config['url']}")
        print(f"📅 Criado em: {config['criado_em']}")
    else:
        print("❌ Não configurado")
        print("")
        print("Execute: python sync_supabase.py config")
    
    # Contar arquivos pendentes de sync
    sync_dir = ALEXANDRIA / "sync"
    if sync_dir.exists():
        pendentes = list(sync_dir.glob("sync_*.json"))
        print(f"⏳ Jobs pendentes: {len(pendentes)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python sync_supabase.py [config|status|sync ID]")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "config":
        configurar()
    elif cmd == "status":
        status()
    elif cmd == "sync":
        if len(sys.argv) < 3:
            print("Uso: python sync_supabase.py sync [contexto_id]")
            sys.exit(1)
        result = sync_supabase(sys.argv[2])
        print(json.dumps(result, indent=2))
    else:
        print(f"Comando desconhecido: {cmd}")
