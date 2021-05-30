const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();

  // 下文中会多次用到 page 对象，可以先留意下
  const page = await browser.newPage();
  // await page.goto('https://www.google.com');
  await page.goto('https://www.baidu.com', {
    waitUntil: 'networkidle0',
    timeout: 0,
  });
  // other actions...
  await browser.close();
})();
