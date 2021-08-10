/*
 * @Author: chengtianqing
 * @Date: 2021-05-21 01:19:08
 * @LastEditTime: 2021-07-19 22:44:38
 * @LastEditors: chengtianqing
 * @Description:
 */
import serialize from 'serialize-javascript';
import prettier from 'prettier/esm/standalone.mjs';
import parserBabel from 'prettier/esm/parser-babel.mjs';
import parserHTML from 'prettier/esm/parser-html.mjs';
import parserCSS from 'prettier/esm/parser-postcss.mjs';
import parserTypeScript from 'prettier/esm/parser-typescript.mjs';
import parserFlow from 'prettier/esm/parser-flow.mjs';

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
 * @param type
 * @returns
 */
export const prettierFormat = (str: string | null, type: string) => {
  if (!str) return str;
  let plugins = [];
  let parser = type;
  switch (type) {
    case 'vue2':
    case 'vue3':
      parser = 'vue';
      plugins = [parserHTML, parserBabel, parserCSS, parserTypeScript];
      break;
    case 'react':
      parser = 'babel';
      plugins = [parserHTML, parserBabel, parserCSS, parserTypeScript];
      break;
    case 'html':
      plugins = [parserHTML, parserBabel];
      break;
    case 'less':
      plugins = [parserHTML, parserCSS];
      break;
    default:
      plugins = [parserBabel];
  }

  return prettier.format(str, {
    parser,
    plugins,
    printWidth: 80,
    singleQuote: true,
    jsxSingleQuote: true,
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
  const funcStartIndex = funcStr.indexOf('function ') + 9;
  const paramsStartIndex = funcStr.indexOf('(');
  const paramsEndIndex = funcStr.indexOf(')');
  const funcName = funcStr.slice(funcStartIndex, paramsStartIndex);
  const params = funcStr.slice(paramsStartIndex, paramsEndIndex + 1);
  let newFunc = funcStr.replace('function ', '');
  let funcBodyStart = funcStr.indexOf('{') + 1;
  let funcBodyEnd = funcStr.lastIndexOf('}');
  let funcBody = funcStr.slice(funcBodyStart, funcBodyEnd);
  if (newFuncName) {
    newFunc = newFunc.replace(funcName, newFuncName);
  }
  return { newFunc, newFuncName: newFuncName || funcName, params, funcBody };
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
 * 替换字符串
 * @param s
 * @param fromReg 匹配的正则表达式
 * @param toStr 要替换的函数或字符串
 * @returns
 */
export const replaceStr = (s: any, fromReg: any, toStr: any) => {
  return [undefined, null].includes(s)
    ? s
    : s.toString().replace(fromReg, toStr);
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
    const spacePre: any = {
      p: 'padding',
      m: 'margin',
      h: 'height',
      w: 'width',
    };
    const spaceFix: any = {
      t: '-top',
      b: '-bottom',
      l: '-left',
      r: '-right',
    };
    const fontPre: any = {
      fs: 'font-size',
      fw: 'font-weight',
    };
    const flex: any = {
      df: 'display: flex',
      jcsb: 'justify-content: space-between',
      aic: 'align-items: center',
      jcfe: 'justify-content: flex-end',
    };
    const colorPre: any = {
      c: 'color',
      bgc: 'background-color',
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
    const getColorStyle = (reg: any, str: any, pre: any) => {
      const ex = reg.exec(str);
      if (ex) {
        if (ex.length === 3) {
          if (/^([0-9]|[A-F]|[0-9A-F])+$/gi.test(ex[2])) {
            return `${pre[ex[1]]}: #${ex[2]}`;
          }
          return `${pre[ex[1]]}: ${ex[2]}`;
        }
      }
      return '';
    };
    // 处理flex布局
    if (flex[cls]) return flex[cls];

    // 处理内外间距宽高值，w100表示width: 100px
    style = getStyle(/^(p|m|h|w)(\d+)$/, cls, spacePre, spaceFix);
    if (style) return style;

    // 处理百分比，w-100表示width: 100%
    style = getStyle(/^(p|m|h|w)(-)(\d+)$/, cls, spacePre, spaceFix);
    if (style) return style;

    // 处理单一内外间距，pr100表示padding-right: 100px
    style = getStyle(/^(p|m)(r|l|t|b)(\d+)$/, cls, spacePre, spaceFix);
    if (style) return style;

    // 处理字体，fs16表示font-size: 16px
    style = getStyle(/^(fw|fs)(\d+)$/, cls, fontPre, spaceFix);
    if (style) return style;

    // 处理颜色，c-fff表示color: #fff
    style = getColorStyle(/^(c|bgc)-(\w+)$/, cls, colorPre);
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
 * 处理JSON.stringify
 * @param s
 * @returns
 */
export const JSONtoString = (s: any) => {
  return JSON.stringify(s, function (k, v) {
    if (typeof v === 'function') {
      return v.toString();
    }
    return v;
  });
};

// export const JSONtoParse = (s: any) => {
//   return JSON.parse(s, function (k, v) {
//     if (v && v.toString().indexOf('function') > -1) {
//       return v.toString().replace(/\"/g, '');
//     }
//     return v;
//   });
// }

/**
 * 对象转换成字符串，function,date,reg不出现丢失
 */
export { serialize };
