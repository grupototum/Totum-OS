# Agents Guide: Master Your AI Specialists

## What Are Agents?

Agents are autonomous AI specialists trained to perform specific tasks. In elizaOS, agents are your team of AI workers that can:
- Work independently on their assigned tasks
- Collaborate with other agents in workflows
- Learn from feedback and improve
- Execute 24/7 without human intervention

Think of an agent like hiring a specialized consultant for a specific job.

## Agent Types in elizaOS

### Content Agents
- **Content Writer**: Creates articles, blog posts, social media content
- **Copywriter**: Writes marketing copy, headlines, call-to-actions
- **Script Generator**: Creates video and podcast scripts
- **Email Composer**: Drafts email campaigns and templates

### Analysis Agents
- **Data Analyst**: Analyzes metrics, trends, and insights
- **Sentiment Analyzer**: Reads customer feedback and extracts insights
- **Competitor Analyst**: Researches competitors and market trends
- **Report Generator**: Creates summaries and reports

### Sales & Marketing Agents
- **Lead Prospector**: Identifies and qualifies potential leads
- **Email Outreach**: Sends personalized outreach messages
- **Social Media Manager**: Plans and schedules content
- **Campaign Optimizer**: Tests and improves campaigns

### Operations Agents
- **Task Scheduler**: Schedules and manages recurring tasks
- **Document Processor**: Extracts and processes document information
- **Quality Checker**: Reviews outputs for quality and compliance
- **Integration Manager**: Connects with external systems

## Creating an Agent

### Step-by-Step Process

**1. Navigate to Agent Lab**
```
Click: Agent Lab (left sidebar)
Click: "New Agent" (top right)
```

**2. Basic Information**
```
Name: Unique identifier
  - Use lowercase, hyphens ok
  - Example: "content-writer-v1"

Role: What this agent does
  - Example: "Content Creator"

Description: How it works
  - Explain its purpose and capabilities
  - 1-2 sentences
```

**3. Select Skills**
```
Choose which skills this agent has:
- Writing
- Analysis
- Research
- Scheduling
- Integration
- Etc.

Each skill adds capability
You can add/remove skills later
```

**4. Model Configuration**
```
Model: Which AI powers this agent
- Groq (fast, free tier)
- Gemini (powerful, flexible)
- GPT-4 (advanced reasoning)
- Local Ollama (fast, no cost)

Temperature: Creativity vs consistency
- 0.0 = Very consistent, factual
- 0.5 = Balanced
- 1.0 = Creative, varied responses
  
Max Tokens: Response length
- 500 = Short responses
- 2000 = Medium responses  
- 4000+ = Long-form content

Context Window: How much history it remembers
- More = better quality, higher cost
```

**5. Custom Instructions (Optional)**
```
Add specific instructions:
- Writing style preferences
- Brand voice guidelines
- Specific formats to follow
- Things to avoid
```

**6. Review & Save**
```
Review all settings
Click: Save Agent
Agent is now available to use
```

## Executing an Agent

### From Agent Lab

**Step 1: Select Agent**
```
Go to: Agent Lab
Find your agent in the list
Click on it
```

**Step 2: Enter Objective**
```
Click: Execute
Enter your request/objective:
- Be specific about what you want
- Provide context if needed
- Example: "Write a LinkedIn post about AI automation, casual tone, 150 words"
```

**Step 3: Provide Input (Optional)**
```
Add relevant information:
- Source material
- Data to analyze
- Context or background
- Any constraints
```

**Step 4: Execute**
```
Click: Run
Agent processes your request
You see: Status, progress, ETA
```

**Step 5: Review Output**
```
Agent returns results
Review for quality
Options:
- Accept and use
- Regenerate with different settings
- Edit and refine
- Save as template
```

## From Workflows

Agents in workflows execute automatically based on:
- Triggers (schedule, webhook, manual)
- Inputs from previous steps
- Configured settings
- Error handling rules

See: [Workflows Guide](./03-workflows-guide.md)

## Advanced Agent Usage

### Chaining Agents
Combine multiple agents sequentially:
```
Agent 1 (Research) → Agent 2 (Analyze) → Agent 3 (Summarize)
     Input              Output from 1         Output from 2
```

### Parallel Execution
Run agents simultaneously for speed:
```
Agent A ─┐
Agent B ─┤─→ Combine Results
Agent C ─┘
```

### Conditional Logic
Route based on conditions:
```
If quality > threshold → Use output
Else → Re-run with different parameters
```

### Error Handling
Agents can recover from errors:
```
Try Agent with Model A
If fails → Try with Model B
If still fails → Use fallback output
```

## Agent Performance Metrics

Monitor your agents:

### Execution Time
- Average time per execution
- Trend over time
- Performance by model

