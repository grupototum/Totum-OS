# WORKFLOWS × AGENTS MAPPING - DETAILED VIEW

**Status**: ✅ COMPLETO  
**Date**: 2026-04-13  
**Total Workflows**: 20  
**Total Active Agents**: 37  
**Deployment Status**: Tier 1 (Ready), Tier 2 (Ready), Tier 3 (Future)

---

## 📊 WORKFLOW ARCHITECTURE

### TIER 1: MVP - CRITICAL (Immediate Deployment)

#### **WF-001: Lead Intake Analysis (ARTEMIS)**
```yaml
Trigger: Webhook POST /leads/intake
Schedule: On-demand
Agents:
  1. ARTEMIS (30s) - Lead scoring
     Input: Lead description, source, industry
     Output: Score 0-10, reasoning, recommendation
     Condition: Required
     
  2a. LOKI (30s) - Deep analysis [IF score > 7.5]
      Input: Lead data, score
      Output: Company research, decision maker profile
      Fallback: ANALYZER
      
  2b. WANDA (25s) - Ideation [IF score > 7.5]
      Input: Lead insights
      Output: 3+ outreach ideas
      Parallel: Yes
      
  2c. KVIRTUALOSO (30s) - Industry context [IF score > 7.5]
      Input: Lead industry
      Output: Market insights, trends
      Parallel: Yes
      
  3. FORMATTER (15s) - Standardize output
     Input: All previous outputs
     Output: Formatted JSON/HTML for delivery

Output:
  - Slack #sales-hot-leads if score > 7.5
  - Pipedrive deal creation if score > 8
  - Supabase: agent_executions log entry
  
SLA: 95% success, <5s avg, 20 daily executions
Cost: ~1800 tokens/execution
```

#### **WF-006: Brand Sentiment Monitor (GUARDIAN)**
```yaml
Trigger: Cron every 4 hours (0, 4, 8, 12, 16, 20 UTC)
Agents:
  1. GUARDIAN (30s) - Monitor sentiment
     Input: Twitter mentions, LinkedIn posts, press
     Output: Sentiment score (-1 to +1), key mentions
     
  2a. WANDA (25s) - Response generation [IF sentiment < -0.7]
      Input: Negative mention details
      Output: Response templates, apology options
      
  2b. FORMATTER (15s) - Polish response [IF sentiment < -0.7]
      Input: Response template
      Output: Ready-to-send message

Output:
  - Slack #brand-alerts for negative sentiment
  - Email to executives [IF sentiment < -0.8]
  - Supabase: mention tracking + sentiment history

SLA: 95% success, <5s avg, 24 daily executions
Cost: ~1500 tokens/execution
Critical: Yes (reputational)
```

#### **WF-007: Retention & Upsell Engine (ATLAS)**
```yaml
Trigger: Cron daily at 08:00 UTC
Agents:
  1. ATLAS (30s) - Customer health analysis
     Input: Customer data, usage patterns, contracts
     Output: Health score, churn risk, expansion potential
     
  2a. SOLVER (30s) - Solution matching [IF churn_risk > 0.6]
      Input: Customer profile, pain points
      Output: Recommended solutions, fit score
      
  2b. HERALD (30s) - Retention email [IF churn_risk > 0.6]
      Input: Customer data, solutions
      Output: Personalized retention email
      
  2c. NEXUS (30s) - Outreach [IF churn_risk > 0.6]
      Input: Engagement insights
      Output: Community engagement suggestions

Output:
  - Slack #customer-success with actionable list
  - Google Sheets: health scores + trends
  - Pipedrive: opportunity creation for expansion

SLA: 95% success, <5s avg, 1 daily execution
Cost: ~2000 tokens/execution
Impact: LTV improvement, churn reduction
```

---

### TIER 2: MVP - OPERATIONAL (Week 2-3 Deployment)

#### **WF-003: Social Content Generator (ECHO+CREATOR)**
```yaml
Trigger: Cron Monday & Thursday 14:00 UTC
Agents:
  1. ECHO (30s) - Content strategy
     Output: Week's strategy, themes, angles
     
  2. WANDA (25s) - Brainstorm
     Output: 5+ content ideas
     
  3. CREATOR (25s) - LinkedIn optimization
     Output: Posts optimized for platform
     
  4a. KVIRTUALOSO (30s) - Industry context [Parallel]
      Output: Research to include
      
  4b. VISU (40s) - Image generation [Parallel]
      Output: Image prompts + descriptions
      
  5. FORMATTER (15s) - Finalize
     Output: Ready-to-publish content

Output:
  - Google Sheets: Content calendar insert
  - Slack #content-team: 5+ posts ready to schedule
  - LinkedIn: Post scheduling (optional)

SLA: 94% success, 4-5s parallel avg, 2 daily executions
Cost: ~2500 tokens/execution
Frequency: 2x weekly
```

