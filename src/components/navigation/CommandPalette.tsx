/**
 * CommandPalette — Global search & navigation palette
 * Triggered by Cmd+K (Mac) / Ctrl+K (Windows/Linux)
 */
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard, Bot, BookOpen, KanbanSquare, GitBranch,
  Building2, Terminal, Users, Settings, FileText, Brain,
  Sparkles, Cloud, Library, Server, UserPlus, Contact,
  Shield, Home, Cpu, UserCog, CalendarClock, FolderOpen,
  CheckSquare, BookMarked, Lightbulb, ClipboardList,
} from "lucide-react";

interface CommandEntry {
  id: string;
  label: string;
  group: string;
  path: string;
  icon: React.ElementType;
  keywords?: string;
}

const COMMANDS: CommandEntry[] = [
  // Principal
  { id: "dashboard", label: "Dashboard", group: "Principal", path: "/dashboard", icon: LayoutDashboard, keywords: "home inicio" },
  { id: "hub", label: "Hub de Agentes", group: "Principal", path: "/hub", icon: Home },
  { id: "office", label: "Visão do Escritório", group: "Principal", path: "/office", icon: Building2 },
  { id: "stark", label: "Stark Industries", group: "Principal", path: "/stark", icon: Shield, keywords: "vps infra server" },

  // Agentes
  { id: "agents", label: "Painel de Agentes", group: "Agentes", path: "/agents", icon: Bot, keywords: "agents dashboard" },
  { id: "estrutura-time", label: "Estrutura do Time", group: "Agentes", path: "/estrutura-time", icon: Users, keywords: "team time" },

  // Alexandria
  { id: "alexandria", label: "Alexandria", group: "Alexandria", path: "/alexandria", icon: BookOpen, keywords: "base conhecimento knowledge" },
  { id: "hermione", label: "Hermione", group: "Alexandria", path: "/hermione", icon: Sparkles, keywords: "chat ia giles knowledge base" },
  { id: "alexandria-pops", label: "Portal POPs", group: "Alexandria", path: "/alexandria/pops", icon: FileText, keywords: "procedimentos operacionais" },
  { id: "alexandria-context", label: "Context HUB", group: "Alexandria", path: "/alexandria/context", icon: Brain, keywords: "contexto rag embeddings" },
  { id: "alexandria-skills", label: "Skills Central", group: "Alexandria", path: "/alexandria/skills", icon: Lightbulb, keywords: "habilidades skills" },
  { id: "alexandria-openclaw", label: "OpenClaw Dashboard", group: "Alexandria", path: "/alexandria/openclaw", icon: Cloud, keywords: "gateway openclaw" },
  { id: "docs", label: "Documentação", group: "Alexandria", path: "/docs", icon: BookMarked, keywords: "docs documentation guias" },

  // Trabalho
  { id: "tasks", label: "Quadro de Tarefas", group: "Trabalho", path: "/tasks", icon: KanbanSquare, keywords: "kanban tarefas tasks board" },
  { id: "content", label: "Pipeline de Conteúdo", group: "Trabalho", path: "/content", icon: GitBranch, keywords: "conteudo pipeline" },
  { id: "action-plan", label: "Plano de Ação", group: "Trabalho", path: "/action-plan", icon: ClipboardList, keywords: "plano acao goals" },
  { id: "deployment", label: "Checklist Deploy", group: "Trabalho", path: "/deployment", icon: CheckSquare, keywords: "deploy checklist release" },
  { id: "task-recurrence", label: "Recorrência de Tarefas", group: "Trabalho", path: "/task-recurrence", icon: CalendarClock, keywords: "recorrencia tarefas agendamento" },

  // Clientes
  { id: "clients", label: "Central de Clientes", group: "Clientes", path: "/clients", icon: Contact, keywords: "clientes crm" },
  { id: "new-client", label: "Novo Cliente", group: "Clientes", path: "/new-client", icon: UserPlus, keywords: "novo cliente add" },

  // IA Tools
  { id: "claude-code", label: "Claude Code", group: "IA Tools", path: "/claude-code", icon: Terminal, keywords: "ai code claudecode" },
  { id: "craudio-codete", label: "Cráudio Codete", icon: Cpu, group: "IA Tools", path: "/craudio-codete", keywords: "audio codete ia" },
  { id: "ada", label: "ADA", group: "IA Tools", path: "/ada", icon: Brain, keywords: "ada assistente" },

  // Infraestrutura
  { id: "hosting", label: "Painel de Hosting", group: "Infra", path: "/hosting", icon: Server, keywords: "hosting vps server cloud" },
  { id: "google-drive", label: "Google Drive", group: "Infra", path: "/google-drive", icon: FolderOpen, keywords: "drive arquivos files" },

  // Configurações
  { id: "settings", label: "Configurações", group: "Config", path: "/settings", icon: Settings, keywords: "settings configuracoes" },
  { id: "operadores", label: "Operadores", group: "Config", path: "/operadores", icon: UserCog, keywords: "operadores usuarios" },
  { id: "pop-sla", label: "POP e SLA", group: "Config", path: "/pop-sla", icon: FileText, keywords: "pop sla procedimentos" },
  { id: "dicas", label: "Dicas & Recursos", group: "Config", path: "/dicas", icon: Lightbulb, keywords: "dicas recursos tips" },
];

// Agrupa mantendo a ordem de aparição
function groupCommands(commands: CommandEntry[]) {
  const groups: Record<string, CommandEntry[]> = {};
  for (const cmd of commands) {
    if (!groups[cmd.group]) groups[cmd.group] = [];
    groups[cmd.group].push(cmd);
  }
  return groups;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: Props) {
  const navigate = useNavigate();

  const runCommand = useCallback(
    (path: string) => {
      onOpenChange(false);
      navigate(path);
    },
    [navigate, onOpenChange]
  );

  const grouped = groupCommands(COMMANDS);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar página ou ação..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        {Object.entries(grouped).map(([group, items], idx) => (
          <span key={group}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.label} ${item.keywords ?? ""} ${item.path}`}
                  onSelect={() => runCommand(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4 shrink-0 opacity-70" />
                  <span>{item.label}</span>
                  <CommandShortcut className="text-[10px] opacity-40">{item.path}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </span>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

/**
 * Hook to manage palette open state + Cmd/Ctrl+K keyboard shortcut.
 * Mount this once at app level.
 */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return { open, setOpen };
}
