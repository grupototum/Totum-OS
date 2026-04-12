import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Auth Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Core Pages
import Hub from "./pages/Hub";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Agents - Estrutura Unificada
import AgentsDashboard from "./pages/agents/AgentsDashboard";
import AgentDetail from "./pages/agents/AgentDetail";
import AgentChatLayout from "./components/chat/AgentChatLayout";

// Tasks - Unificado (QuadroTarefas é a versão com Supabase)
import QuadroTarefas from "./pages/QuadroTarefas";

// Content & Office
import ContentPipeline from "./pages/ContentPipeline";
import OfficeView from "./pages/OfficeView";
import TeamStructure from "./pages/TeamStructure";
import EstruturaTime from "./pages/EstruturaTime";

// Other Pages
import ClaudeCode from "./pages/ClaudeCode";
import SettingsPage from "./pages/Settings";
import PopSlaPage from "./pages/PopSla";
import DicasPage from "./pages/DicasPage";
import RecursosPage from "./pages/RecursosPage";
import ActionPlan from "./pages/ActionPlan";
import NewClient from "./pages/NewClient";
import ClientsCenter from "./pages/ClientsCenter";
import EditClient from "./pages/EditClient";
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
import AlexandriaPage from "./pages/alexandria";
import ContextHub from "./pages/alexandria/ContextHub";
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
            <Route path="/agents" element={<AgentsDashboard />} />
            <Route path="/agents/:agentId" element={<AgentDetail />} />
            <Route path="/agents/:agentId/chat" element={<AgentChatLayout />} />

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
            <Route path="/dashboard" element={<Dashboard />} />
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
            <Route path="/clients" element={<ClientsCenter />} />
            <Route path="/edit-client/:clientId" element={<EditClient />} />
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
            <Route path="/alexandria" element={<AlexandriaPage />} />
            <Route path="/alexandria/pops" element={<PopsPortal />} />
            <Route path="/alexandria/context" element={<ContextHub />} />
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
