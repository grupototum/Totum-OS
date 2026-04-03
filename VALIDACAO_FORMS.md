# Correção de Validação de Formulários - Apps Totum

## Resumo

Foi implementada validação client-side completa em todos os formulários do Apps Totum para evitar erros 500 causados por envio de dados inválidos.

## Arquivos Criados

### `/src/lib/validation.ts`
Novo módulo de validações reutilizáveis contendo:

- **Funções de validação individuais:**
  - `isValidEmail()` - Valida formato de e-mail
  - `isValidCNPJ()` - Valida CNPJ (formato e dígitos verificadores)
  - `isValidPhone()` - Valida telefone brasileiro (com DDD)
  - `isValidURL()` - Valida URL
  - `isValidPassword()` - Valida senha (mínimo 6 caracteres)
  - `isRequired()` - Verifica campo obrigatório
  - `sanitizeURL()` - Sanitiza URL (adiciona https:// se necessário)

- **Funções de validação de formulários completos:**
  - `validateLoginForm()` - Valida login
  - `validateSignUpForm()` - Valida registro
  - `validateForgotPasswordForm()` - Valida recuperação de senha
  - `validateResetPasswordForm()` - Valida redefinição de senha
  - `validateClientBasicInfo()` - Valida dados do cliente (etapa 0)
  - `validateTask()` - Valida tarefa
  - `validateContentCard()` - Valida conteúdo do pipeline

## Formulários Atualizados

### 1. **Login.tsx**
- ✅ Adicionada validação de e-mail (formato)
- ✅ Adicionada validação de senha (obrigatório)
- ✅ Feedback visual com bordas vermelhas em campos inválidos
- ✅ Mensagens de erro específicas

### 2. **SignUp.tsx**
- ✅ Adicionada validação de nome (obrigatório)
- ✅ Adicionada validação de e-mail (formato)
- ✅ Adicionada validação de senha (mínimo 6 caracteres)
- ✅ Validação de confirmação de senha
- ✅ Feedback visual com bordas vermelhas
- ✅ Mensagens de erro específicas por campo

### 3. **ForgotPassword.tsx**
- ✅ Adicionada validação de e-mail (formato)
- ✅ Feedback visual com bordas vermelhas
- ✅ Mensagem de erro específica

### 4. **ResetPassword.tsx**
- ✅ Adicionada validação de senha (mínimo 6 caracteres)
- ✅ Validação de confirmação de senha
- ✅ Feedback visual com bordas vermelhas
- ✅ Mensagens de erro específicas

### 5. **NewClient.tsx**
- ✅ Validacão completa na etapa 0:
  - Nome da empresa (obrigatório)
  - CNPJ (formato e dígitos verificadores)
  - Nome do responsável (obrigatório)
  - E-mail (formato)
  - Telefone (formato brasileiro)
  - Website (URL válida, opcional)
- ✅ Sanitização de URL antes do envio
- ✅ Validação final antes do submit
- ✅ Helper `ErrorMessage` para exibir erros
- ✅ Feedback visual em todos os campos

### 6. **EditClient.tsx**
- ✅ Mesmas validações do NewClient.tsx
- ✅ Sanitização de URL antes do update
- ✅ Validação final antes do submit

### 7. **TasksBoard.tsx**
- ✅ Validação de título da tarefa (obrigatório)
- ✅ Feedback visual com bordas vermelhas
- ✅ Mensagem de erro específica

### 8. **ContentPipeline.tsx**
- ✅ Validação de título do conteúdo (obrigatório)
- ✅ Feedback visual com bordas vermelhas
- ✅ Mensagem de erro específica

## Como Funciona

### Fluxo de Validação:

1. **Usuário tenta submeter formulário**
2. **Validação client-side é executada**
3. **Se houver erros:**
   - Erros são armazenados no estado `errors`
   - Toast mostra o primeiro erro
   - Campos inválidos recebem borda vermelha
   - Mensagens de erro aparecem abaixo dos campos
   - **Request NÃO é enviado ao servidor**
4. **Se não houver erros:**
   - Request é enviado ao servidor
   - Dados são sanitizados (ex: URL com https://)

### Exemplo de Uso:

```tsx
import { validateLoginForm, type ValidationErrors } from "@/lib/validation";

const [errors, setErrors] = useState<ValidationErrors>({});

const handleSubmit = (e) => {
  e.preventDefault();
  
  const validationErrors = validateLoginForm(email, password);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    toast.error(Object.values(validationErrors)[0]);
    return; // Impede envio
  }
  
  // Prossegue com o envio...
};
```

## Benefícios

1. **Prevenção de erros 500:** Dados inválidos nunca chegam ao servidor
2. **Melhor UX:** Feedback imediato ao usuário
3. **Redução de carga no servidor:** Menos requests inválidos
4. **Padronização:** Validações consistentes em todos os formulários
5. **Reutilização:** Módulo de validação pode ser usado em novos formulários

## Próximos Passos (Opcional)

- [ ] Adicionar validação em tempo real (onBlur)
- [ ] Adicionar indicador de força de senha
- [ ] Adicionar máscaras de input (CNPJ, telefone)
- [ ] Validar campos de URL com regex mais estrito
