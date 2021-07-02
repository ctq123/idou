const base = require('../base.js');

// 处理模版变化
const tmplChange = async ({ page, text }) => {
  let ele = null;
  // 打开请求tab
  await page.waitForSelector('#rc-tabs-0-tab-template');
  ele = await page.$('#rc-tabs-0-tab-template');
  ele.click();

  await page.waitForSelector('#rc-tabs-0-panel-template div div img');
  ele = await page.$('#rc-tabs-0-panel-template');
  // 选择框
  await base.clickDom(page, ele, 'div div', text);
  await page.waitForTimeout(1000);
};

// 处理请求tab
const apiChange = async ({ page, apiData }) => {
  let ele = null;
  // 打开请求tab
  await page.waitForSelector('#rc-tabs-0-tab-request');
  ele = await page.$('#rc-tabs-0-tab-request');
  ele.click();

  await page.waitForSelector('#rc-tabs-0-panel-request form div span input');
  ele = await page.$('#rc-tabs-0-panel-request');
  // 选择框
  await base.setSelect(
    page,
    ele,
    'form div div div .ant-select',
    apiData.method || 'POST',
  );

  await base.setInput(
    page,
    ele,
    'form div div div div',
    `/api/v1/h5/oversea${apiData.url || ''}`,
  );

  await base.clickButton(page, ele, 'form div div div div', '提交');
  await page.waitForTimeout(1000);
};

// 修改弹窗标题
const modalTitleChange = async ({ page, text, apiData }) => {
  await page.waitForSelector("#root div[class^='modal']");
  await base.clickDom(page, null, "#root div[class^='modal'] div span", text);
  await page.waitForSelector('#rc-tabs-0-panel-setting form div span input');

  ele = await page.$('#rc-tabs-0-panel-setting');
  await page.waitForTimeout(500);
  ele = await page.$('#rc-tabs-0-panel-setting form');
  await base.setInput(page, ele, `div`, apiData.title);

  await base.clickButton(page, ele, 'div div div div', '提交');
  await page.waitForTimeout(1000);
};

// 关闭配置窗口
const closeConfigModal = async ({ page }) => {
  await page.waitForSelector(
    'body div .ant-modal .ant-modal-body .monaco-editor .view-lines',
  );
  await base.clickButton(
    page,
    null,
    'body div .ant-modal .ant-modal-footer',
    '取消',
  );
  await page.waitForTimeout(300);
};

const generateCode = async ({ page }) => {
  await base.clickButton(
    page,
    null,
    "#root div[class^='c-header'] div",
    '生成源码',
  );
  await page.waitForSelector(
    'body div .ant-drawer .ant-drawer-body .ant-tabs-content .monaco-editor .view-lines',
  );
  await page.waitForSelector(
    'body div .ant-drawer div.ant-drawer-header button span[aria-label="download"]',
  );
  await base.clickDom(
    page,
    null,
    'body > div > div > div.ant-drawer-content-wrapper > div > div > div.ant-drawer-header > div > div > div',
  );
  await page.waitForSelector('body div .ant-modal .ant-modal-footer button');
  await page.waitForTimeout(1000);
  await base.clickButton(
    page,
    null,
    'body div .ant-modal .ant-modal-footer',
    '下载',
  );
  await page.waitForTimeout(1000);
};

module.exports = {
  apiChange,
  tmplChange,
  closeConfigModal,
  modalTitleChange,
  generateCode,
};
