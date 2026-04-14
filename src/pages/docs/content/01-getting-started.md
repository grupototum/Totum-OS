# Getting Started with elizaOS

## Welcome to elizaOS

elizaOS is an AI-powered agent orchestration platform that automates complex business processes through intelligent, specialized agents working together seamlessly.

Think of it as building a team of AI specialists, each with specific skills, who can collaborate to accomplish your business goals automatically.

## What You'll Learn

In this guide, you'll understand:
- **Agents**: Autonomous AI workers with specific roles
- **Workflows**: Automated sequences combining multiple agents
- **Alexandria**: Your AI-powered knowledge management system
- **How to get started**: Your first steps into elizaOS

## Key Concepts Explained

### Agents

Agents are autonomous AI specialists designed to perform specific tasks. Each agent:
- Has a defined role and expertise area
- Can work independently or collaborate with other agents
- Executes tasks based on your input and objectives
- Learns from interactions and improves over time

**Examples of agents:**
- Content Writer Agent: Creates marketing copy
- Data Analyst Agent: Analyzes metrics and generates reports
- Customer Support Agent: Handles inquiries and provides solutions
- SDR Agent: Identifies and qualifies leads

### Workflows

Workflows are orchestrated sequences where multiple agents work together. They:
- Define step-by-step automation sequences
- Handle complex business processes
- Manage dependencies between agents
- Run on schedules or on-demand

**Example workflow:**
```
Lead Discovery → Qualification → Email Outreach → Meeting Scheduling
(Agent 1)      (Agent 2)      (Agent 3)         (Agent 4)
```

### Alexandria

Alexandria is your intelligent knowledge base. It:
- Stores documents, processes, and institutional knowledge
- Searches using AI (not just keywords)
- Allows you to chat with GILES (AI librarian)
- Keeps your team's knowledge organized and accessible

### Command Center

The Command Center is your control hub where you:
- View system metrics and agent status
- Monitor active executions
- Access dashboards and reports
- Manage configurations

## Quick Start: 5 Minutes

### Step 1: Login
```
URL: http://187.127.4.140:3002/
Enter your credentials
```

### Step 2: Explore the Dashboard
You'll see:
- Key metrics (agents active, workflows running, documents stored)
- Recent activity feed
- System health status
- Quick action buttons

### Step 3: Visit Agent Lab
```
Click: Agent Lab (left sidebar)
Browse available agents
View their descriptions and capabilities
```

### Step 4: Execute Your First Agent
```
1. Click on an agent (e.g., "Content Writer")
2. Enter your objective (e.g., "Write a product announcement")
3. Click Execute
4. Wait for results
5. Review the output
```

### Step 5: Explore Alexandria
```
1. Click: Alexandria (left sidebar)
2. Upload a document (PDF, TXT, MD)
3. Ask GILES a question about your documents
4. See AI-powered search results
```

## Understanding the Interface

### Left Sidebar
Your navigation hub:
- **Command Center**: Dashboard and metrics
- **Agent Lab**: Create and execute agents
- **Workflow Studio**: Design and run workflows
- **Alexandria**: Knowledge base and search
- **Settings**: Configuration and preferences

### Main Area
- Dashboard: Overview and metrics
- Agent pages: Create, edit, execute agents
- Workflow pages: Design and manage automations
- Alexandria: Upload and search documents

### Top Right
- Your profile
- Notifications
- Help and documentation (?)
- Settings

## Common Tasks

### Creating an Agent
1. Go to Agent Lab
2. Click "New Agent"
3. Fill in details:
   - Name: Unique identifier
   - Role: What it does (e.g., "Content Creator")
   - Description: How it works
   - Skills: Select from available skills
4. Configure settings:
   - Model (Groq, Gemini, etc)
   - Temperature (creativity level: 0-1)
   - Max tokens (response length)
5. Save and test

### Building a Workflow
1. Go to Workflow Studio
2. Click "New Workflow"
3. Add steps by selecting agents
4. Configure input/output mapping
5. Set execution rules (sequential or parallel)
6. Test and deploy

### Uploading Documents
1. Go to Alexandria
2. Click "Upload"
3. Select file
4. Add metadata (title, tags, category)
5. Upload
6. Search immediately or ask GILES

## Best Practices

### For Agents
- Start with simple agents before complex ones
- Test agent outputs before using in workflows
- Document agent purpose for team reference
- Monitor execution times and costs
- Use appropriate models for task complexity

### For Workflows
- Design workflows to handle errors gracefully
- Log important steps for debugging
- Test workflows with sample data first
- Schedule workflows during off-peak hours if possible
- Monitor workflow performance regularly

### For Knowledge Management
- Keep documents organized with clear tags
- Update documents regularly
- Use consistent naming conventions
- Leverage GILES for searching and insights
- Archive outdated information

## System Architecture Overview

elizaOS runs on a modern stack:
- **Frontend**: React 18 with Tailwind CSS
- **Backend**: Node.js with orchestration
- **Database**: Supabase (PostgreSQL + vector search)
- **Local AI**: Ollama (Qwen3 for quick responses)
- **Cloud AI**: Groq, Gemini, GPT models (for complex tasks)

This hybrid approach means:
- Fast local responses when possible
- Powerful cloud models when needed
- No data leaves your servers unnecessarily
- Cost-optimized for scale

## Getting Help

### Documentation
- Check the **Documentation** section for detailed guides
- Use the **Troubleshooting** guide if you hit issues

### Chat Assistant
- Click the **?** button (top right) on any page
- Ask questions about the system
- Get step-by-step guidance
- Get context-aware help

### Common Issues
- Agent not executing? → See Troubleshooting guide
- Documents not found? → Check search terms and metadata
- Workflow stuck? → Monitor individual agents

## What's Next?

Now that you understand the basics:

1. **Explore Agents**: Visit Agent Lab and try different agents
2. **Build Your First Workflow**: Automate a simple process
3. **Upload Documents**: Build your knowledge base
4. **Invite Your Team**: Add colleagues and collaborate
5. **Scale Up**: Create more complex automations

## Important Reminders

- elizaOS learns from your usage patterns
- More specific objectives yield better results
- Monitor costs if using premium models
- Keep your documents updated for better search
- Save important workflows for reuse

---

**Ready to dive deeper?**

- Next: [Agents Guide](./02-agents-guide.md) - Learn everything about agents
- Or: [Workflows Guide](./03-workflows-guide.md) - Master workflow automation
- Or: [Alexandria Guide](./04-alexandria-guide.md) - Knowledge management secrets
