# Workflows Guide: Automate Everything

## What Are Workflows?

Workflows are multi-step automation sequences where agents work together to accomplish complex business processes. Instead of running agents manually, workflows run automatically based on triggers and conditions.

Think of a workflow as a recipe: specific steps in a specific order, with agents handling each step.

## Workflow Concepts

### Components

**1. Trigger**: What starts the workflow
- Schedule (every day, week, month)
- Manual (click to run)
- Webhook (external system triggers)
- Event (something happens in elizaOS)

**2. Steps**: Sequential or parallel agent executions
- Each step uses one or more agents
- Steps can have conditions
- Steps can have error handling

**3. Data Flow**: How data moves between steps
- Output from step 1 → Input to step 2
- Mapping ensures correct format
- Transformations available if needed

**4. Actions**: What happens when workflow completes
- Save results to database
- Send email with results
- Update external system
- Trigger next workflow
- Store in Alexandria

### Workflow Patterns

**Sequential**: One step after another
```
Step 1 → Step 2 → Step 3 → Step 4
```
Best for: Step-by-step processes with dependencies

**Parallel**: Multiple steps at once
```
        ┌─ Step 2 ─┐
Step 1 ─┤         ├─ Step 4
        └─ Step 3 ─┘
```
Best for: Independent tasks that can run simultaneously

**Conditional**: Different paths based on conditions
```
Step 1 ─ If condition A → Step 2A → Step 3
      └─ If condition B → Step 2B → Step 3
```
Best for: Different processing based on input

**Looping**: Repeat steps until condition met
```
Step 1 → Step 2 (Loop until done) → Step 3
```
Best for: Processing variable amounts of data

## Creating a Workflow

### Step 1: Define Purpose
Before building, clarify:
- What problem does it solve?
- What triggers it?
- What's the desired output?
- How often runs it?

### Step 2: Plan Steps
List the agents/actions needed:
```
Example: Lead Qualification Workflow

1. Receive lead data
2. Validate contact information
3. Check against CRM (already customer?)
4. Score lead quality
5. Send notification to sales
6. Schedule follow-up
```

### Step 3: Create in Workflow Studio

**1. New Workflow**
```
Click: Workflow Studio
Click: New Workflow
Enter name and description
```

**2. Add Trigger**
```
Choose trigger type:
- Schedule: Daily at 9 AM
- Manual: Click to run
- Webhook: External system calls
- Event: Specific event occurs

Configure trigger details
```

**3. Add Steps**
```
Click: Add Step
Select agent or action
Configure:
- Input mapping (where does data come from?)
- Settings (temperature, tokens, etc)
- Timeout (how long to wait?)
- Error handling (what if it fails?)
- Output mapping (what to pass to next step?)

Repeat for each step
```

**4. Configure Data Flow**
```
Connect step outputs to next step inputs
Example:
- Step 1 output "emails" → Step 2 input "contact_list"
- Step 2 output "validated_emails" → Step 3 input "emails"

Ensure data types match
```

**5. Add Post-Actions**
```
When workflow completes:
- Save results where?
- Notify whom?
- Trigger other workflows?
- Update external systems?
```

**6. Test & Deploy**
```
Click: Test
Run with sample data
Review results
If ok: Click Deploy
If not: Fix and test again
```

## Workflow Examples

### Example 1: Daily Content Generation

```
Name: Daily Blog Post Generator
Schedule: Every weekday at 8 AM

Step 1: Topic Selector
- Agent: Topic Researcher
- Input: Blog category, target keywords
- Output: 5 topic ideas ranked by relevance

Step 2: Content Writer
- Agent: Blog Post Writer
- Input: Selected topic from Step 1
- Output: 1500+ word blog post

Step 3: Quality Check
- Agent: Content Reviewer
- Input: Blog post from Step 2
- Output: Quality score, suggestions

Step 4: Post Action
- If quality score > 0.8: Save to Alexandria
- Send email to content team
```

### Example 2: Lead Qualification Workflow

```
Name: Lead Auto-Qualification
Trigger: New lead submitted via web form

Step 1: Data Validation
- Agent: Data Validator
- Input: Form submission
- Output: Validated contact info

Step 2: CRM Check (Parallel)
- Agent: CRM Lookup
- Input: Email from Step 1
- Output: Is existing customer?

Step 3: Lead Scoring (Parallel)
- Agent: Lead Scorer
- Input: Validated data from Step 1
- Output: Lead quality score (1-100)

Step 4: Route Decision
- If existing customer: Route to Account Manager
- If high quality (>80): Route to Sales
- If medium quality: Add to nurture sequence
- If low quality: Archive

Step 5: Notify
- Agent: Email Sender
- Input: Routing decision
- Output: Email sent to appropriate team
```

### Example 3: Weekly Report Generation

