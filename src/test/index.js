const puppeteer = require('puppeteer');
const get = require('lodash/get');
const openUrl =
  'https://mock.shizhuang-inc.com/project/574/interface/api/134167';
let apiData = {};

//使用 puppeteer.launch 启动 Chrome
(async () => {
  apiData = {};
  const browser = await puppeteer.launch({
    headless: false, //有浏览器界面启动
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(
    'https://sso.shizhuang-inc.com/?returnUrl=https://mock.shizhuang-inc.com/#/login',
  );
  const text = await page.evaluate(
    () => document.querySelector('button>span>span').innerHTML,
  );
  // console.log("text", text)
  if (text && text.includes('飞书扫码登录')) {
    // await page.waitForFunction(`document.cookie=${decodeURI(cookie)}`)
    let ele = await page.$('button>span>span');
    ele.click();

    await Promise.all([ele.click(), page.waitForNavigation()]);

    // await page.waitForResponse('https://mock.shizhuang-inc.com/api/v1/h5/luna/user/getLoginUser');
    await page.waitForSelector('.user-toolbar');

    // 监听对应的接口
    const urlArr = openUrl.match(/\d+/g);
    const requestUrl = `https://mock.shizhuang-inc.com/api/interface/get?id=${urlArr[1]}`;
    await page.on('response', async (resp) => {
      console.log('url=', resp.url());
      if (resp.url() == requestUrl) {
        console.log('XHR resp received');
        const respData = await resp.json();
        console.log(respData);
        const { method, path, req_body_other, res_body } =
          (respData && respData.data) || {};
        console.log('req_body_other', req_body_other);
        const paramsObj = JSON.parse(req_body_other);
        const respObj = JSON.parse(res_body);
        const requestObj = get(paramsObj, 'properties')
          ? { ...get(paramsObj, 'properties') }
          : {};
        const responseObj = get(respObj, 'properties.data.properties')
          ? { ...get(respObj, 'properties.data.properties') }
          : {};
        apiData['method'] = method;
        apiData['url'] = path;
        apiData['request'] = requestObj;
        apiData['response'] = responseObj;
        console.log('apiData', apiData);
      }
    });

    await page.goto(openUrl);

    await page.screenshot({
      path: `/Users/alan/Desktop/${Date.now()}.png`,
    });

    // console.log("将等待30秒")
    // // 等待30秒
    // await page.waitForTimeout(30 * 1000);
  }

  await page.close();
  await browser.close();
})();
