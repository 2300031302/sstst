const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/take-ss-leetcode", async (req, res) => {
    let browser;

    try {
        console.log("Launching Chrome...");

        browser = await puppeteer.launch({
            headless: "new",
            executablePath: puppeteer.executablePath(),   // ★ Render needs this
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-software-rasterizer",
                "--disable-background-networking",
                "--disable-default-apps",
                "--disable-extensions",
                "--disable-sync",
                "--metrics-recording-only",
                "--mute-audio",
                "--no-first-run",
                "--safebrowsing-disable-auto-update"
            ]
        });

        console.log("Browser started!");

        const page = await browser.newPage();

        await page.setViewport({
            width: 1200,
            height: 700
        });

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        console.log("Opening LeetCode...");
        await page.goto("https://leetcode.com/u/klu2300031302/", {
            waitUntil: "networkidle2",
            timeout: 60000
        });

        await new Promise(r => setTimeout(r, 6000)); // wait for dynamic data

        console.log("Taking screenshot...");

        const x1 = 40, y1 = 95;
        const x2 = 308, y2 = 175;

        const rect = {
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1
        };

        const buffer = await page.screenshot({
            type: "png",
            clip: rect
        });

        console.log("Screenshot captured!");

        res.setHeader("Content-Type", "image/png");
        return res.send(buffer);

    } catch (err) {
        console.error("🔥 ERROR OCCURRED:");
        console.error(err);

        return res
            .status(500)
            .send("Screenshot failed");
    } finally {
        if (browser) {
            console.log("Closing browser...");
            await browser.close();
        }
    }
});

app.listen(PORT, () => console.log(`✔ Server running on port ${PORT}`));
