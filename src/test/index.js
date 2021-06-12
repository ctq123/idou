/*
 * @Author: chengtianqing
 * @Date: 2021-06-12 00:58:07
 * @LastEditTime: 2021-06-12 17:01:23
 * @LastEditors: chengtianqing
 */

const puppeteer = require('puppeteer');
const get = require('lodash/get');
const common = require('./common.js');
const domain = 'xxx.com';
const openUrl = `https://mock.${domain}/project/574/interface/api/134167`;
let apiData = {};
let browser = null;

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
  await getBrowser();
  let ele = null;
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto('http://localhost:8000/setting');

  const apiChange = async () => {
    // 打开请求tab
    await page.waitForSelector('#rc-tabs-0-tab-request');
    ele = await page.$('#rc-tabs-0-tab-request');
    ele.click();

    // 选择框
    await page.waitForTimeout(1 * 1000);
    await common.select(page, 'PUT');

    // 输入框
    await page.waitForSelector('#url');
    ele = await page.$('#rc-tabs-0-panel-request .ant-input-suffix');
    ele && ele.click();

    await page.waitForSelector('#url');
    ele = await page.$('#url');
    ele.click();
    await page.waitForTimeout(1 * 1000);
    await ele.type('/api/v1/123', { delay: 10 });

    // // 点击提交
    // await page.waitForSelector(
    //   '#rc-tabs-0-panel-request button.ant-btn-primary[type="submit"]',
    // );
    // ele = await page.$(
    //   '#rc-tabs-0-panel-request button.ant-btn-primary[type="submit"]',
    // );
    // ele.click();
    await common.clickButton(page, '#rc-tabs-0-panel-request', '提交');
  };

  // await apiChange();

  // 点击搜索组件
  await page.waitForSelector("div[class^='page-container']");
  // ele = await page.$("div[class^='page-container']");
  // console.log('ele', ele);
  // ele.click();
  await common.clickButton(
    page,
    "div[class^='page-container'] form .ant-form-item",
    '重置',
  );
};

/**
 * 从YAPI系统中提取接口数据
 */
const handleApiData = async () => {
  apiData = {};
  await getBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(
    `https://sso.${domain}/?returnUrl=https://mock.${domain}/#/login`,
  );
  let text = await page.evaluate(
    () => document.querySelector('button>span>span').innerHTML,
  );
  // console.log("text", text)
  if (text && text.includes('飞书扫码登录')) {
    // await page.waitForFunction(`document.cookie=${decodeURI(cookie)}`)
    let ele = await page.$('button>span>span');
    ele.click();

    await Promise.all([ele.click(), page.waitForNavigation()]);

    await page.waitForSelector('.user-toolbar');

    // 监听对应的接口
    const [, id] = openUrl.match(/\d+/g);
    const requestUrl = `https://mock.${domain}/api/interface/get?id=${id}`;
    await page.on('response', async (resp) => {
      // 提取对应的数据
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
