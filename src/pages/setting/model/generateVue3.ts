import { message } from 'antd';

import { Vue3XML, styleXML, Vue3TableRenderXML } from './componentXML';
import {
  prettierFormat,
  transformFunc,
  replaceObjKey,
  generateClassStyle,
  replaceStr,
} from '@/utils';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';

let renderData: any = {
  prefixUI: 'a',
  vue3Code: '',
  template: '',
  imports: [],
  asyncImport: {},
  exports: [],
  asyncExport: {},
  constOptions: [],
  constImport: {},
  formRefs: [],
  formRefMap: {},
  componentProps: [],
  data: {},
  constData: [],
  computed: [],
  methods: [],
  asyncMethod: {},
  lifeCycles: [],
  styles: [],
  asyncStyle: {},
  apiImports: [],
  apis: [],
};

const lifeCycleMap: any = {
  beforeMount: 'onBeforeMount',
  mounted: 'onMounted',
  beforeUpdate: 'onBeforeUpdate',
  updated: 'onUpdated',
  beforeDestroy: 'onBeforeUnmount',
  destroyed: 'onUnmounted',
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
    vue3Code: '',
    template: '',
    imports: [],
    asyncImport: {},
    exports: [],
    asyncExport: {},
    constOptions: [],
    constImport: {},
    formRefMap: {},
    formRefs: [],
    componentProps: [],
    data: {},
    computed: [],
    methods: [],
    asyncMethod: {},
    lifeCycles: [],
    styles: [],
    asyncStyle: {},
    apiImports: [],
    apis: [],
  };
};