#### **WF-009: Email Campaign Orchestration (HERALD)**
```yaml
Trigger: Cron Tuesday 06:00 UTC + Thursday 18:00 UTC
Agents:
  1. HERALD (30s) - Campaign creation
     Input: Segment data, campaign brief
     Output: Email templates, personalization rules
     
  2a. WANDA (25s) - Copy variations [Parallel]
      Output: 3 subject lines, 2 body variations
      
  2b. FORMATTER (15s) - Format [Parallel]
      Input: Copy variations
      Output: HTML-ready email
      
  3. ANALYZER-EXP (30s) - A/B test design
     Output: Test splits, sample sizes

Output:
  - Email SMTP: Send to segment
  - Slack #email-marketing: Confirmation + stats
  - Analytics: Track opens, clicks, conversions

SLA: 94% success, 3-4s parallel avg, 2x weekly
Cost: ~2200 tokens/execution
Response: 48-72h for reporting
```

#### **WF-010: LinkedIn Content Pipeline (CREATOR)**
```yaml
Trigger: Cron Monday & Thursday 08:00 UTC
Agents:
  1. ECHO (30s) - Strategic angle
     Output: Theme for the day
     
  2. WANDA (25s) - Idea generation
     Output: 3 post concepts
     
  3. CREATOR (25s) - LinkedIn-specific
     Output: Optimized post copy, emojis, hashtags
     
  4. FORMATTER (15s) - Final polish
     Output: Ready-to-post

Output:
  - Slack #social-content: Approve/reject
  - LinkedIn: Direct post (if approved)
  - Google Sheets: Engagement tracking

SLA: 94% success, 3-4s avg, 2x weekly
Cost: ~1800 tokens/execution
```

#### **WF-008: Community Engagement (NEXUS)**
```yaml
Trigger: Cron every 6 hours
Agents:
  1. NEXUS (30s) - Community monitoring
     Input: Slack channels, Discord, Forums
     Output: Unanswered questions, engagement potential
     
  2a. WANDA (25s) - Response ideas [IF engagement > 0.7]
      Output: Suggested responses
      
  2b. CREATOR (25s) - Platform-specific [Parallel]
      Output: Formatted for platform
      
  3. FORMATTER (15s) - Final [IF engagement > 0.7]
     Output: Ready for human review

Output:
  - Slack #community-team: Suggested responses
  - Human review: Before posting (CRITICAL)
  - Analytics: Engagement metrics

SLA: 92% success, 3-4s parallel avg, 4x daily
Cost: ~1600 tokens/execution
```

#### **WF-004: CRM Lead Sync (Pipedrive)**
```yaml
Trigger: Webhook from Pipedrive
Agents:
  1. ARTEMIS (30s) - Re-score lead
     Input: Updated lead data
     Output: New score, recommendations
     
  2. SOLVER (30s) - Solution match [IF score > 8]
     Input: Lead profile
     Output: Best solutions
     
Output:
  - Pipedrive: Update deal stage
  - Slack #sales-team: Hot lead alert
  - Supabase: Sync log

SLA: 95% success, <5s avg, 8 daily executions
Cost: ~1700 tokens/execution
Frequency: Real-time
```

#### **WF-005: Nightly Data Cleaning**
```yaml
Trigger: Cron 23:00 UTC
Agents:
  1. SCRAPER-WEB (45s) - Fetch data [Optional]
     Input: Data sources
     Output: Raw data
     
  2. CLEANER (20s) - Remove junk
     Input: Raw data
     Output: Cleaned dataset
     
  3. VALIDATOR (20s) - Quality check
     Input: Cleaned data
     Output: Validation report
     
  4. DEDUPE (25s) - Merge duplicates
     Input: Validated data
     Output: Final dataset

Output:
  - Supabase: Archive processed data
  - Email #data-ops: Cleaning summary

SLA: 96% success, 3-5s avg, 1 daily execution
Cost: ~1500 tokens/execution
Duration: 110s total (sequential)
```

