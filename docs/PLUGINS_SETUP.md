# Guia de Ativação dos Plugins - Kimi Claw

## 📋 Resumo das Ativações Necessárias

### 1️⃣ Feishu (飞书/Lark) - 10 Skills
**Status**: ⚠️ Desativado
**Skills disponíveis**:
- Bitable (banco de dados)
- Calendário e eventos
- Tarefas e listas
- Documentos (criar/ler/editar)
- Mensagens IM

**Como ativar**:
```bash
# Passo 1: Habilitar plugin
openclaw config set channels.feishu.enabled true

# Passo 2: Configurar credenciais (obter em https://open.larkoffice.com/app)
openclaw config set channels.feishu.appId <SEU_APP_ID>
openclaw config set channels.feishu.appSecret <SEU_APP_SECRET>

# Passo 3: Reiniciar gateway
openclaw gateway restart
```

**Documentação**: https://bytedance.larkoffice.com/docx/MFK7dDFLFoVlOGxWCv5cTXKmnMh

---

### 2️⃣ WeCom (企业微信) - 14 Skills
**Status**: ⚠️ Desativado
**Skills disponíveis**:
- Contatos e diretório
- Documentos e Smart Sheets
- Reuniões (criar/cancelar/consultar)
- Agenda e calendário
- Mensagens e mídia
- Tarefas/To-do

**Como ativar**:
```bash
# Passo 1: Criar bot em https://work.weixin.qq.com
# Passo 2: Obter Bot ID e Secret

# Passo 3: Configurar
openclaw config set channels.wecom.enabled true
openclaw config set channels.wecom.botId <SEU_BOT_ID>
openclaw config set channels.wecom.secret <SEU_BOT_SECRET>

# Passo 4: Reiniciar
openclaw gateway restart
```

**Documentação**: https://doc.weixin.qq.com/doc/w3_AFYA1wY6ACoCNRxfnyGRJQaSa6jjJ

---

### 3️⃣ DingTalk - Conector
**Status**: ⚠️ Não configurado

**Como ativar**:
```bash
openclaw channels add
# Selecionar DingTalk e seguir wizard interativo
```

---

### 4️⃣ WeChat (微信) - openclaw-weixin
**Status**: ⚠️ Sem token

**Como ativar**:
```bash
openclaw config set channels.weixin.enabled true
openclaw config set channels.weixin.token <SEU_TOKEN>
openclaw gateway restart
```

---

## 🔧 Configurações de Segurança Recomendadas

### Feishu/Lark
```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "dmPolicy": "pairing",  // Requer aprovação para DM
      "groupPolicy": "allowlist"  // Apenas grupos autorizados
    }
  }
}
```

### WeCom
```json
{
  "channels": {
    "wecom": {
      "enabled": true,
      "dmPolicy": "pairing",  // ou "open" / "allowlist"
      "groupPolicy": "allowlist"
    }
  }
}
```

---

## 📁 Scripts Criados

| Script | Função | Local |
|--------|--------|-------|
| backup-memories.sh | Backup do banco e memórias | scripts/ |
| daily-report-generator.sh | Gerar relatórios diários | scripts/ |
| health-check.sh | Verificar saúde do sistema | scripts/ |

---

## 🗄️ Banco de Dados Criado

**Local**: `/root/.openclaw/workspace/data/totum_claw.db`

**Tabelas**:
- `conversations` - Histórico de interações
- `memories` - Fatos importantes sobre você
- `projects` - Projetos em andamento
- `links` - Links/artigos salvos

---

## 📝 Próximos Passos

1. [ ] Escolher qual(is) plugin(s) ativar primeiro
2. [ ] Obter credenciais necessárias
3. [ ] Executar comandos de configuração
4. [ ] Testar integrações
5. [ ] Popular banco de dados com dados iniciais

---

*Gerado em: 2025-03-31*
