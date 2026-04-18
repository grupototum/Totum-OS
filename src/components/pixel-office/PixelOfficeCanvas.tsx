import { useRef, useEffect, useState, useCallback } from "react";
import { PixelOfficeEngine } from "./engine";
import type { OfficeAgent } from "./types";
import { TILE_SIZE, COLS, ROWS } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Monitor, Footprints, BookOpen, CircleDot } from "lucide-react";

interface PixelOfficeCanvasProps {
  agents: OfficeAgent[];
  onSelectAgent?: (agent: OfficeAgent | null) => void;
}

export default function PixelOfficeCanvas({ agents, onSelectAgent }: PixelOfficeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PixelOfficeEngine | null>(null);
  const [selected, setSelected] = useState<OfficeAgent | null>(null);

  // Init engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new PixelOfficeEngine(canvas);
    engineRef.current = engine;
    engine.start();

    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      engine.stop();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Sync agents
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const existing = new Set(engine.agents.keys());
    const incoming = new Set(agents.map((a) => a.id));

    // Remove old
    for (const id of existing) {
      if (!incoming.has(id)) engine.removeAgent(id);
    }

    // Add new
    for (const agent of agents) {
      if (!engine.agents.has(agent.id)) {
        engine.addAgent(agent);
      }
    }
  }, [agents]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const engine = engineRef.current;
    if (!engine) return;
    const rect = e.currentTarget.getBoundingClientRect();
    engine.handleMouseMove(e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const engine = engineRef.current;
      if (!engine) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const id = engine.handleClick(e.clientX - rect.left, e.clientY - rect.top);
      if (id) {
        const agent = engine.agents.get(id) || null;
        setSelected(agent);
        onSelectAgent?.(agent);
      } else {
        setSelected(null);
        onSelectAgent?.(null);
      }
    },
    [onSelectAgent]
  );

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const engine = engineRef.current;
    if (!engine) return;
    engine.handleWheel(e.deltaY, e.ctrlKey);
  }, []);

  const stateLabels: Record<string, string> = {
    idle: "Ocioso",
    walk: "Caminhando",
    type: "Digitando",
    read: "Lendo",
  };

  const stateIcons: Record<string, React.ReactNode> = {
    idle: <CircleDot className="h-3.5 w-3.5" />,
    walk: <Footprints className="h-3.5 w-3.5" />,
    type: <Monitor className="h-3.5 w-3.5" />,
    read: <BookOpen className="h-3.5 w-3.5" />,
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1a1a2e] rounded-xl">
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-pointer"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onWheel={handleWheel}
      />

      {/* Selected agent panel */}
      {selected && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-card/90 backdrop-blur-md border rounded-xl p-3 shadow-lg min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selected.emoji}</span>
                <span className="font-semibold text-sm">{selected.name}</span>
              </div>
              <button
                onClick={() => {
                  setSelected(null);
                  onSelectAgent?.(null);
                  if (engineRef.current) {
                    engineRef.current.selectedAgentId = null;
                    for (const a of engineRef.current.agents.values()) a.selected = false;
                  }
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs gap-1">
                {stateIcons[selected.state]}
                {stateLabels[selected.state]}
              </Badge>
              <Badge
                className="text-xs"
                style={{
                  backgroundColor: selected.color,
                  color: "#fff",
                }}
              >
                Tier {selected.tier}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Clique em um tile vazio para mover este agente
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selected && (
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-card/80 backdrop-blur-sm border rounded-lg px-3 py-2 text-[10px] text-muted-foreground space-y-0.5">
            <div>🖱️ Clique em um agente para selecionar</div>
            <div>🖱️ Clique direito em um tile para mover</div>
            <div>🔍 Scroll + Ctrl para zoom</div>
          </div>
        </div>
      )}
    </div>
  );
}
