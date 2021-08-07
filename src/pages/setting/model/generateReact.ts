import { message } from 'antd';

import { ReactXML, styleXML, ReactTableRenderXML } from './componentXML';
import {
  prettierFormat,
  transformFunc,
  replaceObjKey,
  generateClassStyle,
  serialize,
} from '@/utils';
import isFunction from 'lodash/isFunction';

let renderData: any = {
  prefixUI: '',
  reactCode: '',
  template: '',
  imports: [],
  asyncImport: {},
  constOptions: [],
  constImport: {},
  formRefs: [],
  formRefMap: {},
  componentProps: [],
  data: {},
  useStates: [],
  computed: [],
  methods: [],
  asyncMethod: {},
  lifecycles: [],
  styles: [],
  asyncStyle: {},
  apiImports: [],
  apis: [],
};

const lifeCycleMap: any = {
  mounted: 'mounted',
  beforeDestroy: 'beforeDestroy',
};

// 通用事件
const commonFunc = [
  'onClick',
  'onChange',
  'onBlur',
  'onFocus',
  'onClear',
  'onSelect',
  'onSearch',
];

const initData = (prefixUI: string) => {
  renderData = {
    prefixUI: prefixUI,
    reactCode: '',
    template: '',
    imports: [],
    asyncImport: {},
    constOptions: [],
    constImport: {},
    formRefMap: {},
    formRefs: [],
    componentProps: [],
    data: {},
    computed: [],
    methods: [],
    asyncMethod: {},
    lifecycles: [],
    styles: [],
    asyncStyle: {},
    apiImports: [],
    apis: [],
  };
};

// 转换componentName成对应的源码名称
const getDomName = (componentName: string, componentType: any = 'antd') => {
  switch (componentType) {
    case 'native':
      return componentName.toLowerCase();
    case 'custom':
      return componentName;
    default:
      if (!(componentName.indexOf('.') > -1)) {
        setAsyncImport(componentName);
      }
      return renderData.prefixUI + componentName;
  }
};

