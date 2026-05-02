# Troubleshooting Guide

## Quick Diagnosis

**First Steps**:
1. Check elizaOS status: Command Center → Metrics (green = healthy)
2. Refresh page: Clear cache and reload
3. Check browser console: F12 → Console tab for errors
4. Try incognito mode: Eliminates cookie/cache issues
5. Check documentation: Your issue might be covered here

---

## Common Issues & Solutions

### Can't Login

**Symptom**: Login button doesn't work or gives error

**Solutions**:
1. Verify username/password (case-sensitive)
2. Check if account is active (contact admin if unsure)
3. Reset password if forgotten
   - Click "Forgot Password"
   - Enter email
   - Check inbox for reset link
4. Clear cookies and cache (Ctrl+Shift+Delete)
5. Try different browser
6. Check internet connection

**Still stuck**?: Contact system administrator

---

### Agent Not Executing

**Symptom**: Agent execution stuck, doesn't start, or fails immediately

**Diagnosis**:
1. Check agent status in dashboard
2. Review error message (look for clues)
3. Check input format (is it what agent expects?)
4. Verify model is available
5. Check API keys if using external model

**Solutions**:

**Error: "Model not available"**
- Agent's configured model offline or API key invalid
- Check API credentials in agent settings
- Try different model
- Use local Ollama if cloud model down

**Error: "Timeout"**
- Agent took too long
- Try reducing max_tokens
- Use faster model
- Test with simpler input

**Error: "Invalid input"**
- Agent expecting different format
- Check agent description for expected format
- Provide cleaner input
- Add context if needed

**Agent starts but no output**
- Check model output
- Agent might be running (wait longer)
- Check system resources (might be slow)
- Monitor in background

**Status "Running" for hours**
- Agent likely stuck
- Cancel execution
- Try with different settings
- Check system health

---

### Poor Quality Output

**Symptom**: Agent output is wrong, irrelevant, or low quality

**Root Causes & Solutions**:

**Vague input**
```
✗ "Write something"
✓ "Write LinkedIn post about AI automation, casual tone, 150 words"

✗ "Analyze data"
✓ "Analyze Q3 sales data and identify top 3 revenue trends"
```

**Wrong agent for task**
- Complex task needing reasoning? Use GPT-4, not Groq
- Simple task? Use fast Groq, not slow models
- Match agent capability to task complexity

**Temperature too high**
- Temperature 1.0 = very creative, inconsistent
- Temperature 0.0 = consistent, repetitive
- Try 0.6-0.7 for balanced results

**Token limit too low**
- max_tokens 500 = very short responses
- Response gets cut off?
- Increase max_tokens to 2000+

**Unclear instructions**
- Agent instructions ambiguous?
- Make instructions specific and detailed
- Add examples of desired output
- Clarify constraints

**Bad input data**
- Garbage in = garbage out
- Verify input quality
- Provide clean, complete data
- Add context if needed

---

### Workflow Issues

**Symptom**: Workflow fails, doesn't run, or produces wrong results

**Workflow Not Starting**

Check:
- Is workflow deployed?
- Trigger configured correctly?
- Trigger conditions met? (time, event, etc)
- Sufficient permissions?

**Solution**:
- Click "Test Workflow" to run manually
- If test works, trigger might have issue
- Re-configure trigger
- Check workflow logs for clues

**Workflow Fails at Specific Step**

Diagnosis:
- Check step error message
- Verify output from previous step
- Input mapping correct?
- Agent available/API key valid?

Solutions:
1. Check data format from Step N-1 matches Step N input
2. Add error handling (retry, fallback)
3. Test agent independently (run outside workflow)
4. Increase step timeout if data processing takes long

**Wrong Output from Workflow**

Causes:
- Agent quality issues (see above)
- Data mapping errors
- Wrong agent selected
- Agent settings wrong

Solutions:
1. Test each agent individually
2. Verify data transformations
3. Check input to each step
4. Add validation steps
5. Review agent outputs

**Workflow Too Slow**

Causes:
- Sequential steps that could parallel
- Expensive model choices
- Large token counts

Solutions:
- Run independent steps in parallel
- Use faster models (Groq vs GPT-4)
- Reduce max_tokens
- Reduce context window
- Schedule during off-peak

---

### Document/Alexandria Issues

**Documents Not Searchable**

Check:
- Upload completed?
- Document has text (not image-only PDF)?
- Sufficient metadata (title, tags)?

Solutions:
1. Re-upload document
2. Extract text from image PDF
3. Add meaningful title and tags
4. Use different search terms
5. Ask HERMIONE directly

**HERMIONE Gives Wrong Answer**

Causes:
- Question unclear
- Document doesn't contain answer
- Answer in different wording
- Multiple interpretations

