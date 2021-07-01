const get = require('lodash/get');
const base = require('../base.js');
const common = require('./common.js');

const generatePage = async ({ page, apiData }) => {
  let ele = null;

  // 处理搜索框的设置tab
  const searchChange = async () => {
    // 点击搜索组件
    await page.waitForSelector("#root div[class^='page-container'] form");
    await base.clickButton(
      page,
      null,
      "#root div[class^='page-container'] form",
      '重置',
    );
    await page.waitForSelector(
      '#root #rc-tabs-0-panel-setting form div span input',
    );

    ele = await page.$('#root #rc-tabs-0-panel-setting');
    // 先清空所有数据
    await base.clickAllDom(
      page,
      ele,
      'form div div div div div div button span.anticon-delete',
    );
    await page.waitForTimeout(500);
    const form = get(apiData, 'search.form');
    console.log('form', form);
    let i = 0;
    for (let k in form) {
      await base.clickDom(
        page,
        ele,
        'form div div div div button span.anticon-plus',
      );
      await page.waitForTimeout(500);
      await base.setInput(
        page,
        ele,
        `form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(1) .ant-space-item:nth-child(1)`,
        form[k].description,
      );
      await base.setInput(
        page,
        ele,
        `form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(1) .ant-space-item:nth-child(2)`,
        k,
      );
      await base.setSelect(
        page,
        ele,
        `form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(2) .ant-space-item:nth-child(1)`,
        form[k].componentType,
        i,
      );
      if (['选择器', '单选框'].includes(form[k].componentType)) {
        await common.closeConfigModal({ page });
      }
      i++;
    }

    // 提交
    await base.clickButton(page, ele, 'form div div div div', '提交');
    await page.waitForTimeout(1000);
  };

  // 处理表格顶部模块
  const operateChange = async () => {
    await page.waitForSelector(
      "#root div div div[class^='page-container'] div[class^='df'] button",
    );
    await base.clickDom(
      page,
      null,
      "#root div div div[class^='page-container'] div[class^='df'] button",
    );

    await page.waitForSelector(
      '#root #rc-tabs-0-panel-setting form div span input',
    );
    await page.waitForTimeout(500);
    ele = await page.$('#root #rc-tabs-0-panel-setting form');
    await base.setInput(page, ele, `div`, apiData.title);

    await base.clickButton(page, ele, 'div div div div', '提交');
    await page.waitForTimeout(1000);
  };

  // 处理表格列配置
  const tableChange = async () => {
    // 点击列表组件
    await page.waitForSelector("#root div[class^='page-container'] div table");
    await base.clickDom(
      page,
      null,
      "#root div[class^='page-container'] div table",
    );
    await page.waitForSelector(
      '#root #rc-tabs-0-panel-setting form div span input',
    );
    await page.waitForTimeout(1000);

    // 先清空所有数据
    ele = await page.$('#root #rc-tabs-0-panel-setting');
    // 先清空所有数据
    await base.clickAllDom(
      page,
      ele,
      'form div div button span.anticon-delete',
    );
    await page.waitForTimeout(500);
    let columnsObj = get(apiData, 'columnsObj');
    columnsObj = Object.assign(columnsObj, {
      '-': {
        description: '操作',
        componentType: '操作',
      },
    });
    let i = 0;
    console.log('columnsObj', columnsObj);
    for (let k in columnsObj) {
      await base.clickDom(page, ele, 'form div div button span.anticon-plus');
      await page.waitForTimeout(500);
      await base.setInput(
        page,
        ele,
        `form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(1) .ant-space-item:nth-child(1)`,
        columnsObj[k].description,
      );
      await base.setInput(
        page,
        ele,
        `form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(1) .ant-space-item:nth-child(2)`,
        k,
      );
      await base.setSelect(
        page,
        ele,
        `form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(2) .ant-space-item:nth-child(1)`,
        columnsObj[k].componentType,
        i,
      );
      if (['状态'].includes(columnsObj[k].componentType)) {
        await common.closeConfigModal({ page });
      }
      i++;
    }

    // 提交
    await base.clickButton(page, ele, 'div div div div', '提交');
    await page.waitForTimeout(1000);
  };

  // 处理
  await common.tmplChange({ page, text: '管理列表' });
  await common.apiChange({ page, apiData });
  await searchChange();
  await operateChange();
  await tableChange();
  await common.generateCode({ page });
};

module.exports = {
  generatePage,
};
