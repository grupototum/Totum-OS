# Totum OS Architecture

## Product Model

Totum OS is organized around four visible workspaces:

- **AI Command Center**: one place to call agents, switch model/provider, attach Markdown context/skills, and see short activity logs inside the chat.
- **Alexandria**: the Knowledge First second brain for sources, artifacts, skills, POPs, prompts, decisions and context packs.
- **Agentes**: registry, hierarchy and configuration of agent personas, skills and status.
- **Fluxos**: execution and automation layer for OpenClaw, Suna, Claude Code, AnythingLLM and future Flowise-style builders.

## AnythingLLM Integration

AnythingLLM is an internal service, not a visual iframe inside Totum OS.

- Clone location: `/Users/israellemos/Documents/Pixel Systems/anything-llm`
- Totum OS calls Supabase Edge Function: `agent-chat`
- The edge function calls AnythingLLM Developer API:
  - `POST /api/v1/workspace/:slug/chat`
- Frontend never receives `ANYTHINGLLM_API_KEY`.

Recommended workspaces:

| Workspace | Use |
|---|---|
| `totum-agents` | Default shared agent workspace |
| `hermione-alexandria` | Hermione and Alexandria knowledge |
| `agent-{slug}` | Dedicated workspace for one agent |

## AI Command Center

The chat follows this sequence:

1. User selects an agent.
2. User selects AnythingLLM or a direct provider fallback.
3. User optionally pastes Markdown context/skill.
4. The chat displays short activity rows:
   - organizing context;
   - consulting workspace/model;
   - generating response;
   - completed or failed.
5. Responses can cite sources when AnythingLLM returns them.

## Input -> Output Agents

The first generator layer is form-based:

- social media planning;
- ad copy;
- social posts;
- SEO/growth;
- customer support bot;
- carousel.

Every output is Markdown-first:

1. Fill briefing.
2. Generate document.
3. Review and add feedback.
4. Download/copy Markdown.
5. Save as Alexandria artifact draft.

## Future MCP/Local AI Export

Alexandria should eventually expose exporters for:

- Claude project/context files;
- ChatGPT/Gemini prompt packs;
- Kimi context packs;
- local MCP insertion scripts;
- skill bundles for external tools.

## Alexandria Knowledge Bridges

Alexandria can receive sanitized knowledge packages from local second-brain systems without ingesting private life data.

The first supported bridge is **Bulma / Logseq local**:

- Bulma remains the personal/local memory layer.
- Alexandria receives only files exported to `exports/totum-os/`.
- The bridge records imported sources with `origin = bulma_logseq_bridge`.
- Red-zone files are blocked before they become Hermione sources.

Privacy zones:

| Zone | Meaning | Action |
|---|---|---|
| Green | Business/operational knowledge | Import into Alexandria |
| Yellow | Personal context allowed as a summary | Import as `personal_allowed` and keep under review |
| Red | Sensitive personal data | Keep local; do not import |

Recommended package:

```text
exports/totum-os/
├── manifest.json
├── contexto-sanitizado.md
├── preferencias-permitidas.md
├── decisoes.md
└── tags.json
```

The future Alexandria MCP Server should use the same boundary:

- `alexandria.search`
- `alexandria.get_context_pack`
- `alexandria.get_skill`
- `alexandria.recommend_ai`
- `alexandria.export_for_ai`
- `alexandria.ingest_feedback`
