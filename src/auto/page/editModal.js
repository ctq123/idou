const get = require('lodash/get');
const base = require('../base.js');
const common = require('./common.js');

const generatePage = async ({ page, apiData }) => {
  let ele = null;

  // 表单
  const formChange = async () => {
    await page.waitForSelector("#root div[class^='modal'] form");
    await base.clickDom(page, null, "#root div[class^='modal'] form .ant-row");
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
    let formObj = get(apiData, 'formObj');
    let i = 0;
    for (let k in formObj) {
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
        formObj[k].description || formObj[k].title,
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
