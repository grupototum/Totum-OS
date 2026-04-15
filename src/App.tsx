import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet, useParams } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PageSkeleton } from "@/components/loading/PageSkeleton";

// Auth Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Core Pages
import Hub from "./pages/Hub";
import NotFound from "./pages/NotFound";

// Lazy load major pages for performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AgentsDashboard = lazy(() => import("./pages/agents/AgentsDashboard"));
const AgentDetail = lazy(() => import("./pages/agents/AgentDetail"));
const AgentElizaOSEdit = lazy(() => import("./pages/agents/AgentElizaOSEdit"));
const AgentChatLayout = lazy(() => import("./components/chat/AgentChatLayout"));

// Tasks - Unificado (QuadroTarefas é a versão com Supabase)
import QuadroTarefas from "./pages/QuadroTarefas";

// Content & Office
import ContentPipeline from "./pages/ContentPipeline";
import OfficeView from "./pages/OfficeView";
import TeamStructure from "./pages/TeamStructure";
import EstruturaTime from "./pages/EstruturaTime";

// Lazy load secondary pages
const DocsPage = lazy(() => import("./pages/docs"));
const ClientsCenter = lazy(() => import("./pages/ClientsCenter"));
const EditClient = lazy(() => import("./pages/EditClient"));
const AlexandriaPage = lazy(() => import("./pages/alexandria"));

// Other Pages
import ClaudeCode from "./pages/ClaudeCode";
import SettingsPage from "./pages/Settings";
import PopSlaPage from "./pages/PopSla";
import DicasPage from "./pages/DicasPage";
import RecursosPage from "./pages/RecursosPage";
import ActionPlan from "./pages/ActionPlan";
import NewClient from "./pages/NewClient";
import AdaPage from "./pages/ada";

// Stark Industries + Workspace + IA Tools
import StarkIndustries from "./pages/dashboard/StarkIndustries";
import GoogleDriveEmbed from "./pages/workspace/GoogleDriveEmbed";
import TaskRecurrence from "./pages/workspace/TaskRecurrence";
import DeploymentChecklist from "./pages/workspace/DeploymentChecklist";
import CraudioCodete from "./pages/iatools/CraudioCodete";
import HostingPanel from "./pages/HostingPanel";
import Operadores from "./pages/settings/Operadores";

// Alexandria - Agora integrado no sistema unificado (sem layout separado)
import WikiAlexandria from "./pages/WikiAlexandria";
import GilesChat from "./pages/GilesChat";
import ContextHubPage from "./pages/alexandria/ContextHubPage";
import PopsPortal from "./pages/alexandria/PopsPortal";
import SkillsCentral from "./pages/alexandria/SkillsCentral";
import OpenClawDashboard from "./pages/alexandria/OpenClawDashboard";

