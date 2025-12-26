const express = require("express");
const puppeteer = require("puppeteer-core");

const app = express();
app.use(express.json());

app.post("/scrape", async (req, res) => {
    try {
        if (!process.env.BROWSERLESS_WS) {
            throw new Error("BROWSERLESS_WS manquant");
        }

        const browser = await puppeteer.connect({
            browserWSEndpoint: process.env.BROWSERLESS_WS
        });

        const page = await browser.newPage();

        await page.goto(req.body.url, {
            waitUntil: "networkidle2",
            timeout: 60000
        });

        await page.waitForTimeout(5000);

        const html = await page.content();
        await browser.close();

        res.json({ success: true, html });

    } catch (err) {
        console.error("SCRAPE ERROR:", err.message);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API Browserless active"));
