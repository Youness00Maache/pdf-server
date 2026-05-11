const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/generate-pdf', async (req, res) => {
    const { html } = req.body;
    let browser;
    try {
        browser = await puppeteer.launch({
            // 2. Do NOT provide an executablePath. 
            // Let puppeteer find the one installed by your build command.
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
            ],
            // 3. This is crucial for Render
            headless: 'new' 
        });
        
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        
        res.contentType("application/pdf");
        res.send(pdf);
    } catch (e) {
        console.error(e);
        res.status(500).send("PDF Generation Failed");
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(3000, () => console.log("Server running"));