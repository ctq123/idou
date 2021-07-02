const get = require('lodash/get');
const base = require('../base.js');
const common = require('./common.js');

const generatePage = async ({ page, apiData }) => {
  let ele = null;

  const titleChange = async () => {
    await page.waitForSelector("#root div[class^='modal']");
    await base.clickDom(
      page,
      null,
      "#root div[class^='modal'] div span",
      'XX详情',
    );
    await page.waitForSelector(
      '#root #rc-tabs-0-panel-setting form div span input',
    );

    ele = await page.$('#root #rc-tabs-0-panel-setting');
    await page.waitForTimeout(500);
    ele = await page.$('#root #rc-tabs-0-panel-setting form');
    await base.setInput(page, ele, `div`, apiData.title);

    await base.clickButton(page, ele, 'div div div div', '提交');
    await page.waitForTimeout(1000);
  };

  // 信息头
  const baseInfoChange = async () => {
    await page.waitForSelector("#root div[class^='modal'] section");
    await base.clickDom(
      page,
      null,
      "#root div[class^='modal'] section .ant-row",
    );
    await page.waitForSelector(
      '#root #rc-tabs-0-panel-setting form div button',
    );
    await page.waitForTimeout(1000);

    // 先清空所有数据
    ele = await page.$('#root #rc-tabs-0-panel-setting');
    // 先清空所有数据
    await base.clickAllDom(
      page,
      ele,
      'form div div div div div div button span.anticon-delete',
    );
    await page.waitForTimeout(500);
    let recordObj = get(apiData, 'recordObj');
    let i = 0;
    for (let k in recordObj) {
      await base.clickDom(page, ele, 'form div div button span.anticon-plus');
      await page.waitForTimeout(500);
      await base.setInput(
        page,
        ele,
        `form div:nth-child(${
          i + 1
        }) .ant-space:nth-child(1) .ant-space-item:nth-child(1)`,
        recordObj[k].description || recordObj[k].title,
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
        recordObj[k].componentType,
        i,
      );
      if (['状态'].includes(recordObj[k].componentType)) {
        await common.closeConfigModal({ page });
      }
      i++;
    }

    // 提交
    await base.clickButton(page, ele, 'div div div div', '提交');
    await page.waitForTimeout(1000);
  };

  // 处理
  await common.tmplChange({ page, text: '弹窗详情' });
  await common.apiChange({ page, apiData });
  await titleChange();
  await baseInfoChange();
  await common.generateCode({ page });
};

module.exports = {
  generatePage,
};
