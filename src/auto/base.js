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
  els2 = null;
  await (ele || page).focus(`${classPath} input`);
  el = await (ele || page).$(`${classPath} .ant-select-clear`);
  el && (await el.click());

  el = await (ele || page).$(`${classPath} .ant-select-selection-search`);
  el && (await el.click());

  await page.waitForSelector(
    `body div.ant-select-dropdown div div.rc-virtual-list div div div div.ant-select-item`,
  );
  els = await page.$$(`body div div div.ant-select-dropdown`);
  el = els[index];

  els2 = await el.$$('div.rc-virtual-list div div div div.ant-select-item');
  // 查找对应的内容
  const texts = await el.$$eval(
    'div.rc-virtual-list div div div div.ant-select-item div',
    (node) => node.map((n) => n.innerText),
  );
  const i = texts.findIndex((k) => k === val);

  await page.waitForTimeout(500);
  await els2[i].click();
}

/**
 * 设置input
 * @param {*} page
 * @param {*} ele 父节点
 * @param {*} classPath 路径
 * @param {*} val 值
 */
async function setInput(page, ele, classPath, val = '') {
  const input = await (ele || page).$(`${classPath} input`);
  if (input) {
    let suf = null,
      icon = null;
    suf = await (ele || page).$(`${classPath} .ant-input-suffix`);
    suf && (await suf.click());
    icon = await (ele || page).$(
      `${classPath} .ant-input-suffix .ant-input-clear-icon-hidden`,
    );
    await input.focus();
    await input.type(val);
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

  const els = await (ele || page).$$(`${classPath} button`);
  els[index] && (await els[index].click());
}

/**
 * 根据文本查询节点
 * @param {*} page
 * @param {*} ele
 * @param {*} classPath
 * @param {*} text
 * @returns
 */
async function findEle(page, ele, classPath, text) {
  const texts = await (ele || page).$$eval(`${classPath}`, (node) =>
    node.map((n) => n.innerText.replace(/\s/g, '')),
  );
  const index = texts.findIndex((k) => k === text);
  // console.log("texts", texts, index)
  const els = await (ele || page).$$(`${classPath}`);
  return els[index] || null;
}

/**
 * 点击节点
 * @param {*} page
 * @param {*} ele 父节点
 * @param {*} classPath 路径
 */
async function clickDom(page, ele, classPath, text = '') {
  let el = null;
  if (text) {
    el = await findEle(page, ele, classPath, text);
  } else {
    el = await (ele || page).$(`${classPath}`);
  }
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
  // console.log("classPath", els.length)
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
  findEle,
};
