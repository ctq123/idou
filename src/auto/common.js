/*
 * @Author: chengtianqing
 * @Date: 2021-06-12 01:50:35
 * @LastEditTime: 2021-06-13 14:50:17
 * @LastEditors: chengtianqing
 */

/**
 * 设置选择框
 * @param {*} page
 * @param {*} classPath 父节点路径
 * @param {*} val 值
 * @param {*} index 第几个下拉框
 */
async function setSelect(page, classPath, val, index = 0) {
  let ele = null,
    eles = null;
  await page.waitForSelector(`${classPath} .ant-select-selection-search`);
  await page.focus(`${classPath} input`);
  await page.waitForTimeout(500);
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
}

/**
 * 设置input
 * @param {*} page
 * @param {*} classPath 父节点路径
 * @param {*} val 值
 */
async function setInput(page, classPath, val) {
  let ele = null;
  await page.waitForTimeout(500);
  ele = await page.$(`${classPath} .ant-input-suffix`);
  ele && ele.click();

  await page.waitForTimeout(500);
  ele = await page.$(`${classPath} input.ant-input`);
  ele.click();
  await page.waitForTimeout(1 * 1000);
  await ele.type(val);
}

/**
 * 点击按钮
 * @param {*} page
 * @param {*} classPath 按钮父节点路径，自身路径
 * @param {*} btnText 按钮文字
 */
async function clickButton(page, classPath, btnText) {
  const texts = await page.$$eval(`${classPath} button > span`, (node) =>
    node.map((n) => n.innerText.replace(/\s/g, '')),
  );

  // console.log('texts', texts);

  const index = texts.findIndex((k) => k === btnText);
  // console.log('index', index);

  // 等待1s
  await page.waitForTimeout(1000);

  const eles = await page.$$(`${classPath} button`);
  eles[index].click();
}

/**
 * 点击节点
 * @param {*} page
 * @param {*} classPath 自身路径
 */
async function clickDom(page, classPath) {
  const ele = await page.$(`${classPath}`);
  ele && ele.click();
}

module.exports = {
  clickButton,
  setInput,
  setSelect,
  clickDom,
};
