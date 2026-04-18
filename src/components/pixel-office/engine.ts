import type { OfficeAgent, Tile, Camera } from "./types";
import { TILE_SIZE, COLS, ROWS } from "./types";

// ── Layout predefinido do escritório ──
// '#' = parede, ' ' = vazio, '.' = piso, 'D' = mesa, 'C' = cadeira
const OFFICE_LAYOUT = [
  "############################",
  "#..........................#",
  "#..D.C....D.C....D.C......#",
  "#.........D......D........#",
  "#..........................#",
  "#..D.C....D.C....D.C......#",
  "#.........D......D........#",
  "#..........................#",
  "#..........................#",
  "#..D.C....D.C....D.C......#",
  "#.........D......D........#",
  "#..........................#",
  "#..D.C....D.C....D.C......#",
  "#.........D......D........#",
  "#..........................#",
  "#..........................#",
  "#..D.C....D.C....D.C......#",
  "#.........D......D........#",
  "#..........................#",
  "############################",
];

export class PixelOfficeEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  agents: Map<string, OfficeAgent> = new Map();
  tileMap: Tile[][] = [];
  blockedTiles: Set<string> = new Set();
  seats: Array<{ col: number; row: number; occupiedBy: string | null }> = [];
  camera: Camera = { x: 0, y: 0, zoom: 1 };
  selectedAgentId: string | null = null;
  hoveredAgentId: string | null = null;
  mouseCol = -1;
  mouseRow = -1;
  private rafId = 0;
  private lastTime = 0;
  private running = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false })!;
    this.ctx.imageSmoothingEnabled = false;
    this.parseLayout();
    this.resize();
  }

  // ── Layout parser ──
  private parseLayout() {
    this.tileMap = [];
    this.blockedTiles.clear();
    this.seats = [];
    for (let row = 0; row < ROWS; row++) {
      const line = OFFICE_LAYOUT[row] || "".padEnd(COLS, ".");
      const tileRow: Tile[] = [];
      for (let col = 0; col < COLS; col++) {
        const ch = line[col] || ".";
        const type: Tile["type"] =
          ch === "#"
            ? "wall"
            : ch === "D"
            ? "desk"
            : ch === "C"
            ? "chair"
            : ch === " "
            ? "void"
            : "floor";
        tileRow.push({ col, row, type });
        if (type === "wall" || type === "desk" || type === "void") {
          this.blockedTiles.add(`${col},${row}`);
        }
        if (type === "chair") {
          this.seats.push({ col, row, occupiedBy: null });
        }
      }
      this.tileMap.push(tileRow);
    }
  }

  // ── Agent management ──
  addAgent(agent: OfficeAgent) {
    // Encontra um seat livre
    const freeSeat = this.seats.find((s) => s.occupiedBy === null);
    if (freeSeat) {
      freeSeat.occupiedBy = agent.id;
      agent.seatCol = freeSeat.col;
      agent.seatRow = freeSeat.row;
      agent.targetCol = freeSeat.col;
      agent.targetRow = freeSeat.row;
      // Posiciona perto do seat (1 tile acima)
      agent.col = freeSeat.col;
      agent.row = freeSeat.row - 1;
      if (this.blockedTiles.has(`${agent.col},${agent.row}`)) {
        agent.row = freeSeat.row;
      }
    } else {
      // Posição aleatória no piso
      let placed = false;
      for (let attempts = 0; attempts < 100 && !placed; attempts++) {
        const c = Math.floor(Math.random() * COLS);
        const r = Math.floor(Math.random() * ROWS);
        if (!this.blockedTiles.has(`${c},${r}`) && !this.agentAt(c, r)) {
          agent.col = c;
          agent.row = r;
          agent.targetCol = c;
          agent.targetRow = r;
          placed = true;
        }
      }
    }
    this.agents.set(agent.id, agent);
  }

  removeAgent(id: string) {
    const agent = this.agents.get(id);
    if (agent && agent.seatCol !== null) {
      const seat = this.seats.find(
        (s) => s.col === agent.seatCol && s.row === agent.seatRow
      );
      if (seat) seat.occupiedBy = null;
    }
    this.agents.delete(id);
  }

  private agentAt(col: number, row: number): OfficeAgent | undefined {
    for (const a of this.agents.values()) {
      if (Math.round(a.col) === col && Math.round(a.row) === row) return a;
    }
    return undefined;
  }

  // ── Game Loop ──
  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private loop = (now: number) => {
    if (!this.running) return;
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.update(dt);
    this.render();
    this.rafId = requestAnimationFrame(this.loop);
  };

  // ── Update ──
  private update(dt: number) {
    for (const agent of this.agents.values()) {
      this.updateAgent(agent, dt);
    }
  }

  private updateAgent(agent: OfficeAgent, dt: number) {
    // Animate frame timer
    agent.frameTimer += dt;

    // State machine
    switch (agent.state) {
      case "idle": {
        agent.wanderTimer += dt;
        if (agent.wanderTimer > 2 + Math.random() * 3) {
          agent.wanderTimer = 0;
          if (Math.random() > 0.3 && agent.seatCol !== null) {
            // Walk to seat
            agent.targetCol = agent.seatCol;
            agent.targetRow = agent.seatRow - 1;
            agent.state = "walk";
            agent.path = this.findPath(
              Math.round(agent.col),
              Math.round(agent.row),
              agent.targetCol,
              agent.targetRow
            );
          } else {
            // Wander to random floor tile
            this.wanderRandom(agent);
          }
        }
        if (agent.frameTimer > 0.5) {
          agent.frame = 0;
          agent.frameTimer = 0;
        }
        break;
      }
      case "walk": {
        if (agent.path.length > 0) {
          agent.moveProgress += dt * 3; // 3 tiles/s
          if (agent.moveProgress >= 1) {
            agent.moveProgress = 0;
            const next = agent.path.shift()!;
            agent.col = next.col;
            agent.row = next.row;
            // Update dir
            if (agent.path.length > 0) {
              const after = agent.path[0];
              if (after.col > next.col) agent.dir = 2;
              else if (after.col < next.col) agent.dir = 1;
              else if (after.row > next.row) agent.dir = 0;
              else agent.dir = 3;
            }
          }
          if (agent.frameTimer > 0.15) {
            agent.frame = (agent.frame + 1) % 4;
            agent.frameTimer = 0;
          }
        } else {
          agent.state = Math.random() > 0.4 ? "type" : "read";
          agent.isActive = true;
          agent.frame = 0;
          agent.frameTimer = 0;
        }
        break;
      }
      case "type":
      case "read": {
        if (agent.frameTimer > 0.3) {
          agent.frame = (agent.frame + 1) % 2;
          agent.frameTimer = 0;
        }
        // After some time, go idle
        agent.wanderTimer += dt;
        if (agent.wanderTimer > 3 + Math.random() * 4) {
          agent.wanderTimer = 0;
          agent.state = "idle";
          agent.isActive = false;
          agent.frame = 0;
        }
        break;
      }
    }
  }

  private wanderRandom(agent: OfficeAgent) {
    for (let i = 0; i < 50; i++) {
      const tc = Math.floor(Math.random() * COLS);
      const tr = Math.floor(Math.random() * ROWS);
      if (!this.blockedTiles.has(`${tc},${tr}`)) {
        agent.targetCol = tc;
        agent.targetRow = tr;
        agent.state = "walk";
        agent.path = this.findPath(
          Math.round(agent.col),
          Math.round(agent.row),
          tc,
          tr
        );
        return;
      }
    }
    agent.wanderTimer = 0;
  }

  // ── BFS Pathfinding ──
  private findPath(
    sc: number,
    sr: number,
    tc: number,
    tr: number
  ): Array<{ col: number; row: number }> {
    if (sc === tc && sr === tr) return [];
    const q: Array<{ c: number; r: number; path: Array<{ col: number; row: number }> }> = [
      { c: sc, r: sr, path: [] },
    ];
    const visited = new Set<string>([`${sc},${sr}`]);
    const dirs = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    while (q.length > 0) {
      const { c, r, path } = q.shift()!;
      for (const [dc, dr] of dirs) {
        const nc = c + dc;
        const nr = r + dr;
        const key = `${nc},${nr}`;
        if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) continue;
        if (visited.has(key)) continue;
        if (this.blockedTiles.has(key)) continue;
        // Don't walk through other agents
        const occupant = this.agentAt(nc, nr);
        if (occupant && occupant.id !== `${sc},${sr}`) continue;
        const npath = [...path, { col: nc, row: nr }];
        if (nc === tc && nr === tr) return npath;
        visited.add(key);
        q.push({ c: nc, r: nr, path: npath });
      }
    }
    return [];
  }

  // ── Render ──
  private render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, w, h);

    const ts = TILE_SIZE * this.camera.zoom;
    const offsetX = this.camera.x;
    const offsetY = this.camera.y;

    // Visible range
    const startCol = Math.max(0, Math.floor(-offsetX / ts));
    const endCol = Math.min(COLS, Math.ceil((w - offsetX) / ts) + 1);
    const startRow = Math.max(0, Math.floor(-offsetY / ts));
    const endRow = Math.min(ROWS, Math.ceil((h - offsetY) / ts) + 1);

    // Draw tiles
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const tile = this.tileMap[row]?.[col];
        if (!tile) continue;
        const x = Math.floor(col * ts + offsetX);
        const y = Math.floor(row * ts + offsetY);
        this.drawTile(ctx, tile.type, x, y, ts);
      }
    }

    // Draw grid lines (subtle)
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let row = startRow; row <= endRow; row++) {
      const y = Math.floor(row * ts + offsetY);
      ctx.beginPath();
      ctx.moveTo(Math.floor(startCol * ts + offsetX), y);
      ctx.lineTo(Math.floor(endCol * ts + offsetX), y);
      ctx.stroke();
    }
    for (let col = startCol; col <= endCol; col++) {
      const x = Math.floor(col * ts + offsetX);
      ctx.beginPath();
      ctx.moveTo(x, Math.floor(startRow * ts + offsetY));
      ctx.lineTo(x, Math.floor(endRow * ts + offsetY));
      ctx.stroke();
    }

    // Collect renderables (agents + furniture for z-sort by Y)
    interface Renderable {
      y: number;
      type: "agent" | "desk" | "chair";
      data: any;
    }
    const renderables: Renderable[] = [];

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const tile = this.tileMap[row]?.[col];
        if (tile?.type === "desk" || tile?.type === "chair") {
          renderables.push({
            y: row * ts + ts,
            type: tile.type,
            data: { col, row, type: tile.type },
          });
        }
      }
    }

    for (const agent of this.agents.values()) {
      renderables.push({
        y: agent.row * ts + ts,
        type: "agent",
        data: agent,
      });
    }

    renderables.sort((a, b) => a.y - b.y);

    for (const item of renderables) {
      if (item.type === "agent") {
        this.drawAgent(ctx, item.data, ts, offsetX, offsetY);
      } else {
        const x = Math.floor(item.data.col * ts + offsetX);
        const y = Math.floor(item.data.row * ts + offsetY);
        this.drawFurniture(ctx, item.data.type, x, y, ts);
      }
    }

    // Draw mouse hover highlight
    if (this.mouseCol >= 0 && this.mouseRow >= 0) {
      const mx = Math.floor(this.mouseCol * ts + offsetX);
      const my = Math.floor(this.mouseRow * ts + offsetY);
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(mx, my, ts, ts);
    }

    // Draw selected agent highlight
    if (this.selectedAgentId) {
      const agent = this.agents.get(this.selectedAgentId);
      if (agent) {
        const sx = Math.floor(agent.col * ts + offsetX);
        const sy = Math.floor(agent.row * ts + offsetY);
        ctx.strokeStyle = "#60A5FA";
        ctx.lineWidth = 2;
        ctx.strokeRect(sx - 2, sy - 2, ts + 4, ts + 4);
      }
    }
  }

  private drawTile(
    ctx: CanvasRenderingContext2D,
    type: Tile["type"],
    x: number,
    y: number,
    ts: number
  ) {
    switch (type) {
      case "wall":
        ctx.fillStyle = "#2d2d44";
        ctx.fillRect(x, y, ts, ts);
        ctx.fillStyle = "#3a3a55";
        ctx.fillRect(x + 2, y + 2, ts - 4, ts - 4);
        break;
      case "floor":
        ctx.fillStyle = "#252538";
        ctx.fillRect(x, y, ts, ts);
        ctx.fillStyle = "#2a2a40";
        ctx.fillRect(x + 1, y + 1, ts - 2, ts - 2);
        break;
      case "desk":
        ctx.fillStyle = "#252538";
        ctx.fillRect(x, y, ts, ts);
        break;
      case "chair":
        ctx.fillStyle = "#252538";
        ctx.fillRect(x, y, ts, ts);
        break;
      case "void":
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(x, y, ts, ts);
        break;
    }
  }

  private drawFurniture(
    ctx: CanvasRenderingContext2D,
    type: "desk" | "chair",
    x: number,
    y: number,
    ts: number
  ) {
    if (type === "desk") {
      // Desk top
      ctx.fillStyle = "#5c4033";
      ctx.fillRect(x + 2, y + 6, ts - 4, ts - 8);
      ctx.fillStyle = "#6b4e3d";
      ctx.fillRect(x + 4, y + 8, ts - 8, 4);
      // Legs
      ctx.fillStyle = "#4a3528";
      ctx.fillRect(x + 4, y + ts - 6, 4, 6);
      ctx.fillRect(x + ts - 8, y + ts - 6, 4, 6);
      // Monitor
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(x + ts / 2 - 6, y + 4, 12, 8);
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(x + ts / 2 - 5, y + 5, 10, 6);
    } else if (type === "chair") {
      ctx.fillStyle = "#8b5a2b";
      ctx.fillRect(x + 6, y + 8, ts - 12, ts - 10);
      ctx.fillStyle = "#a06b35";
      ctx.fillRect(x + 6, y + 8, ts - 12, 4);
      // Back
      ctx.fillStyle = "#8b5a2b";
      ctx.fillRect(x + 6, y + 4, ts - 12, 6);
    }
  }

  private drawAgent(
    ctx: CanvasRenderingContext2D,
    agent: OfficeAgent,
    ts: number,
    offX: number,
    offY: number
  ) {
    const x = Math.floor(agent.col * ts + offX);
    const y = Math.floor(agent.row * ts + offY);

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(
      x + ts / 2,
      y + ts - 2,
      ts * 0.35,
      ts * 0.12,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Body (colored circle)
    const cx = x + ts / 2;
    const cy = y + ts / 2 + 2;
    const r = ts * 0.38;

    // Bob animation
    let bobY = 0;
    if (agent.state === "type" || agent.state === "read") {
      bobY = Math.sin(agent.frameTimer * 20) * 2;
    } else if (agent.state === "walk") {
      bobY = Math.sin(agent.frameTimer * 15) * 3;
    }

    ctx.fillStyle = agent.color;
    ctx.beginPath();
    ctx.arc(cx, cy + bobY, r, 0, Math.PI * 2);
    ctx.fill();

    // Outline if selected/hovered
    if (agent.selected || agent.hover) {
      ctx.strokeStyle = agent.selected ? "#60A5FA" : "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy + bobY, r + 1, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Emoji
    ctx.font = `${Math.floor(ts * 0.55)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(agent.emoji, cx, cy + bobY);

    // State indicator (small dot)
    const dotColors: Record<string, string> = {
      idle: "#fbbf24",
      walk: "#3b82f6",
      type: "#22c55e",
      read: "#a855f7",
    };
    ctx.fillStyle = dotColors[agent.state] || "#9ca3af";
    ctx.beginPath();
    ctx.arc(x + ts - 6, y + 6, 3, 0, Math.PI * 2);
    ctx.fill();

    // Name label (only for selected or hovered)
    if (agent.selected || agent.hover) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      const nameW = ctx.measureText(agent.name).width + 8;
      const nx = cx - nameW / 2;
      const ny = y - 14;
      ctx.fillRect(nx, ny, nameW, 14);
      ctx.fillStyle = "#fff";
      ctx.font = `${Math.max(8, Math.floor(ts * 0.22))}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(agent.name, cx, ny + 7);
    }
  }

  // ── Input handling ──
  handleMouseMove(mx: number, my: number) {
    const ts = TILE_SIZE * this.camera.zoom;
    this.mouseCol = Math.floor((mx - this.camera.x) / ts);
    this.mouseRow = Math.floor((my - this.camera.y) / ts);

    // Check agent hover
    let found: string | null = null;
    for (const agent of this.agents.values()) {
      const ac = Math.floor(agent.col);
      const ar = Math.floor(agent.row);
      if (ac === this.mouseCol && ar === this.mouseRow) {
        found = agent.id;
        break;
      }
    }
    this.hoveredAgentId = found;
    for (const a of this.agents.values()) {
      a.hover = a.id === found;
    }
  }

  handleClick(mx: number, my: number) {
    const ts = TILE_SIZE * this.camera.zoom;
    const col = Math.floor((mx - this.camera.x) / ts);
    const row = Math.floor((my - this.camera.y) / ts);

    // Find clicked agent
    for (const agent of this.agents.values()) {
      const ac = Math.floor(agent.col);
      const ar = Math.floor(agent.row);
      if (ac === col && ar === row) {
        this.selectedAgentId = agent.id;
        agent.selected = true;
        for (const a of this.agents.values()) {
          if (a.id !== agent.id) a.selected = false;
        }
        return agent.id;
      }
    }
    // Clicked empty tile -> move selected agent
    if (this.selectedAgentId) {
      const agent = this.agents.get(this.selectedAgentId);
      if (agent && !this.blockedTiles.has(`${col},${row}`)) {
        agent.targetCol = col;
        agent.targetRow = row;
        agent.state = "walk";
        agent.path = this.findPath(
          Math.round(agent.col),
          Math.round(agent.row),
          col,
          row
        );
      }
    }
    return null;
  }

  handleWheel(deltaY: number, ctrl: boolean) {
    if (ctrl) {
      const newZoom = Math.max(0.5, Math.min(3, this.camera.zoom - deltaY * 0.001));
      this.camera.zoom = newZoom;
    } else {
      this.camera.y -= deltaY * 0.5;
    }
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight;
    }
    // Center camera
    const ts = TILE_SIZE * this.camera.zoom;
    this.camera.x = (this.canvas.width - COLS * ts) / 2;
    this.camera.y = (this.canvas.height - ROWS * ts) / 2;
  }
}
