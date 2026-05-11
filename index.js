const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post("/generate-pdf", async (req, res) => {
  const { html } = req.body;

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process'
    ],
    // If you are using puppeteer-core, you might need to point to the installed chrome
    // but with 'npx puppeteer browsers install chrome', it should find it automatically.
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  res.set("Content-Type", "application/pdf");
  res.send(pdf);
});

app.listen(3000, () => console.log("Server running"));