Solutions:
1. Ask more specific question
2. Provide context
3. Suggest document to check
4. Upload clarifying document
5. Ask follow-up for clarification

**Can't Find Document**

Try:
- Different search terms
- Search by author/date
- Browse categories
- Check document tags
- Ask HERMIONE to find it
- Check if document uploaded

**Upload Fails**

Check:
- File format supported?
- File size < 100MB?
- Document has text?
- Storage space available?
- File not corrupted?

---

### Performance Issues

**Page Loads Slowly**

Causes:
- Large amount of data
- Network latency
- Browser cache full
- Too many tabs open

Solutions:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Close other tabs
3. Try different browser
4. Check internet speed
5. Reload page (F5)

**System Running Slow**

Check:
- CPU usage (Command Center → Metrics)
- Memory usage
- Network status
- Number of active agents/workflows

Solutions:
1. Stop unnecessary workflows
2. Schedule heavy tasks off-peak
3. Restart if needed
4. Check for resource leaks
5. Contact admin if persists

**API Calls Timing Out**

Causes:
- External API down
- Network latency
- Large data transfer
- Rate limiting

Solutions:
1. Check if external service status
2. Increase timeout settings
3. Reduce data size
4. Batch requests
5. Use retry logic

---

### Authentication & Permission Issues

**Error: "Unauthorized"**

Cause: Missing permissions

Solutions:
1. Check if you have access to this feature
2. Admin might need to grant permissions
3. Ask admin to add you to appropriate team/role
4. Verify account is active

**Can't Edit Agent/Workflow**

Cause: Insufficient permissions

Solutions:
1. Check if you're owner/admin
2. Ask owner to grant edit access
3. Duplicate and create your own version
4. Contact admin for access

**Session Expired**

Cause: Logged out due to inactivity

Solutions:
1. Login again
2. Refresh page (F5)
3. Clear cookies if problems persist
4. Contact admin if keeps happening

---

### Data & Integration Issues

**External API Not Responding**

Check:
- Is external service online?
- API credentials valid?
- Rate limits hit?
- Firewall/network issues?

Solutions:
1. Check service status page
2. Verify API keys in settings
3. Reset rate limiter or wait
4. Check network connectivity
5. Use retry logic

**Data Sync Not Working**

Causes:
- API connection failed
- Data format mismatch
- Credentials invalid
- Rate limit exceeded

Solutions:
1. Test connection
2. Verify data format
3. Check credentials
4. Add error logging
5. Retry with exponential backoff

**Wrong Data Format**

Cause: Integration expecting different format

Solutions:
1. Check expected format in documentation
2. Add transformation step in workflow
3. Map fields correctly
4. Test with sample data
5. Validate before sending

---

## Advanced Troubleshooting

### Checking Logs

**View execution logs**:
```
1. Find your agent/workflow
2. Click "History" or "Logs"
3. Select execution
4. View detailed logs
5. Look for error messages
```

**Common log indicators**:
- [ERROR]: Something failed
- [WARN]: Potential issue
- [DEBUG]: Detailed info for troubleshooting
- [INFO]: General information
- Timestamp: When issue occurred

### Testing in Isolation

```
Instead of running full workflow:

1. Test agent alone
2. Test with sample data
3. Verify output format
4. Check step by step
5. Then integrate into workflow
```

### Performance Profiling

```
Track metrics:
- Execution time per step
- Token usage per agent
- Cost per execution
- Success rate per agent
- Error frequency

Use to optimize:
- Identify slow steps
- Find expensive agents
- Detect patterns in failures
- Plan improvements
```

---

## When to Contact Admin

**Contact admin if**:
- System down or very slow
- Can't access features others can
- Security concern
- Need new model/API access
- Large-scale issues
- Permission problems

**Have ready**:
- Error messages (screenshot or text)
- Steps to reproduce
- When did it start?
- Your username
- Affected feature

---

## Prevention Tips

1. **Monitor regularly**: Check dashboard for issues
2. **Test before deploy**: Always test workflows
3. **Add error handling**: Configure retries and fallbacks
4. **Document processes**: Know how your automations work
5. **Regular backups**: Save important outputs
6. **Update regularly**: Keep agents and configs current
7. **Performance monitoring**: Track metrics over time
8. **Train your team**: Know how to use features

---

## Getting More Help

**In-app help**:
- Click "?" button on any page
- Use Documentation Chat
- Ask HERMIONE about docs

**Documentation**:
- Check relevant guide (Agents, Workflows, etc)
- Read Getting Started
- Review examples

**Contact Support**:
- Use help form with details
- Include error messages
- Describe steps to reproduce

---

*Remember: Most issues have simple solutions. Start with basics (refresh, restart, check settings) before escalating.*
