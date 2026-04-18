import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { usePageTransition } from "@/hooks/usePageTransition";
import { Building2, Users, Monitor, CircleDot, Footprints, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import PixelOfficeCanvas from "@/components/pixel-office/PixelOfficeCanvas";
import type { OfficeAgent } from "@/components/pixel-office/types";
import agentsRegistry from "@/lib/agents-registry.json";

const tierColors: Record<number, string> = {
  1: "#ef4444", // red-500
  2: "#f59e0b", // amber-500
  3: "#10b981", // emerald-500
};

function toOfficeAgents(filterText = ""): OfficeAgent[] {
  const entries = Object.entries(agentsRegistry as Record<string, any>);
  return entries
    .filter(([_, a]) => {
      if (!filterText) return true;
      const q = filterText.toLowerCase();
      return (
        (a.name || "").toLowerCase().includes(q) ||
        (a.bio || "").toLowerCase().includes(q)
      );
    })
    .slice(0, 24) // max 24 agents in office
    .map(([id, a], i) => ({
      id,
      name: a.name || id,
      emoji: a.emoji || "🤖",
      color: tierColors[a.tier || 2] || "#9ca3af",
      tier: a.tier || 2,
      col: 0,
      row: 0,
      targetCol: 0,
      targetRow: 0,
      state: "idle" as const,
      dir: (Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3),
      path: [],
      moveProgress: 0,
      frame: 0,
      frameTimer: 0,
      wanderTimer: Math.random() * 3,
      isActive: false,
      seatCol: null,
      seatRow: null,
      selected: false,
      hover: false,
    }));
}

const stateLabels: Record<string, string> = {
  idle: "Ocioso",
  walk: "Caminhando",
  type: "Digitando",
  read: "Lendo",
};

const stateIcons: Record<string, React.ReactNode> = {
  idle: <CircleDot className="h-3 w-3" />,
  walk: <Footprints className="h-3 w-3" />,
  type: <Monitor className="h-3 w-3" />,
  read: <BookOpen className="h-3 w-3" />,
};

export default function OfficeView() {
  const navigate = useNavigate();
  const pageTransition = usePageTransition();
  const [search, setSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<OfficeAgent | null>(null);
  const [agents, setAgents] = useState<OfficeAgent[]>([]);

  useEffect(() => {
    setAgents(toOfficeAgents(search));
  }, [search]);

  const stats = useMemo(() => {
    const byState: Record<string, number> = {};
    for (const a of agents) {
      byState[a.state] = (byState[a.state] || 0) + 1;
    }
    return { total: agents.length, byState };
  }, [agents]);

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="h-[calc(100vh-4rem)] flex gap-0">
        {/* Sidebar — lista de agentes no escritório */}
        <aside className="w-72 border-r bg-card flex flex-col shrink-0">
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-accent" />
              <h2 className="font-semibold text-lg">Pixel Office</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Escritório virtual dos agentes da Totum
            </p>
            <Input
              placeholder="Buscar agente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm"
            />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>
                {stats.total} agente{stats.total !== 1 ? "s" : ""} no escritório
              </span>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {agents.map((agent) => {
                const isActive = selectedAgent?.id === agent.id;
                return (
                  <motion.button
                    key={agent.id}
                    layout
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors ${
                      isActive
                        ? "bg-accent/10 border border-accent/20"
                        : "hover:bg-accent/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                        style={{ backgroundColor: agent.color }}
                      >
                        {agent.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium truncate">
                            {agent.name}
                          </span>
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5">
                            T{agent.tier}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-muted-foreground">
                            {stateIcons[agent.state]}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {stateLabels[agent.state]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Selected agent detail */}
          {selectedAgent && (
            <div className="p-3 border-t space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedAgent.emoji}</span>
                <div>
                  <p className="text-sm font-semibold">{selectedAgent.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Tier {selectedAgent.tier} · {stateLabels[selectedAgent.state]}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/agents/${selectedAgent.id}`)}
                className="w-full text-xs bg-primary text-primary-foreground rounded-md py-1.5 hover:bg-primary/90 transition-colors"
              >
                Ver perfil →
              </button>
            </div>
          )}
        </aside>

        {/* Canvas area */}
        <main className="flex-1 p-4">
          <PixelOfficeCanvas
            agents={agents}
            onSelectAgent={(agent) => setSelectedAgent(agent)}
          />
        </main>
      </motion.div>
    </AppLayout>
  );
}
