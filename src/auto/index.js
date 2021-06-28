/*
 * @Author: chengtianqing
 * @Date: 2021-06-12 00:58:07
 * @LastEditTime: 2021-06-14 12:01:29
 * @LastEditors: chengtianqing
 */

const puppeteer = require('puppeteer');
const get = require('lodash/get');
const cloneDeep = require('lodash/cloneDeep');
const common = require('./common.js');
const transform = require('./transform.js');
const domain = 'shizhuang-inc.com';
const mockUrl = `https://mock.${domain}/project/574/interface/api/111276`;
// const mockUrl = `https://mock.shizhuang-inc.com/project/781/interface/api/41375`;
const platformUrl = `http://localhost:8000/setting`;
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
  await page.goto(platformUrl);

  // 处理请求tab
  const apiChange = async () => {
    // 打开请求tab
    await page.waitForSelector('#rc-tabs-0-tab-request');
    ele = await page.$('#rc-tabs-0-tab-request');
    ele.click();

    await page.waitForTimeout(1 * 1000);
    // 选择框
    await common.setSelect(
      page,
      '#rc-tabs-0-panel-request',
      apiData.method || 'POST',
    );

    // // 输入框
    // await page.waitForSelector('#url');
    // ele = await page.$('#rc-tabs-0-panel-request .ant-input-suffix');
    // ele && ele.click();

    // await page.waitForSelector('#url');
    // ele = await page.$('#url');
    // ele.click();
    // await page.waitForTimeout(1 * 1000);
    // await ele.type('/api/v1/123', { delay: 10 });
    await common.setInput(
      page,
      '#rc-tabs-0-panel-request .ant-form-item-control-input',
      `/api/v1/h5/oversea${apiData.url || ''}`,
    );

    await page.waitForTimeout(500);
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

  // 处理搜索框的设置tab
  const searchChange = async () => {
    // 点击搜索组件
    await page.waitForSelector("div[class^='page-container'] form");
    await common.clickButton(page, "div[class^='page-container'] form", '重置');
    await page.waitForSelector('#rc-tabs-0-panel-setting');

    // 先清空所有数据
    await page.waitForSelector(
      '#rc-tabs-0-panel-setting form .ant-space .ant-space-item button span.anticon-delete',
    );
    await common.clickAllDom(
      page,
      '#rc-tabs-0-panel-setting form .ant-space .ant-space-item button span.anticon-delete',
    );
    await page.waitForTimeout(1 * 1000);
    const form = get(apiData, 'search.form');
    console.log('form', form);
    let i = 0;
    for (let k in form) {
      await common.clickDom(
        page,
        '#rc-tabs-0-panel-setting form .ant-form-item .ant-btn-block .anticon-plus',
      );
      await page.waitForTimeout(1 * 1000);
      await common.setInput(
        page,
        `#rc-tabs-0-panel-setting form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(1) .ant-space-item:nth-child(1)`,
        form[k].description,
      );
      await common.setInput(
        page,
        `#rc-tabs-0-panel-setting form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(1) .ant-space-item:nth-child(2)`,
        k,
      );
      await common.setSelect(
        page,
        `#rc-tabs-0-panel-setting form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(2) .ant-space-item:nth-child(1)`,
        form[k].componentType,
        i,
      );
      i++;
    }

    // 提交
    await common.clickButton(
      page,
      '#rc-tabs-0-panel-setting form .ant-form-item',
      '提交',
    );
  };

  // 处理表格顶部模块
  const operateChange = async () => {
    await page.waitForTimeout(1 * 1000);
    await page.waitForSelector(
      "div[class^='page-container'] div[class^='df'] button",
    );
    await common.clickDom(
      page,
      "div[class^='page-container'] div[class^='df'] button",
    );
    await page.waitForSelector(
      '#rc-tabs-0-panel-setting form .ant-space-item .ant-form-item-control-input',
    );
    await page.waitForTimeout(1 * 1000);
    await common.setInput(
      page,
      `#rc-tabs-0-panel-setting form .ant-space-item .ant-form-item-control-input`,
      apiData.title,
    );

    await common.clickButton(
      page,
      '#rc-tabs-0-panel-setting form .ant-form-item',
      '提交',
    );
  };

  // 处理表格列配置
  const tableChange = async () => {
    // 点击列表组件
    await page.waitForTimeout(1 * 1000);
    await page.waitForSelector("div[class^='page-container'] table");
    await common.clickDom(page, "div[class^='page-container'] table");
    await page.waitForSelector('#rc-tabs-0-panel-setting');

    // 先清空所有数据
    await page.waitForSelector(
      '#rc-tabs-0-panel-setting form .ant-space .ant-space-item button span.anticon-delete',
    );
    await common.clickAllDom(
      page,
      '#rc-tabs-0-panel-setting form .ant-space .ant-space-item button span.anticon-delete',
    );
    await page.waitForTimeout(1 * 1000);
    let columnsObj = get(apiData, 'columnsObj');
    // console.log("form", form)
    columnsObj = Object.assign(columnsObj, {
      '-': {
        description: '操作',
        componentType: '操作',
      },
    });
    let i = 0;
    for (let k in columnsObj) {
      await common.clickDom(
        page,
        '#rc-tabs-0-panel-setting form .ant-form-item .ant-btn-block .anticon-plus',
      );
      await page.waitForTimeout(1 * 1000);
      await common.setInput(
        page,
        `#rc-tabs-0-panel-setting form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(1) .ant-space-item:nth-child(1)`,
        columnsObj[k].description,
      );
      await common.setInput(
        page,
        `#rc-tabs-0-panel-setting form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(1) .ant-space-item:nth-child(2)`,
        k,
      );
      await common.setSelect(
        page,
        `#rc-tabs-0-panel-setting form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(2) .ant-space-item:nth-child(1)`,
        columnsObj[k].componentType,
        i,
      );
      i++;
    }

    // 提交
    await common.clickButton(
      page,
      '#rc-tabs-0-panel-setting form .ant-form-item',
      '提交',
    );
  };

  const generateCode = async () => {
    await common.clickButton(page, "div[class^='c-header']", '生成源码');
    await page.waitForSelector(
      '.ant-drawer .ant-drawer-body .ant-tabs-content .monaco-editor .view-lines',
    );
    await page.waitForSelector(
      '.ant-drawer .ant-drawer-title button span.anticon-download',
    );
    await common.clickDom(
      page,
      '.ant-drawer .ant-drawer-title button span.anticon-download',
    );
    await page.waitForSelector('.ant-modal .ant-modal-footer button');
    await common.clickButton(page, '.ant-modal .ant-modal-footer', '下载');
  };

  if (apiData.componentType === 'list') {
    await apiChange();
    await searchChange();
    await operateChange();
    await tableChange();
    await generateCode();
  } else {
    console.log('接口数据不是列表页面');
    page.close();
    browser.close();
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
    const [, id] = mockUrl.match(/\d+/g);
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
        apiData = transform.transData(apiData);
        console.log('apiData', apiData);
      }
    });

    const resp = await page.goto(mockUrl);
    if (resp.ok()) {
      await page.waitForTimeout(1 * 1000);
      page.close();
      await handleEditorPage();
    }
    // await page.waitForTimeout(1 * 1000);
    // const resp2 = await page.goto("https://www.poizon.com/zh-hk/");
    // const html = await page.content();
    // console.log("html", html);

    // await page.screenshot({
    //   path: `/Users/alan/Desktop/${Date.now()}.png`,
    // });
  }
};

handleApiData();
// apiData = cloneDeep(transform.mockApiData);
// apiData = transform.transData(apiData);
// await handleEditorPage();
