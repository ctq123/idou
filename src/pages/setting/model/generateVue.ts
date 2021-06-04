// import prettier from 'prettier/esm/standalone.mjs';
// import parserBabel from 'prettier/esm/parser-babel.mjs';
// import parserHTML from 'prettier/esm/parser-html.mjs';
// import parserCSS from 'prettier/esm/parser-postcss.mjs';
// import parserGraphql from 'prettier/esm/parser-graphql.mjs';
import { message } from 'antd';
// import prettier from 'https://unpkg.com/prettier@2.3.0/esm/standalone.mjs';
// import parserBabel from 'https://unpkg.com/prettier@2.3.0/esm/parser-babel.mjs';
// import parserHTML from 'https://unpkg.com/prettier@2.3.0/esm/parser-html.mjs';

import { VueXML, styleXML } from './componentXML';
import { prettierFormat, transformFunc, replaceObjKey } from '@/utils';
import isFunction from 'lodash/isFunction';

/**
 * element-ui的前缀
 */
const elementUI = 'el-';

let renderData: any = {
  vueCode: '',
  template: '',
  imports: [],
  data: {},
  methods: [],
  lifecycles: [],
  styles: [],
  apiImports: [],
  apis: [],
};

const lifeCycleMap = {
  constructor: 'created',
  getDerivedStateFromProps: 'beforeUpdate',
  componentDidMount: 'mounted',
  componentDidUpdate: 'updated',
  componentWillUnmount: 'beforeDestroy',
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
    vueCode: '',
    template: '',
    imports: [],
    data: {},
    methods: [],
    lifecycles: [],
    styles: [],
    apiImports: [],
    apis: [],
  };
};

const generateTemplate = (schemaDSL: any, vModel?: any) => {
  const { componentName, props, children, options, dataKey } = schemaDSL || {};
  let xml = '';
  switch (componentName) {
    case 'Page':
      const childStr = (children || [])
        .map((item: any) => generateTemplate(item))
        .join('\n');
      xml = VueXML['Page'](childStr);
      break;
    case 'DIV':
      const divProps = {
        ...props,
      };
      replaceObjKey(divProps, 'className', 'class');
      const divAttr = `${getPropsStr(divProps)} ${getEventStr(schemaDSL)}`;
      const divChildStr = Array.isArray(children)
        ? children.map((item: any) => generateTemplate(item)).join('')
        : children || '';
      xml = VueXML['Default']('div', divAttr, divChildStr);
      break;
    case 'Form':
      const formDataKey = dataKey || 'form';
      renderData.data[formDataKey] = {};

      const childs = children || [];
      const buttonItems = (list: any) =>
        list.map((item: any) => {
          if (!item) return '';
          const itemChildren = (item.children || [])
            .map((child: any) => generateTemplate(child))
            .join('');
          return VueXML['Default']('template', `v-slot:doBox`, itemChildren);
        });

      const formItems = (list: any[]) =>
        list
          .map((item: any) => {
            const { key, label, initValue } = item || {};
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
            }
            const itemChildren = (item.children || [])
              .map((child: any) => generateTemplate(child, vmodel))
              .join('');
            return VueXML['FormItem'](getPropsStr(itemProps), itemChildren);
          })
          .join('\n');

      const formProps = {
        ...props,
        ':model': formDataKey,
      };
      const buttonItemsContainer = !childs[childs.length - 1].key
        ? buttonItems(childs.splice(-1))
        : '';
      const formItemsContainer = VueXML['Default'](
        'template',
        `v-slot:content`,
        formItems(childs),
      );

      xml = VueXML['Form'](
        getPropsStr(formProps),
        `${formItemsContainer}\n${buttonItemsContainer}`,
      );
      break;
    case 'Select':
      const selectOptions = (options || [])
        .map((item: any) => {
          return VueXML['Default']('el-option', getPropsStr(item), '');
        })
        .join('\n');
      const selectProps = {
        ...props,
      };
      if (vModel) {
        selectProps['v-model'] = vModel;
      }
      const selectAttr = `${getPropsStr(selectProps)} ${getEventStr(
        schemaDSL,
      )}`;
      xml = VueXML['Default']('el-select', selectAttr, `\n${selectOptions}\n`);
      break;
    case 'RangePicker':
      const rangepickerProps: any = {
        type: 'datetimerange',
        'unlink-panels': true,
        'value-format': 'timestamp',
        'default-time': ['00:00:00', '23:59:59'],
        'range-separator': '至',
        'start-placeholder': '开始日期',
        'end-placeholder': '结束日期',
        style: 'width: 100%',
        ...props,
      };
      if (vModel) {
        rangepickerProps['v-model'] = vModel;
      }
      const rangePickerAttr = `${getPropsStr(rangepickerProps)} ${getEventStr(
        schemaDSL,
      )}`;
      xml = VueXML['Default']('el-date-picker', rangePickerAttr, '');
      break;
    case 'Cascader':
      const cascaderProps: any = {
        options: options || [],
        props: { multiple: true },
        'collapse-tags': true,
        clearable: true,
        ...props,
      };
      if (vModel) {
        cascaderProps['v-model'] = vModel;
      }
      const cascaderAttr = `${getPropsStr(cascaderProps)} ${getEventStr(
        schemaDSL,
      )}`;
      xml = VueXML['Default']('el-cascader', cascaderAttr, '');
      break;
    case 'AutoComplete':
      const autoCompleteEventStr = getEventStr(schemaDSL, {
        onSearch: ':fetch-suggestions',
      });
      const autoCompleteProps: any = {
        clearable: true,
        ...props,
      };
      if (vModel) {
        autoCompleteProps['v-model'] = vModel;
      }
      const autoCompleteAttr = `${getPropsStr(
        autoCompleteProps,
      )} ${autoCompleteEventStr}`;
      xml = VueXML['Default']('el-autocomplete', autoCompleteAttr, '');
      break;
    case 'Table':
      const listKey = dataKey || 'list';
      renderData.data[listKey] = [];

      const columns = (children || [])
        .map((item: any) => {
          const newProps = { ...item };
          let childStr = `{{ row.${item.key} }}`;
          if (item.key) {
            delete newProps.key;
          }
          if (item.render) {
            delete newProps.render;
            const { funcBody } = transformFunc(item.render);
            childStr = funcBody.replace('return', '');
          }
          return VueXML['TableColumn'](getPropsStr(newProps), childStr);
        })
        .join('\n');

      const tableProps = {
        border: true,
        ...props,
        ':data': listKey,
      };
      xml = VueXML['Default'](
        'el-table',
        getPropsStr(tableProps),
        `\n${columns}\n`,
      );
      break;
    case 'Pagination':
      const paginationDataKey = dataKey || 'pagination';
      renderData.data[paginationDataKey] = {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      };
      const paginationEventStr = getEventStr(schemaDSL, {
        onPageChange: '@current-change',
      });
      const paginationPorps = {
        class: 'mt24 tar',
        layout: 'total, prev, pager, next, jumper',
        ...props,
        'v-bind': paginationDataKey,
      };
      const paginationAttr = `${getPropsStr(
        paginationPorps,
      )} ${paginationEventStr}`;
      xml = VueXML['Default']('el-pagination', paginationAttr, '');
      break;
    default:
      const defaultProps = {
        ...props,
      };
      if (vModel) {
        defaultProps['v-model'] = vModel;
      }
      const defaultAttr = `${getPropsStr(defaultProps)} ${getEventStr(
        schemaDSL,
      )}`;
      const defaultChildStr = Array.isArray(children)
        ? children.map((t) => t).join('\n')
        : children || '';
      xml = VueXML['Default'](
        `el-${componentName.toLowerCase()}`,
        defaultAttr,
        defaultChildStr,
      );
      break;
  }
  return xml + '\n';
};

