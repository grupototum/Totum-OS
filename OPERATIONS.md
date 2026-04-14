# 🔧 Operations & Maintenance Guide

**Production deployment, monitoring, and troubleshooting procedures**

---

## Deployment Configuration

### VPS Details
```
Provider: Hostinger KVM4
IP Address: 187.127.4.140
OS: Ubuntu 24
Directory: /home/apps/elizaos/
Process Manager: PM2
```

### Pre-Deployment Checklist

```bash
# 1. SSH into server
ssh root@187.127.4.140

# 2. Navigate to project
cd /home/apps/elizaos/

# 3. Update from Git
git pull origin main

# 4. Install dependencies
npm install

# 5. Build
npm run build

# 6. Verify build success
ls -la dist/

# 7. Check existing PM2 processes
pm2 status

# 8. Start/restart with PM2
pm2 start "npm run prod" --name "elizaos" --instances 2

# 9. Verify running
pm2 status
pm2 logs elizaos --lines 50

# 10. Test health endpoint
curl http://187.127.4.140:3000/api/health
```

---

## Daily Operations

### Morning Health Check (9 AM)

```bash
# 1. Check system status
curl http://187.127.4.140:3000/api/health

# Expected response:
# {"status":"ok","agents":{"online":56,...}}

# 2. Review overnight logs
pm2 logs elizaos --err

# Look for:
# - ERROR messages
# - CRITICAL errors
# - Agent failures
# - API timeouts

# 3. Check metrics
curl http://187.127.4.140:3000/api/metrics?period=24h

# Monitor:
# - successRate (should be > 99%)
# - avgExecutionTime (should be < 3 min)
# - errorCount (should be < 5)
```

### Error Log Review

```bash
# SSH to server
ssh root@187.127.4.140

# View error logs
pm2 logs elizaos --err --lines 100

# Filter for specific errors
pm2 logs elizaos | grep ERROR

# If issues found:
# 1. Note timestamp and error
# 2. Check agent status
# 3. Determine if restart needed
# 4. Restart if necessary: pm2 restart elizaos
```

### Real-Time Monitoring

```bash
# SSH to server
ssh root@187.127.4.140

# Monitor process status and resources
pm2 monit

# Watch: CPU, Memory, restart count
# Exit with: Ctrl+C

# Check logs in real-time
pm2 logs elizaos --follow
```

---

## Weekly Maintenance

### Database Cleanup (Monday Morning)

```bash
# SSH to server
ssh root@187.127.4.140

# Login to Supabase PostgreSQL
psql -h db.supabase.co -U postgres -d elizaos

# Remove old logs (keep 30 days)
DELETE FROM agent_executions 
WHERE created_at < NOW() - INTERVAL '30 days';

# Remove resolved alerts (keep 7 days)
DELETE FROM alerts 
WHERE status = 'resolved' 
  AND resolved_at < NOW() - INTERVAL '7 days';

# Optimize database
VACUUM ANALYZE;

# Check table sizes
SELECT schemaname, tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Exit psql
\q
```

### Backup Verification

```bash
# SSH to server
ssh root@187.127.4.140

# Check backup directory
ls -lah /backups/elizaos/

# Expected: Daily backups for last 7 days
# Each backup: 10-50 MB (depending on data)

# Verify last backup integrity
pg_restore --list /backups/elizaos/backup-latest.dump | head -20

# Test restore (to temp database)
createdb elizaos_restore_test
pg_restore -d elizaos_restore_test /backups/elizaos/backup-latest.dump

# Verify test database
psql -d elizaos_restore_test -c "SELECT COUNT(*) FROM agent_executions;"

# Clean up test database
dropdb elizaos_restore_test
```

### Performance Analysis

```bash
# SSH to server
ssh root@187.127.4.140

# Check slow queries
psql -h db.supabase.co -U postgres -d elizaos

SELECT query, calls, mean_time, max_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

# Exit
\q

# Check API response times
pm2 logs elizaos | grep "response_time" | tail -50

# Calculate average
pm2 logs elizaos | grep "response_time" | \
  awk -F'response_time:' '{print $2}' | \
  awk '{sum+=$1; count++} END {print "Average: " sum/count "ms"}'
```

### Security Audit

```bash
# SSH to server
ssh root@187.127.4.140

# Check for unauthorized access
grep "401\|403" /var/log/elizaos/*.log | wc -l

# Check failed login attempts
grep "AUTHENTICATION_FAILED" /var/log/elizaos/*.log

# Review API keys (rotate if needed)
# (In dashboard)

# Check SSL certificate expiry
openssl s_client -connect 187.127.4.140:443 -servername elizaos.local \
  2>/dev/null | grep "notAfter"

# Update dependencies
npm audit
npm update

# Review recent changes
git log --oneline -20
```

---

## Monthly Tasks

### Cost Analysis

