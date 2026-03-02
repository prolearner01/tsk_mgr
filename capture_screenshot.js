
import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: 'new'
        });
        const page = await browser.newPage();

        // Capture console logs
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
        page.on('error', err => console.log('PAGE CRASH:', err.toString()));

        await page.setViewport({ width: 1280, height: 800 });

        // Go to login page first to authenticate
        await page.goto('http://localhost:5178/login', { waitUntil: 'networkidle0' });

        // Fill in existing auth user credentials created earlier
        await page.type('input[type="email"]', 'test@example.com');
        await page.type('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Wait for dashboard to load
        await page.waitForSelector('.glass-panel-heavy', { timeout: 10000 });

        // Taking a small timeout to let the animations settle and React to render tasks
        await new Promise(r => setTimeout(r, 1500));

        await page.screenshot({ path: 'screenshot_dashboard_status.png', fullPage: true });
        console.log('Dashboard screenshot captured');

        console.log(`Screenshots captured successfully.`);
        await browser.close();
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        process.exit(1);
    }
})();
