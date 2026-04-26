import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const routeMappings: Record<string, BreadcrumbItem[]> = {
  "/hub": [{ label: "Hub" }],
  "/dashboard": [{ label: "Dashboard" }],
  "/agents": [{ label: "Agentes" }],
  "/tasks": [{ label: "Tarefas" }],
  "/content": [{ label: "Pipeline de Conteúdo" }],
  "/office": [{ label: "Escritório" }],
  "/team": [{ label: "Estrutura do Time" }],
  "/settings": [{ label: "Configurações" }],
  "/alexandria": [{ label: "Alexandria" }],
  "/hermione": [{ label: "Alexandria", path: "/alexandria" }, { label: "Hermione" }],
  "/alexandria/pops": [{ label: "Alexandria", path: "/alexandria" }, { label: "Portal POPs" }],
  "/alexandria/context": [{ label: "Alexandria", path: "/alexandria" }, { label: "Context HUB" }],
  "/alexandria/skills": [{ label: "Alexandria", path: "/alexandria" }, { label: "Skills" }],
  "/alexandria/openclaw": [{ label: "Alexandria", path: "/alexandria" }, { label: "OpenClaw" }],
  "/clients": [{ label: "Clientes" }],
  "/new-client": [{ label: "Clientes", path: "/clients" }, { label: "Novo Cliente" }],
  "/hosting": [{ label: "Hosting" }],
  "/claude-code": [{ label: "Claude Code" }],
  "/pop-sla": [{ label: "POPs & SLAs" }],
  "/dicas": [{ label: "Dicas & Recursos" }],
  "/recursos": [{ label: "Recursos Centrais" }],
  "/action-plan": [{ label: "Plano de Ação" }],
};

export function PageBreadcrumb({ className }: { className?: string }) {
  const location = useLocation();
  const pathname = location.pathname;

  // Get breadcrumb items for current route
  const items = routeMappings[pathname] || [{ label: getDefaultLabel(pathname) }];

  // Add Home as first item
  const breadcrumbItems: BreadcrumbItem[] = [{ label: "Início", path: "/hub" }, ...items];

  return (
    <nav
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground py-2 px-4 border-b border-zinc-800 bg-zinc-900/30",
        className
      )}
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const isFirst = index === 0;

        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            )}
            
            {isLast || !item.path ? (
              <span
                className={cn(
                  "font-medium",
                  isLast ? "text-white" : "text-zinc-400"
                )}
              >
                {isFirst && <Home className="w-4 h-4 inline mr-1" />}
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {isFirst && <Home className="w-4 h-4 inline mr-1" />}
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function getDefaultLabel(pathname: string): string {
  // Extract last part of path and capitalize
  const parts = pathname.split("/").filter(Boolean);
  const lastPart = parts[parts.length - 1] || "Página";
  return lastPart
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default PageBreadcrumb;
