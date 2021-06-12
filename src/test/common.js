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
  let texts = await page.$$eval(
    '.rc-virtual-list-holder-inner .ant-select-item-option-content',
    (node) => node.map((n) => n.innerText),
  );
  let index = texts.findIndex((k) => k === val);
  console.log('index', index);

  // 等待1s
  await page.waitForTimeout(1000);

  let eles = await page.$$(
    '.rc-virtual-list-holder-inner .ant-select-item-option-content',
  );
  eles[index].click();
}

async function findButton(page) {
  let texts = await page.$$eval(
    '.rc-virtual-list-holder-inner .ant-select-item-option-content',
    (node) => node.map((n) => n.innerText),
  );
}

module.exports = {
  select,
};
