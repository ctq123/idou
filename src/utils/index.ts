/*
 * @Author: chengtianqing
 * @Date: 2021-05-21 01:19:08
 * @LastEditTime: 2021-07-08 02:07:10
 * @LastEditors: chengtianqing
 * @Description:
 */
import serialize from 'serialize-javascript';
import prettier from 'prettier/esm/standalone.mjs';
import parserBabel from 'prettier/esm/parser-babel.mjs';
import parserHTML from 'prettier/esm/parser-html.mjs';
import parserCSS from 'prettier/esm/parser-postcss.mjs';

/**
 * 获取域
 * @param type
 * @returns
 */
export const getDomain = (type = 1) => {
  switch (type) {
    case 1:
      return 'P.O.I.Z.O.N'.split('.').join('').toLowerCase();
    case 2:
      return 'S.H.I.Z.H.U.A.N.G.-.I.N.C'.split('.').join('').toLowerCase();
    default:
      return '';
  }
};

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
 * 根据class名称生成css样式
 * @param cls class名称
 * @returns
 */
export const generateClassStyle = (cls: string) => {
  let style = '';
  cls = cls.trim();
  if (cls) {
    const preS: any = {
      p: 'padding',
      m: 'margin',
      h: 'height',
      w: 'width',
    };
    const fixD: any = {
      t: '-top',
      b: '-bottom',
      l: '-left',
      r: '-right',
    };
    const preF: any = {
      fs: 'font-size',
      fw: 'font-weight',
    };
    const flex: any = {
      df: 'display: flex',
      jcsb: 'justify-content: space-between',
      aic: 'align-items: center',
      jcfe: 'justify-content: flex-end',
    };

    const getStyle = (reg: any, str: any, pre: any, fix: any) => {
      const ex = reg.exec(str);
      if (ex) {
        if (ex.length === 3) {
          if (ex[1] === 'fw') {
            return `${pre[ex[1]]}: ${ex[2]}`;
          }
          return `${pre[ex[1]]}: ${ex[2]}px`;
        }
        if (ex.length === 4) {
          if (ex[2] === '-') {
            return `${pre[ex[1]]}: ${ex[3]}%`;
          }
          if (fix[ex[2]]) {
            return `${pre[ex[1]]}${fix[ex[2]]}: ${ex[3]}px`;
          }
        }
      }
      return '';
    };
    // 处理flex布局
    if (flex[cls]) return flex[cls];

    // 处理内外间距宽高值，w100表示width: 100px
    style = getStyle(/^(p|m|h|w)(\d+)$/, cls, preS, fixD);
    if (style) return style;

    // 处理百分比，w-100表示width: 100%
    style = getStyle(/^(p|m|h|w)(-)(\d+)$/, cls, preS, fixD);
    if (style) return style;

    // 处理单一内外间距，pr100表示padding-right: 100px
    style = getStyle(/^(p|m)(r|l|t|b)(\d+)$/, cls, preS, fixD);
    if (style) return style;

    // 处理单一内外间距，pr100表示padding-right: 100px
    style = getStyle(/^(fw|fs)(\d+)$/, cls, preF, fixD);
    if (style) return style;
  }
  return style;
};

/**
 * 中划线转驼峰
 * @param s
 */
export const toHump = (s: string) => {
  return s.replace(/\-(\w)/g, (_, c) => c && c.toUpperCase());
};

/**
 * 驼峰转中划线
 * @param s
 */
export const toLine = (s: string) => {
  return s.replace(/([A-Z])/g, '-$1').toLowerCase();
};

/**
 * 对象转换成字符串，function,date,reg不出现丢失
 */
export { serialize };
