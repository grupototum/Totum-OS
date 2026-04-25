-- ============================================================
-- 20260425120000_alexandria_decisoes_prompts.sql
-- Alexandria — Bloco 1 + Bloco 2 do prompt OPUS (2026-04-25)
--
-- Cria as tabelas `decisoes` e `prompts` (que ainda não existiam
-- no projeto cgpkfhrqprqptvehatad) e popula `decisoes` com as 6
-- decisões fundacionais consolidadas pelo TOT.
--
-- Idempotente: usa IF NOT EXISTS e ON CONFLICT DO NOTHING.
-- NÃO toca em `giles_knowledge` (60 registros, vector(768) Gemini).
-- ============================================================

-- ─── Bloco 1 — Tabelas ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS decisoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    contexto TEXT NOT NULL,
    decisao TEXT NOT NULL,
    responsavel TEXT NOT NULL,
    impacto TEXT,
    status TEXT DEFAULT 'ativa',
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agente TEXT NOT NULL,
    versao INTEGER NOT NULL DEFAULT 1,
    nome TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    diff TEXT,
    data TIMESTAMPTZ DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE,
    UNIQUE(agente, versao)
);

CREATE INDEX IF NOT EXISTS idx_decisoes_data    ON decisoes(data);
CREATE INDEX IF NOT EXISTS idx_decisoes_status  ON decisoes(status);
CREATE INDEX IF NOT EXISTS idx_decisoes_tags    ON decisoes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_prompts_agente   ON prompts(agente);
CREATE INDEX IF NOT EXISTS idx_prompts_ativo    ON prompts(ativo);

-- ─── Bloco 2 — Seed das 6 decisões fundacionais ────────────────
-- Idempotente: identificamos por (data, decisao) — não há UNIQUE
-- natural, então usamos NOT EXISTS antes do INSERT.

DO $mig$
BEGIN
    -- 1. Governança de criação de agentes
    IF NOT EXISTS (
        SELECT 1 FROM decisoes
        WHERE data = '2026-04-12'
          AND decisao LIKE 'NUNCA criar agente sem consultar POP-001%'
    ) THEN
        INSERT INTO decisoes (data, contexto, decisao, responsavel, impacto, status, tags) VALUES
        ('2026-04-12',
         'Criação de agentes sem processo estabelecido',
         'NUNCA criar agente sem consultar POP-001 ou POP-002 e obter aprovação explícita de Israel',
         'Israel',
         'Evita retrabalho, mantém governança do ecossistema',
         'ativa',
         ARRAY['governanca', 'agentes', 'pop']);
    END IF;

    -- 2. Lição R2D2 — processo > velocidade
    IF NOT EXISTS (
        SELECT 1 FROM decisoes
        WHERE data = '2026-04-12'
          AND decisao LIKE 'Regra permanente: Processo > Velocidade%'
    ) THEN
        INSERT INTO decisoes (data, contexto, decisao, responsavel, impacto, status, tags) VALUES
        ('2026-04-12',
         'Lição aprendida com criação do R2D2 sem processo',
         'Regra permanente: Processo > Velocidade. Sempre. Sem exceções.',
         'Israel',
         'Documentação obrigatória antes de qualquer deploy de agente',
         'ativa',
         ARRAY['governanca', 'processo', 'licao']);
    END IF;

    -- 3. Roteamento Telegram TOT × Kimi Totum
    IF NOT EXISTS (
        SELECT 1 FROM decisoes
        WHERE data = '2026-04-15'
          AND decisao LIKE 'Kimi Totum responde no Telegram%'
    ) THEN
        INSERT INTO decisoes (data, contexto, decisao, responsavel, impacto, status, tags) VALUES
        ('2026-04-15',
         'Conflito de roteamento entre TOT e Kimi Totum no Telegram',
         'Kimi Totum responde no Telegram. TOT NUNCA responde mensagens Telegram diretamente.',
         'Israel',
         'Elimina duplicação de respostas e confusão de identidade',
         'ativa',
         ARRAY['roteamento', 'telegram', 'kimi-totum']);
    END IF;

    -- 4. Alexandria como fonte única de verdade
    IF NOT EXISTS (
        SELECT 1 FROM decisoes
        WHERE data = '2026-04-25'
          AND decisao LIKE 'Alexandria é a fonte única de verdade%'
    ) THEN
        INSERT INTO decisoes (data, contexto, decisao, responsavel, impacto, status, tags) VALUES
        ('2026-04-25',
         'Fragmentação de conhecimento impedindo operação dos agentes',
         'Alexandria é a fonte única de verdade. Nenhum agente opera sem contexto da Alexandria. Improvisar sem base = erro.',
         'Israel',
         'Define Alexandria como pré-requisito para qualquer agente novo',
         'ativa',
         ARRAY['alexandria', 'governanca', 'agentes']);
    END IF;

    -- 5. Discord × Apps Totum × Alexandria — papéis
    IF NOT EXISTS (
        SELECT 1 FROM decisoes
        WHERE data = '2026-04-25'
          AND decisao LIKE 'Discord = canal de alerta%'
    ) THEN
        INSERT INTO decisoes (data, contexto, decisao, responsavel, impacto, status, tags) VALUES
        ('2026-04-25',
         'Proposta de Discord substituir Apps Totum',
         'Discord = canal de alerta e comando rápido. Apps Totum = interface oficial. Alexandria = memória. Nunca inverter.',
         'Israel',
         'Preserva investimento no Apps Totum e define papel correto do Discord',
         'ativa',
         ARRAY['discord', 'apps-totum', 'arquitetura']);
    END IF;

    -- 6. Separação Alibaba × Hostinger
    IF NOT EXISTS (
        SELECT 1 FROM decisoes
        WHERE data = '2026-04-25'
          AND decisao LIKE 'Alibaba Cloud = TOT + StarkClaw%'
    ) THEN
        INSERT INTO decisoes (data, contexto, decisao, responsavel, impacto, status, tags) VALUES
        ('2026-04-25',
         'VPS Alibaba vs Hostinger gerando confusão',
         'Alibaba Cloud = TOT + StarkClaw (agentes). Hostinger KVM4 = Apps Totum + produto. São VPS separados com funções separadas.',
         'Israel',
         'Elimina confusão de deploy e separação de responsabilidades',
         'ativa',
         ARRAY['infra', 'vps', 'arquitetura']);
    END IF;
END
$mig$;

-- ─── Verificação rápida ────────────────────────────────────────
-- SELECT COUNT(*) AS decisoes_total FROM decisoes;  -- esperado: >= 6