```bash
# Get monthly metrics
curl http://187.127.4.140:3000/api/metrics?period=30d

# Calculate:
# - Total cost: /summary/totalCost
# - Cost per agent
# - Cost per execution (/summary/costPerExecution)
# - Compare to budget

# Optimization opportunities:
# - Agents running inefficiently?
# - Workflows with high error rates?
# - Unnecessary API calls?
```

### Capacity Planning

```bash
# Current capacity
# - 57 agents
# - 20 workflows
# - 50+ daily executions
# - 500+ concurrent operations

# Growth analysis (last 30 days)
curl http://187.127.4.140:3000/api/metrics?period=30d

# Calculate:
# - Execution growth rate
# - Resource usage trend
# - When will we hit limits?

# Action if hitting limits:
# - Scale database (increase Supabase tier)
# - Add more servers
# - Optimize slow agents
```

### Major Updates

```bash
# Check for major updates
npm outdated

# Test in staging first
git checkout -b feature/update-dependencies
npm update
npm run build
npm run test

# If all tests pass:
git push origin feature/update-dependencies
# Create PR and get review

# After approval and merge to main:
git pull origin main
npm install
npm run build
npm run test
pm2 restart elizaos
```

---

## Troubleshooting

### Issue: Agent Not Responding

**Symptoms**: Agent returns 500 error or hangs

**Diagnosis**:
```bash
# 1. Check agent status
curl http://187.127.4.140:3000/api/agents/[AGENT_ID]

# 2. Check logs for errors
pm2 logs elizaos | grep [AGENT_ID]

# 3. Check if process is stuck
pm2 monit

# 4. Check database connection
psql -h db.supabase.co -U postgres -c "SELECT 1;"
```

**Solutions**:
```bash
# Solution 1: Restart agent
pm2 restart elizaos

# Solution 2: Check dependencies
npm audit
npm update

# Solution 3: Clear cache
redis-cli FLUSHDB

# Solution 4: Recreate connection
# In code: force reconnect to database
curl http://187.127.4.140:3000/api/agents/[AGENT_ID]/reconnect

# Solution 5: If still failing
pm2 kill
npm run prod
```

---

### Issue: Tests Failing

**Symptoms**: `npm run test` fails

**Diagnosis**:
```bash
# 1. Run specific failing test
npm run test -- [test-name]

# 2. Run with verbose output
npm run test -- --reporter=verbose

# 3. Check test coverage
npm run coverage

# 4. Check dependencies
npm install
```

**Solutions**:
```bash
# Solution 1: Clean reinstall
rm -rf node_modules package-lock.json
npm install
npm run test

# Solution 2: Check Node version
node --version  # Should be 18+

# Solution 3: Fix test issues
npm run test -- --debug

# Solution 4: Check environment
cat .env | head -10

# Solution 5: Run single test
npm run test -- monitoring-service.unit.test.ts --run
```

---

### Issue: High Latency

**Symptoms**: API responses slow (> 500ms), agents taking > 5 min

**Diagnosis**:
```bash
# 1. Check CPU/Memory
pm2 monit

# 2. Check database
psql -h db.supabase.co -U postgres -d elizaos \
  -c "SELECT datname, usename, state, query 
      FROM pg_stat_activity 
      WHERE datname = 'elizaos';"

# 3. Check network
ping google.com
ping db.supabase.co

# 4. Check slow queries
psql -h db.supabase.co -U postgres -d elizaos \
  -c "SELECT query, calls, mean_time 
      FROM pg_stat_statements 
      ORDER BY mean_time DESC LIMIT 5;"
```

**Solutions**:
```bash
# Solution 1: Add indexes
psql -h db.supabase.co -U postgres -d elizaos \
  -c "CREATE INDEX idx_exec_agent_time 
      ON agent_executions(agent_id, created_at DESC);"

# Solution 2: Increase cache TTL
# In code: redis.set(key, value, 'EX', 7200)

# Solution 3: Clear cache
redis-cli FLUSHDB

# Solution 4: Upgrade database
# (Supabase dashboard → Project settings)

# Solution 5: Add read replicas
# (Supabase enterprise feature)

# Solution 6: Optimize agents
# Identify slow agents and optimize their logic
npm run profile -- [AGENT_ID]
```

---

### Issue: High Cost

**Symptoms**: Monthly bill higher than expected

**Diagnosis**:
```bash
# Get cost breakdown
curl http://187.127.4.140:3000/api/metrics?period=30d

# Analyze:
# - Cost per agent
# - Cost per execution
# - Cost trend

# Identify expensive agents
jq '.byAgent | sort_by(.cost) | reverse | .[0:5]' metrics.json

# Check for inefficient workflows
curl http://187.127.4.140:3000/api/workflows?sort=cost
```

