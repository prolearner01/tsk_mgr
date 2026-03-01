
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

        // Go to login page
        await page.goto('http://localhost:5176/login', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: 'screenshot_login_premium.png', fullPage: true });
        console.log('Login screenshot captured');

        // Go to dashboard
        await page.goto('http://localhost:5176', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: 'screenshot_dashboard_premium.png', fullPage: true });
        console.log('Dashboard screenshot captured');

        console.log(`Screenshots captured successfully.`);
        await browser.close();
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        process.exit(1);
    }
})();
