/*
 * @Author: chengtianqing
 * @Date: 2021-06-12 01:50:35
 * @LastEditTime: 2021-06-14 04:44:49
 * @LastEditors: chengtianqing
 */

/**
 * 设置选择框
 * @param {*} page
 * @param {*} ele 父节点
 * @param {*} classPath 路径
 * @param {*} val 值
 * @param {*} index 第几个下拉框
 */
async function setSelect(page, ele, classPath, val, index = 0) {
  let el = null,
    els = null;
  // await page.waitForSelector(`${classPath} .ant-select-selection-search`);
  await (ele || page).focus(`${classPath} input`);
  await page.waitForTimeout(500);
  el = await (ele || page).$(`${classPath} .ant-select-clear`);
  (await el) && el.click();

  el = await (ele || page).$(`${classPath} .ant-select-selection-search`);
  await el.click();

  await page.waitForTimeout(1 * 1000);

  await page.waitForSelector(
    `body div.ant-select-dropdown .rc-virtual-list-holder-inner .ant-select-item-option-content`,
  );
  els = await page.$$(`body div.ant-select-dropdown`);
  el = els[index];

  // 查找对应的内容
  const texts = await el.$$eval(
    '.rc-virtual-list-holder-inner .ant-select-item-option-content',
    (node) => node.map((n) => n.innerText),
  );
  const i = texts.findIndex((k) => k === val);

  // 等待1s
  await page.waitForTimeout(1 * 1000);

  els = await el.$$(
    '.rc-virtual-list-holder-inner .ant-select-item-option-content',
  );
  await els[i].click();
}

/**
 * 设置input
 * @param {*} page
 * @param {*} classPath 父节点路径
 * @param {*} val 值
 */
async function setInput2(page, classPath, val) {
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
 * @param {*} page
 * @param {*} ele 父节点
 * @param {*} classPath 路径
 * @param {*} val 值
 */
async function setInput(page, ele, classPath, val) {
  const input = await (ele || page).$(`${classPath} input`);
  if (input) {
    let suf = null,
      icon = null;
    suf = await (ele || page).$(`${classPath} span.ant-input-suffix`);
    await suf.click();
    icon = await (ele || page).$(
      `${classPath} span.ant-input-suffix span.ant-input-clear-icon-hidden`,
    );
    input.focus();
    input.type(val);
  }
}

/**
 * 点击按钮
 * @param {*} page
 * @param {*} ele 父节点
 * @param {*} classPath 路径
 * @param {*} btnText 按钮文字
 */
async function clickButton(page, ele, classPath, btnText) {
  const texts = await (ele || page).$$eval(
    `${classPath} button > span`,
    (node) => node.map((n) => n.innerText.replace(/\s/g, '')),
  );
  const index = texts.findIndex((k) => k === btnText);
  // 等待500ms
  await page.waitForTimeout(500);

  const els = await (ele || page).$$(`${classPath} button`);
  await els[index].click();
}

/**
 * 点击节点
 * @param {*} page
 * @param {*} ele 父节点
 * @param {*} classPath 路径
 */
async function clickDom(page, ele, classPath) {
  const el = await (ele || page).$(`${classPath}`);
  (await el) && el.click();
}

/**
 * 点击节点
 * @param {*} page
 * @param {*} ele 父节点
 * @param {*} classPath 路径
 */
async function clickAllDom(page, ele, classPath) {
  const els = await (ele || page).$$(`${classPath}`);
  for (let i = 0; i < els.length; i++) {
    await els[i].click();
  }
}

module.exports = {
  clickButton,
  setInput,
  setSelect,
  clickDom,
  clickAllDom,
};
