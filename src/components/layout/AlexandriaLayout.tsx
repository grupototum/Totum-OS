import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  FileText,
  Zap,
  LogOut,
  Menu,
  X,
  Home,
  Search,
  BarChart3,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AlexandriaLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  description?: string;
  children?: { label: string; href: string; icon: React.ElementType }[];
}

export default function AlexandriaLayout({ children }: AlexandriaLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    alexandria: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Apenas Alexandria na navegação — sem Workspace, Agentes, Configurações
  const navigationItems: NavItem[] = [
    {
      label: 'Home',
      href: '/hub',
      icon: Home,
      description: 'Dashboard principal'
    },
    {
      label: 'Alexandria',
      href: '/alexandria',
      icon: BookOpen,
      description: 'Central de conhecimento',
      children: [
        { label: 'Dashboard', href: '/alexandria', icon: BarChart3 },
        { label: 'Portal POPs', href: '/alexandria/pops', icon: FileText },
        { label: 'Context HUB', href: '/alexandria/context', icon: BookOpen },
        { label: 'Central Skills', href: '/alexandria/skills', icon: Zap },
        { label: 'OpenClaw', href: '/alexandria/openclaw', icon: BarChart3 },
      ]
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const isSectionActive = (item: NavItem) => {
    if (!item.children) return isActive(item.href);
    return item.children.some(child => isActive(child.href));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center font-bold text-sm text-primary-foreground">
                A
              </div>
              <span className="font-semibold text-foreground tracking-tight">Alexandria</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const sectionKey = item.label.toLowerCase().replace(' ', '');
            const isExpanded = expandedSections[sectionKey];
            const sectionActive = isSectionActive(item);

            if (!sidebarOpen) {
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
                    sectionActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  title={item.label}
                >
                  <Icon size={20} />
                </button>
              );
            }

            if (hasChildren) {
              return (
                <div key={item.label} className="space-y-0.5">
                  <button
                    onClick={() => toggleSection(sectionKey)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      sectionActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="ml-3 space-y-0.5 border-l border-border pl-3">
                      {item.children?.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <button
                            key={child.href}
                            onClick={() => navigate(child.href)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-sm ${
                              isActive(child.href)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                          >
                            <ChildIcon size={14} />
                            <span>{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  sectionActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                title={item.label}
              >
                <Icon size={18} />
                {sidebarOpen && (
                  <div className="text-left">
                    <div className="text-sm font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground/70">{item.description}</div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-border space-y-2">
          {sidebarOpen && user && (
            <div className="px-3 py-2 text-sm">
              <div className="font-medium text-foreground truncate">{user.email}</div>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full border-border hover:bg-muted"
          >
            {sidebarOpen ? (
              <>
                <LogOut size={14} className="mr-2" />
                Sair
              </>
            ) : (
              <LogOut size={14} />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Alexandria</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-9 pr-4 py-1.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
