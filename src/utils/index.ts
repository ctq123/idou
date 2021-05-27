import serialize from 'serialize-javascript';
import prettier from 'prettier/esm/standalone.mjs';
import parserBabel from 'prettier/esm/parser-babel.mjs';
import parserHTML from 'prettier/esm/parser-html.mjs';
import parserCSS from 'prettier/esm/parser-postcss.mjs';

/**
 * 获取唯一值
 * @returns
 */
export const getUid = () => Math.random().toString(36).slice(-8);

/**
 * 由字符串转换成对象
 * @param code
 * @returns
 */
export const deserialize = (code: any) => {
  return eval('(' + code + ')');
};

/**
 * 处理格式
 * @param str
 * @param parser
 * @returns
 */
export const prettierFormat = (str: string | null, parser: string) => {
  if (!str) return str;
  let plugins = [];
  switch (parser) {
    case 'vue':
      plugins = [parserHTML, parserBabel, parserCSS];
      break;
    case 'html':
      plugins = [parserHTML, parserBabel];
      break;
    default:
      plugins = [parserBabel];
  }

  return prettier.format(str, {
    parser,
    plugins,
    printWidth: 80,
    singleQuote: true,
  });
};

/**
 * 获取function
 * @param func
 * @param newFuncName
 * @returns
 */
export const transformFunc = (func: any, newFuncName = '') => {
  const funcStr = func.toString();
  const start = funcStr.indexOf('function ') + 9;
  const end = funcStr.indexOf('(');
  const funcName = funcStr.slice(start, end);
  let newFunc = funcStr.replace('function ', '');
  let funcBodyStart = funcStr.indexOf('{') + 1;
  let funcBodyEnd = funcStr.lastIndexOf('}');
  let funcBody = funcStr.slice(funcBodyStart, funcBodyEnd);
  if (newFuncName) {
    newFunc = newFunc.replace(funcName, newFuncName);
  }
  return { newFunc, newFuncName: newFuncName || funcName, funcBody };
};

/**
 * 替换对象属性
 * @param obj 对象
 * @param oldKey 老属性
 * @param newKey 新属性
 */
export const replaceObjKey = (obj: any, oldKey: any, newKey: any) => {
  Object.keys(obj).forEach((k) => {
    if (k === oldKey) {
      obj[newKey] = obj[k];
      delete obj[k];
    }
  });
};

/**
 * 对象转换成字符串，function,date,reg不出现丢失
 */
export { serialize };
