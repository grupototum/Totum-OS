

## Plan: Ativar auto-confirm de email

### O que será feito
Ativar a confirmação automática de email no sistema de autenticação, para que novos usuários possam fazer login imediatamente após o cadastro, sem precisar verificar o e-mail.

### Etapa única
- Usar a ferramenta `cloud--configure_auth` para habilitar `autoconfirm: true` nas configurações de email do projeto.

### Observação
- Após ativar, será necessário criar uma tela de cadastro (Sign Up) ou criar um usuário manualmente para testar o fluxo de login.
- Esta configuração é recomendada apenas para desenvolvimento/testes. Em produção, a verificação de email deve ser reativada.

