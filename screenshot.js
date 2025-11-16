const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        headless: false,   // MUST be false for LeetCode
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled"
        ]
    });

    const page = await browser.newPage();

    // Pretend to be a real Chrome
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Desktop screen size
    await page.setViewport({
        width: 1200,
        height: 700
    });

    console.log("Opening LeetCode...");

    await page.goto("https://leetcode.com/u/klu2300031302/", {
        waitUntil: "networkidle2",
        timeout: 0
    });

    // Wait 5 seconds for React to load (replacement for waitForTimeout)
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("Taking screenshot...");

    const clip = {
        x: 340,
        y: 296,
        width: 410,
        height: 168
    };

    await page.screenshot({
        path: "cropped.png",
        clip: clip
    });

    console.log("Screenshot saved as cropped.png!");
    await browser.close();
})();
