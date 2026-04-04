import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { DashboardGeral } from './components/dashboards/DashboardGeral';
import { DashboardAgente } from './components/dashboards/DashboardAgente';
import { DashboardComunicacao } from './components/dashboards/DashboardComunicacao';
import { DashboardConhecimento } from './components/dashboards/DashboardConhecimento';
import { cn } from './lib/utils';

type DashboardView = 'geral' | 'agente' | 'comunicacao' | 'conhecimento';

const navItems = [
  { id: 'geral' as DashboardView, label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'agente' as DashboardView, label: 'Por Agente', icon: Users },
  { id: 'comunicacao' as DashboardView, label: 'Comunicação', icon: MessageSquare },
  { id: 'conhecimento' as DashboardView, label: 'Conhecimento', icon: BookOpen },
];

function App() {
  const [currentView, setCurrentView] = useState<DashboardView>('geral');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderDashboard = () => {
    switch (currentView) {
      case 'geral':
        return <DashboardGeral />;
      case 'agente':
        return <DashboardAgente />;
      case 'comunicacao':
        return <DashboardComunicacao />;
      case 'conhecimento':
        return <DashboardConhecimento />;
      default:
        return <DashboardGeral />;
    }
  };

  return (
    <div className="min-h-screen bg-tot-bg flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          'bg-tot-card border-r border-tot-border transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-tot-border">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎛️</span>
              <span className="font-bold text-tot-text">TOT Dashboard</span>
            </div>
          ) : (
            <span className="text-2xl">🎛️</span>
          )}
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-tot-bg rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-tot-muted" />
            ) : (
              <Menu className="w-5 h-5 text-tot-muted" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive 
                    ? 'bg-tot-primary text-white' 
                    : 'text-tot-muted hover:bg-tot-bg hover:text-tot-text'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-tot-border">
            <p className="text-xs text-tot-muted text-center">
              Totum Operative Technology
            </p>
            <p className="text-xs text-tot-muted text-center mt-1">
              v1.0.0 • Data UI
            </p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderDashboard()}
      </main>
    </div>
  );
}

export default App;
