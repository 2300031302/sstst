const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 3000;

app.get("/take-ss-leetcode", async (req, res) => {
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();

        // Set viewport
        await page.setViewport({
            width: 1200,
            height: 700
        });

        // ⭐ VERY IMPORTANT — Set User Agent BEFORE loading page
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        console.log("Opening LeetCode...");
        
        await page.goto("https://leetcode.com/u/klu2300031302/", {
            waitUntil: "networkidle2"
        });

        // Wait extra loading time (LeetCode loads dynamic data)
        await new Promise(r => setTimeout(r, 5000));

        console.log("Taking screenshot...");

        // Rectangle coordinate values
        const x1 = 40, y1 = 95;
        const x2 = 308, y2 = 175;

        const rect = {
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1
        };

        const buffer = await page.screenshot({
            clip: rect,
            type: "png"
        });

        console.log("Screenshot captured!");

        // Send screenshot directly to browser
        res.setHeader("Content-Type", "image/png");
        res.send(buffer);

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).send("Screenshot failed");
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