#### **WF-011: ASO Automation (OPTIMIZER)**
```yaml
Trigger: Cron 1st & 15th of month at 10:00 UTC
Agents:
  1. OPTIMIZER (30s) - App Store analysis
     Input: App metrics, reviews
     Output: ASO recommendations
     
  2a. WANDA (25s) - Copy variations [Parallel]
      Output: New app description, keywords
      
  2b. VISU (40s) - Screenshots [Parallel]
      Output: New screenshot prompts
      
  3. FORMATTER (15s) - Format
     Output: App Store-ready files

Output:
  - Slack #app-growth: Recommendations
  - App Store: Manual update (human review)
  - Analytics: Track impact

SLA: 91% success, 3-4s parallel avg, 2x monthly
Cost: ~2000 tokens/execution
Duration: 110s total
```

---

### TIER 3: FUTURE - SPECIALIZED (Week 4+ Deployment)

#### **WF-012: Opportunity Match Engine (SOLVER)**
```yaml
Trigger: Webhook from CRM
Agents:
  1. ARTEMIS (30s) - Lead score
  2. SOLVER (30s) - Fit analysis
  3a. KVIRTUALOSO (30s) - Industry context [Parallel]
  3b. WANDA (25s) - Pitch angles [Parallel]
  4. FORMATTER (15s) - Proposal

Output:
  - Pipedrive: Opportunity creation
  - Slack #sales-opportunities

SLA: 92% success, 4-5s parallel avg, 5 daily executions
```

#### **WF-013: Product Roadmap Analysis (ARCHITECT)**
```yaml
Trigger: Cron 1st of month at 09:00 UTC
Agents:
  1. ARCHITECT (30s) - Roadmap prioritization
  2a. ANALYZER (30s) - Trend analysis [Parallel]
  2b. KVIRTUALOSO (30s) - Competitive research [Parallel]
  3. FORMATTER (15s) - Format

Output:
  - Google Sheets: Prioritized roadmap
  - Slack #product-team: Notification

SLA: 91% success, 4-5s parallel avg, Monthly
Cost: ~2500 tokens/execution
```

#### **WF-014: A/B Test Orchestration (ANALYZER-EXP)**
```yaml
Trigger: Cron Monday 07:00 UTC
Agents:
  1. ANALYZER-EXP (30s) - Analyze results
     Input: Test data (previous week)
     Output: Statistical analysis, winner determination

Output:
  - Slack #analytics: Results + recommendation
  - Supabase: Test results logging

SLA: 93% success, 5-6s avg, Weekly
Cost: ~2000 tokens/execution
Duration: 30s (analysis only, not monitoring)
```

#### **WF-015: Crisis Response (GUARDIAN+LOKI)**
```yaml
Trigger: Webhook or manual crisis alert
Agents:
  1. GUARDIAN (20s) - Detect threat level
  2. LOKI (30s) - Deep analysis
  3. WANDA (25s) - Response generation
  4. FORMATTER (15s) - Polish

Output:
  - Slack #brand-crisis: URGENT alert
  - Email: Executive notification
  - Supabase: Crisis log entry

SLA: 98% success, <5s alert time, Ad-hoc
Cost: ~2000 tokens/execution
Priority: CRITICAL
```

#### **WF-016: Lead Nurture Sequence**
```yaml
Trigger: Cron daily 06:00 UTC
Agents:
  1. ECHO (30s) - Strategy for nurture sequence
  2a. HERALD (30s) - Email creation [Parallel]
  2b. FORMATTER (15s) - Format [Parallel]

Output:
  - Supabase: Schedule emails (Day 1, 7, 14, 30)
  - Slack #sales-nurture: Sequence tracking

SLA: 92% success, 3-4s parallel avg, Daily
Cost: ~1700 tokens/execution
```

#### **WF-017: Quarterly Business Review**
```yaml
Trigger: Cron 1st of Q at 09:00 UTC (Jan, Apr, Jul, Oct)
Agents:
  1. ANALYST-1 (30s) - BI analysis
  2a. ANALYST-4 (30s) - Insights [Parallel]
  2. ANALYST-2 (30s) - Report creation
  3. ANALYST-3 (30s) - Dashboard update

Output:
  - Email: Executive report
  - Google Sheets: Dashboard refresh
  - Slack #leadership: Notification

SLA: 88% success, 5-6s parallel avg, Quarterly
Cost: ~2500 tokens/execution
```

