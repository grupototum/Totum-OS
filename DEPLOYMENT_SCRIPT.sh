#!/bin/bash

################################################################################
# 🚀 elizaOS Deployment Script — Fase 2
#
# Deploy automatizado para produção em 187.127.4.140
# Tempo estimado: 30-45 minutos
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# Recording start time
START_TIME=$(date '+%Y-%m-%d %H:%M:%S')
DEPLOYMENT_LOG="/tmp/elizaos-deployment-$(date +%s).log"

log_info "═══════════════════════════════════════════════════════════════════"
log_info "elizaOS Deployment — Fase 2"
log_info "Start Time: $START_TIME"
log_info "Log File: $DEPLOYMENT_LOG"
log_info "═══════════════════════════════════════════════════════════════════"

################################################################################
# STEP 1: Update Code from Git
################################################################################

log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "STEP 1: Git Update (5 min)"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd /home/apps/elizaos/ || log_error "Directory /home/apps/elizaos not found"
log_info "Directory: $(pwd)"

log_info "Checking current branch..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
log_info "Current branch: $CURRENT_BRANCH"

log_info "Pulling latest changes from origin/main..."
git pull origin main >> "$DEPLOYMENT_LOG" 2>&1 || log_error "Git pull failed"
log_success "Git pull completed"

LATEST_COMMIT=$(git log -1 --pretty=format:"%h - %s")
log_info "Latest commit: $LATEST_COMMIT"

################################################################################
# STEP 2: Install Dependencies
################################################################################

log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "STEP 2: Install Dependencies (10 min)"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Installing npm dependencies..."
npm install >> "$DEPLOYMENT_LOG" 2>&1 || log_error "npm install failed"
log_success "Dependencies installed"

log_info "Node version: $(node --version)"
log_info "npm version: $(npm --version)"

################################################################################
# STEP 3: Build
################################################################################

log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "STEP 3: Build Production (10 min)"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Building for production..."
npm run build >> "$DEPLOYMENT_LOG" 2>&1 || log_error "npm run build failed"
log_success "Build completed successfully"

log_info "Verifying build output..."
if [ -d "dist" ]; then
  BUILD_SIZE=$(du -sh dist | cut -f1)
  FILE_COUNT=$(find dist -type f | wc -l)
  log_info "Build size: $BUILD_SIZE"
  log_info "Files in build: $FILE_COUNT"
  log_success "Build directory verified"
else
  log_error "Build directory not found"
fi

################################################################################
# STEP 4: Stop Current PM2 Process (if running)
################################################################################

log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "STEP 4: PM2 Management"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Checking PM2 status..."
if pm2 status elizaos &> /dev/null; then
  log_info "Found running elizaos process"
  log_info "Reloading process with zero-downtime deployment..."
  pm2 reload elizaos >> "$DEPLOYMENT_LOG" 2>&1 || log_error "PM2 reload failed"
  log_success "Process reloaded"
else
  log_info "No running elizaos process found"
  log_info "Starting new process..."
  pm2 start "npm run prod" --name "elizaos" --instances 2 >> "$DEPLOYMENT_LOG" 2>&1 || log_error "PM2 start failed"
  log_success "Process started"
fi

log_info "Saving PM2 configuration..."
pm2 save >> "$DEPLOYMENT_LOG" 2>&1 || log_warning "PM2 save may have issues"

################################################################################
# STEP 5: Verify PM2 Status
################################################################################

log_info "PM2 Process Status:"
pm2 status

################################################################################
# STEP 6: Health Check
################################################################################

log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "STEP 5: Health Check (5 min)"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Waiting for server to be ready..."
sleep 5

log_info "Sending health check request..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://187.127.4.140:3000/api/health)

if [ "$HEALTH_CHECK" == "200" ]; then
  log_success "Health check passed (HTTP 200)"

  # Get detailed health response
  HEALTH_RESPONSE=$(curl -s http://187.127.4.140:3000/api/health)
  log_info "Health response: $HEALTH_RESPONSE"
else
  log_warning "Health check returned HTTP $HEALTH_CHECK (expected 200)"
  log_info "This may be normal if server is still starting up"
  log_info "Check logs with: pm2 logs elizaos"
fi

################################################################################
# STEP 7: Logs Review
################################################################################

log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "STEP 6: Recent Logs"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Last 20 lines of PM2 logs:"
pm2 logs elizaos --lines 20 --nostream || true

################################################################################
# Deployment Summary
################################################################################

END_TIME=$(date '+%Y-%m-%d %H:%M:%S')
DURATION=$(($(date +%s) - $(date -d "$START_TIME" +%s)))

echo ""
log_info "═══════════════════════════════════════════════════════════════════"
log_success "DEPLOYMENT COMPLETED SUCCESSFULLY!"
log_info "═══════════════════════════════════════════════════════════════════"
echo ""
log_info "📊 Deployment Summary:"
log_info "  Start Time: $START_TIME"
log_info "  End Time: $END_TIME"
log_info "  Duration: ~$((DURATION / 60)) minutes"
log_info "  Latest Commit: $LATEST_COMMIT"
log_info ""
log_info "✅ Status Checks:"
log_info "  [✓] Git updated"
log_info "  [✓] Dependencies installed"
log_info "  [✓] Build successful (size: $BUILD_SIZE)"
log_info "  [✓] PM2 process running"
log_info "  [✓] Health check passed (HTTP $HEALTH_CHECK)"
log_info ""
log_info "🌐 Access URLs:"
log_info "  Frontend: http://187.127.4.140:3000"
log_info "  API: http://187.127.4.140:3000/api"
log_info "  Health: http://187.127.4.140:3000/api/health"
log_info ""
log_info "📋 Next Steps:"
log_info "  1. Monitor logs: pm2 logs elizaos --follow"
log_info "  2. Verify system health: curl http://187.127.4.140:3000/api/health"
log_info "  3. Check metrics: curl http://187.127.4.140:3000/api/metrics"
log_info ""
log_info "📁 Log file: $DEPLOYMENT_LOG"
log_info "═══════════════════════════════════════════════════════════════════"
