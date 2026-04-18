export interface Tile {
  col: number;
  row: number;
  type: "floor" | "wall" | "desk" | "chair" | "void";
}

export type AgentState = "idle" | "walk" | "type" | "read";

export interface OfficeAgent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  tier: number;
  col: number;
  row: number;
  targetCol: number;
  targetRow: number;
  state: AgentState;
  dir: 0 | 1 | 2 | 3; // 0=down, 1=left, 2=right, 3=up
  path: Array<{ col: number; row: number }>;
  moveProgress: number;
  frame: number;
  frameTimer: number;
  wanderTimer: number;
  isActive: boolean;
  seatCol: number | null;
  seatRow: number | null;
  selected: boolean;
  hover: boolean;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export const TILE_SIZE = 32;
export const COLS = 28;
export const ROWS = 20;