const generateTemplate = (
  schemaDSL: any,
  vModel?: any,
  isGlobalParams?: any,
) => {
  const {
    componentName,
    props,
    children,
    options,
    dataKey,
    type,
    componentType,
  } = schemaDSL || {};
  let xml = '';
  if (componentName) {
    setAsyncStyles(props.className);
    replaceObjKey(props, 'clearable', 'allowClear');

    const eleName = getDomName(componentName, componentType);
    switch (componentName) {
      case 'Form':
        const formDataKey = dataKey || 'form';
        const formRefKey = formDataKey + 'Ref';
        // 解决多个form公用数据问题
        renderData.data[formDataKey] = renderData.data[formDataKey]
          ? { ...renderData.data[formDataKey] }
          : {};

        setAsyncImport('Form');
        setAsyncImport('Row');
        setAsyncImport('Col');
        renderData.formRefMap[formRefKey] = formRefKey;

        const formChildren = children || [];
        const buttonItems = (list: any) =>
          list.map((item: any) => {
            if (!item) return '';
            const itemChildren = (item.children || [])
              .map((child: any) =>
                generateTemplate(child, vModel, isGlobalParams),
              )
              .join('');
            return itemChildren;
          });

        const formItems = (list: any[]) =>
          list
            .map((item: any) => {
              const { key, label, initValue, rules } = item || {};
              const vmodel = key && formDataKey ? `${formDataKey}.${key}` : '';
              const itemProps: any = {
                label,
              };
              if (key) {
                itemProps['prop'] = key;
                if (formDataKey) {
                  renderData.data[formDataKey][key] =
                    initValue !== undefined ? initValue : '';
                }
                // console.log('rules', rules);
                // 生成rules
                if (Array.isArray(rules)) {
                  itemProps['rules'] = rules;
                }
              }
              let itemChildren = (item.children || [])
                .map((child: any) =>
                  generateTemplate(child, vmodel, isGlobalParams),
                )
                .join('');

              itemChildren = ReactXML.CreateDom(
                getDomName('Form.Item'),
                getPropsStr(itemProps),
                itemChildren,
              );

              return ReactXML.CreateDom(
                getDomName('Col'),
                `{ ...colProps }`,
                itemChildren,
              );
            })
            .join('\n');

        const formProps = {
          ...props,
          form: `{${formRefKey}}`,
        };

        let buttonItemsStr = !formChildren[formChildren.length - 1].key
          ? buttonItems(formChildren.splice(-1))
          : '';
        let formItemsStr = formItems(formChildren);
        let formChildStr = null;

        if (type === 'search') {
          // 搜索组件
          buttonItemsStr = ReactXML.CreateDom(
            getDomName('Form.Item'),
            '',
            buttonItemsStr,
          );
          buttonItemsStr = ReactXML.CreateDom(
            getDomName('Col'),
            `{ ...colProps }`,
            buttonItemsStr,
          );
          formChildStr = `${formItemsStr}\n${buttonItemsStr}`;
        } else {
          // 普通输入组件
          formChildStr = `${formItemsStr}\n${buttonItemsStr}`;
        }

        formChildStr = ReactXML.CreateDom(
          getDomName('Row'),
          `gutter={20}`,
          formChildStr,
        );

        xml = ReactXML.CreateDom(
          eleName,
          getPropsStr(formProps),
          `${formChildStr}`,
        );
        break;
      case 'Select':
        setAsyncImport(componentName);
        const selectOptions = (options || [])
          .map((item: any) => {
            return ReactXML.CreateDom(
              getDomName('Select.Option'),
              getPropsStr(item),
              '',
            );
          })
          .join('\n');
        const selectProps = {
          ...props,
        };
        const selectAttr = `${getPropsStr(selectProps)} ${getEventStr(
          schemaDSL,
        )}`;
        xml = ReactXML.CreateDom(eleName, selectAttr, `\n${selectOptions}\n`);
        break;
      case 'RangePicker':
        setAsyncImport('DatePicker');
        const rangepickerProps: any = {
          style: 'width: 100%',
          ...props,
        };
        const rangePickerAttr = `${getPropsStr(rangepickerProps)} ${getEventStr(
          schemaDSL,
        )}`;
        xml = ReactXML.CreateDom(
          getDomName('DatePicker.RangePicker'),
          rangePickerAttr,
          '',
        );
        break;
      case 'RadioGroup':
        setAsyncImport('Radio');
        const radioOptions = (options || [])
          .map((item: any) => {
            let name = type === 'button' ? 'Radio.Button' : 'Radio';
            const itemProps = { ...item };
            // 剔除value
            delete itemProps.value;
            return ReactXML.CreateDom(
              getDomName(name),
              getPropsStr(itemProps),
              '',
            );
          })
          .join('\n');
        const radioGroupProps: any = {
          ...props,
        };
        const radioGroupAttr = `${getPropsStr(radioGroupProps)} ${getEventStr(
          schemaDSL,
        )}`;
        xml = ReactXML.CreateDom(
          getDomName('Radio.Group'),
          radioGroupAttr,
          radioOptions,
        );
        break;
      case 'Cascader':
        setAsyncImport('Cascader');
        const cascaderProps: any = {
          options: options || [],
          ...props,
        };
        if (vModel) {
          const key = vModel.split('.').splice(-1)[0];
          const dataKey1 = key + 'CategoryOptions';
          renderData.data[dataKey1] = options || [];
          delete cascaderProps.options;
          cascaderProps['options'] = `{ ${dataKey1} }`;
        }
        const cascaderAttr = `${getPropsStr(cascaderProps)} ${getEventStr(
          schemaDSL,
        )}`;
        xml = ReactXML.CreateDom(eleName, cascaderAttr, '');
        break;
      case 'AutoComplete':
        setAsyncImport('AutoComplete');
        const autoCompleteEventStr = getEventStr(schemaDSL);
        const autoCompleteProps: any = {
          ...props,
        };
        const autoCompleteAttr = `${getPropsStr(
          autoCompleteProps,
        )} ${autoCompleteEventStr}`;
        xml = ReactXML.CreateDom(eleName, autoCompleteAttr, '');
        break;
      case 'Table':
        const listKey = dataKey || 'list';
        renderData.data[listKey] = [];
        setAsyncImport('Table');

        let columns = [];
        if (type === 'editTable') {
          // // 添加选择行
          // columns += ReactXML.CreateDom(
          //   'el-table-column',
          //   `type="selection" width="50"`,
          //   '',
          // );
        }
        columns = (children || []).map((item: any) => {
          const newProps = { ...item };
          const renderMothod =
            ReactTableRenderXML[item.renderKey] ||
            ReactTableRenderXML['renderDefault'];
          let childStr = renderMothod(item.key);

          if (item.key) {
            delete newProps.key;
            delete newProps.renderKey;
          }
          if (item.label) {
            delete newProps.label;
          }
          if (item.minWidth) {
            delete newProps.minWidth;
          }
          if (item.render) {
            childStr = item.render;
          }
          if (item.enumObj) {
            renderData.data[`${item.key}Obj`] = item.enumObj;
            delete newProps.enumObj;
          }
          if (Array.isArray(item.children) && item.children.length) {
            // 编辑类型
            delete newProps.children;
            delete newProps.uuid;
            const vmodel =
              listKey && item.key && type === 'editTable'
                ? `row.${item.key}`
                : '';
            childStr = (item.children || [])
              .map((child: any) => generateTemplate(child, vmodel, true))
              .join('');
          }
          // 重新扫描是否包含函数
          checkFuncStr(childStr);
          getPropsStr(newProps);
          // const renderFunc = () => childStr
          // function fn(obj: any) {
          //   return new Function(`"use strict"; return (text: any, row: any) => { return ${obj} }`);
          // }
          // const a = fn(childStr)
          const res = {
            ...newProps,
            title: item.label,
            dataIndex: item.key,
          };
          if (
            item.renderKey !== 'renderDefault' ||
            !ReactTableRenderXML[item.renderKey]
          ) {
            // console.log('childStr', childStr);
            // // TODO 转化函数包含全局变量的问题
            // res.render = (text: any, row: any) => {
            //   return `${childStr}`
            // }
          }
          return res;
        });

        // console.log("columns", columns)

        renderData.data[`${listKey}Columns`] = columns;

        const tableProps = {
          ...props,
          pagination: false,
          ':columns': `${listKey}Columns`,
          ':dataSource': `${listKey}`,
        };
        xml = ReactXML.CreateDom(eleName, getPropsStr(tableProps), ``);
        break;
      case 'Row':
        if (dataKey) {
          renderData.data[dataKey] = renderData.data[dataKey]
            ? { ...renderData.data[dataKey] }
            : {};
        }
        setAsyncImport('Row');
        setAsyncImport('Col');

        const rowChildren = (children || [])
          .filter(Boolean)
          .map((item: any) => {
            if (item.componentName) {
              const vmodel =
                dataKey && item.key ? `${dataKey}.${item.key}` : '';
              return generateTemplate(item, vmodel, isGlobalParams);
            } else {
              const renderMothod =
                ReactTableRenderXML[item.renderKey] ||
                ReactTableRenderXML['renderDefault'];
              // let childStr = renderMothod(item.key);
              let childStr = '';

              if (item.key && dataKey) {
                renderData.data[dataKey][item.key] = '';
              }
              if (item.enumObj) {
                renderData.data[`${item.key}Obj`] = item.enumObj;
              }

              childStr = ReactXML.CreateDom(
                getDomName('span', 'native'),
                'className="title"',
                `${item.label}：`,
              );
              childStr += '\n';

              if (item.render) {
                childStr += item.render;
              } else {
                childStr += renderMothod(item.key, dataKey);
              }

              // 重新扫描是否包含函数
              checkFuncStr(childStr);

              const colProps = {
                span: item.span ? item.span : 8,
                ...item.props,
              };
              return ReactXML.CreateDom(
                getDomName('Col'),
                getPropsStr(colProps),
                childStr,
              );
            }
          })
          .join('\n');

        xml = ReactXML.CreateDom(eleName, getPropsStr(props), rowChildren);
        break;
      case 'Pagination':
        setAsyncImport('Pagination');
        const paginationDataKey = dataKey || 'pagination';
        renderData.data[paginationDataKey] = {
          current: 1,
          pageSize: 20,
          total: 0,
        };
        const paginationEventStr = getEventStr(schemaDSL, {
          onPageChange: 'onChange',
        });
        const paginationPorps = {
          ...props,
          showSizeChanger: false,
        };
        const paginationAttr = `{...${paginationDataKey}} ${getPropsStr(
          paginationPorps,
        )} ${paginationEventStr}`;
        xml = ReactXML.CreateDom(eleName, paginationAttr, '');
        break;
      case 'CrumbBack':
        xml = ReactXML['CrumbBack'](getEventStr(schemaDSL), children);
        break;
      case 'StatusTag':
        setAsyncImport('Tag');
        // TODO 这个自定义设计需要改进
        const { statusKey, statusTagObj } = props;
        const key = statusKey.split('.').splice(-1)[0];
        const dataKey1 = key + 'Tag';
        renderData.data[dataKey1] = statusTagObj;
        xml = ReactXML['StatusTag'](statusKey, dataKey1);
        break;
      case 'Modal':
        delete props['close-on-click-modal'];
        if (props[':visible.sync']) {
          delete props[':visible.sync'];
          props[':visible'] = `visible`;
        }
      default:
        if (dataKey && renderData.data[dataKey] === undefined) {
          renderData.data[dataKey] = '';
        }
        const defaultAttr = `${getPropsStr(props)} ${getEventStr(
          schemaDSL,
          {},
          isGlobalParams,
        )}`;
        const defaultChildStr = Array.isArray(children)
          ? children
              .filter(Boolean)
              .map((t) => {
                if (t.componentName) {
                  return generateTemplate(t, vModel, isGlobalParams);
                } else {
                  return t;
                }
              })
              .join('')
          : children || '';
        xml = ReactXML.CreateDom(eleName, defaultAttr, defaultChildStr);
        break;
    }
  }

  return xml + '\n';
};

