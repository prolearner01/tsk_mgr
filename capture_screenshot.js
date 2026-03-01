
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

        // Go to local dev server
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

        const content = await page.content();
        console.log('PAGE CONTENT:', content);

        // Take screenshot
        const path = 'screenshot.png';
        await page.screenshot({ path, fullPage: true });

        console.log(`Screenshot captured at: ${path}`);
        await browser.close();
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        process.exit(1);
    }
})();