#### **WF-018, 19, 20: Reserved for Future**
Available slots for scaling and new agents.

---

## 🔄 AGENT UTILIZATION MATRIX

| Agent | WF-001 | WF-003 | WF-004 | WF-005 | WF-006 | WF-007 | WF-008 | WF-009 | WF-010 | WF-011 | Usage% |
|-------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|
| ARTEMIS | ✅ | - | ✅ | - | - | - | - | - | - | - | 40% |
| LOKI | ✅ | - | - | - | - | - | - | - | - | - | 25% |
| GUARDIAN | - | - | - | - | ✅ | - | - | - | - | - | 15% |
| ATLAS | - | - | - | - | - | ✅ | - | - | - | - | 20% |
| ECHO | - | ✅ | - | - | - | - | - | - | ✅ | - | 35% |
| WANDA | ✅ | ✅ | - | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 85% |
| CREATOR | - | ✅ | - | - | - | - | ✅ | - | ✅ | - | 60% |
| HERALD | - | - | - | - | - | ✅ | - | ✅ | - | - | 40% |
| NEXUS | - | - | - | - | - | ✅ | ✅ | - | - | - | 35% |
| KVIRTUALOSO | ✅ | ✅ | - | - | - | - | - | - | - | ✅ | 55% |
| SOLVER | - | - | ✅ | - | - | ✅ | - | - | - | - | 45% |
| OPTIMIZER | - | - | - | - | - | - | - | - | - | ✅ | 15% |
| SCRAPER-WEB | - | - | - | ✅ | - | - | - | - | - | - | 20% |
| ANALYZER | - | - | - | ✅ | - | - | - | - | - | - | 25% |
| FORMATTER | ✅ | ✅ | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 95% |
| CLEANER | - | - | - | ✅ | - | - | - | - | - | - | 15% |
| VALIDATOR | - | - | - | ✅ | - | - | - | - | - | - | 15% |
| DEDUPE | - | - | - | ✅ | - | - | - | - | - | - | 15% |
| VISU | - | ✅ | - | - | - | - | - | - | - | ✅ | 30% |
| ANALYZER-EXP | - | - | - | - | - | - | - | ✅ | - | - | 20% |
| ARCHITECT | - | - | - | - | - | - | - | - | - | - | 10% |
| ANALYST-1,2,3,4 | - | - | - | - | - | - | - | - | - | - | 5% |

**Utilization Summary**:
- High usage (70%+): WANDA, FORMATTER
- Medium usage (30-70%): ECHO, CREATOR, KVIRTUALOSO, LOKI, ARTEMIS, HERALD, SOLVER, NEXUS, VISU
- Low usage (<30%): OPTIMIZER, ANALYZER-EXP, ANALYST-*, SCRAPER-WEB, CLEANER, VALIDATOR, DEDUPE, ATLAS, GUARDIAN, ARCHITECT

---

## ✅ PASSO 6 COMPLETION STATUS

✅ **6.1: Agent Division Mapping** - 57 agentes em 7 divisões  
✅ **6.2: Inter-Agent Flows** - 15 fluxos primários mapeados  
✅ **6.3: Execution Matrix** - 20 workflows × 37 agentes  
✅ **6.4: Health Metrics** - SLAs e targets definidos  
✅ **6.5: Workflows Agent Mapping** - Detalhamento completo  

**TOTAL**: 5 arquivos criados  
- AGENT_DIVISION_MAPPING.json
- DIVISAO_SKILLS_MATRIX.md
- INTER_AGENT_FLOWS.md
- AGENT_EXECUTION_MATRIX.json
- AGENT_HEALTH_METRICS.json
- WORKFLOWS_AGENT_MAPPING.md

**Status**: 🟢 PASSO 6 COMPLETO

---

## 🚀 PRÓXIMO: PASSO 7 - WORKFLOW ORCHESTRATION & AUTOMATION

Iniciando implementação de:
1. Agent Runtime Environment
2. Workflow Engine
3. n8n Cloud Integration
4. Monitoring & Alerting
5. Testes & Validation (5 dias)

**Timeline**: 2 semanas para PASSO 7
**Deadline**: 2026-04-27 (14 dias)