const getLifeCycle = (item: object = {}) => {
  const lifeList: any = [];
  Object.entries(item)
    .filter(Boolean)
    .forEach(([k, v]) => {
      const name = lifeCycleMap[k];
      const { newFunc } = transformFunc(v, name || k);
      let funcStr = newFunc.replace(name, '');
      let i = funcStr.indexOf('{');
      let effectStr = '';
      switch (name) {
        case 'mounted':
          effectStr = `useEffect(${funcStr.substr(0, i)} => ${funcStr.substr(
            i,
          )}, [])`;
          break;
        case 'beforeDestroy':
          effectStr = `useEffect(() => {
            return ${funcStr.substr(0, i)} => ${funcStr.substr(i)}
          , [])`;
          break;
      }
      if (effectStr) {
        lifeList.push(effectStr);
      }
    });
  return lifeList;
};

const getPageProps = (item: object = {}) => {
  const propsList: any = [];
  if (Object.keys(item).length) {
    const str = `const { ${Object.keys(item).join(',')} } = props`;
    propsList.push(str);
  }
  return propsList;
};

const getComputed = (item: object = {}) => {
  const computedList: any = [];
  Object.entries(item)
    .filter(Boolean)
    .forEach(([k, v]) => {
      computedList.push(`${k}: ${v}`);
    });
  return computedList;
};