// 转换componentName成对应的源码名称
const getDomName = (componentName: string, componentType: any = 'antdv') => {
  switch (componentType) {
    case 'native':
      return componentName.toLowerCase();
    case 'custom':
      return componentName;
    default:
      return (
        renderData.prefixUI +
        componentName.replace(/([A-Z])/g, '-$1').toLowerCase()
      );
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
    replaceObjKey(props, 'className', 'class');
    replaceObjKey(props, 'clearable', 'allowClear');

    const eleName = getDomName(componentName, componentType);
    switch (componentName) {
      case 'Form':
        const formDataKey = dataKey || 'form';
        const formRefKey = formDataKey + 'Ref';
        const rulesKey = formDataKey + 'Rules';
        const rulesObj: any = {};
        // 解决多个form公用数据问题
        renderData.data[formDataKey] = renderData.data[formDataKey]
          ? { ...renderData.data[formDataKey] }
          : {};

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
                itemProps['name'] = key;
                if (formDataKey) {
                  renderData.data[formDataKey][key] =
                    initValue !== undefined ? initValue : '';
                }
                // console.log('rules', rules);
                // 生成rules
                if (Array.isArray(rules)) {
                  rulesObj['rules'] = rules;
                }
              }
              let itemChildren = (item.children || [])
                .map((child: any) =>
                  generateTemplate(child, vmodel, isGlobalParams),
                )
                .join('');

              itemChildren = Vue3XML.CreateDom(
                getDomName('FormItem'),
                getPropsStr(itemProps),
                itemChildren,
              );

              return Vue3XML.CreateDom(
                getDomName('Col'),
                `v-bind="colProps"`,
                itemChildren,
              );
            })
            .join('\n');

        const formProps = {
          ...props,
          ':model': formDataKey,
          ref: formDataKey,
          ':labelCol': '{ span: 6 }',
        };

        let buttonItemsStr = !formChildren[formChildren.length - 1].key
          ? buttonItems(formChildren.splice(-1))
          : '';
        let formItemsStr = formItems(formChildren);
        let formChildStr = null;

        // 生成rules
        if (Object.keys(rulesObj).length) {
          formProps[':rules'] = rulesKey;
          renderData.data[rulesKey] = renderData.data[rulesKey]
            ? { ...renderData.data[rulesKey], ...rulesObj }
            : rulesObj;
        }

        if (type === 'search') {
          // 搜索组件
          buttonItemsStr = Vue3XML.CreateDom(
            getDomName('FormItem'),
            '',
            buttonItemsStr,
          );
          buttonItemsStr = Vue3XML.CreateDom(
            getDomName('Col'),
            `v-bind="colProps"`,
            buttonItemsStr,
          );
          formChildStr = `${formItemsStr}\n${buttonItemsStr}`;
        } else {
          // 普通输入组件
          formChildStr = `${formItemsStr}\n${buttonItemsStr}`;
        }

        formChildStr = Vue3XML.CreateDom(
          getDomName('Row'),
          `:gutter="20"`,
          formChildStr,
        );

        xml = Vue3XML.CreateDom(
          eleName,
          getPropsStr(formProps),
          `${formChildStr}`,
        );
        break;
      case 'Select':
        const selectOptions = (options || [])
          .map((item: any) => {
            return Vue3XML.CreateDom(
              getDomName('SelectOption'),
              getPropsStr(item),
              item.label,
            );
          })
          .join('\n');
        const selectProps = {
          ...props,
        };
        if (vModel) {
          selectProps['v-model:value'] = vModel;
        }
        const selectAttr = `${getPropsStr(selectProps)} ${getEventStr(
          schemaDSL,
        )}`;
        xml = Vue3XML.CreateDom(eleName, selectAttr, `\n${selectOptions}\n`);
        break;
      case 'RangePicker':
        const rangepickerProps: any = {
          style: 'width: 100%',
          ...props,
        };
        if (vModel) {
          rangepickerProps['v-model:value'] = vModel;
        }
        const rangePickerAttr = `${getPropsStr(rangepickerProps)} ${getEventStr(
          schemaDSL,
        )}`;
        xml = Vue3XML.CreateDom(eleName, rangePickerAttr, '');
        break;
      case 'RadioGroup':
        const radioOptions = (options || [])
          .map((item: any) => {
            let name = type === 'button' ? 'RadioButton' : 'Radio';
            const itemProps = { ...item };
            // 剔除value
            delete itemProps.value;
            return Vue3XML.CreateDom(
              getDomName(name),
              getPropsStr(itemProps),
              '',
            );
          })
          .join('\n');
        const radioGroupProps: any = {
          ...props,
        };
        if (vModel) {
          radioGroupProps['v-model:value'] = vModel;
        }
        const radioGroupAttr = `${getPropsStr(radioGroupProps)} ${getEventStr(
          schemaDSL,
        )}`;
        xml = Vue3XML.CreateDom(eleName, radioGroupAttr, radioOptions);
        break;
      case 'Cascader':
        const cascaderProps: any = {
          options: options || [],
          ...props,
        };
        if (vModel) {
          const key = vModel.split('.').splice(-1)[0];
          const dataKey1 = key + 'CategoryOptions';
          renderData.data[dataKey1] = options || [];
          delete cascaderProps.options;
          cascaderProps[':options'] = dataKey1;
          cascaderProps['v-model:value'] = vModel;
        }
        const cascaderAttr = `${getPropsStr(cascaderProps)} ${getEventStr(
          schemaDSL,
        )}`;
        xml = Vue3XML.CreateDom(eleName, cascaderAttr, '');
        break;
      case 'AutoComplete':
        const autoCompleteEventStr = getEventStr(schemaDSL);
        const autoCompleteProps: any = {
          ...props,
        };
        if (vModel) {
          autoCompleteProps['v-model:value'] = vModel;
        }
        const autoCompleteAttr = `${getPropsStr(
          autoCompleteProps,
        )} ${autoCompleteEventStr}`;
        xml = Vue3XML.CreateDom(eleName, autoCompleteAttr, '');
        break;
      case 'Table':
        const listKey = dataKey || 'list';
        renderData.data[listKey] = [];

        let columns: any = [];
        let columnsStr = [];
        if (type === 'editTable') {
          // // 添加选择行
          // columns += VueXML.CreateDom(
          //   getDomName('TableColumn'),
          //   `type="selection" width="50"`,
          //   '',
          // );
        }
        columnsStr = (children || [])
          .map((item: any) => {
            let col: any = {};
            const newProps = { ...item };
            const renderMothod =
              Vue3TableRenderXML[item.renderKey] ||
              Vue3TableRenderXML['renderDefault'];
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
              delete newProps.render;
            }
            if (item.enumObj) {
              renderData.data[`${item.key}Obj`] = item.enumObj;
              delete newProps.enumObj;
            }
            if (Array.isArray(item.children)) {
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
            col = {
              ...newProps,
              title: item.label,
              dataIndex: item.key,
            };
            if (!['', 'renderDefault'].includes(item.renderKey)) {
              if (item.renderKey === 'renderOperate') {
                col['slots'] = { customRender: 'action' };
              } else {
                col['slots'] = { customRender: item.key };
              }
              columns.push(col);
              return Vue3XML.CreateDom(
                getDomName('template', 'custom'),
                `#${item.key}="{ record: row }"`,
                childStr,
              );
            } else {
              columns.push(col);
              return null;
            }
          })
          .filter(Boolean)
          .join('\n');

        renderData.data[`${listKey}Columns`] = columns;

        const tableProps = {
          ...props,
          pagination: false,
          ':columns': `${listKey}Columns`,
          ':dataSource': `${listKey}`,
        };
        xml = Vue3XML.CreateDom(
          eleName,
          getPropsStr(tableProps),
          `\n${columnsStr}\n`,
        );
        break;
      case 'Row':
        if (dataKey) {
          renderData.data[dataKey] = renderData.data[dataKey]
            ? { ...renderData.data[dataKey] }
            : {};
        }

        const rowChildren = (children || [])
          .filter(Boolean)
          .map((item: any) => {
            if (item.componentName) {
              const vmodel =
                dataKey && item.key ? `${dataKey}.${item.key}` : '';
              return generateTemplate(item, vmodel, isGlobalParams);
            } else {
              const renderMothod =
                Vue3TableRenderXML[item.renderKey] ||
                Vue3TableRenderXML['renderDefault'];
              // let childStr = renderMothod(item.key);
              let childStr = '';

              if (item.key && dataKey) {
                renderData.data[dataKey][item.key] = '';
              }
              if (item.enumObj) {
                renderData.data[`${item.key}Obj`] = item.enumObj;
              }

              childStr = Vue3XML.CreateDom(
                getDomName('span', 'native'),
                'class="title"',
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
              return Vue3XML.CreateDom(
                getDomName('Col'),
                getPropsStr(colProps),
                childStr,
              );
            }
          })
          .join('\n');

        xml = Vue3XML.CreateDom(eleName, getPropsStr(props), rowChildren);
        break;
      case 'Pagination':
        const paginationDataKey = dataKey || 'pagination';
        renderData.data[paginationDataKey] = {
          current: 1,
          pageSize: 20,
          total: 0,
        };
        const paginationEventStr = getEventStr(schemaDSL);
        const paginationPorps = {
          ...props,
          'v-bind': paginationDataKey,
          'v-model:current': `${paginationDataKey}.current`,
          ':showTotal': '`total => 共 ${total} 条`',
        };
        const paginationAttr = `${getPropsStr(
          paginationPorps,
        )} ${paginationEventStr}`;
        xml = Vue3XML.CreateDom(eleName, paginationAttr, '');
        break;
      case 'CrumbBack':
        xml = Vue3XML['CrumbBack'](getEventStr(schemaDSL), children);
        break;
      case 'StatusTag':
        // TODO 这个自定义设计需要改进
        const { statusKey, statusTagObj } = props;
        const key = statusKey.split('.').splice(-1)[0];
        const dataKey1 = key + 'Tag';
        renderData.data[dataKey1] = statusTagObj;
        xml = Vue3XML['StatusTag'](statusKey, dataKey1);
        break;
      default:
        if (dataKey && renderData.data[dataKey] === undefined) {
          renderData.data[dataKey] = '';
        }
        vModel && (props['v-model:value'] = vModel);
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
        xml = Vue3XML.CreateDom(eleName, defaultAttr, defaultChildStr);
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
      let effectStr = `${name}(${funcStr.substr(0, i)} => ${funcStr.substr(
        i,
      )})`;
      // 替换内部字符串
      effectStr = replaceStr(effectStr, /this\./g, '');
      lifeList.push(effectStr);
      setAsyncImport(name);
    });
  return lifeList;
};

