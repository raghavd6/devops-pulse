/**
 * Minimal Selenium smoke test (optional).
 * Install if you want:
 *   npm i selenium-webdriver chromedriver
 */
import { Builder, By, until } from 'selenium-webdriver';

const BASE = process.env.BASE_URL || 'http://localhost:5173';

(async function run() {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get(BASE);
    await driver.wait(until.elementLocated(By.css('h1')), 10000);
    const title = await driver.findElement(By.css('h1')).getText();
    if (title !== 'DevOps Pulse') throw new Error('Unexpected title: ' + title);
    console.log('✅ Selenium smoke passed');
  } finally {
    await driver.quit();
  }
})();
