/*
 * @Author: chengtianqing
 * @Date: 2021-06-12 00:58:07
 * @LastEditTime: 2021-07-06 23:54:25
 * @LastEditors: chengtianqing
 * @备注: 已检查，无账号密码信息
 */

const puppeteer = require('puppeteer');
const get = require('lodash/get');
const cloneDeep = require('lodash/cloneDeep');
const transform = require('./transform.js');
const pageList = require('./page/list.js');
const pageDetail = require('./page/detail.js');
const pageEditModal = require('./page/editModal.js');
const mockApiData = require('./mockApiData.js');
const domain = 'S.H.I.Z.H.U.A.N.G.-.I.N.C'.split('.').join('').toLowerCase();
// const mockUrl = `https://mock.${domain}.com/project/2492/interface/api/140446`;// 详情
const mockUrl = `https://mock.${domain}.com/project/2492/interface/api/140456`; // 编辑
// const mockUrl = `https://mock.${domain}.com/project/2492/interface/api/140494`;// 列表
const platformUrl = `https://idou100.netlify.app`;
// const platformUrl = `http://localhost:8000/setting`;
let apiData = {};
let browser = null;

const getBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false, //有浏览器界面启动
      args: [`--window-size=1440,900`],
    });
  }
  return browser;
};

const autoEditPage = async () => {
  await getBrowser();
  const page = await browser.newPage();
  if (!apiData.componentType) {
    console.log('接口匹配不到页面类型，退出');
    page.close();
    browser.close();
    return;
  }
  await page.setViewport({ width: 1440, height: 900 });
  const navigationPromise = page.waitForNavigation();
  await page.goto(platformUrl);
  await navigationPromise;
  await page.waitForTimeout(1 * 1000);
  switch (apiData.componentType) {
    case 'list':
      await pageList.generatePage({ page, apiData });
      break;
    case 'detail':
      await pageDetail.generatePage({ page, apiData });
      break;
    case 'editModal':
      await pageEditModal.generatePage({ page, apiData });
      break;
    case 'edit':
      // await list.generatePage({ page, apiData });
      break;
  }
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
    `https://sso.${domain}.com/?returnUrl=https://mock.${domain}.com/#/login`,
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
    const [, id] = mockUrl.match(/\d+/g);
    const requestUrl = `https://mock.${domain}.com/api/interface/get?id=${id}`;
    await page.on('response', async (resp) => {
      // 提取对应的数据
      console.log('url=', resp.url());
      if (resp.url() == requestUrl) {
        console.log('XHR resp received');
        const respData = await resp.json();
        console.log(respData);
        const {
          title,
          method,
          path,
          req_body_other,
          req_params,
          res_body = {},
        } = (respData && respData.data) || {};
        console.log('req_params', req_params);
        const paramsObj = req_body_other ? JSON.parse(req_body_other) : {};
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
        apiData = transform.transData(apiData);
        console.log('apiData', apiData);
      }
    });

    const resp = await page.goto(mockUrl);
    if (resp.ok()) {
      await page.waitForTimeout(1 * 1000);
      page.close();
      await autoEditPage();
    }
    // await page.waitForTimeout(1 * 1000);
    // const resp2 = await page.goto("https://www.google.com");
    // const html = await page.content();
    // console.log("html", html);

    // await page.screenshot({
    //   path: `/Users/alan/Desktop/${Date.now()}.png`,
    // });
  }
};

// // 真实爬接口
// handleApiData();

// 测试mock接口
apiData = cloneDeep(mockApiData.listData);
apiData = transform.transData(apiData);
console.log('apiData', apiData);
autoEditPage();
