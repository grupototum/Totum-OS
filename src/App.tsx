import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Hub from "./pages/Hub";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
// Agent chats - refatorados para usar AgentChatLayout dinâmico
import RadarInsightsChat from "./pages/agents/RadarInsightsChat";
import GestorTrafegoChat from "./pages/agents/GestorTrafegoChat";
import PlanejamentoSocialChat from "./pages/agents/PlanejamentoSocialChat";
import AtendenteTotumChat from "./pages/agents/AtendenteTotumChat";
import SdrComercialChat from "./pages/agents/SdrComercialChat";
import KimiChat from "./pages/agents/KimiChat";
import RadarAnunciosChat from "./pages/agents/RadarAnunciosChat";
// Novo AgentChatLayout para agentes do Supabase
import AgentChatLayout from "./components/chat/AgentChatLayout";
import TasksBoard from "./pages/TasksBoard";
import QuadroTarefas from "./pages/QuadroTarefas";
import ContentPipeline from "./pages/ContentPipeline";
import OfficeView from "./pages/OfficeView";
import TeamStructure from "./pages/TeamStructure";
import ClaudeCode from "./pages/ClaudeCode";
import SettingsPage from "./pages/Settings";
import AgentParentPage from "./pages/AgentParentPage";
import SubAgentPage from "./pages/SubAgentPage";
import PopSlaPage from "./pages/PopSla";
import DicasPage from "./pages/DicasPage";
import RecursosPage from "./pages/RecursosPage";
import AgentsDashboard from "./pages/agents/AgentsDashboard";
import AgentDetail from "./pages/agents/AgentDetail";
import ActionPlan from "./pages/ActionPlan";
import NewClient from "./pages/NewClient";
import ClientsCenter from "./pages/ClientsCenter";
import AgentProfile from "./pages/AgentProfile";
import EditClient from "./pages/EditClient";
import AdaPage from "./pages/ada";
// Alexandria - Wiki e Chat
import WikiAlexandria from "./pages/WikiAlexandria";
import GilesChat from "./pages/GilesChat";
// Central de Agentes - Novas páginas
import PainelAgentes from "./pages/PainelAgentes";
import HubAgentes from "./pages/HubAgentes";
import EstruturaTime from "./pages/EstruturaTime";
import AgenteDetail from "./pages/AgenteDetail";
// Stark Industries + Workspace + IA Tools + Settings
import StarkIndustries from "./pages/dashboard/StarkIndustries";
import GoogleDriveEmbed from "./pages/workspace/GoogleDriveEmbed";
import TaskRecurrence from "./pages/workspace/TaskRecurrence";
import DeploymentChecklist from "./pages/workspace/DeploymentChecklist";
import CraudioCodete from "./pages/iatools/CraudioCodete";
import HostingPanel from "./pages/HostingPanel";
import Operadores from "./pages/settings/Operadores";
// Alexandria - Novas páginas transplantadas
import AlexandriaLayout from "./components/layout/AlexandriaLayout";
import AlexandriaPage from "./pages/alexandria";
import AlexandriaDashboard from "./pages/alexandria/Dashboard";
import ContextHub from "./pages/alexandria/ContextHub";
import PopsPortal from "./pages/alexandria/PopsPortal";
import SkillsCentral from "./pages/alexandria/SkillsCentral";
import OpenClawDashboard from "./pages/alexandria/OpenClawDashboard";

// Wrapper para páginas do Alexandria com layout
const AlexandriaRoutes = () => (
  <AlexandriaLayout>
    <Outlet />
  </AlexandriaLayout>
);

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
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/hub" element={<Hub />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/agent/radar" element={<RadarInsightsChat />} />
            <Route path="/agent/gestor" element={<GestorTrafegoChat />} />
            <Route path="/agent/social" element={<PlanejamentoSocialChat />} />
            <Route path="/agent/atendente" element={<AtendenteTotumChat />} />
            <Route path="/agent/sdr" element={<SdrComercialChat />} />
            <Route path="/agent/kimi" element={<KimiChat />} />
            <Route path="/agent/ads-extractor" element={<RadarAnunciosChat />} />
            <Route path="/tasks" element={<TasksBoard />} />
            <Route path="/quadro-tarefas" element={<QuadroTarefas />} />
            <Route path="/content" element={<ContentPipeline />} />
            <Route path="/office" element={<OfficeView />} />
            <Route path="/team" element={<TeamStructure />} />
            <Route path="/claude-code" element={<ClaudeCode />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Agent hierarchy */}
            <Route path="/agentes/:agentId" element={<AgentParentPage />} />
            <Route path="/agentes/:agentId/:subId" element={<SubAgentPage />} />
            {/* New pages */}
            <Route path="/pop-sla" element={<PopSlaPage />} />
            <Route path="/dicas" element={<DicasPage />} />
            <Route path="/recursos" element={<RecursosPage />} />
            <Route path="/recursos/:resourceId" element={<RecursosPage />} />
            <Route path="/agents-dashboard" element={<AgentsDashboard />} />
            <Route path="/action-plan" element={<ActionPlan />} />
            <Route path="/new-client" element={<NewClient />} />
            <Route path="/clients" element={<ClientsCenter />} />
            <Route path="/agent-profile/:agentId" element={<AgentProfile />} />
            <Route path="/edit-client/:clientId" element={<EditClient />} />
            <Route path="/ada" element={<AdaPage />} />
            {/* Central de Agentes - Novas rotas */}
            <Route path="/painel-agentes" element={<PainelAgentes />} />
            <Route path="/hub-agentes" element={<HubAgentes />} />
            <Route path="/estrutura-time" element={<EstruturaTime />} />
            <Route path="/agente/:agenteId" element={<AgenteDetail />} />
            {/* NOVA ESTRUTURA UNIFICADA DE AGENTES */}
            <Route path="/agents" element={<AgentsDashboard />} />
            <Route path="/agents/:agentId" element={<AgentDetail />} />
            {/* Chat dinâmico dos agentes do Supabase */}
            <Route path="/agents/:agentId/chat" element={<AgentChatLayout />} />
            {/* Redirecionamentos para compatibilidade */}
            <Route path="/agents-dashboard" element={<Navigate to="/agents" replace />} />
            {/* Stark Industries */}
            <Route path="/stark" element={<StarkIndustries />} />
            {/* Workspace */}
            <Route path="/google-drive" element={<GoogleDriveEmbed />} />
            <Route path="/task-recurrence" element={<TaskRecurrence />} />
            <Route path="/deployment" element={<DeploymentChecklist />} />
            {/* Ferramentas IA */}
            <Route path="/craudio-codete" element={<CraudioCodete />} />
            {/* Configurações */}
            <Route path="/operadores" element={<Operadores />} />
            {/* Alexandria - Wiki e Chat com GILES */}
            <Route path="/wiki" element={<WikiAlexandria />} />
            <Route path="/giles" element={<GilesChat />} />
            
            {/* Alexandria - Novas rotas transplantadas com layout */}
            <Route path="/alexandria" element={<AlexandriaRoutes />}>
              <Route index element={<AlexandriaPage />} />
              <Route path="pops" element={<PopsPortal />} />
              <Route path="context" element={<ContextHub />} />
              <Route path="skills" element={<SkillsCentral />} />
              <Route path="openclaw" element={<OpenClawDashboard />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
