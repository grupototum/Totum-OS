import { describe, expect, it, vi } from "vitest";
import type { Skill } from "@/types/agents";

const mockSkills: Skill[] = [
  {
    id: "skill_router",
    name: "Skill Router",
    emoji: "🚦",
    description: "Roteia skills",
    category: "automation",
    model_preference: "claude",
    status: "active",
    is_primary: true,
    routing_priority: 1000,
    tags: ["router", "planner", "skills"],
  },
  {
    id: "automation_workflows",
    name: "Automation Workflows",
    emoji: "⚙️",
    description: "Automatiza fluxos e processos",
    category: "automation",
    model_preference: "claude",
    status: "active",
    routing_priority: 100,
    tags: ["automation", "workflows", "processos"],
  },
];

vi.mock("./skillsService", () => ({
  listSkills: () => mockSkills,
}));

import { getPrimarySkill, routeSkillsByObjective } from "./skillRouter";

describe("skillRouter", () => {
  it("expõe o skill_router como skill principal", () => {
    const primary = getPrimarySkill();

    expect(primary?.id).toBe("skill_router");
    expect(primary?.is_primary).toBe(true);
  });

  it("retorna skills candidatas para o objetivo informado", () => {
    const result = routeSkillsByObjective("quero automatizar fluxos e roteamento de skills");

    expect(result.primary?.id).toBe("skill_router");
    expect(result.candidates.length).toBeGreaterThan(0);
    expect(result.candidates.some((candidate) => candidate.reasons.length > 0)).toBe(true);
  });
});