```
Name: Weekly Performance Report
Schedule: Every Monday at 9 AM

Step 1: Data Collection (Parallel)
- Agent 1: Collect Sales Metrics
- Agent 2: Collect Marketing Metrics  
- Agent 3: Collect Operations Metrics
- Output: Three data sets

Step 2: Analysis (Parallel)
- Agent 1: Analyze Sales Data
- Agent 2: Analyze Marketing Data
- Agent 3: Analyze Operations Data
- Output: Three analysis reports

Step 3: Consolidation
- Agent: Report Consolidator
- Input: Three reports from Step 2
- Output: Single comprehensive report

Step 4: Distribution
- Send to leadership team
- Save to Alexandria
- Create Slack notification
```

## Advanced Workflow Features

### Error Handling

```
For each step, configure what happens if it fails:

Option 1: Retry
- Retry up to 3 times
- Wait 60 seconds between retries
- Then fail or use fallback

Option 2: Fallback
- If Step 2 fails, use static/default data
- Continue to Step 3 with fallback

Option 3: Notify & Stop
- Send alert to admin
- Stop workflow
- Require manual intervention

Option 4: Alternative Path
- If Step 2 fails, go to Step 2B instead
- Continue normally
```

### Conditional Logic

```
After Step 2, check condition:

If lead_score > 80:
  → Route to sales team
Else if lead_score > 50:
  → Add to nurture sequence  
Else:
  → Archive

Different agents or paths based on conditions
```

### Data Transformation

```
Between steps, transform data if needed:

Step 1 output format:
{
  "name": "John Doe",
  "email": "john@example.com"
}

Transform to Step 2 input format:
{
  "customer_name": "John Doe",
  "contact_email": "john@example.com"
}
```

### Scheduling

```
Choose when workflow runs:

- One time: "Run once at 2 PM next Tuesday"
- Recurring: 
  - Every day at 9 AM
  - Every Monday at 8 AM
  - Every 1st of month at 9 AM
  - Every 4 hours
  - Custom cron expression

Timezone-aware scheduling
Avoid peak hours if cost-conscious
```

## Monitoring Workflows

### Dashboard

View for each workflow:
- Last run time
- Status (success/failed/running)
- Duration (how long it took)
- Results (what was output)
- Cost (tokens used, API charges)

### Execution History

See past executions:
- When it ran
- How long it took
- What errors occurred
- What was output

### Performance Metrics

Track over time:
- Average execution time
- Success rate
- Cost per execution
- Most common errors

## Best Practices

### Design
1. Keep workflows focused (one business process per workflow)
2. Use parallel steps when possible (faster)
3. Add error handling (don't let workflows silently fail)
4. Test with real data before deploying
5. Document purpose and expected outputs

### Execution
1. Schedule computationally intensive workflows during off-peak hours
2. Monitor costs, especially with expensive models
3. Use notifications for important workflows
4. Archive results for auditability
5. Regularly review and optimize

### Optimization
1. Reduce token usage (shorter outputs = cheaper)
2. Use faster models for simple tasks
3. Combine steps when possible
4. Cache results when applicable
5. Monitor and alert on failures

## Workflow Performance Tips

### Speed Up
- Use parallel steps instead of sequential
- Use faster models (Groq instead of GPT-4)
- Reduce max_tokens in agent config
- Simplify data transformations

### Save Money
- Use Groq/Ollama for simple tasks
- Reduce token usage (shorter prompts/outputs)
- Schedule during lower-demand times
- Reuse workflows (don't rebuild)

### Improve Reliability
- Add error handling to all steps
- Test before deploying
- Monitor execution history
- Set up alerts for failures
- Have fallback options

## Common Patterns

### Content Pipeline
```
Topic Research → Write → Edit → Publish → Social Promotion
```

### Lead Management
```
Lead Received → Validate → Score → Qualify → Route → Notify
```

### Data Pipeline
```
Extract → Transform → Analyze → Report → Distribute
```

### Customer Support
```
Ticket Received → Categorize → Route → Respond → Follow-up
```

## Troubleshooting

### Workflow Not Running
**Check**:
- Trigger configured correctly?
- Workflow deployed?
- Trigger conditions met?
- Permissions set correctly?

### Workflow Fails at Step 2
**Check**:
- Data format from Step 1 correct?
- Step 2 input mapping correct?
- Step 2 agent available?
- Error message in logs?

### Poor Output Quality
**Check**:
- Agent instructions clear?
- Input data good quality?
- Temperature appropriate?
- Try different model?

### Workflow Too Slow
**Check**:
- Are steps sequential unnecessarily?
- Can any run in parallel?
- Can you use faster model?
- Reduce max_tokens?

## Next Steps

- **Build Your First Workflow**: Automate a manual process
- **Monitor Performance**: Track costs and execution time
- **Optimize**: Improve speed and quality
- **Scale**: Add more workflows as you succeed

---

**Need help?** Use the chat to ask about workflow design or troubleshooting.
