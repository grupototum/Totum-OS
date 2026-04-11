# Correção BUG 1: Clique rápido em "Agentes" causa tela branca

## Problema Identificado

Ao clicar rapidamente no menu "Agentes" (ou em qualquer item de navegação relacionado), ocorria uma tela branca. Isso era causado por **race conditions** durante a navegação rápida entre páginas.

## Causas Raiz

1. **Race condition no useEffect do AgentsDashboard.tsx**: Quando o usuário navegava rapidamente, o componente desmontava antes das promises do Supabase completarem, causando tentativas de atualizar estado em componente desmontado.

2. **AnimatePresence mode="popLayout"**: Causava problemas quando o usuário navegava rapidamente entre páginas, deixando animações pendentes.

3. **Falta de proteção contra cliques duplos**: O usuário podia clicar múltiplas vezes no mesmo link, causando múltiplas navegações simultâneas.

4. **Estado de loading inconsistente no AppLayout**: A verificação de autenticação podia causar flash de tela branca.

## Correções Implementadas

### 1. AgentsDashboard.tsx

**Antes:**
```tsx
useEffect(() => {
  async function load() {
    const [agRes, intRes] = await Promise.all([...]);
    if (agRes.data) setAgents(agRes.data as Agent[]);
    if (intRes.data) setInteractions(intRes.data as Interaction[]);
    setLoading(false);
  }
  load();
  // ...
  return () => { supabase.removeChannel(ch); };
}, []);
```

**Depois:**
```tsx
useEffect(() => {
  let isMounted = true;
  let channel: ReturnType<typeof supabase.channel> | null = null;

  async function load() {
    try {
      const [agRes, intRes] = await Promise.all([...]);
      if (!isMounted) return;
      if (agRes.data) setAgents(agRes.data as Agent[]);
      if (intRes.data) setInteractions(intRes.data as Interaction[]);
    } catch (error) {
      console.error("Erro ao carregar dados dos agentes:", error);
    } finally {
      if (isMounted) setLoading(false);
    }
  }
  
  load();
  // ...
  return () => { 
    isMounted = false;
    if (channel) supabase.removeChannel(channel); 
  };
}, []);
```

**Mudanças:**
- Adicionado flag `isMounted` para evitar atualizações após desmontagem
- Adicionado try/catch para tratamento de erros
- Removido `AnimatePresence` que causava problemas com animações pendentes

### 2. AppLayout.tsx

**Antes:**
```tsx
useEffect(() => {
  if (!loading && !user) navigate("/login");
}, [user, loading, navigate]);

if (loading) { /* loading spinner */ }
if (!user) return null;
```

**Depois:**
```tsx
const [isReady, setIsReady] = useState(false);

useEffect(() => {
  if (!loading) {
    if (!user) {
      navigate("/login");
    } else {
      setIsReady(true);
    }
  }
}, [user, loading, navigate]);

if (loading || !isReady) { /* loading spinner */ }
```

**Mudanças:**
- Adicionado estado `isReady` para controlar quando o layout está pronto para renderizar
- Evita flash de tela branca entre loading e renderização

### 3. AppSidebar.tsx e AppSidebarContent.tsx

**Adicionado:**
```tsx
const [isNavigating, setIsNavigating] = useState(false);

const handleNav = (path: string) => {
  // Previne navegação se já estiver navegando
  if (isNavigating) return;
  
  setIsNavigating(true);
  navigate(path);
  onNavigate?.();
  
  // Libera o estado após a transição
  setTimeout(() => setIsNavigating(false), 300);
};
```

**Mudanças:**
- Adicionado debounce de 300ms na navegação
- Previne cliques múltiplos rápidos no mesmo link
- Melhora a experiência do usuário ao evitar navegações duplicadas

## Arquivos Modificados

1. `/opt/apps-totum/app/src/pages/AgentsDashboard.tsx`
2. `/opt/apps-totum/app/src/components/layout/AppLayout.tsx`
3. `/opt/apps-totum/app/src/components/layout/AppSidebar.tsx`
4. `/opt/apps-totum/app/src/components/layout/AppSidebarContent.tsx`

## Testes

- Build realizado com sucesso ✅
- Nenhum erro de compilação ✅
- Padrão de código mantido ✅

## Como Testar

1. Navegue rapidamente entre as páginas clicando múltiplas vezes no menu "Agentes"
2. A tela branca não deve mais ocorrer
3. A navegação deve ser suave e responsiva
