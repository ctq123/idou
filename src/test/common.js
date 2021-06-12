/*
 * @Author: chengtianqing
 * @Date: 2021-06-12 01:50:35
 * @LastEditTime: 2021-06-12 16:40:55
 * @LastEditors: chengtianqing
 */
/**
 * 处理选择框
 * @param page
 * @param val
 */
async function select(page, val) {
  let ele = null;
  await page.waitForSelector(
    '#rc-tabs-0-panel-request .ant-select-selection-search',
  );

  ele = await page.$('#rc-tabs-0-panel-request .ant-select-clear');
  ele && ele.click();

  ele = await page.$(
    '#rc-tabs-0-panel-request span.ant-select-selection-search',
  );
  ele.click();

  await page.waitForSelector(
    '.rc-virtual-list-holder-inner .ant-select-item-option-content',
  );
  // 查找对应的内容
  const texts = await page.$$eval(
    '.rc-virtual-list-holder-inner .ant-select-item-option-content',
    (node) => node.map((n) => n.innerText),
  );
  const index = texts.findIndex((k) => k === val);
  console.log('index', index);

  // 等待1s
  await page.waitForTimeout(1000);

  const eles = await page.$$(
    '.rc-virtual-list-holder-inner .ant-select-item-option-content',
  );
  eles[index].click();
}

async function clickButton(page, classStr, btnText) {
  const texts = await page.$$eval(`${classStr} button > span`, (node) =>
    node.map((n) => n.innerText.replace(/\s/g, '')),
  );

  console.log('texts', texts);

  const index = texts.findIndex((k) => k === btnText);
  // console.log('index', index);

  // 等待1s
  await page.waitForTimeout(1000);

  const eles = await page.$$(`${classStr} button`);
  eles[index].click();
}

module.exports = {
  select,
  clickButton,
};
