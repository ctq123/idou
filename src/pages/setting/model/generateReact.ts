import { message } from 'antd';

import { ReactXML, styleXML, ReactTableRenderXML } from './componentXML';
import {
  prettierFormat,
  transformFunc,
  replaceObjKey,
  generateClassStyle,
} from '@/utils';
import isFunction from 'lodash/isFunction';

// /**
//  * element-ui的前缀
//  */
// const elementUI = '';

let renderData: any = {
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

const initData = () => {
  renderData = {
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
const getDomName = (componentType: any, componentName: string) => {
  switch (componentType) {
    case 'native':
      return componentName.toLowerCase();
    case 'custom':
    default:
      setAsyncImport(componentName);
      return componentName;
  }
};

const generateTemplate = (schemaDSL: any, vModel?: any) => {
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

        const childs = children || [];
        const buttonItems = (list: any) =>
          list.map((item: any) => {
            if (!item) return '';
            const itemChildren = (item.children || [])
              .map((child: any) => generateTemplate(child))
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
                .map((child: any) => generateTemplate(child, vmodel))
                .join('');

              itemChildren = ReactXML.CreateDom(
                'Form.Item',
                getPropsStr(itemProps),
                itemChildren,
              );

              return ReactXML.CreateDom('Col', `{ ...colProps }`, itemChildren);
            })
            .join('\n');

        const formProps = {
          ...props,
          form: `{${formRefKey}}`,
        };

        let buttonItemsStr = !childs[childs.length - 1].key
          ? buttonItems(childs.splice(-1))
          : '';
        let formItemsStr = formItems(childs);
        let formChildStr = null;

        if (type === 'search') {
          // 搜索组件
          buttonItemsStr = ReactXML.CreateDom('Form.Item', '', buttonItemsStr);
          buttonItemsStr = ReactXML.CreateDom(
            'Col',
            `{ ...colProps }`,
            buttonItemsStr,
          );
          formChildStr = `${formItemsStr}\n${buttonItemsStr}`;
        } else {
          // 普通输入组件
          formChildStr = `${formItemsStr}\n${buttonItemsStr}`;
        }

        formChildStr = ReactXML.CreateDom('Row', `gutter={20}`, formChildStr);

        xml = ReactXML.CreateDom(
          'Form',
          getPropsStr(formProps),
          `${formChildStr}`,
        );
        break;
      case 'Select':
        setAsyncImport(componentName);
        const selectOptions = (options || [])
          .map((item: any) => {
            return ReactXML.CreateDom('Select.Option', getPropsStr(item), '');
          })
          .join('\n');
        const selectProps = {
          ...props,
        };
        const selectAttr = `${getPropsStr(selectProps)} ${getEventStr(
          schemaDSL,
        )}`;
        xml = ReactXML.CreateDom('Select', selectAttr, `\n${selectOptions}\n`);
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
        xml = ReactXML.CreateDom('DatePicker.RangePicker', rangePickerAttr, '');
        break;
      case 'RadioGroup':
        setAsyncImport('Radio');
        const radioOptions = (options || [])
          .map((item: any) => {
            let name = type === 'button' ? 'Radio.Button' : 'Radio';
            const itemProps = { ...item };
            // 剔除value
            delete itemProps.value;
            return ReactXML.CreateDom(name, getPropsStr(itemProps), '');
          })
          .join('\n');
        const radioGroupProps: any = {
          ...props,
        };
        const radioGroupAttr = `${getPropsStr(radioGroupProps)} ${getEventStr(
          schemaDSL,
        )}`;
        xml = ReactXML.CreateDom('Radio.Group', radioGroupAttr, radioOptions);
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
        xml = ReactXML.CreateDom('Cascader', cascaderAttr, '');
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
        xml = ReactXML.CreateDom('AutoComplete', autoCompleteAttr, '');
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
          // let childStr = '';

          if (item.renderKey === 'renderOperate') {
            setAsyncImport('Button');
          }

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
          if (Array.isArray(item.children)) {
            // 编辑类型
            delete newProps.children;
            delete newProps.uuid;
            const vmodel = listKey && item.key ? `row.${item.key}` : '';
            childStr = (item.children || [])
              .map((child: any) => generateTemplate(child, vmodel))
              .join('');
          }
          // 重新扫描是否包含函数
          checkFuncStr(childStr);
          getPropsStr(newProps);
          return {
            ...newProps,
            title: item.label,
            dataIndex: item.key,
            render: `(text, row) => (<div>${childStr}</div>)`,
          };
        });

        renderData.data[`${listKey}Columns`] = columns;

        const tableProps = {
          border: true,
          ...props,
          pagination: false,
          ':columns': `${listKey}Columns`,
          ':dataSource': `${listKey}`,
        };
        xml = ReactXML.CreateDom('Table', getPropsStr(tableProps), ``);
        break;
      case 'Row':
        if (dataKey) {
          renderData.data[dataKey] = renderData.data[dataKey]
            ? { ...renderData.data[dataKey] }
            : {};
        }
        setAsyncImport('Row');
        setAsyncImport('Col');

        const rowChilds = (children || [])
          .filter(Boolean)
          .map((item: any) => {
            if (item.componentName) {
              const vmodel =
                dataKey && item.key ? `${dataKey}.${item.key}` : '';
              return generateTemplate(item, vmodel);
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
                'span',
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
              return ReactXML.CreateDom('Col', getPropsStr(colProps), childStr);
            }
          })
          .join('\n');

        xml = ReactXML.CreateDom('Row', getPropsStr(props), rowChilds);
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
        xml = ReactXML.CreateDom('Pagination', paginationAttr, '');
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
        delete props[':visible.sync'];
      default:
        if (dataKey && renderData.data[dataKey] === undefined) {
          renderData.data[dataKey] = '';
        }
        const defaultAttr = `${getPropsStr(props)} ${getEventStr(schemaDSL)}`;
        const defaultChildStr = Array.isArray(children)
          ? children
              .filter(Boolean)
              .map((t) => {
                if (t.componentName) {
                  return generateTemplate(t);
                } else {
                  return t;
                }
              })
              .join('')
          : children || '';
        const eleName = getDomName(componentType, componentName);
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
      const useStateStr = `const [${k}, set${key}] = useState(${JSON.stringify(
        v,
      )})`;
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

const getEventStr = (item: object, extraMap: any = {}) => {
  let funcStr = '';
  Object.entries(item).forEach(([k, v]) => {
    if ((typeof v === 'string' && v.includes('function')) || isFunction(v)) {
      const { newFunc, newFuncName } = transformFunc(v);
      funcStr = funcStr ? `${funcStr} ` : funcStr;
      if (commonFunc.includes(k)) {
        // 通用的函数事件
        funcStr += `${k}={${newFuncName}}`;
      } else if (extraMap[k]) {
        // 特定的函数事件
        funcStr += `${extraMap[k]}={${newFuncName}}`;
      }
      renderData.asyncMethod[newFuncName] = newFunc;
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
      return `${pre} ${k}={${JSON.stringify(v).replace(/\"/g, "'")}}`;
    } else {
      return `${pre} ${k}="${v}"`;
    }
  }, '');
};

const generateReact = () => {
  const reactCode = ReactXML.ReactTemplate(renderData);
  return prettierFormat(reactCode, 'babel');
};

const generateApi = () => {
  const apiCode = `
    ${renderData.apiImports.join(';\n')}

    ${renderData.apis.join('\n')}
  `;
  return prettierFormat(apiCode, 'babel');
};

const generateStyle = () => {
  const styleCode = `
    ${renderData.styles.join('\n')}
  `;
  return prettierFormat(styleCode, 'less');
};

const getSourceCode = (DSL: any) => {
  try {
    initData();
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
    renderData.apiCode = generateApi();
    return renderData;
  } catch (e) {
    console.error(e);
    message.error('生成源码异常');
  }
};

export { getSourceCode };