const getImports = (item: object = {}) => {
  const ilist: any = [];
  const hooks: any = [];
  if (Object.keys(renderData.data).length) {
    hooks.push('useState');
  }
  if (renderData.lifecycles.length) {
    hooks.push('useEffect');
  }
  if (hooks.length) {
    const importStr = `import { ${hooks.join(', ')} } from "react"`;
    ilist.push(importStr);
  }
  Object.entries(item).forEach(([k, v]) => {
    const importStr = `import ${k} from "${v}"`;
    ilist.push(importStr);
  });
  Object.entries(renderData.asyncImport).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      const importStr = `import { ${v.join(',')} } from "${k}"`;
      ilist.push(importStr);
    }
  });
  ilist.push(`import "./index.less"`);
  return ilist;
};

/**
 * 依赖包
 * @param component
 * @param lib
 */
const setAsyncImport = (component: string, lib: string = 'antd') => {
  if (!renderData.asyncImport[lib]) {
    renderData.asyncImport[lib] = [component];
  } else if (!renderData.asyncImport[lib].includes(component)) {
    renderData.asyncImport[lib].push(component);
  }
};

/**
 * 引入子依赖包
 * @returns
 */
const getConstOptions = () => {
  const olist: any = [];
  Object.entries(renderData.constImport).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      const constStr = `const { ${v.join(',')} } = ${k}`;
      olist.push(constStr);
    }
  });
  return olist;
};

