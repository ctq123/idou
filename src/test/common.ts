/**
 * 处理选择框
 * @param page
 * @param val
 */
export const select = async (page: any, val: any) => {
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
    (node: any) => node.map((n: any) => n.innerText),
  );
  let index = texts.findIndex((k: any) => k === val);
  console.log('index', index);

  // 等待300ms
  await page.waitForTimeout(300);

  let eles = await page.$$(
    '.rc-virtual-list-holder-inner .ant-select-item-option-content',
  );
  eles[index].click();
};
