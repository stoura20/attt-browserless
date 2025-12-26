const express = require("express");
const puppeteer = require("puppeteer-core");

const app = express();
app.use(express.json());

app.post("/scrape", async (req, res) => {
    const { url } = req.body;

    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: process.env.BROWSERLESS_WS
        });

        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 60000
        });

        await page.waitForTimeout(5000);

        const html = await page.content();

        await browser.close();

        res.json({ success: true, html });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("API Browserless active");
});
