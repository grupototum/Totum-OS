#!/usr/bin/env python3
"""
Parseia todos os arquivos MD de agentes em DNAS_39_AGENTES/ e DNAS_AGENCY_AGENTS/
e gera:
  - src/lib/agents-registry.json
  - src/agents/<id>/character.json (formato elizaOS)
  - src/agents/<id>/AGENT.md (cópia estruturada)
"""

import json, os, re
from pathlib import Path
from datetime import datetime

ROOT = Path("/Users/israellemos/Documents/Totum Dev")
SRC_AGENTS = ROOT / "src" / "agents"
REGISTRY_PATH = ROOT / "src" / "lib" / "agents-registry.json"

DNAS_DIRS = [ROOT / "DNAS_39_AGENTES", ROOT / "DNAS_AGENCY_AGENTS"]

# Tier mapping
TIER_MAP = {
    "1": 1, "laboratório": 1, "lab": 1, "laboratorio": 1,
    "2": 2, "mid": 2, "médio": 2, "medio": 2,
    "3": 3, "fábrica": 3, "fabrica": 3, "factory": 3,
}

MODEL_MAP = {
    "claude": "anthropic",
    "claude 3.7 sonnet": "anthropic",
    "claude-3.5-sonnet": "anthropic",
    "claude-3-5-sonnet": "anthropic",
    "claude 3.5 sonnet": "anthropic",
    "anthropic": "anthropic",
    "groq": "groq",
    "groq mixtral": "groq",
    "groq/llama": "groq",
    "llama": "groq",
    "gemini": "google",
    "google": "google",
    "gpt": "openai",
    "openai": "openai",
    "ollama": "ollama",
}

def infer_model_provider(model_text):
    if not model_text:
        return "groq"
    mt = model_text.lower()
    for key, provider in MODEL_MAP.items():
        if key in mt:
            return provider
    return "groq"

def infer_model_name(model_text, tier):
    if not model_text:
        if tier == 1:
            return "claude-3-5-sonnet"
        elif tier == 2:
            return "groq-mixtral"
        return "ollama-qwen3-coder"
    mt = model_text.lower()
    if "claude-3.7" in mt or "claude 3.7" in mt:
        return "claude-3-7-sonnet"
    if "claude-3.5" in mt or "claude 3.5" in mt:
        return "claude-3-5-sonnet"
    if "gemini 2.5" in mt or "gemini2.5" in mt:
        return "gemini-2.5-pro"
    if "gemini" in mt:
        return "gemini-1.5-pro"
    if "llama-3.3" in mt:
        return "llama-3.3-70b"
    if "llama" in mt:
        return "llama-3.1-8b"
    if "mixtral" in mt:
        return "mixtral-8x7b"
    if "gpt-4" in mt:
        return "gpt-4o"
    if tier == 1:
        return "claude-3-5-sonnet"
    elif tier == 2:
        return "groq-mixtral"
    return "ollama-qwen3-coder"

def parse_tier(text):
    if not text:
        return 2
    t = text.lower()
    for key, val in TIER_MAP.items():
        if key in t:
            return val
    # Try to extract number
    m = re.search(r'(\d+)', t)
    if m:
        n = int(m.group(1))
        if n in (1, 2, 3):
            return n
    return 2

