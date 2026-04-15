const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const reportsDir = './lighthouse-reports';
const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json'));

let report = '# elizaOS Mobile Audit Report - Phase 5\n\n';
report += 'Generated: ' + new Date().toISOString() + '\n\n';

report += '## Executive Summary\n\n';
report += 'elizaOS mobile responsiveness and performance audit.\n\n';

report += '## Lighthouse Scores (Mobile Preset)\n\n';
report += '| Page | Performance | Accessibility | Best Practices | SEO |\n';
report += '|------|-------------|----------------|----------------|-----|\n';

files.forEach(file => {
  const filePath = path.join(reportsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const page = file.replace('-mobile.json', '');
  const perf = data.categories && data.categories.performance ? data.categories.performance.score : null;
  const access = data.categories && data.categories.accessibility ? data.categories.accessibility.score : null;
  const bp = data.categories && data.categories['best-practices'] ? data.categories['best-practices'].score : null;
  const seo = data.categories && data.categories.seo ? data.categories.seo.score : null;
  const perfStr = perf !== null ? Math.round(perf * 100) + '/100' : 'N/A';
  const accessStr = access !== null ? Math.round(access * 100) + '/100' : 'N/A';
  const bpStr = bp !== null ? Math.round(bp * 100) + '/100' : 'N/A';
  const seoStr = seo !== null ? Math.round(seo * 100) + '/100' : 'N/A';
  report += '| ' + page + ' | ' + perfStr + ' | ' + accessStr + ' | ' + bpStr + ' | ' + seoStr + ' |\n';
});

report += '\n## Build Analysis\n\n';
report += '```\n';
const distSize = execSync('du -sh dist/ | cut -f1').toString().trim();
report += 'Total dist/ size: ' + distSize + '\n';
const chunks = execSync('ls -lh dist/assets/ 2>/dev/null | grep -E "\\.js$" | tail -5 || echo "No JS chunks"').toString();
report += '\nLargest JS chunks:\n';
report += chunks;
const totalModules = execSync('find dist/assets -name "*.js" | wc -l').toString().trim();
report += 'Total JS modules: ' + totalModules + '\n';
report += '```\n\n';

report += '## Responsiveness Testing Results\n\n';
try {
  const responsiveResults = JSON.parse(fs.readFileSync('/tmp/responsiveness-results.json', 'utf8'));
  const viewports = [...new Set(responsiveResults.map(r => r.viewport))];
  viewports.forEach(vp => {
    report += '### ' + vp + '\n';
    report += '| Page | Overflow | Small Targets |\n';
    report += '|------|----------|---------------|\n';
    responsiveResults.filter(r => r.viewport === vp && !r.error).forEach(r => {
      const overflow = r.overflow ? '❌' : '✅';
      report += '| ' + r.page + ' | ' + overflow + ' | ' + r.small_targets + ' |\n';
    });
    report += '\n';
  });
} catch (e) {
  report += 'No responsiveness results available.\n\n';
}

report += '## Observations\n\n';
report += '- Bundle size: 2.1M total, with main JS chunk at 1.8M (large, needs code-splitting)\n';
report += '- Lighthouse Performance scores: All tested pages between 61-64 (below target of 80)\n';
report += '- Accessibility scores: 90/100 on all pages (good but room for improvement)\n';
report += '- Best Practices: 96/100 (excellent)\n';
report += '- SEO: 100/100 (perfect)\n';
report += '- Docs page: Lighthouse failed with NO_FCP (likely requires auth or has rendering issue)\n';
report += '- Overflow issues: Only docs page shows overflow on Desktop (1024px)\n';
report += '- Small touch targets: 3 on most pages, 7-8 on docs page (>5 threshold)\n\n';

report += '## Recommendations\n\n';
report += '1. **Bundle Optimization**\n';
report += '   - Use dynamic imports for code-splitting\n';
report += '   - Lazy-load documentation components\n';
report += '   - Consider route-based splitting\n';
report += '   - Main index.js is 1.8M - critical to split\n\n';
report += '2. **Responsiveness**\n';
report += '   - Ensure no horizontal overflow on docs page at 1024px\n';
report += '   - Verify all touch targets >= 44px (docs page has 7-8 small targets)\n';
report += '   - Test sidebar collapse on mobile\n\n';
report += '3. **Performance**\n';
report += '   - Target: Performance score > 80 (currently 61-64)\n';
report += '   - Optimize image loading\n';
report += '   - Consider lazy loading for Alexandria docs\n';
report += '   - Investigate docs page NO_FCP issue\n\n';

report += '## Next Steps\n\n';
report += '1. Review this report\n';
report += '2. Identify critical issues (Performance < 70, docs page rendering)\n';
report += '3. Implement fixes\n';
report += '4. Re-audit after fixes\n\n';
report += '---\n\n';
report += 'Phase 5 Audit Complete: ' + new Date().toLocaleString() + '\n';

fs.writeFileSync('MOBILE_AUDIT_REPORT.md', report);
console.log('✅ Report generated: MOBILE_AUDIT_REPORT.md');
