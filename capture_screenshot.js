
import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: 'new'
        });
        const page = await browser.newPage();

        await page.setViewport({ width: 1280, height: 800 });

        // Go to local dev server
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

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
