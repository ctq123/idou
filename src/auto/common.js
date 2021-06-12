/*
 * @Author: chengtianqing
 * @Date: 2021-06-12 01:50:35
 * @LastEditTime: 2021-06-13 04:01:12
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

/**
 * 设置选择框
 * @param {*} page
 * @param {*} classPath 父节点路径
 * @param {*} val 值
 * @param {*} index 第几个下拉框
 */
async function setSelect(page, classPath, val, index = 0) {
  try {
    let ele = null,
      eles = null;
    await page.waitForTimeout(1 * 1000);
    ele = await page.$(`${classPath} .ant-select-clear`);
    ele && ele.click();

    ele = await page.$(`${classPath} .ant-select-selection-search`);
    ele.click();

    await page.waitForTimeout(1 * 1000);

    await page.waitForSelector(
      `div.ant-select-dropdown .rc-virtual-list-holder-inner .ant-select-item-option-content`,
    );
    eles = await page.$$(`div.ant-select-dropdown`);
    ele = eles[index];

    // 查找对应的内容
    const texts = await ele.$$eval(
      '.rc-virtual-list-holder-inner .ant-select-item-option-content',
      (node) => node.map((n) => n.innerText),
    );
    const i = texts.findIndex((k) => k === val);

    // 等待1s
    await page.waitForTimeout(1 * 1000);

    eles = await ele.$$(
      '.rc-virtual-list-holder-inner .ant-select-item-option-content',
    );
    eles[i].click();
  } catch (e) {
    console.log(`方法异常：setSelect ${classPath} ${val} ${index}`);
    console.log(`错误信息：${e}`);
  }
}

/**
 * 设置input
 * @param {*} page
 * @param {*} classPath 父节点路径
 * @param {*} val 值
 */
async function setInput(page, classPath, val) {
  try {
    let ele = null;
    await page.waitForTimeout(500);
    ele = await page.$(`${classPath} .ant-input-suffix`);
    ele && ele.click();

    await page.waitForTimeout(500);
    ele = await page.$(`${classPath} input.ant-input`);
    ele.click();
    await page.waitForTimeout(1 * 1000);
    await ele.type(val);
  } catch (e) {
    console.log(`方法异常：setInput ${classPath} ${val}`);
    console.log(`错误信息：${e}`);
  }
}

/**
 * 点击按钮
 * @param {*} page
 * @param {*} classPath 按钮父节点路径，自身路径
 * @param {*} btnText 按钮文字
 */
async function clickButton(page, classPath, btnText) {
  try {
    const texts = await page.$$eval(`${classPath} button > span`, (node) =>
      node.map((n) => n.innerText.replace(/\s/g, '')),
    );

    console.log('texts', texts);

    const index = texts.findIndex((k) => k === btnText);
    // console.log('index', index);

    // 等待1s
    await page.waitForTimeout(1000);

    const eles = await page.$$(`${classPath} button`);
    eles[index].click();
  } catch (e) {
    console.log(`方法异常：clickButton ${classPath} ${btnText}`);
    console.log(`错误信息：${e}`);
  }
}

/**
 * 点击节点
 * @param {*} page
 * @param {*} classPath 自身路径
 */
async function clickDom(page, classPath) {
  try {
    const ele = await page.$(`${classPath}`);
    ele && ele.click();
  } catch (e) {
    console.log(`方法异常：clickDom ${classPath} ${btnText}`);
    console.log(`错误信息：${e}`);
  }
}

module.exports = {
  select,
  clickButton,
  setInput,
  setSelect,
  clickDom,
};
