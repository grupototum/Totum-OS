# 👻 Relatório de Teste de Ghosting - Apps_totum_Oficial

**Data:** 2026-04-12  
**Projeto:** Apps_totum_Oficial  
**Repositório:** https://github.com/grupototum/Apps_totum_Oficial.git

---

## 📊 Resumo Executivo

| Métrica | Valor |
|---------|-------|
| **Tamanho do Repositório** | 184 MB |
| **Objetos Inacessíveis (Ghost)** | 36 blobs, 8 trees, 1 commit |
| **Arquivos Não Rastreados** | 95 arquivos |
| **Arquivos Duplicados** | 100+ arquivos " 2.*" |
| **Submódulos Órfãos** | 1 (Apps_totum_Oficial) |

---

## 🔍 Objetos Inacessíveis (Git Ghost Objects)

### Objetos Identificados
```
Objetos Inacessíveis Encontrados: 45 total
├── Blobs (arquivos): 36
├── Trees (diretórios): 8
└── Commits: 1
```

### Lista de Objetos Órfãos
```
unreachable blob 340e16e0b14121119fcf1810c1214f354e629d07
unreachable tree 5d1c46c6126cf442606b19cb82f6502f6e4d99c0
unreachable blob fe1eba70465a4d01bd4238963c92a7b6d0819bc1
unreachable tree 711f140db07410f2c3baf2870bdaa62ae6e52b77
unreachable tree a120460a4764a7944ba65faa3c466c2e9c0a685c
unreachable blob cf253cf17056ce04827219643e484ea99c77cf6b
unreachable blob f62edea578d50058bef5e6bcc178b88d145564e9
unreachable tree 8f408c08e301abd8d4bca198ed2cef1d20279402
unreachable tree 8842a6c2f8e2a5ac8ca28fb0a47658bb5897684e
unreachable blob de4410e1b8674dc5ab3470665517f35dcbc014c3
...
unreachable commit c9d1642aba56d7ffe1d81bd3b5c7d07db61dde4f
```

**Impacto:** Estes objetos ocupam espaço no repositório e podem conter dados sensíveis de versões antigas.

---

## 📦 Arquivos Não Rastreados (Untracked Files)

### Arquivos Duplicados " 2" (95 arquivos)
```
Design System Apps/
├── assets/6xKtdSZaM9iE8KbpRA_hJFQNYuDyP7_8c18ec0bb69c 2.woff2
├── assets/6xKtdSZaM9iE8KbpRA_hJVQNYuDyP7_db92d2802bf7 2.woff2
├── assets/css2_*.css (13 arquivos)
├── assets/*.woff2 (40+ arquivos de fontes)
└── assets/photo-*.jpg (7 fotos)

code.grupototum.com/
├── DEPLOY 2.md
├── DEPLOY_AUTOMATICO.sh
├── DIAGNOSTICO_VPS.sh
├── components 2.json
├── index 2.html
├── package 2.json
├── postcss.config 2.js
├── server 2.js
├── tsconfig 2.json
├── tsconfig.app 2.json
├── tsconfig.node 2.json
└── src/index 2.css
└── src/main 2.tsx
```

### Origem Provável
- **macOS Finder:** Duplicação automática ao copiar arquivos
- **Downloads múltiplos:** Arquivos com mesmo nome baixados
- **Edições manuais:** Cópias de backup manuais

**Impacto:** +~50MB de espaço desperdiçado

---

## 🔗 Problemas com Submódulos

### Submódulo Órfão Detectado
```
Path: Apps_totum_Oficial
Status: Sem mapeamento em .gitmodules
Erro: "fatal: no submodule mapping found in .gitmodules"
```

### Análise
- O diretório `Apps_totum_Oficial` existe dentro do repositório
- Não há configuração de submódulo no arquivo `.gitmodules`
- Possivelmente um submódulo que foi removido mas os dados permanecem
- Contém arquivos duplicados do projeto pai

**Impacto:** Possível confusão de histórico e duplicação de código

---

## 💾 Estatísticas do Repositório Git

```
Tamanho Total:        184 MB
Contagem de Objetos:  635
Tamanho dos Objetos:  5.65 MiB
Objetos Empacotados:  45,090
Packs:                2
Tamanho dos Packs:    177.62 MiB
Prune-packable:       20
Lixo:                 0 bytes
```

