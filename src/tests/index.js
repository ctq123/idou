const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // console.log("打开页面", page)
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://yapi.baidu.com/project/66009/interface/api/934862');
  await page.screenshot({
    path: `/Users/chengtianqing/Desktop/${Date.now()}.png`,
  });

  await browser.close();
})();