### Success Rate
- Successful executions
- Failed executions
- Retry rate

### Cost
- Tokens used
- Model costs
- Cost per execution

### Quality
- User ratings
- Output consistency
- Improvement over time

## Best Practices for Agents

### Design Principles
1. **Single Responsibility**: Each agent does one thing well
2. **Clear Purpose**: Define exactly what it does
3. **Consistent Output**: Similar inputs produce similar quality outputs
4. **Proper Scoping**: Don't make agents do too much

### Configuration Tips
1. **Start Simple**: Basic settings first, optimize later
2. **Test Before Deploy**: Always test new agents
3. **Monitor Performance**: Track quality and costs
4. **Update Regularly**: Refine instructions based on results
5. **Document Everything**: Record agent purpose and usage

### Prompt Engineering
Write clear agent instructions:
```
✓ GOOD: "Analyze sales data for Q3 and identify top 3 trends"
✗ BAD: "Analyze data"

✓ GOOD: "Write friendly, casual tone. Max 150 words. Include emoji."
✗ BAD: "Write something"

✓ GOOD: "Return response in JSON format with these fields: ..."
✗ BAD: "Return response"
```

### Resource Management
- Use Groq/Ollama for simple tasks (faster, cheaper)
- Use Gemini/GPT-4 for complex reasoning
- Reuse agents across workflows (cost efficient)
- Monitor token usage (can add up quickly)

## Troubleshooting Agents

### Agent Not Executing
**Symptoms**: Execution stuck or fails immediately

**Solutions**:
1. Check agent status in dashboard
2. Verify model is available (check API keys)
3. Review error message carefully
4. Test with simpler objective first
5. Check input format (does agent expect JSON? Plain text?)

### Poor Quality Output
**Symptoms**: Agent output is irrelevant, inconsistent, or wrong

**Solutions**:
1. Refine agent instructions (be more specific)
2. Lower temperature (more consistent)
3. Provide better context/examples
4. Try different model
5. Break complex task into multiple agents
6. Add validation step after agent

### Unexpected Results
**Symptoms**: Agent producing weird or off-topic responses

**Solutions**:
1. Check agent instructions (any ambiguity?)
2. Review input provided to agent
3. Increase context window (more memory)
4. Test with different examples
5. Consider if task is too complex for agent

### Performance Issues
**Symptoms**: Agent runs slowly or times out

**Solutions**:
1. Reduce max tokens (shorter responses)
2. Use faster model (Groq instead of GPT-4)
3. Reduce context window
4. Break task into smaller pieces
5. Check for external API delays

## Agent Examples

### Example 1: Content Writer Agent

```
Name: content-writer-blog
Role: Blog Post Writer
Model: Gemini (creative, good writing)
Temperature: 0.7 (balanced)
Max Tokens: 2000

Custom Instructions:
- Write in casual, engaging tone
- Include examples and analogies
- Structure with clear headings
- Add call-to-action at end
- Target: Marketing professionals
```

Usage:
```
Input: "Write blog post about AI automation benefits"
Output: 1500-word blog post, ready to publish
```

### Example 2: Data Analyst Agent

```
Name: data-analyst-metrics
Role: Metrics Analyzer
Model: GPT-4 (reasoning, analysis)
Temperature: 0.3 (consistent, analytical)
Max Tokens: 1000

Custom Instructions:
- Identify trends in data
- Highlight anomalies
- Suggest improvements
- Use percentages and comparisons
- Focus on actionable insights
```

Usage:
```
Input: Sales data CSV
Output: Analysis report with 3 key insights and recommendations
```

### Example 3: Email Outreach Agent

```
Name: email-outreach-sales
Role: Sales Email Writer
Model: Groq (fast, efficient)
Temperature: 0.6 (personalized)
Max Tokens: 500

Custom Instructions:
- Personalize with prospect name
- Keep to 3-4 sentences
- Include specific value proposition
- Add soft CTA (not pushy)
- Professional but friendly tone
```

Usage:
```
Input: Prospect name, company, role, pain point
Output: Personalized email ready to send
```

## Integration with Workflows

Agents power workflows. Example:
```
Workflow: "Weekly Report Generation"

Step 1: Data Collector Agent
- Gathers metrics from all sources
- Output: Structured data

Step 2: Data Analyst Agent  
- Analyzes data
- Output: Insights and trends

Step 3: Report Writer Agent
- Creates formatted report
- Output: Polished report document

Step 4: Email Agent
- Sends to stakeholders
- Output: Confirmation
```

## Next Steps

- **Run Your First Agent**: Pick an agent and execute it
- **Create Custom Agent**: Design one for your specific need
- **Explore Workflows**: Combine agents for automation
- **Monitor Performance**: Track quality and costs

---

**Need help?** Use the chat assistant to ask about agents or specific tasks.