/**
 * 子依赖包
 * @param childCom
 * @param component
 */
const setConstImport = (childCom: string, component: string) => {
  if (!renderData.constImport[component]) {
    renderData.constImport[component] = [childCom];
  } else if (!renderData.constImport[component].includes(childCom)) {
    renderData.constImport[component].push(childCom);
  }
};

const getMethods = (item: object = {}) => {
  const mlist: any = [];
  Object.entries(item).forEach(([k, v]) => {
    const { newFunc } = transformFunc(v);
    mlist.push(newFunc);
  });
  Object.entries(renderData.asyncMethod).forEach(([_, v]) => {
    mlist.push(v);
  });
  // 将async fuc() {} 转换成 const func = async () => {}
  return mlist
    .map((str: any) => {
      if (str) {
        const paramStartIndex = str.indexOf('(');
        const paramEndIndex = str.indexOf('{');
        const nameStr = str.substr(0, paramStartIndex);
        const funcName = nameStr.replace('async ', '');
        const paramStr = str.substr(0, paramEndIndex);
        return `const ${funcName} = ${paramStr.replace(
          funcName,
          '',
        )} => ${str.substr(paramEndIndex)}`;
      }
      return null;
    })
    .filter(Boolean);
};

const getFormRefs = () => {
  const refs: any = [];
  Object.keys(renderData.formRefMap).forEach((k) => {
    const formStr = `const [ ${k} ] = Form.useForm()`;
    refs.push(formStr);
  });
  return refs;
};

const getUseStates = () => {
  const list: any = [];
  Object.entries(renderData.data).forEach(([k, v]) => {
    if (k) {
      // 将首写字母变大写
      const key = k.replace(/^\w/g, (c) => c.toUpperCase());
      const useStateStr = `const [${k}, set${key}] = useState(${serialize(v)})`;
      list.push(useStateStr);
    }
  });
  return list;
};

const getStyles = (type: string) => {
  const slist: any = [];
  const css = styleXML[type]();
  slist.push(css);
  Object.entries(renderData.asyncStyle).forEach(([_, v]) => {
    slist.push(v);
  });
  return slist;
};

const setAsyncStyles = (cls: any) => {
  (cls || '')
    .toString()
    .split(' ')
    .filter(Boolean)
    .forEach((c: any) => {
      let css = generateClassStyle(c);
      if (css) {
        const style = `.${c} {
          ${css};
        }`;
        renderData.asyncStyle[c] = style;
      }
    });
};

const getApis = (item: object = {}) => {
  let apiList: any = [];
  let apiImportList: any = [];
  Object.entries(item).forEach(([k, v]) => {
    if (k === 'imports') {
      Object.entries(v).forEach(([kk, vv]) => {
        const importStr = `import ${kk} from "${vv}"`;
        apiImportList.push(importStr);
      });
    } else {
      apiList.push(`export ${v}`);
    }
  });
  return { apiList, apiImportList };
};

/**
 * 处理事件字符串
 * @param item dsl
 * @param extraMap 特定函数事件
 * @param isGlobalParams 是否包含全局参数
 * @returns
 */
