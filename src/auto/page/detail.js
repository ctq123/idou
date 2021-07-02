const get = require('lodash/get');
const base = require('../base.js');
const common = require('./common.js');

const generatePage = async ({ page, apiData }) => {
  let ele = null;

  // 信息头
  const baseInfoChange = async () => {
    await page.waitForSelector("#root div[class^='modal'] section");
    await base.clickDom(
      page,
      null,
      "#root div[class^='modal'] section .ant-row",
    );
    await page.waitForSelector('#rc-tabs-0-panel-setting form div button');
    await page.waitForTimeout(1000);

    // 先清空所有数据
    ele = await page.$('#rc-tabs-0-panel-setting');
    // 先清空所有数据
    await base.clickAllDom(
      page,
      ele,
      'form div div div div div div button span.anticon-delete',
    );
    await page.waitForTimeout(500);
    let recordObj = get(apiData, 'recordObj');
    let i = 1;
    let plusEl = await ele.$(
      `form > div > div > div > div button .anticon-plus`,
    );
    for (let k in recordObj) {
      await plusEl.click();
      await page.waitForSelector(
        `#dynamic_form_nest_item div:nth-child(${i}) input`,
        { timeout: 10000 },
      );
      await base.setInput(
        page,
        ele,
        `form div:nth-child(${i}) .ant-space:nth-child(1) .ant-space-item:nth-child(1)`,
        recordObj[k].label,
      );
      await base.setInput(
        page,
        ele,
        `form div:nth-child(${i}) .ant-space:nth-child(1) .ant-space-item:nth-child(2)`,
        k,
      );
      console.log('label', recordObj[k].label);
      await base.setSelect(
        page,
        ele,
        `form div:nth-child(${i}) .ant-space:nth-child(2) .ant-space-item:nth-child(1)`,
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
  await common.modalTitleChange({ page, apiData, text: 'XX详情' });
  await baseInfoChange();
  await common.generateCode({ page });
};

module.exports = {
  generatePage,
};
