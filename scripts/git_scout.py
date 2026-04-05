#!/usr/bin/env python3
"""
🐙 GitHub Scout - Agente GIT
Monitora repositórios trending no GitHub relevantes para Totum
Autor: TOT (Totum Operative Technology)
"""

import os
import json
import time
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import requests

# Configurações
GITHUB_API = "https://api.github.com"
CATEGORY_KEYWORDS = [
    "automation", "n8n", "supabase", "ai-agent", "low-code", "crm",
    "workflow", "productivity", "chatbot", "integration"
]
MIN_STARS_DAILY = 20  # Mínimo de estrelas ganhas nas últimas 24h
CACHE_FILE = "/tmp/openclaw/git_scout_cache.json"
OUTPUT_FILE = "/tmp/openclaw/git_scout_report.md"

def get_github_token() -> Optional[str]:
    """Obtém token do GitHub das variáveis de ambiente."""
    return os.environ.get("GITHUB_TOKEN")

def github_request(endpoint: str, params: Dict = None) -> Dict:
    """Faz requisição à API do GitHub com rate limit handling."""
    token = get_github_token()
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Totum-GitScout/1.0"
    }
    if token:
        headers["Authorization"] = f"token {token}"
    
    url = f"{GITHUB_API}/{endpoint}"
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=30)
        
        # Rate limit check
        if response.status_code == 403 and "rate limit" in response.text.lower():
            print("⚠️ Rate limit atingido. Aguardando...")
            time.sleep(60)
            return github_request(endpoint, params)
        
        response.raise_for_status()
        time.sleep(1)  # Respeitar rate limit
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro na requisição: {e}")
        return {}

def search_trending_repos(keyword: str, days: int = 7) -> List[Dict]:
    """Busca repositórios criados ou atualizados recentemente."""
    since_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
    
    # Busca por repositórios criados recentemente com a keyword
    params = {
        "q": f"{keyword} created:>{since_date}",
        "sort": "stars",
        "order": "desc",
        "per_page": 10
    }
    
    data = github_request("search/repositories", params)
    return data.get("items", [])

def get_repo_details(owner: str, repo: str) -> Dict:
    """Obtém detalhes de um repositório."""
    return github_request(f"repos/{owner}/{repo}")

def load_cache() -> Dict:
    """Carrega cache de repositórios já reportados."""
    try:
        if os.path.exists(CACHE_FILE):
            with open(CACHE_FILE, 'r') as f:
                return json.load(f)
    except Exception:
        pass
    return {"reported": [], "last_run": None}

def save_cache(cache: Dict):
    """Salva cache de repositórios reportados."""
    os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f)

def analyze_relevance(repo: Dict) -> Dict:
    """Analisa relevância do repositório para a Totum."""
    name = repo.get("full_name", "")
    description = repo.get("description", "") or ""
    topics = repo.get("topics", [])
    
    relevance_score = 0
    reasons = []
    action = "ignorar"
    
    # Critérios de relevância
    if any(k in name.lower() or k in description.lower() for k in ["n8n", "automation", "workflow"]):
        relevance_score += 3
        reasons.append("Ferramenta de automação - core da Totum")
        action = "estudar"
    
    if any(k in name.lower() or k in description.lower() for k in ["crm", "customer", "sales"]):
        relevance_score += 3
        reasons.append("Relacionado a CRM - relevante para clientes")
        action = "estudar"
    
    if any(k in name.lower() or k in description.lower() for k in ["ai-agent", "agent", "llm"]):
        relevance_score += 4
        reasons.append("Framework/agente de IA - alinhado com nossa estratégia")
        action = "implementar" if repo.get("stargazers_count", 0) > 500 else "estudar"
    
    if any(k in name.lower() or k in description.lower() for k in ["supabase", "firebase", "backend"]):
        relevance_score += 2
        reasons.append("Infraestrutura backend - possível uso interno")
        action = "estudar"
    
    if "low-code" in name.lower() or "low-code" in description.lower():
        relevance_score += 2
        reasons.append("Plataforma low-code - mercado que atuamos")
        action = "estudar"
    
    # Ajustar ação baseado na maturidade
    stars = repo.get("stargazers_count", 0)
    if stars < 50 and action == "implementar":
        action = "estudar"
    
    return {
        "score": relevance_score,
        "reasons": reasons,
        "action": action
    }

