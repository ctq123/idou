const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // console.log("打开页面", page)
  await page.goto('https://www.google.com');
  await page.screenshot({
    path: `/Users/chengtianqing/Desktop/${Date.now()}.png`,
  });

  await browser.close();
})();
