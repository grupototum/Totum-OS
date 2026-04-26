/**
 * CommandPalette — Global search & navigation palette
 * Triggered by Cmd+K (Mac) / Ctrl+K (Windows/Linux)
 *
 * Primary entries are derived from `src/config/navigation.ts` (single source of
 * truth shared with the sidebar). "Extras" below cover routes that aren't in
 * the sidebar but are still reachable.
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
  Terminal, FileText, Brain, Server, CalendarClock, FolderOpen,
  CheckSquare, Lightbulb, Cpu,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";
import { getCommandPaletteEntries, type CommandPaletteEntry } from "@/config/navigation";

interface CommandEntry {
  id: string;
  label: string;
  group: string;
  path: string;
  icon: LucideIcon;
  keywords?: string;
}

// Routes not present in the sidebar but still navigable
const EXTRA_COMMANDS: CommandEntry[] = [
  { id: "extra-deployment", label: "Checklist Deploy", group: "Operações", path: "/deployment", icon: CheckSquare, keywords: "deploy checklist release" },
  { id: "extra-command", label: "AI Command Center", group: "AI Command", path: "/ai-command-center", icon: MessageSquareText, keywords: "chat agentes llm comando" },
  { id: "extra-task-recurrence", label: "Recorrência de Tarefas", group: "Operações", path: "/task-recurrence", icon: CalendarClock, keywords: "recorrencia tarefas agendamento" },
  { id: "extra-claude-code", label: "Claude Code", group: "Sistema", path: "/claude-code", icon: Terminal, keywords: "ai code claudecode" },
  { id: "extra-craudio", label: "Cráudio Codete", group: "Sistema", path: "/craudio-codete", icon: Cpu, keywords: "audio codete ia" },
  { id: "extra-ada", label: "ADA", group: "Sistema", path: "/ada", icon: Brain, keywords: "ada assistente" },
  { id: "extra-hosting", label: "Painel de Hosting", group: "Sistema", path: "/hosting", icon: Server, keywords: "hosting vps server cloud" },
  { id: "extra-google-drive", label: "Google Drive", group: "Operações", path: "/google-drive", icon: FolderOpen, keywords: "drive arquivos files" },
  { id: "extra-pop-sla", label: "POP e SLA", group: "Sistema", path: "/pop-sla", icon: FileText, keywords: "pop sla procedimentos" },
  { id: "extra-dicas", label: "Dicas & Recursos", group: "Sistema", path: "/dicas", icon: Lightbulb, keywords: "dicas recursos tips" },
];

function buildAllCommands(): CommandEntry[] {
  const navEntries: CommandEntry[] = getCommandPaletteEntries().map((e: CommandPaletteEntry) => ({
    id: e.id,
    label: e.label,
    group: e.group,
    path: e.path,
    icon: e.icon,
  }));

  // Dedupe by path — nav is authoritative
  const seen = new Set(navEntries.map((e) => e.path));
  const extras = EXTRA_COMMANDS.filter((e) => !seen.has(e.path));

  return [...navEntries, ...extras];
}

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

  const grouped = groupCommands(buildAllCommands());

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