const getEventStr = (
  item: object,
  extraMap: any = {},
  isGlobalParams: any = false,
) => {
  let funcStr = '';
  Object.entries(item).forEach(([k, v]) => {
    if ((typeof v === 'string' && v.includes('function')) || isFunction(v)) {
      const { newFunc, newFuncName, params = '' } = transformFunc(v);
      const isValidParams = params.replace(/\(|\)/g, '').trim();
      // 判断是否含有全局参数
      const paramsStr = isValidParams && isGlobalParams ? params : '';
      const funcName = newFuncName + paramsStr;
      funcStr = funcStr ? `${funcStr} ` : funcStr;
      if (commonFunc.includes(k)) {
        // 通用的函数事件
        funcStr += `${k}={${funcName}}`;
      } else if (extraMap[k]) {
        // 特定的函数事件
        funcStr += `${extraMap[k]}={${funcName}}`;
      }
      renderData.asyncMethod[funcName] = newFunc;
    }
  });
  return funcStr;
};

/**
 * 检测字符串中包含的事件-针对vue【@+事件名】
 * @param str
 */
const checkFuncStr = (str: string) => {
  const funcs = commonFunc.join('|');
  const reg = new RegExp(`${funcs}`, 'g');
  if (str) {
    const ex = reg.exec(str);
    if (ex) {
      const s = str.substr(ex.index + ex[0].length);
      // console.log('s', s);
      let funcName = s.split(/\{/g)[1];
      funcName = funcName.split(/\}/g)[0];
      let func = funcName;
      if (funcName && funcName.endsWith(')')) {
        func += '{ }';
      } else {
        func += '() { }';
      }
      renderData.asyncMethod[funcName] = func;
      checkFuncStr(s);
    }
  }
};

const getPropsStr = (obj: any) => {
  return Object.entries(obj).reduce((pre, [k, v]) => {
    if (v === undefined || v === null) return pre;
    if (k && k.startsWith(':')) {
      return `${pre} ${k.substr(1)}={${v}}`;
    }
    if (typeof v !== 'string') {
      return `${pre} ${k}={${serialize(v).replace(/\"/g, "'")}}`;
    } else {
      return `${pre} ${k}="${v}"`;
    }
  }, '');
};

const generateReact = () => {
  const reactCode = ReactXML.ReactTemplate(renderData);
  // console.log("reactCode", reactCode)
  return prettierFormat(reactCode, 'babel');
};

const generateApi = () => {
  const reactApiCode = `
    ${renderData.apiImports.join(';\n')}

    ${renderData.apis.join('\n')}
  `;
  return prettierFormat(reactApiCode, 'babel');
};

const generateStyle = () => {
  const styleCode = `
    ${renderData.styles.join('\n')}
  `;
  return prettierFormat(styleCode, 'less');
};

const getSourceCode = (DSL: any, prefixUI: string) => {
  try {
    initData('');
    const { apiList, apiImportList } = getApis(DSL.apis);
    renderData.data = DSL.dataSource || {};
    renderData.componentProps = getPageProps(DSL.componentProps);
    renderData.computed = getComputed(DSL.computed);
    renderData.lifecycles = getLifeCycle(DSL.lifeCycle);
    renderData.apiImports = apiImportList;
    renderData.apis = apiList;
    // console.time("generateTemplate")
    renderData.template = generateTemplate(DSL);
    // console.timeEnd("generateTemplate")
    // 动态生成class，有顺序要求
    renderData.styles = getStyles(DSL.type);
    renderData.methods = getMethods(DSL.methods);
    renderData.imports = getImports(DSL.imports);
    renderData.formRefs = getFormRefs();
    renderData.useStates = getUseStates();
    renderData.constOptions = getConstOptions();
    renderData.reactCode = generateReact();
    renderData.styleCode = generateStyle();
    renderData.reactApiCode = generateApi();
    return renderData;
  } catch (e) {
    console.error(e);
    message.error('生成源码异常');
  }
};

export { getSourceCode };
