import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useParams } from "react-router-dom";
import { Suspense, lazy, type ReactNode } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PageSkeleton } from "@/components/loading/PageSkeleton";
import { ErrorBoundary, PageErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CommandPalette, useCommandPalette } from "@/components/navigation/CommandPalette";

// Auth Pages (públicas)
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import PendingApproval from "./pages/PendingApproval";
import NotFound from "./pages/NotFound";

// Lazy load — todas as páginas (reduz bundle inicial)
const Dashboard         = lazy(() => import("./pages/Dashboard"));
const AgentsDashboard   = lazy(() => import("./pages/agents/AgentsDashboard"));
const AgentDetail       = lazy(() => import("./pages/agents/AgentDetail"));
const AgentElizaOSEdit  = lazy(() => import("./pages/agents/AgentElizaOSEdit"));
const AICommandCenter   = lazy(() => import("./pages/AICommandCenter"));
const DocsPage          = lazy(() => import("./pages/docs"));
const ClientsCenter     = lazy(() => import("./pages/ClientsCenter"));
const EditClient        = lazy(() => import("./pages/EditClient"));
const AlexandriaPage    = lazy(() => import("./pages/alexandria"));

const QuadroTarefas     = lazy(() => import("./pages/QuadroTarefas"));
const ContentPipeline   = lazy(() => import("./pages/ContentPipeline"));
const OfficeView        = lazy(() => import("./pages/OfficeView"));
const SystemDiagram     = lazy(() => import("./pages/SystemDiagram"));
const ClaudeCode        = lazy(() => import("./pages/ClaudeCode"));
const SettingsPage      = lazy(() => import("./pages/Settings"));
const PopSlaPage        = lazy(() => import("./pages/PopSla"));
const DicasPage         = lazy(() => import("./pages/DicasPage"));
const RecursosPage      = lazy(() => import("./pages/RecursosPage"));
const ActionPlan        = lazy(() => import("./pages/ActionPlan"));
const NewClient         = lazy(() => import("./pages/NewClient"));
const AdaPage           = lazy(() => import("./pages/ada"));
const GoogleDriveEmbed  = lazy(() => import("./pages/workspace/GoogleDriveEmbed"));
const GoogleDriveCallback = lazy(() => import("./pages/workspace/GoogleDriveCallback"));
const TaskRecurrence    = lazy(() => import("./pages/workspace/TaskRecurrence"));
const DeploymentChecklist = lazy(() => import("./pages/workspace/DeploymentChecklist"));
const CraudioCodete     = lazy(() => import("./pages/iatools/CraudioCodete"));
const HostingPanel      = lazy(() => import("./pages/HostingPanel"));
const Operadores        = lazy(() => import("./pages/settings/Operadores"));
const HermioneChat      = lazy(() => import("./pages/HermioneChat"));
const ContextHubPage    = lazy(() => import("./pages/alexandria/ContextHubPage"));
const PopsPortal        = lazy(() => import("./pages/alexandria/PopsPortal"));
const SkillsCentral     = lazy(() => import("./pages/alexandria/SkillsCentral"));
const OpenClawDashboard = lazy(() => import("./pages/alexandria/OpenClawDashboard"));
const KnowledgeBridges  = lazy(() => import("./pages/alexandria/KnowledgeBridges"));
const AlexandriaTutorial = lazy(() => import("./pages/alexandria/AlexandriaTutorial"));
const SunaPage          = lazy(() => import("./pages/suna"));
const UserApprovals     = lazy(() => import("./pages/admin/UserApprovals"));

// Per-page error boundary + suspense wrapper
const Page = ({ children }: { children: ReactNode }) => (
  <PageErrorBoundary>
    <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
  </PageErrorBoundary>
);

// Redirect helper para rotas com params
const RedirectToAgentDetail = () => {
  const { agentId, agenteId } = useParams();
  return <Navigate to={`/agents/${agentId || agenteId}`} replace />;
};

const RedirectToAgentCommand = () => {
  const { agentId } = useParams();
  return <Navigate to={`/ai-command-center?agent=${agentId || "hermione"}`} replace />;
};

