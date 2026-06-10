// Capture fresh screenshots of the live BetaBridge UI for the showcase page.
//
// Usage:
//   1. Start the BetaBridge server:  python3 main.py playground --no-browser --port 8765
//   2. node scripts/capture-betabridge-screenshots.mjs [--base http://127.0.0.1:8765] [--out assets/images/betabridge]
//
// Requires the `playwright` package with the Chromium browser installed
// (`npx playwright install chromium`). Used both locally and by the Pages
// deploy workflow so the showcase always pictures the current UI.

import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const resolvePlaywright = () => {
  for (const candidate of ["playwright", "/opt/node22/lib/node_modules/playwright"]) {
    try {
      return require(candidate);
    } catch {
      /* try next */
    }
  }
  throw new Error("playwright not found — run `npm install playwright` first");
};
const { chromium } = resolvePlaywright();

const args = process.argv.slice(2);
const argValue = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = argValue("--base", "http://127.0.0.1:8765");
const OUT = argValue("--out", "assets/images/betabridge");

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
const page = await context.newPage();

const shoot = async (name) => {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`captured ${OUT}/${name}.png`);
};

// 1. Dashboard / hub.
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await shoot("dashboard");

// 2. Play table: fresh board during the auction (bid buttons visible).
await page.goto(`${BASE}/play.html`, { waitUntil: "networkidle" });
await page.waitForSelector("#calls button", { timeout: 30000 });
await page.waitForTimeout(800);
await shoot("play-auction");

// 3. Play table mid-play: Watch AI vs AI until cards hit the trick area.
await page.click("#watchToggle");
await page.click("#watchFaster"); // 600 ms
await page.click("#watchFaster"); // 300 ms
await page.click("#watchFaster"); // 150 ms
await page.waitForFunction(
  () => document.querySelectorAll("#trick .card, #trick [class*='card']").length >= 2,
  { timeout: 90000 },
);
await page.click("#watchPause").catch(() => {});
await page.waitForTimeout(500);
await shoot("play-table");

// 4. Agreement browser (full-disclosure view of the evolved system).
await page.goto(`${BASE}/agreements.html`, { waitUntil: "networkidle" });
await page.waitForSelector("#rules table, #rules .rule, #rules div", { timeout: 30000 });
// Prefer the evolved AlphaBridge system if it is in the dropdown.
const picked = await page.evaluate(() => {
  const select = document.getElementById("systemSelect");
  if (!select) return false;
  const option = [...select.options].find((o) => o.value.includes("alphabridge"));
  if (!option) return false;
  select.value = option.value;
  select.dispatchEvent(new Event("change"));
  return true;
});
if (picked) await page.waitForTimeout(1200);
await shoot("agreements");

await context.close();

// 5. Short "Watch AI vs AI" demo video (webm) for the showcase hero.
const videoContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  reducedMotion: "no-preference",
});
const videoPage = await videoContext.newPage();
await videoPage.goto(`${BASE}/play.html`, { waitUntil: "networkidle" });
await videoPage.waitForSelector("#calls button", { timeout: 30000 });
await videoPage.click("#watchToggle");
await videoPage.click("#watchFaster"); // 600 ms
await videoPage.click("#watchFaster"); // 300 ms
await videoPage.waitForTimeout(30000);
const video = videoPage.video();
await videoContext.close();
const { renameSync } = await import("node:fs");
renameSync(await video.path(), `${OUT}/watch-demo.webm`);
console.log(`captured ${OUT}/watch-demo.webm`);

await browser.close();
console.log("done");
