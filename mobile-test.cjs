const puppeteer = require('puppeteer');

const viewports = [
  { name: 'iPhone SE (375px)', width: 375, height: 667, deviceScaleFactor: 2 },
  { name: 'iPhone 14 (428px)', width: 428, height: 926, deviceScaleFactor: 3 },
  { name: 'iPad (768px)', width: 768, height: 1024, deviceScaleFactor: 2 },
  { name: 'Desktop (1024px)', width: 1024, height: 768, deviceScaleFactor: 1 },
];

const pages = [
  'dashboard',
  'agents',
  'clients',
  'alexandria',
  'docs',
];

(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const results = [];
  
  for (const viewport of viewports) {
    console.log(`\n📱 Testing ${viewport.name}`);
    
    for (const page of pages) {
      const browser_page = await browser.newPage();
      await browser_page.setViewport(viewport);
      
      try {
        await browser_page.goto(`http://localhost:8083/${page}`, { 
          waitUntil: 'networkidle0',
          timeout: 30000
        });
        
        // Check for overflow
        const hasOverflow = await browser_page.evaluate(() => {
          const body = document.body;
          const html = document.documentElement;
          return body.scrollWidth > window.innerWidth || 
                 html.scrollWidth > window.innerWidth;
        });
        
        // Check touch targets
        const smallTargets = await browser_page.evaluate(() => {
          const buttons = document.querySelectorAll('button, a, [role="button"]');
          let count = 0;
          buttons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            if (rect.height < 44 || rect.width < 44) {
              count++;
            }
          });
          return count;
        });
        
        const result = {
          viewport: viewport.name,
          page: page,
          overflow: hasOverflow,
          small_targets: smallTargets,
          timestamp: new Date().toISOString()
        };
        
        results.push(result);
        
        const status = hasOverflow ? '❌' : '✅';
        console.log(`  ${status} ${page}: overflow=${hasOverflow}, small_targets=${smallTargets}`);
        
      } catch (error) {
        console.log(`  ⚠️  ${page}: ERROR - ${error.message}`);
        results.push({
          viewport: viewport.name,
          page: page,
          error: error.message
        });
      }
      
      await browser_page.close();
    }
  }
  
  await browser.close();
  
  // Save results
  require('fs').writeFileSync(
    '/tmp/responsiveness-results.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n✅ Responsiveness tests complete!');
})();
