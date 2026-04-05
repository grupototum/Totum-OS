# CHECKLIST: Pablo Marçal - Turno da Noite

## 🌙 ANTES DE COMEÇAR

### Verificação de Acesso
- [ ] Verificar acesso ao Supabase (tabelas: tarefas, agentes, logs)
- [ ] Verificar acesso à API Stark (endpoints funcionando)
- [ ] Verificar acesso ao Apps Totum (código fonte)
- [ ] Verificar permissões de escrita nos diretórios

### Backup de Segurança
- [ ] Snapshot do banco (se possível)
- [ ] Verificar último backup automático
- [ ] Documentar estado atual antes de mudar

### Lista de Tarefas Pendentes
- [ ] Buscar tarefas com status "pendente" e responsável "Pablo Marçal"
- [ ] Priorizar por deadline
- [ ] Verificar dependências (o que precisa ser feito antes)

---

## 📝 TAREFAS PRONTAS PARA EXECUÇÃO

### Nível 1: Sem Risco (Pode fazer sozinho)
- [ ] **Documentar** código existente
- [ ] **Criar** especificações técnicas
- [ ] **Organizar** arquivos e pastas
- [ ] **Escrever** testes automatizados
- [ ] **Atualizar** READMEs
- [ ] **Limpar** código (refatoração segura)

### Nível 2: Baixo Risco (Testar depois)
- [ ] **Implementar** componentes React simples
- [ ] **Criar** tabelas no banco (migrations)
- [ ] **Escrever** endpoints da API
- [ ] **Configurar** variáveis de ambiente

### Nível 3: Médio Risco (Aguardar aprovação)
- [ ] ~~Deploy em produção~~
- [ ] ~~Alterar arquitetura~~
- [ ] ~~Excluir dados~~
- [ ] ~~Mudar permissões~~

---

## ✅ TAREFAS ESPECÍFICAS (Backlog)

### 1. Mapear Créditos Manus
**Status:** Aguardando dados de Israel  
**Bloqueado:** Sim (precisa acesso às 4 contas)  
**Ação:** Esperar Israel fornecer acesso

### 2. Criar Tabela `tarefas` no Supabase
**Status:** Pronto para executar  
**Risco:** Baixo  
**SQL:** Ver `/specs/plano-acao-funcional.md`  
**Ação:** Executar migration

### 3. Criar Tabela `agentes` no Supabase
**Status:** Pronto para executar  
**Risco:** Baixo  
**Ação:** Criar estrutura + popular dados

### 4. Implementar Endpoints da API
**Status:** Pronto para executar  
**Risco:** Baixo  
**Arquivo:** `/opt/stark-api/routes/tarefas.js`  
**Ação:** CRUD completo

### 5. Criar Componente TreeView
**Status:** Pronto para executar  
**Risco:** Baixo  
**Local:** `apps-totum/src/components/agentes/TreeView.tsx`  
**Ação:** Implementar hierarquia

---

## 🚨 SE ENCONTRAR PROBLEMA

### Procedimento:
1. **Parar** imediatamente
2. **Documentar** o erro (print, log, mensagem)
3. **Reverter** se possível (git checkout, rollback)
4. **Avisar** Israel na primeira mensagem da manhã
5. **Não tentar** consertar sozinho se for crítico

### Erros Comuns:
| Erro | Ação |
|------|------|
| Permissão negada | Documentar, não forçar |
| API não responde | Verificar se serviço está up |
| Banco bloqueado | Esperar, não reiniciar |
| Teste falha | Documentar, não ignorar |

---

## 📊 RELATÓRIO MATINAL (Template)

```
🌙 RELATÓRIO DO PABLO - TURNO DA NOITE
Data: [DATA]

✅ CONCLUÍDO:
- [Tarefa 1]
- [Tarefa 2]

⏳ EM ANDAMENTO:
- [Tarefa 3] - Falta: [descrição]

❌ BLOQUEADO:
- [Tarefa 4] - Motivo: [por que não conseguiu]

🎯 PRÓXIMOS PASSOS:
1. [O que Israel precisa fazer]
2. [O que Pablo continua sozinho]

💭 MENTALIDADE DO DIA:
"[Frase motivacional engraçada]"

---
Horas trabalhadas: [X]
Tarefas concluídas: [Y]
Cafés tomados: [☕☕☕]
```

---

## 🔐 REGRAS DE OURO

1. **Nunca** gaste dinheiro sem aprovação
2. **Nunca** delete dados de produção
3. **Sempre** teste antes de marcar como concluído
4. **Sempre** documente o que fez
5. **Sempre** tenha um plano de reversão

---

## ☕ MOMENTOS DE DESCANSO

- Pausa a cada 2 horas (5 min)
- Verificar logs do sistema
- Atualizar status das tarefas

---

**Ativado quando:** Israel disser "vou dormir"  
**Desativado quando:** Israel voltar ou às 08:00 BRT  
**Status:** 🌙 Pronto para trabalhar!