### Objetos Grandes (>1MB)
```
55.5 MB  apps/totum/node_modules/@swc/core-linux-x64-musl/swc.linux-x64-musl.node
37.7 MB  apps/totum/node_modules/@swc/core-linux-x64-gnu/swc.linux-x64-gnu.node
23.0 MB  data-unifica-agentes-ui/node_modules/@rolldown/binding-linux-x64-gnu/...
11.1 MB  src/stark-api/node_modules/@esbuild/linux-x64/bin/esbuild
10.7 MB  venv/lib/python3.12/site-packages/hf_xet/hf_xet.abi3.so
10.0 MB  apps/totum/node_modules/lovable-tagger/node_modules/@esbuild/linux-x64/...
```

---

## 🗑️ Lixeira e Objetos Temporários

### Reflog (Histórico de Referências)
```
Total de entradas: 20+
Últimas operações:
- 5d02be97: docs: adiciona diagnóstico...
- 3c133eff: docs: adiciona guia completo...
- 597debf8: docs: adiciona diagnóstico...
- ab72afab: feat: implementa layout final...
```

### Stash
```
Lista de stash: Vazia ✅
```

### Branches
```
Branches Locais:
  * main

Branches Remotas:
  origin/HEAD -> origin/main
  origin/main
  origin/master
  origin/refactor/operacao-pente-fino
```

---

## 🎯 Recomendações de Limpeza

### Prioridade Alta

1. **Remover Arquivos Duplicados " 2"**
   ```bash
   # Encontrar e remover
   find . -name "* 2.*" -type f | grep -v node_modules | xargs rm -v
   # Remover diretórios vazios
   find . -type d -empty -delete
   ```

2. **Limpar Objetos Inacessíveis**
   ```bash
   # Garbage collection agressivo
   git gc --aggressive --prune=now
   
   # Ou remover objetos unreachable específicos
   git prune --expire=now
   ```

3. **Resolver Submódulo Órfão**
   ```bash
   # Opção A: Remover completamente
   git rm --cached Apps_totum_Oficial
   rm -rf Apps_totum_Oficial
   
   # Opção B: Configurar como submódulo correto
   git submodule add <url> Apps_totum_Oficial
   ```

### Prioridade Média

4. **Adicionar ao .gitignore**
   ```gitignore
   # Arquivos duplicados do macOS
   * 2
   * 2.*
   
   # Diretórios de node_modules
   **/node_modules/
   
   # Arquivos de ambiente
   .env
   .env.local
   
   # Arquivos de build
   dist/
   build/
   ```

5. **Limpar Reflog Antigo**
   ```bash
   git reflog expire --expire=30.days --all
   ```

### Prioridade Baixa

6. **Otimizar Repositório**
   ```bash
   # Repack otimizado
   git repack -a -d --depth=250 --window=250
   
   # Verificar integridade
   git fsck --full --strict
   ```

---

## 📈 Impacto da Limpeza (Estimativa)

| Ação | Economia Estimada |
|------|-------------------|
| Remover arquivos " 2" | ~50 MB |
| git gc --aggressive | ~20-30 MB |
| Remover node_modules do git | ~100+ MB* |
| **Total Potencial** | **~150+ MB** |

*Requer filter-branch ou filter-repo para remover do histórico

---

## ⚠️ Alertas de Segurança

1. **Dados Sensíveis no Histórico?**
   - Verificar se objetos unreachable contêm:
     - Chaves API
     - Senhas
     - Tokens de acesso
   - Recomendação: Usar `git filter-repo` se necessário

2. **Arquivos .env no Repositório**
   ```bash
   # Verificar
   find . -name ".env*" -type f | grep -v node_modules
   
   # Resultado:
   ./.env
   ./Apps_totum_Oficial/.env
   ```
   - ⚠️ Arquivo `.env` está versionado (pode conter dados sensíveis)

---

## 🛠️ Script de Limpeza Automatizado

```bash
#!/bin/bash
# cleanup-ghost.sh

echo "🧹 Iniciando limpeza de ghost files..."

# 1. Remover arquivos duplicados
echo "Removendo arquivos ' 2'..."
find . -name "* 2.*" -type f ! -path "./node_modules/*" ! -path "./.git/*" -delete

# 2. Limpar git
echo "Executando garbage collection..."
git gc --aggressive --prune=now

# 3. Verificar submódulos
echo "Verificando submódulos..."
git submodule status

# 4. Mostrar estatísticas finais
echo "Estatísticas finais:"
du -sh .git
git count-objects -vH

echo "✅ Limpeza concluída!"
```

---

**Conclusão:** O repositório possui problemas significativos de ghosting, com objetos inacessíveis, arquivos duplicados e um submódulo órfão. A limpeza pode reduzir o tamanho do repositório em até 50-60%.

---
*Relatório gerado automaticamente em 2026-04-12*
