import type { Skill } from "@/types/agents";
import { listSkills } from "@/services/skillsService";

export interface SkillRouteCandidate {
  skill: Skill;
  score: number;
  reasons: string[];
}

export interface SkillRouteResult {
  primary: Skill | null;
  candidates: SkillRouteCandidate[];
}

const STOP_WORDS = new Set([
  "a", "o", "e", "de", "do", "da", "para", "com", "em", "um", "uma", "os", "as",
  "the", "and", "for", "with", "to", "of", "in",
]);

export function routeSkillsByObjective(objective: string, limit = 5): SkillRouteResult {
  const normalizedTerms = tokenize(objective);
  const skills = listSkills({ status: "active" });

  const candidates = skills
    .filter((skill) => skill.id !== "skill_router")
    .map((skill) => scoreSkill(skill, normalizedTerms))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || (b.skill.routing_priority || 0) - (a.skill.routing_priority || 0))
    .slice(0, limit);

  return {
    primary: getPrimarySkill(),
    candidates,
  };
}

export function getPrimarySkill(): Skill | null {
  return listSkills({ status: "active" }).find((skill) => skill.is_primary) || null;
}

function scoreSkill(skill: Skill, terms: string[]): SkillRouteCandidate {
  const reasons: string[] = [];
  let score = skill.routing_priority || 0;
  const haystack = [
    skill.name,
    skill.description,
    skill.category,
    ...(skill.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  for (const term of terms) {
    if (skill.id.includes(term)) {
      score += 12;
      reasons.push(`ID combina com "${term}"`);
      continue;
    }

    if (skill.name.toLowerCase().includes(term)) {
      score += 10;
      reasons.push(`Nome combina com "${term}"`);
      continue;
    }

    if (haystack.includes(term)) {
      score += 4;
      reasons.push(`Contexto combina com "${term}"`);
    }
  }

  if (skill.is_primary) {
    score += 100;
    reasons.push("Skill principal do roteamento");
  }

  return {
    skill,
    score,
    reasons: Array.from(new Set(reasons)),
  };
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9à-ÿ_]+/i)
    .map((part) => part.trim())
    .filter((part) => part.length >= 3 && !STOP_WORDS.has(part));
}
