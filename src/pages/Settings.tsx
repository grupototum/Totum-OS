import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageBreadcrumb } from "@/components/navigation/PageBreadcrumb";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Cpu,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Import tabs
import {
  ProfileTab,
  NotificationsTab,
  SecurityTab,
  AppearanceTab,
  SystemTab,
} from "./settings/tabs";

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType;
}

const tabs: Tab[] = [
  { id: "profile", label: "Perfil", icon: User, component: ProfileTab },
  { id: "notifications", label: "Notificações", icon: Bell, component: NotificationsTab },
  { id: "security", label: "Segurança", icon: Shield, component: SecurityTab },
  { id: "appearance", label: "Aparência", icon: Palette, component: AppearanceTab },
  { id: "system", label: "Sistema", icon: Cpu, component: SystemTab },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || ProfileTab;

  return (
    <AppLayout>
      <PageBreadcrumb />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-sans text-2xl font-medium text-foreground tracking-tight">
                  Configurações
                </h1>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  Gerencie suas preferências e conta
                </p>
              </div>
            </div>
          </motion.div>

          {/* Layout with Sidebar Tabs */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Tabs */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-64 shrink-0"
            >
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                        isActive
                          ? "bg-sidebar-accent text-primary border-l-2 border-primary"
                          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>

            {/* Content Area */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-w-0"
            >
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
                <ActiveComponent />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
