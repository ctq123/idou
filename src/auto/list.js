const get = require('lodash/get');
const common = require('./common.js');

const generatePage = async ({ page, platformUrl, apiData }) => {
  let ele = null;
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(platformUrl);

  // 处理请求tab
  const apiChange = async () => {
    // 打开请求tab
    await page.waitForSelector('#rc-tabs-0-tab-request');
    ele = await page.$('#rc-tabs-0-tab-request');
    ele.click();

    await page.waitForSelector('#rc-tabs-0-panel-request form');
    ele = await page.$('#rc-tabs-0-panel-request');
    // 选择框
    await common.setSelect(
      page,
      ele,
      'form div div div .ant-select',
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
      ele,
      'form div div div div',
      `/api/v1/h5/oversea${apiData.url || ''}`,
    );

    await common.clickButton(page, ele, 'form div div div div', '提交');
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

  // 处理
  await apiChange();
  await searchChange();
  await operateChange();
  await tableChange();
  await generateCode();
};

module.exports = {
  generatePage,
};