const getPageProps = (item: object = {}) => {
  const propsList: any = [];
  Object.entries(item)
    .filter(Boolean)
    .forEach(([k, v]) => {
      propsList.push(`${k}: ${v}`);
    });
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
  // ilist.push(`import "./index.less"`);
  return ilist;
};

const getExports = (item: object = {}) => {
  let elist: any = [];
  Object.entries(renderData.asyncExport).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      elist = elist.concat(v);
    }
  });
  return elist;
};

/**
 * 引出依赖包
 * @param exportObj
 * @param type 类型
 */
const setAsyncExport = (exportObj: string, type: string = 'method') => {
  if (!renderData.asyncExport[type]) {
    renderData.asyncExport[type] = [exportObj];
  } else if (!renderData.asyncExport[type].includes(exportObj)) {
    renderData.asyncExport[type].push(exportObj);
  }
};

/**
 * 引入依赖包
 * @param importObj
 * @param lib
 */
const setAsyncImport = (importObj: string, lib: string = 'vue') => {
  if (!renderData.asyncImport[lib]) {
    renderData.asyncImport[lib] = [importObj];
  } else if (!renderData.asyncImport[lib].includes(importObj)) {
    renderData.asyncImport[lib].push(importObj);
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
  let mList: any = [];
  Object.entries(item).forEach(([k, v]) => {
    const { newFunc } = transformFunc(v);
    mList.push(newFunc);
  });
  Object.entries(renderData.asyncMethod).forEach(([_, v]) => {
    mList.push(v);
  });
  // 替换函数内部字符串
  mList = mList.map((s: any) => {
    s = replaceStr(s, 'this.form = {}', 'formRef.value.resetFields()');
    s = replaceStr(s, /this\./g, '');
    return s;
  });
  // 将async fuc() {} 转换成 const func = async () => {}
  return mList
    .map((str: any) => {
      if (str) {
        const paramStartIndex = str.indexOf('(');
        const paramEndIndex = str.indexOf('{');
        const nameStr = str.substr(0, paramStartIndex);
        const funcName = nameStr.replace('async ', '');
        const paramStr = str.substr(0, paramEndIndex);
        setAsyncExport(funcName, 'method');
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
  if (Object.keys(renderData.formRefMap).length) {
    setAsyncImport('ref');
  }
  Object.keys(renderData.formRefMap).forEach((k) => {
    const formStr = `const ${k} = ref()`;
    setAsyncExport(k, 'formRef');
    refs.push(formStr);
  });
  return refs;
};

const getConstData = () => {
  const list: any = [];
  Object.entries(renderData.data).forEach(([k, v]) => {
    if (k) {
      let constStr = '';
      if (isObject(v) || Array.isArray(v)) {
        setAsyncImport('reactive');
        constStr = `const ${k} = reactive(${JSON.stringify(v)})`;
      } else {
        setAsyncImport('ref');
        constStr = `const ${k} = ref(${v})`;
      }
      setAsyncExport(k, 'const');
      list.push(constStr);
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
        const name = k.replace(/on/, '@').toLowerCase();
        funcStr += `${name}="${funcName}"`;
      } else if (extraMap[k]) {
        // 特定的函数事件
        funcStr += `${extraMap[k]}="${funcName}"`;
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
  const funcs = commonFunc
    .map((item) => '@' + item.substr(2).toLowerCase())
    .join('|');
  const reg = new RegExp(`${funcs}`, 'g');
  if (str) {
    const ex = reg.exec(str);
    if (ex) {
      const s = str.substr(ex.index + ex[0].length);
      // console.log('s', s);
      let funcName = s.split(/["']/g)[1];
      let func = funcName;
      if (funcName.endsWith(')')) {
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
    if (typeof v !== 'string') {
      return `${pre} :${k}="${JSON.stringify(v).replace(/\"/g, "'")}"`;
    } else {
      return `${pre} ${k}="${v}"`;
    }
  }, '');
};

const generateVue3 = () => {
  const vue3Code = Vue3XML.Vue3Template(renderData);
  return prettierFormat(vue3Code, 'vue3');
};

const generateApi = () => {
  const vue3ApiCode = `
    ${renderData.apiImports.join(';\n')}

    ${renderData.apis.join('\n')}
  `;
  return prettierFormat(vue3ApiCode, 'babel');
};

const generateStyle = () => {
  const styleCode = `
    ${renderData.styles.join('\n')}
  `;
  return styleCode;
};

const getSourceCode = (DSL: any, prefixUI: string) => {
  try {
    initData('a');
    setAsyncImport('defineComponent');
    const { apiList, apiImportList } = getApis(DSL.apis);
    renderData.data = DSL.dataSource || {};
    renderData.componentProps = getPageProps(DSL.componentProps);
    renderData.computed = getComputed(DSL.computed);
    renderData.lifeCycles = getLifeCycle(DSL.lifeCycle);
    renderData.apiImports = apiImportList;
    renderData.apis = apiList;
    renderData.template = generateTemplate(DSL);
    // 动态生成class，有顺序要求
    renderData.styles = getStyles(DSL.type);
    renderData.formRefs = getFormRefs();
    renderData.constData = getConstData();
    renderData.constOptions = getConstOptions();
    renderData.methods = getMethods(DSL.methods);
    renderData.imports = getImports(DSL.imports);
    renderData.exports = getExports();
    renderData.vue3Code = generateVue3();
    renderData.styleCode = generateStyle();
    renderData.vue3ApiCode = generateApi();
    return renderData;
  } catch (e) {
    console.error(e);
    message.error('生成源码异常');
  }
};

export { getSourceCode };