**Solutions**:
```bash
# Solution 1: Optimize agents
# Reduce API calls, cache results

# Solution 2: Batch operations
# Execute multiple leads in one workflow

# Solution 3: Schedule jobs off-peak
# Use cron for non-urgent workflows

# Solution 4: Use cheaper models
# Downgrade agent tiers where possible

# Solution 5: Reduce logging
# Lower log verbosity for non-critical agents

# Solution 6: Review usage patterns
# Are some workflows running unnecessarily?
```

---

### Issue: Database Connection Error

**Symptoms**: "Database connection failed", "Connection pool exhausted"

**Diagnosis**:
```bash
# 1. Check Supabase status
curl https://status.supabase.com/api

# 2. Test connection
psql -h db.supabase.co -U postgres -c "SELECT 1;"

# 3. Check connection pool
psql -h db.supabase.co -U postgres -d elizaos \
  -c "SHOW max_connections;"

# 4. Check active connections
psql -h db.supabase.co -U postgres -d elizaos \
  -c "SELECT COUNT(*) FROM pg_stat_activity;"
```

**Solutions**:
```bash
# Solution 1: Increase connection pool
# .env: DATABASE_POOL_MAX=50

# Solution 2: Restart connection
pm2 restart elizaos

# Solution 3: Close idle connections
psql -h db.supabase.co -U postgres -d elizaos \
  -c "SELECT pg_terminate_backend(pid) 
      FROM pg_stat_activity 
      WHERE state = 'idle' 
        AND state_change < NOW() - INTERVAL '1 hour';"

# Solution 4: Check firewall
# VPS → Security settings → Allow Supabase IPs

# Solution 5: Upgrade Supabase tier
# (Dashboard → Project settings)
```

---

## Disaster Recovery

### System Down - Quick Recovery

```bash
# 1. SSH to server
ssh root@187.127.4.140

# 2. Check what failed
pm2 logs elizaos --err --lines 100

# 3. Check process status
pm2 status

# 4. Restart if process crashed
pm2 restart elizaos

# 5. Verify running
pm2 status
curl http://187.127.4.140:3000/api/health

# 6. If still down:
pm2 kill
npm run prod

# 7. Check logs
pm2 logs elizaos --follow

# 8. If data issue:
# Restore from backup (see next section)
```

### Restore from Backup

```bash
# 1. SSH to server
ssh root@187.127.4.140

# 2. Get latest backup
ls -la /backups/elizaos/ | head -5

# 3. Create restore database
psql -h db.supabase.co -U postgres \
  -c "CREATE DATABASE elizaos_restore;"

# 4. Restore from backup
pg_restore -h db.supabase.co -U postgres \
  -d elizaos_restore \
  /backups/elizaos/backup-2026-04-14.dump

# 5. Verify restore
psql -h db.supabase.co -U postgres \
  -d elizaos_restore \
  -c "SELECT COUNT(*) FROM agent_executions;"

# 6. If valid, switch to restored database
# (Manual: rename databases in Supabase)

# 7. Restart application
pm2 restart elizaos
```

---

## Monitoring Checklists

### Daily (Morning)
- [ ] System health check
- [ ] Error log review
- [ ] Success rate > 99%
- [ ] No critical alerts

### Weekly (Monday)
- [ ] Database cleanup
- [ ] Backup verification
- [ ] Performance analysis
- [ ] Security audit
- [ ] Dependency updates

### Monthly
- [ ] Cost analysis
- [ ] Capacity planning
- [ ] Update review
- [ ] Disaster recovery test

### Quarterly
- [ ] Full system audit
- [ ] Performance optimization
- [ ] Security penetration test
- [ ] Capacity upgrade planning

---

## Command Reference

```bash
# PM2 Management
pm2 start "npm run prod"      # Start process
pm2 stop elizaos              # Stop process
pm2 restart elizaos           # Restart process
pm2 delete elizaos            # Delete process
pm2 logs elizaos              # View logs
pm2 monit                     # Monitor resources
pm2 save                      # Save config

# Database
psql -h db.supabase.co -U postgres -d elizaos
\dt                          # List tables
\d agent_executions          # Table schema
SELECT COUNT(*) FROM agents; # Count records
\q                           # Exit

# Testing
npm run test                 # Run all tests
npm run test:watch          # Watch mode
npm run coverage            # Coverage report
npm run lint                # Code quality

# Build & Deploy
npm install                 # Install deps
npm run build               # Build
npm run prod                # Production run
npm run dev                 # Development

# Utilities
curl http://localhost:3000/api/health  # Health check
redis-cli PING              # Redis check
```

---

## Contact & Escalation

**Primary Contact**: [Your email]
**Slack Channel**: #elizaos-production
**On-Call Schedule**: [Link to on-call schedule]

**Escalation Path**:
1. Self-healing (automatic restart)
2. Manual restart
3. Engineering team notification
4. Management notification
5. CEO notification (critical)

---

**Operations Guide Version**: 1.0
**Last Updated**: 2026-04-14
**Status**: Production Ready ✅
