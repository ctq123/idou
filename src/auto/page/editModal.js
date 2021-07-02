const get = require('lodash/get');
const base = require('../base.js');
const common = require('./common.js');

const generatePage = async ({ page, apiData }) => {
  let ele = null;

  // 表单
  const formChange = async () => {
    await page.waitForSelector("#root div[class^='modal'] form");
    await base.clickDom(page, null, "#root div[class^='modal'] form .ant-row");
    await page.waitForSelector('#rc-tabs-0-panel-setting form div button');
    await page.waitForTimeout(1000);

    ele = await page.$('#rc-tabs-0-panel-setting');
    // 先清空所有数据
    await base.clickAllDom(
      page,
      ele,
      'form > div > div > div > div > div div button span.anticon-delete',
    );
    await page.waitForTimeout(500);
    let formObj = get(apiData, 'formObj');
    let i = 1;
    let plusEl = await ele.$(
      `form > div > div > div > div button .anticon-plus`,
    );
    for (let k in formObj) {
      await plusEl.click();
      await page.waitForSelector(
        `#dynamic_form_nest_item div:nth-child(${i}) input`,
        { timeout: 10000 },
      );
      // console.log("i", i, k)
      await base.setInput(
        page,
        ele,
        `#dynamic_form_nest_item div:nth-child(${i}) .ant-space:nth-child(1) .ant-space-item:nth-child(1)`,
        formObj[k].label,
      );
      await base.setInput(
        page,
        ele,
        `#dynamic_form_nest_item div:nth-child(${i}) .ant-space:nth-child(1) .ant-space-item:nth-child(2)`,
        k,
      );
      console.log('label', formObj[k].label);
      await base.setSelect(
        page,
        ele,
        `#dynamic_form_nest_item div:nth-child(${i}) .ant-space:nth-child(2) .ant-space-item:nth-child(1)`,
        formObj[k].componentType,
        i,
      );
      if (['选择器', '单选框'].includes(formObj[k].componentType)) {
        await common.closeConfigModal({ page });
      }
      i++;
    }

    // 提交
    await base.clickButton(page, ele, 'div div div div', '提交');
    await page.waitForTimeout(1000);
  };

  // 处理
  await common.tmplChange({ page, text: '弹窗编辑' });
  await common.apiChange({ page, apiData });
  await common.modalTitleChange({ page, apiData, text: 'XX编辑' });
  await formChange();
  await common.generateCode({ page });
};

module.exports = {
  generatePage,
};