const getLifeCycle = (item: object) => {
  const lifeList: any = [];
  Object.entries(item).forEach(([k, v]) => {
    // @ts-ignore
    const name = lifeCycleMap[k];
    if (name) {
      const { newFunc } = transformFunc(v, name);
      lifeList.push(newFunc);
    }
  });
  return lifeList;
};

const getImports = (item: object) => {
  const ilist: any = [];
  Object.entries(item).forEach(([k, v]) => {
    const importStr = `import ${k} from "${v}"`;
    ilist.push(importStr);
  });
  return ilist;
};

const getMethods = (item: object) => {
  const mlist: any = [];
  Object.entries(item).forEach(([k, v]) => {
    const { newFunc } = transformFunc(v);
    mlist.push(newFunc);
  });
  return mlist;
};

const getStyles = (type: string) => {
  const slist: any = [];
  // @ts-ignore
  const css = styleXML[type]();
  slist.push(css);
  return slist;
};

const getApis = (item: object) => {
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
        const name = k.replace(/on/, '@').toLowerCase();
        funcStr += `${name}="${newFuncName}"`;
      } else if (extraMap[k]) {
        // 特定的函数事件
        funcStr += `${extraMap[k]}="${newFuncName}"`;
      }
      // @ts-ignore
      renderData.methods.push(newFunc);
    }
  });
  return funcStr;
};

const getPropsStr = (obj: any) => {
  return Object.entries(obj).reduce((pre, [k, v]) => {
    if (typeof v !== 'string') {
      return `${pre} :${k}="${JSON.stringify(v).replace(/\"/g, "'")}"`;
    } else {
      return `${pre} ${k}="${v}"`;
    }
  }, '');
};

const generateVue = () => {
  const vueCode = `
      <template>
        ${renderData.template}
      </template>

      <script>
        ${renderData.imports.join(';\n')}

        export default {
          data() {
            return ${JSON.stringify(renderData.data, null, 2)}
          },
          ${renderData.lifecycles.join(',\n')}
          ,
          methods: {
            ${renderData.methods.join(',\n')}
          }
        }
      </script>

      <style lang="scss" scoped>
        ${renderData.styles.join('\n')}
      </style>
    `;
  // return serialize(vueCode, { space: 2, unsafe: true })
  // return vueCode;
  // return prettier.format(vueCode, {
  //   parser: 'vue',
  //   plugins: [parserHTML, parserBabel, parserCSS],
  //   printWidth: 80,
  //   singleQuote: true,
  // });
  return prettierFormat(vueCode, 'vue');
};

const generateApi = () => {
  const apiCode = `
    ${renderData.apiImports.join(';\n')}

    ${renderData.apis.join('\n')}
  `;
  return prettierFormat(apiCode, 'babel');
};

const getSourceCode = (DSL: any) => {
  try {
    initData();
    const { apiList, apiImportList } = getApis(DSL.apis);
    renderData.data = DSL.dataSource || {};
    renderData.lifecycles = getLifeCycle(DSL.lifeCycle);
    renderData.methods = getMethods(DSL.methods);
    renderData.imports = getImports(DSL.imports);
    renderData.styles = getStyles(DSL.componentName);
    renderData.apiImports = apiImportList;
    renderData.apis = apiList;
    renderData.template = generateTemplate(DSL);
    renderData.vueCode = generateVue();
    renderData.apiCode = generateApi();
    return renderData;
  } catch (e) {
    console.error(e);
    message.error('生成源码异常');
  }
};

export { getSourceCode };