// Inner wrapper: needs BrowserRouter context for useNavigate inside CommandPalette
const AppWithRouter = () => {
  const { open, setOpen } = useCommandPalette();
  return (
    <>
      <CommandPalette open={open} onOpenChange={setOpen} />
      <Routes>
        {/* ============================
            ROTAS PÚBLICAS
            ============================ */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/google-drive/callback" element={<Page><GoogleDriveCallback /></Page>} />

        {/* ============================
            ROTAS PROTEGIDAS — exigem login
            ============================ */}
        <Route element={<ProtectedRoute />}>

          {/* Agentes */}
          <Route path="/ai-command-center" element={<Page><AICommandCenter /></Page>} />
          <Route path="/command-center" element={<Navigate to="/ai-command-center" replace />} />
          <Route path="/totum-chat" element={<Navigate to="/ai-command-center" replace />} />
          <Route path="/agents" element={<Page><AgentsDashboard /></Page>} />
          {/* Criação de agente — redirect de atalho para o editor elizaOS em modo "new" */}
          <Route path="/agents/new" element={<Navigate to="/agents/elizaos/new/edit" replace />} />
          <Route path="/agents/:agentId" element={<Page><AgentDetail /></Page>} />
          <Route path="/agents/:agentId/chat" element={<RedirectToAgentCommand />} />
          <Route path="/agents/elizaos/:agentId/edit" element={<Page><AgentElizaOSEdit /></Page>} />

          {/* Redirects de compatibilidade — Agentes */}
          <Route path="/hub-agentes" element={<Navigate to="/agents" replace />} />
          <Route path="/painel-agentes" element={<Navigate to="/agents" replace />} />
          <Route path="/agents-dashboard" element={<Navigate to="/agents" replace />} />
          <Route path="/agentes/:agentId" element={<RedirectToAgentDetail />} />
          <Route path="/agentes/:agentId/:subId" element={<RedirectToAgentDetail />} />
          <Route path="/agente/:agenteId" element={<RedirectToAgentDetail />} />
          <Route path="/agent-profile/:agentId" element={<RedirectToAgentDetail />} />
          <Route path="/agent/radar" element={<Navigate to="/ai-command-center?agent=radar" replace />} />
          <Route path="/agent/gestor" element={<Navigate to="/ai-command-center?agent=gestor" replace />} />
          <Route path="/agent/social" element={<Navigate to="/ai-command-center?agent=social" replace />} />
          <Route path="/agent/atendente" element={<Navigate to="/ai-command-center?agent=atendente" replace />} />
          <Route path="/agent/sdr" element={<Navigate to="/ai-command-center?agent=sdr" replace />} />
          <Route path="/agent/kimi" element={<Navigate to="/ai-command-center?agent=kimi" replace />} />
          <Route path="/agent/ads-extractor" element={<Navigate to="/ai-command-center?agent=ads-extractor" replace />} />

          {/* Páginas principais */}
          <Route path="/hub" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Page><Dashboard /></Page>} />
          <Route path="/docs" element={<Page><DocsPage /></Page>} />
          <Route path="/content" element={<Page><ContentPipeline /></Page>} />
          <Route path="/office" element={<Page><OfficeView /></Page>} />
          <Route path="/diagrama-sistemas" element={<Page><SystemDiagram /></Page>} />
          <Route path="/estrutura-time" element={<Navigate to="/diagrama-sistemas" replace />} />
          <Route path="/team" element={<Navigate to="/diagrama-sistemas" replace />} />
          <Route path="/claude-code" element={<Page><ClaudeCode /></Page>} />
          <Route path="/settings" element={<Page><SettingsPage /></Page>} />

          {/* Tarefas */}
          <Route path="/tasks" element={<Page><QuadroTarefas /></Page>} />
          <Route path="/quadro-tarefas" element={<Navigate to="/tasks" replace />} />

          {/* Outras páginas */}
          <Route path="/pop-sla" element={<Page><PopSlaPage /></Page>} />
          <Route path="/dicas" element={<Page><DicasPage /></Page>} />
          <Route path="/recursos" element={<Page><RecursosPage /></Page>} />
          <Route path="/recursos/:resourceId" element={<Page><RecursosPage /></Page>} />
          <Route path="/action-plan" element={<Page><ActionPlan /></Page>} />
          <Route path="/new-client" element={<Page><NewClient /></Page>} />
          <Route path="/clients" element={<Page><ClientsCenter /></Page>} />
          <Route path="/edit-client/:clientId" element={<Page><EditClient /></Page>} />
          <Route path="/ada" element={<Page><AdaPage /></Page>} />

          {/* Workspace / IA Tools */}
          <Route path="/google-drive" element={<Page><GoogleDriveEmbed /></Page>} />
          <Route path="/task-recurrence" element={<Page><TaskRecurrence /></Page>} />
          <Route path="/deployment" element={<Page><DeploymentChecklist /></Page>} />
          <Route path="/craudio-codete" element={<Page><CraudioCodete /></Page>} />
          <Route path="/operadores" element={<Page><Operadores /></Page>} />
          <Route path="/admin/approvals" element={<Page><UserApprovals /></Page>} />
          <Route path="/hosting" element={<Page><HostingPanel /></Page>} />

          {/* Alexandria */}
          <Route path="/alexandria" element={<Page><AlexandriaPage /></Page>} />
          <Route path="/alexandria/pops" element={<Page><PopsPortal /></Page>} />
          <Route path="/alexandria/context" element={<Page><ContextHubPage /></Page>} />
          <Route path="/alexandria/skills" element={<Page><SkillsCentral /></Page>} />
          <Route path="/alexandria/openclaw" element={<Page><OpenClawDashboard /></Page>} />
          <Route path="/alexandria/bridges" element={<Page><KnowledgeBridges /></Page>} />
          <Route path="/alexandria/tutorial" element={<Page><AlexandriaTutorial /></Page>} />
          <Route path="/hermione" element={<Page><HermioneChat /></Page>} />
          <Route path="/suna"    element={<Page><SunaPage /></Page>} />
          <Route path="/wiki" element={<Navigate to="/alexandria" replace />} />

        </Route>
        {/* ============================
            FIM DAS ROTAS PROTEGIDAS
            ============================ */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppWithRouter />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