def parse_md_file(filepath):
    """Parse a single agent MD file, handling both formats."""
    content = filepath.read_text(encoding="utf-8")
    name = filepath.stem

    data = {
        "id": name.lower().replace(" ", "_").replace("-", "_"),
        "name": name,
        "emoji": "🤖",
        "bio": "",
        "lore": "",
        "adjectives": [],
        "tier": 2,
        "model": "",
        "temperature": 0.7,
        "max_tokens": 1500,
        "system_prompt": "",
    }

    # --- Extract from table format (DNAS_39_AGENTES) ---
    # | **Nome** | WANDA |
    table_rows = re.findall(r'\|\s*\*\*(\w+)\*\*\s*\|\s*([^|]+)\s*\|', content)
    for key, val in table_rows:
        key = key.strip().lower()
        val = val.strip()
        if key in ("nome", "name"):
            data["name"] = val
        elif key == "emoji":
            data["emoji"] = val
        elif key in ("bio", "biografia"):
            data["bio"] = val
        elif key in ("lore", "história"):
            data["lore"] = val
        elif key in ("adjetivos", "adjectives"):
            data["adjectives"] = [a.strip() for a in val.split(",") if a.strip()]
        elif key in ("tier", "nível"):
            data["tier"] = parse_tier(val)
        elif key in ("modelo", "model"):
            data["model"] = val
        elif key == "temperature":
            m = re.search(r'(\d+\.?\d*)', val.replace(",", "."))
            if m:
                data["temperature"] = float(m.group(1))
        elif key in ("max tokens", "max_tokens"):
            m = re.search(r'(\d+)', val)
            if m:
                data["max_tokens"] = int(m.group(1))

    # --- Extract from header format (DNAS_AGENCY_AGENTS) ---
    # **name:** ASO-SPECIALIST
    header_rows = re.findall(r'\*\*(\w+):\*\*\s*([^\n]+)', content)
    for key, val in header_rows:
        key = key.strip().lower()
        val = val.strip()
        if key == "name":
            data["name"] = val
        elif key == "emoji":
            data["emoji"] = val
        elif key == "role":
            if not data["bio"]:
                data["bio"] = val
        elif key == "tier":
            data["tier"] = parse_tier(val)
        elif key == "model":
            data["model"] = val

    # Bio from "### Bio" section
    bio_match = re.search(r'###\s*Bio\s*\n([^#]+)', content)
    if bio_match:
        bio_text = bio_match.group(1).strip()
        if bio_text:
            data["bio"] = bio_text

    # Lore from "### Lore" section
    lore_match = re.search(r'###\s*Lore\s*\n([^#]+)', content)
    if lore_match:
        lore_text = lore_match.group(1).strip()
        if lore_text:
            data["lore"] = lore_text

    # Adjectives from "### 5 Adjetivos" or "### Adjetivos"
    adj_match = re.search(r'###\s*(?:5\s*)?Adjetivos\s*\n((?:-?\s*[^\n]+\n?)+)', content, re.IGNORECASE)
    if adj_match:
        adj_text = adj_match.group(1)
        adjs = []
        for line in adj_text.split("\n"):
            line = line.strip().lstrip("-").strip()
            if line and not line.startswith("#"):
                adjs.append(line)
        if adjs:
            data["adjectives"] = adjs

    # System Prompt from code block after "System Prompt"
    sys_match = re.search(r'##\s*System Prompt\s*\n```\n?(.*?)```', content, re.DOTALL | re.IGNORECASE)
    if sys_match:
        data["system_prompt"] = sys_match.group(1).strip()
    else:
        # Try without code block markers
        sys_match2 = re.search(r'##\s*System Prompt\s*\n(.+?)(?=\n##|\Z)', content, re.DOTALL | re.IGNORECASE)
        if sys_match2:
            data["system_prompt"] = sys_match2.group(1).strip()

    # Fallback: extract anything between ``` after "System Prompt"
    if not data["system_prompt"]:
        fallback = re.search(r'System Prompt.*?```(.*?)```', content, re.DOTALL | re.IGNORECASE)
        if fallback:
            data["system_prompt"] = fallback.group(1).strip()

    # Update id based on final name
    data["id"] = data["name"].lower().replace(" ", "_").replace("-", "_").replace(".", "")

    return data


def build_character(agent):
    """Build elizaOS Character JSON from parsed agent data."""
    tier = agent["tier"]
    provider = infer_model_provider(agent["model"])
    model_name = infer_model_name(agent["model"], tier)

    # Default plugins based on tier/provider
    plugins = ["@elizaos/plugin-bootstrap"]
    if provider == "anthropic":
        plugins.append("@elizaos/plugin-anthropic")
    elif provider == "groq":
        plugins.append("@elizaos/plugin-groq")
    elif provider == "google":
        plugins.append("@elizaos/plugin-google")
    elif provider == "ollama":
        plugins.append("@elizaos/plugin-ollama")

    character = {
        "id": agent["id"],
        "name": agent["name"],
        "username": agent["id"],
        "bio": agent["bio"] or f"Agente {agent['name']} da Totum",
        "lore": [agent["lore"]] if agent["lore"] else [],
        "adjectives": agent["adjectives"] if agent["adjectives"] else ["profissional", "eficiente", "focado"],
        "system": agent["system_prompt"] or f"Você é {agent['name']}, um agente especialista da Totum.",
        "systemPrompts": [agent["system_prompt"]] if agent["system_prompt"] else [],
        "style": {
            "all": ["Seja claro e direto", "Use terminologia profissional"],
            "chat": ["Seja conversacional", "Faça perguntas clarificadoras quando necessário"],
            "post": ["Mantenha o engajamento", "Use formatação adequada"],
        },
        "knowledge": [],
        "messageExamples": [],
        "plugins": plugins,
        "clients": [],
        "modelProvider": provider,
        "models": [model_name],
        "settings": {
            "temperature": agent["temperature"],
            "max_tokens": agent["max_tokens"],
            "tier": tier,
        },
        "createdAt": int(datetime.now().timestamp() * 1000),
        "updatedAt": int(datetime.now().timestamp() * 1000),
    }
    return character


