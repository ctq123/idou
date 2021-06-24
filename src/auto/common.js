/*
 * @Author: chengtianqing
 * @Date: 2021-06-12 01:50:35
 * @LastEditTime: 2021-06-14 04:44:49
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
  // console.log(classPath, val)
  let ele = null,
    eles = null;
  await page.waitForSelector(`${classPath} .ant-select-selection-search`);
  await page.focus(`${classPath} input`);
  await page.waitForTimeout(500);
  ele = await page.$(`${classPath} .ant-select-clear`);
  (await ele) && ele.click();

  ele = await page.$(`${classPath} .ant-select-selection-search`);
  await ele.click();

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
  await eles[i].click();
}

/**
 * 设置input
 * @param {*} page
 * @param {*} classPath 父节点路径
 * @param {*} val 值
 */
async function setInput(page, classPath, val) {
  let ele = null;
  // await page.waitForTimeout(500);
  await page.focus(`${classPath} input`);
  ele = await page.$(`${classPath} .ant-input-suffix`);
  (await ele) && ele.click();

  await page.waitForTimeout(500);
  await page.waitForSelector(`${classPath} input.ant-input`);
  ele = await page.$(`${classPath} input.ant-input`);
  await ele.click();
  await page.waitForTimeout(1 * 1000);
  await ele.type(val);
}

/**
 * 设置input-优化
 * @param {*} ele
 * @param {*} classPath 父节点路径
 * @param {*} val 值
 */
async function setInput2(ele, classPath, val) {
  const input = await ele.$(`${classPath} input`);
  if (input) {
    let suf = null,
      icon = null;
    suf = await ele.$(`${classPath} span.ant-input-suffix`);
    await suf.click();
    icon = await ele.$(
      `${classPath} span.ant-input-suffix span.ant-input-clear-icon-hidden`,
    );
    input.focus();
    input.type(val);
  }
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
  await eles[index].click();
}

/**
 * 点击节点
 * @param {*} page
 * @param {*} classPath 自身路径
 */
async function clickDom(page, classPath) {
  const ele = await page.$(`${classPath}`);
  (await ele) && ele.click();
}

/**
 * 点击节点
 * @param {*} page
 * @param {*} classPath 自身路径
 */
async function clickAllDom(page, classPath) {
  const eles = await page.$$(`${classPath}`);
  for (let i = 0; i < eles.length; i++) {
    await eles[i].click();
  }
}

module.exports = {
  clickButton,
  setInput,
  setInput2,
  setSelect,
  clickDom,
  clickAllDom,
};
