const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/take-ss-leetcode", async (req, res) => {
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: "new",
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

        const page = await browser.newPage();

        await page.setViewport({
            width: 1200,
            height: 700
        });

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        await page.goto("https://leetcode.com/u/klu2300031302/", {
            waitUntil: "networkidle2"
        });

        await new Promise(r => setTimeout(r, 5000));

        const rect = {
            x: 40,
            y: 95,
            width: 308 - 40,
            height: 175 - 95
        };

        const buffer = await page.screenshot({
            clip: rect,
            type: "png"
        });

        res.setHeader("Content-Type", "image/png");
        res.send(buffer);

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).send("Screenshot failed");
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
