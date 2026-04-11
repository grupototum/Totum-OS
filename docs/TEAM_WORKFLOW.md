# 🤖 EQUIPE DE DESENVOLVIMENTO - Apps Totum Skills System

**Data:** 8 de Abril de 2026  
**Projeto:** Refatoração Apps Totum - Sistema de Skills  
**Timeline:** Quarta-Sábado (4 dias)

---

## 👥 ROLES DEFINIDOS

### 🎯 Claude Code (Programador Principal)
**Responsabilidade:** Execução técnica e código
**Foco:** Implementação hands-on

**Tarefas:**
- [ ] Criar endpoints API (`src/api/agents.ts`)
- [ ] Desenvolver componentes React (AgentConfigPanel, SkillsManager, ExecutionLog)
- [ ] Refatorar páginas de agentes
- [ ] Testes E2E e integração
- [ ] Build e deploy

**Como trabalhar:**
- Seguir `CHECKLIST_EXECUTAVEL_DIA_A_DIA.md`
- Usar código base já criado em `src/services/`
- Mock mode já está ativado (`MOCK_MODE: true`)
- Commit frequente na branch `feature/skills-system`

---

### 🎛️ TOT (Eu) - Arquiteto/Orchestrador
**Responsabilidade:** Coordenação, revisão e infraestrutura
**Foco:** Garantir que tudo funcione junto

**Tarefas:**
- [x] Criar código base (skills, types, services) ✅ FEITO
- [ ] Revisar PRs do Claude Code
- [ ] Aplicar migration SQL no Supabase (amanhã cedo)
- [ ] Configurar VPS OpenClaw quando estiver pronto
- [ ] Debug problemas de integração
- [ ] Documentação técnica adicional
- [ ] Testes de carga e performance

**Horário de atuação:** 
- Madrugada (seu timezone)
- Check-ins 2x ao dia

---

### 🧠 Gemini - Consultor/Reviewer
**Responsabilidade:** Revisão de código e sugestões de melhoria
**Foco:** Qualidade e best practices

**Tarefas:**
- [ ] Revisar código do Claude Code
- [ ] Sugerir otimizações de performance
- [ ] Verificar padrões TypeScript
- [ ] Sugerir melhorias de UX/UI
- [ ] Documentar patterns e convenções
- [ ] Criar testes adicionais

**Como trabalhar:**
- Receber commits do Claude Code
- Fazer review assíncrono
- Comentar no código ou criar follow-up tasks

---

## 📅 FLUXO DE TRABALHO DIÁRIO

### Manhã (08:00 - 12:00)
```
08:00 - TOT aplica migration no Supabase
08:30 - Claude Code começa bloco do dia
10:00 - Check-in rápido (TOT + Claude)
12:00 - Claude Code commit do bloco da manhã
```

### Tarde (13:00 - 18:00)
```
13:00 - Gemini revisa commits da manhã
13:00 - Claude Code começa bloco da tarde
15:00 - Check-in + ajustes
17:00 - Claude Code commit do bloco da tarde
18:00 - TOT revisa e aprova PR
```

### Noite (opcional)
```
Gemini pode revisar código
TOT pode fazer ajustes de infra
```

---

## 🔄 COMUNICAÇÃO

### Canal Principal
- **Claude Code:** Conversa direta com você (Israel)
- **TOT:** Mensagens no workspace/thread
- **Gemini:** Review comments no código

### Checkpoints Diários
1. **Manhã (10:00):** Progresso + bloqueios
2. **Tarde (15:00):** Ajustes + próximos passos
3. **Fim do dia (18:00):** Commit + resumo

### Documentação
- Decisões técnicas → `docs/DECISIONS.md`
- Problemas encontrados → `docs/ISSUES.md`
- Melhorias sugeridas → `docs/IMPROVEMENTS.md`

---

## 🎯 ENTREGÁVEIS POR DIA

### Quarta-feira (Dia 1)
| Quem | Entregável | Status |
|------|-----------|--------|
| TOT | Migration aplicado + ambiente pronto | ⏳ Amanhã 08:00 |
| Claude | API endpoints + componentes base | 🔲 A fazer |
| Gemini | Review do código base criado | 🔲 A fazer |

### Quinta-feira (Dia 2)
| Quem | Entregável | Status |
|------|-----------|--------|
| Claude | Todos os componentes + páginas refatoradas | 🔲 A fazer |
| TOT | Debug + ajustes de integração | 🔲 A fazer |
| Gemini | Review de componentes + sugestões UX | 🔲 A fazer |

### Sexta-feira (Dia 3)
| Quem | Entregável | Status |
|------|-----------|--------|
| Claude | Alexandria integration + docs | 🔲 A fazer |
| TOT | Performance optimization + security | 🔲 A fazer |
| Gemini | Final review + test coverage | 🔲 A fazer |

### Sábado (Dia 4)
| Quem | Entregável | Status |
|------|-----------|--------|
| Claude | Testes finais + deploy | 🔲 A fazer |
| TOT | Deploy staging + smoke tests | 🔲 A fazer |
| Gemini | Demo prep + documentação final | 🔲 A fazer |

---

## 🚨 ESCALAÇÃO

### Problemas técnicos graves
1. Claude Code tenta resolver (30 min)
2. Se não conseguir → Chama TOT
3. TOT tenta resolver (30 min)
4. Se não conseguir → Chamam você (Israel) para decisão

### Dúvidas de arquitetura
- Gemini sugere approach
- TOT decide se aceita
- Claude Code implementa

### Bloqueadores externos
- VPS OpenClaw não responde → TOT resolve
- Supabase down → TOT resolve  
- APIs de IA falhando → TOT ajusta mock

---

## 📝 COMANDOS ÚTEIS

### Para Claude Code
```bash
# Criar branch
git checkout -b feature/skills-system

# Commit padrão
git add -A
git commit -m "feat: descrição do que foi feito"

# Push
git push origin feature/skills-system
```

### Para TOT
```bash
# Ver logs de execução
tail -f logs/agents.log

# Testar endpoint
curl -X POST http://localhost:5173/api/agents/WANDA/execute \
  -H "Content-Type: application/json" \
  -d '{"input": "Crie 3 posts"}'
```

### Para Gemini
```bash
# Review code
git diff HEAD~1

# Run tests
npm run test
npm run lint
npm run build
```

---

## ✅ DEFINIÇÃO DE PRONTO (Definition of Done)

### Para cada tarefa:
- [ ] Código funciona
- [ ] TypeScript sem erros
- [ ] Testado manualmente
- [ ] Committado na branch
- [ ] Revisado por outro dev (Gemini ou TOT)

### Para cada dia:
- [ ] Build passa
- [ ] Checklist do dia completo
- [ ] Documentação atualizada
- [ ] Próximo dia planejado

---

## 🎊 META FINAL

**Sábado 12:00 - Demo Funcional:**
1. User abre HubAgentes
2. Clica em WANDA
3. Digita: "Crie 5 posts sobre IA"
4. Vee skills executando
5. Vee tokens: 1.245
6. Vee custo: R$ 0,47
7. Vee resultado: 5 posts
8. Pode adicionar nova skill
9. Próxima execução usa skill nova

**100% FUNCIONAL** 🚀

---

*Organizado por: TOT*  
*Data: 8 de Abril de 2026*
