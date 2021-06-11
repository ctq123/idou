import { select } from './common';

const puppeteer = require('puppeteer');
const get = require('lodash/get');
const openUrl =
  'https://mock.shizhuang-inc.com/project/574/interface/api/134167';
let apiData: any = {};
let browser: any = null;

const getBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false, //有浏览器界面启动
      args: [`--window-size=1366,768`],
    });
  }
  return browser;
};

const handleEditorPage = async () => {
  getBrowser();
  let ele = null;
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto('http://localhost:8000/setting');
  await page.waitForSelector('#rc-tabs-0-tab-request');
  ele = await page.$('#rc-tabs-0-tab-request');
  ele.click();
  // console.log("tab", tab)

  await page.waitForTimeout(1 * 1000);
  select(page, 'PUT');

  ele = await page.$('#url');
  await page.waitForTimeout(1 * 1000);
  // // console.log("ele", ele)
  await ele.type('/api/v1/123', { delay: 20 });

  // await page.$('button[type="submit"]').click();
};

/**
 * 从YAPI系统中提取接口数据
 */
const handleApiData = async () => {
  apiData = {};
  getBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(
    'https://sso.shizhuang-inc.com/?returnUrl=https://mock.shizhuang-inc.com/#/login',
  );
  let text = await page.evaluate(
    () => document.querySelector('button>span>span')?.innerHTML,
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
    const [, id]: any = openUrl.match(/\d+/g);
    const requestUrl = `https://mock.shizhuang-inc.com/api/interface/get?id=${id}`;
    await page.on('response', async (resp: any) => {
      console.log('url=', resp.url());
      if (resp.url() == requestUrl) {
        console.log('XHR resp received');
        const respData = await resp.json();
        console.log(respData);
        const { title, method, path, req_body_other, res_body } =
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
        apiData['title'] = title;
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

  // handleEditorPage();

  // await page2.$('button[type="submit"]').click();

  // await page.close();
  // await browser.close();
};

// handleApiData();
handleEditorPage();