// Redirect helpers para rotas com params
const RedirectToAgentDetail = () => {
  const { agentId, agenteId } = useParams();
  return <Navigate to={`/agents/${agentId || agenteId}`} replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* ============================
                ESTRUTURA UNIFICADA DE AGENTES
                ============================ */}
            <Route path="/agents" element={
              <Suspense fallback={<PageSkeleton />}>
                <AgentsDashboard />
              </Suspense>
            } />
            <Route path="/agents/:agentId" element={
              <Suspense fallback={<PageSkeleton />}>
                <AgentDetail />
              </Suspense>
            } />
            <Route path="/agents/:agentId/chat" element={
              <Suspense fallback={<PageSkeleton />}>
                <AgentChatLayout />
              </Suspense>
            } />
            <Route path="/agents/elizaos/:agentId/edit" element={
              <Suspense fallback={<PageSkeleton />}>
                <AgentElizaOSEdit />
              </Suspense>
            } />

            {/* ============================
                REDIRECTS DE COMPATIBILIDADE (Agentes)
                ============================ */}
            {/* Hub → Agents */}
            <Route path="/hub-agentes" element={<Navigate to="/agents" replace />} />
            <Route path="/painel-agentes" element={<Navigate to="/agents" replace />} />
            <Route path="/agents-dashboard" element={<Navigate to="/agents" replace />} />
            {/* Detalhe de agente (rotas antigas) → /agents/:id */}
            <Route path="/agentes/:agentId" element={<RedirectToAgentDetail />} />
            <Route path="/agentes/:agentId/:subId" element={<RedirectToAgentDetail />} />
            <Route path="/agente/:agenteId" element={<RedirectToAgentDetail />} />
            <Route path="/agent-profile/:agentId" element={<RedirectToAgentDetail />} />
            {/* Chat antigo → dinâmico */}
            <Route path="/agent/radar" element={<Navigate to="/agents/radar/chat" replace />} />
            <Route path="/agent/gestor" element={<Navigate to="/agents/gestor/chat" replace />} />
            <Route path="/agent/social" element={<Navigate to="/agents/social/chat" replace />} />
            <Route path="/agent/atendente" element={<Navigate to="/agents/atendente/chat" replace />} />
            <Route path="/agent/sdr" element={<Navigate to="/agents/sdr/chat" replace />} />
            <Route path="/agent/kimi" element={<Navigate to="/agents/kimi/chat" replace />} />
            <Route path="/agent/ads-extractor" element={<Navigate to="/agents/ads-extractor/chat" replace />} />

            {/* ============================
                CORE PAGES
                ============================ */}
            <Route path="/hub" element={<Hub />} />
            <Route path="/dashboard" element={
              <Suspense fallback={<PageSkeleton />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="/docs" element={
              <Suspense fallback={<PageSkeleton />}>
                <DocsPage />
              </Suspense>
            } />
            <Route path="/content" element={<ContentPipeline />} />
            <Route path="/office" element={<OfficeView />} />
            <Route path="/team" element={<TeamStructure />} />
            <Route path="/estrutura-time" element={<EstruturaTime />} />
            <Route path="/claude-code" element={<ClaudeCode />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* ============================
                TAREFAS (unificado em /tasks)
                ============================ */}
            <Route path="/tasks" element={<QuadroTarefas />} />
            <Route path="/quadro-tarefas" element={<Navigate to="/tasks" replace />} />

            {/* ============================
                OUTRAS PÁGINAS
                ============================ */}
            <Route path="/pop-sla" element={<PopSlaPage />} />
            <Route path="/dicas" element={<DicasPage />} />
            <Route path="/recursos" element={<RecursosPage />} />
            <Route path="/recursos/:resourceId" element={<RecursosPage />} />
            <Route path="/action-plan" element={<ActionPlan />} />
            <Route path="/new-client" element={<NewClient />} />
            <Route path="/clients" element={
              <Suspense fallback={<PageSkeleton />}>
                <ClientsCenter />
              </Suspense>
            } />
            <Route path="/edit-client/:clientId" element={
              <Suspense fallback={<PageSkeleton />}>
                <EditClient />
              </Suspense>
            } />
            <Route path="/ada" element={<AdaPage />} />

            {/* ============================
                STARK / WORKSPACE / IA TOOLS
                ============================ */}
            <Route path="/stark" element={<StarkIndustries />} />
            <Route path="/google-drive" element={<GoogleDriveEmbed />} />
            <Route path="/task-recurrence" element={<TaskRecurrence />} />
            <Route path="/deployment" element={<DeploymentChecklist />} />
            <Route path="/craudio-codete" element={<CraudioCodete />} />
            <Route path="/operadores" element={<Operadores />} />
            <Route path="/hosting" element={<HostingPanel />} />

            {/* ============================
                ALEXANDRIA - INTEGRADO NO SISTEMA UNIFICADO
                Rotas planas (sem layout aninhado)
                ============================ */}
            <Route path="/wiki" element={<WikiAlexandria />} />
            <Route path="/giles" element={<GilesChat />} />
            <Route path="/alexandria" element={
              <Suspense fallback={<PageSkeleton />}>
                <AlexandriaPage />
              </Suspense>
            } />
            <Route path="/alexandria/pops" element={<PopsPortal />} />
            <Route path="/alexandria/context" element={<ContextHubPage />} />
            <Route path="/alexandria/skills" element={<SkillsCentral />} />
            <Route path="/alexandria/openclaw" element={<OpenClawDashboard />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
