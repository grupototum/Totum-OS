import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import RadarInsightsChat from "./pages/agents/RadarInsightsChat";
import GestorTrafegoChat from "./pages/agents/GestorTrafegoChat";
import PlanejamentoSocialChat from "./pages/agents/PlanejamentoSocialChat";
import AtendenteTotumChat from "./pages/agents/AtendenteTotumChat";
import SdrComercialChat from "./pages/agents/SdrComercialChat";
import KimiChat from "./pages/agents/KimiChat";
import RadarAnunciosChat from "./pages/agents/RadarAnunciosChat";
import TasksBoard from "./pages/TasksBoard";
import ContentPipeline from "./pages/ContentPipeline";
import OfficeView from "./pages/OfficeView";
import TeamStructure from "./pages/TeamStructure";
import ClaudeCode from "./pages/ClaudeCode";
import SettingsPage from "./pages/Settings";

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
            <Route path="/content" element={<ContentPipeline />} />
            <Route path="/office" element={<OfficeView />} />
            <Route path="/team" element={<TeamStructure />} />
            <Route path="/claude-code" element={<ClaudeCode />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