def generate_report(repos: List[Dict]) -> str:
    """Gera relatório em markdown."""
    today = datetime.now().strftime("%Y-%m-%d")
    
    report = f"""# 🐙 GitHub Scout - {today}

> Agente GIT - Monitoramento de repositórios trending

---

## 📊 Resumo

- **Total analisado:** {len(repos)} repositórios
- **Data da análise:** {datetime.now().strftime("%d/%m/%Y %H:%M")}

---

## ⭐ Destaques

"""
    
    # Ordenar por relevância
    repos_with_analysis = []
    for repo in repos:
        analysis = analyze_relevance(repo)
        if analysis["score"] > 0:
            repos_with_analysis.append((repo, analysis))
    
    repos_with_analysis.sort(key=lambda x: x[1]["score"], reverse=True)
    
    # Top 3 destaques
    for i, (repo, analysis) in enumerate(repos_with_analysis[:3], 1):
        stars = repo.get("stargazers_count", 0)
        language = repo.get("language", "N/A")
        
        report += f"""### {i}. **{repo.get('full_name')}** ⭐ {stars}
🔗 {repo.get('html_url')}

**Descrição:** {repo.get('description', 'Sem descrição')}

**Linguagem:** {language} | **Criado:** {repo.get('created_at', 'N/A')[:10]}

**🎯 Relevância para Totum:**
"""
        for reason in analysis["reasons"]:
            report += f"- {reason}\n"
        
        action_emoji = {"estudar": "📚", "implementar": "🚀", "ignorar": "⏭️"}
        emoji = action_emoji.get(analysis["action"], "⏭️")
        report += f"\n**{emoji} Ação recomendada:** {analysis['action'].upper()}\n\n---\n\n"
    
    # Lista resumida dos demais
    if len(repos_with_analysis) > 3:
        report += "\n## 📋 Outros Repositórios Encontrados\n\n"
        for repo, analysis in repos_with_analysis[3:10]:
            report += f"- **{repo.get('full_name')}** ({analysis['action']}) - {repo.get('description', 'N/A')[:80]}...\n"
    
    # Sem resultados
    if not repos_with_analysis:
        report += "\n⚠️ *Nenhum repositório relevante encontrado nas últimas 24-48h*\n"
    
    report += f"""
---

*Relatório gerado automaticamente pelo Agente GIT*  
*Próxima execução: Amanhã às 22:30*
"""
    
    return report

def main():
    """Função principal do agente."""
    print("🐙 Iniciando GitHub Scout...")
    
    cache = load_cache()
    all_repos = []
    
    # Buscar por cada categoria
    for keyword in CATEGORY_KEYWORDS:
        print(f"🔍 Buscando: {keyword}...")
        repos = search_trending_repos(keyword, days=2)
        
        for repo in repos:
            repo_id = repo.get("id")
            if repo_id not in cache["reported"]:
                all_repos.append(repo)
                cache["reported"].append(repo_id)
        
        time.sleep(1)  # Delay entre buscas
    
    # Remover duplicados
    seen = set()
    unique_repos = []
    for repo in all_repos:
        rid = repo.get("id")
        if rid not in seen:
            seen.add(rid)
            unique_repos.append(repo)
    
    print(f"✅ {len(unique_repos)} repositórios novos encontrados")
    
    # Gerar relatório
    report = generate_report(unique_repos)
    
    # Salvar relatório
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"📝 Relatório salvo em: {OUTPUT_FILE}")
    
    # Atualizar cache (manter apenas últimos 1000)
    cache["last_run"] = datetime.now().isoformat()
    cache["reported"] = cache["reported"][-1000:]
    save_cache(cache)
    
    # Imprimir resumo
    print("\n" + "="*50)
    print(report[:1000] + "..." if len(report) > 1000 else report)
    
    return report

if __name__ == "__main__":
    main()