def build_registry_entry(agent, character):
    """Build TotumAgentConfig-style entry for registry."""
    return {
        "id": agent["id"],
        "agent_id": agent["id"],
        "name": agent["name"],
        "emoji": agent["emoji"],
        "bio": agent["bio"] or f"Agente {agent['name']} da Totum",
        "lore": agent["lore"],
        "adjectives": agent["adjectives"] if agent["adjectives"] else [],
        "system_prompt": agent["system_prompt"] or f"Você é {agent['name']}, um agente especialista da Totum.",
        "system_prompt_variations": [],
        "tier": agent["tier"],
        "model_override": character["models"][0],
        "temperature": agent["temperature"],
        "max_tokens": agent["max_tokens"],
        "skills": [],
        "channels": [],
        "knowledge_enabled": False,
        "knowledge_sources": [],
        "rag_mode": "static",
        "plugins": character["plugins"],
        "is_active": True,
        "status": "online",
        "metadata": {
            "tier": agent["tier"],
            "team": "DNAS_39" if "39" in str(agent.get("_source", "")) else "AGENCY",
            "category": "agent",
        },
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }


def main():
    print("🚀 Gerando agentes elizaOS a partir dos DNAs...")

    SRC_AGENTS.mkdir(parents=True, exist_ok=True)

    all_agents = []
    parsed_agents = []

    for dnas_dir in DNAS_DIRS:
        team_label = "DNAS_39" if "39" in dnas_dir.name else "AGENCY"
        for md_file in sorted(dnas_dir.glob("*.md")):
            if md_file.name.upper() == "INDEX.MD":
                continue
            print(f"  📄 Parsing: {md_file.name}")
            try:
                agent = parse_md_file(md_file)
                agent["_source"] = team_label
                parsed_agents.append(agent)
            except Exception as e:
                print(f"    ⚠️ Erro em {md_file.name}: {e}")

    print(f"\n📊 Total parseado: {len(parsed_agents)} agentes")

    registry = {}
    for agent in parsed_agents:
        char = build_character(agent)
        entry = build_registry_entry(agent, char)
        registry[agent["id"]] = entry

        # Create agent directory
        agent_dir = SRC_AGENTS / agent["id"]
        agent_dir.mkdir(parents=True, exist_ok=True)

        # Write character.json
        char_path = agent_dir / "character.json"
        with open(char_path, "w", encoding="utf-8") as f:
            json.dump(char, f, indent=2, ensure_ascii=False)

        # Write AGENT.md
        md_path = agent_dir / "AGENT.md"
        md_content = f"""# {agent['emoji']} {agent['name']}

> **ID:** `{agent['id']}`  
> **Tier:** {agent['tier']} ({'Laboratório' if agent['tier']==1 else 'Mid' if agent['tier']==2 else 'Fábrica'})  
> **Modelo:** {agent['model'] or 'padrão'}  
> **Provider:** {char['modelProvider']}  
> **Status:** online

## Bio

{agent['bio'] or 'Agente especialista da Totum.'}

## Lore

{agent['lore'] or '—'}

## Adjetivos

{', '.join(agent['adjectives']) if agent['adjectives'] else 'profissional, eficiente, focado'}

## System Prompt

```
{agent['system_prompt'] or f'Você é {agent["name"]}, um agente especialista da Totum.'}
```

## elizaOS Character

Ver `character.json` para exportação completa elizaOS-compatível.

---

*Gerado automaticamente a partir de {agent['_source']}*
"""
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(md_content)

        print(f"    ✅ {agent['id']}")

    # Write registry
    with open(REGISTRY_PATH, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2, ensure_ascii=False)

    # Summary
    tiers = {}
    teams = {}
    for a in parsed_agents:
        tiers[a['tier']] = tiers.get(a['tier'], 0) + 1
        team = a['_source']
        teams[team] = teams.get(team, 0) + 1

    print(f"\n🎉 Concluído!")
    print(f"   Agentes gerados: {len(parsed_agents)}")
    print(f"   Por tier: {dict(sorted(tiers.items()))}")
    print(f"   Por time: {teams}")
    print(f"   Registry: {REGISTRY_PATH}")
    print(f"   Diretório: {SRC_AGENTS}")


if __name__ == "__main__":
    main()
