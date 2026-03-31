

## Plano: Tela de Cadastro (Sign Up) no estilo Totum

### O que será feito
Criar uma página `/signup` com o mesmo visual da tela de Login (background com grid lines, radial glow laranja, card glassmorphism, animações framer-motion), contendo campos de nome, email, senha e confirmação de senha.

### Alterações

**1. Adicionar `signUp` ao AuthContext** (`src/contexts/AuthContext.tsx`)
- Expor uma função `signUp(email, password)` que chama `supabase.auth.signUp()` com `emailRedirectTo: window.location.origin`.

**2. Criar página `src/pages/SignUp.tsx`**
- Mesmo layout visual do Login (grid lines, radial glow, logo Totum, motion container).
- Campos: Nome completo, Email, Senha, Confirmar Senha (com toggle de visibilidade).
- Validação: campos obrigatórios, senhas coincidem, senha mínima 6 caracteres.
- Ao cadastrar com sucesso: toast de sucesso e redirecionar para `/hub` (já que auto-confirm está ativo).
- Botão "Entrar com Google" (reaproveitando o mesmo fluxo OAuth).
- Link "Já tem conta? Entrar" apontando para `/login`.

**3. Adicionar link na tela de Login** (`src/pages/Login.tsx`)
- Trocar o texto "Acesso restrito" por um link "Não tem conta? Cadastre-se" apontando para `/signup`.

**4. Registrar rota no App** (`src/App.tsx`)
- Adicionar `<Route path="/signup" element={<SignUp />} />`.

### Observação
- A tela de Login também precisa de correção na estrutura HTML (há tags `</div>` mal posicionadas no código atual que causam o botão Google e o divider fora do card). Isso será corrigido junto.

