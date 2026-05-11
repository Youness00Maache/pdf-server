const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json({ limit: "10mb" }));

app.post("/generate-pdf", async (req, res) => {
  const { html } = req.body;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
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