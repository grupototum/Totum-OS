# 🤖 SENTINELA - Agente de Monitoramento Totum

## O que é
O **Sentinela** é um agente autônomo que monitora 24/7 todas as aplicações da Totum, detecta problemas e tenta corrigir automaticamente.

## Como Funciona

### Monitoramento Contínuo (a cada 2 minutos)
- ✅ Status dos serviços PM2
- ✅ Portas abertas
- ✅ Uso de disco
- ✅ Uso de memória
- ✅ Conectividade

### Ações Automáticas
| Problema Detectado | Ação Automática |
|-------------------|-----------------|
| Serviço offline | Restart automático |
| Restarts excessivos (>10) | Reload do serviço |
| Porta fechada | Alerta no log |
| Disco >90% | Limpeza de logs antigos |
| Memória >90% | Limpeza de processos |

## Arquivos

| Arquivo | Função |
|---------|--------|
| `/opt/totum-scripts/sentinela-monitor.sh` | Script principal |
| `/var/log/sentinela-monitor.log` | Log de monitoramento |
| `/tmp/sentinela-alerts.txt` | Alertas pendentes |
| `/var/log/sentinela-cron.log` | Log do cron |

## Comandos Úteis

```bash
# Ver status do Sentinela
tail -f /var/log/sentinela-monitor.log

# Ver alertas pendentes
cat /tmp/sentinela-alerts.txt

# Rodar manualmente
/opt/totum-scripts/sentinela-monitor.sh

# Verificar se cron está ativo
crontab -l | grep sentinela
```

## Serviços Monitorados

- upixel (4173)
- totum (4174)
- apps-totum (4175)
- stark-api (3000)
- stark-api-secure (8443)
- totum-backend (5000)
- codeflow (8001)
- kimi-connector (9001)

## Status
🟢 **Ativo** - Rodando a cada 2 minutos via cron
