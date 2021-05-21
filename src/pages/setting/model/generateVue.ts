// import prettier from 'prettier/esm/standalone.mjs';
// import parserBabel from 'prettier/esm/parser-babel.mjs';
// import parserHTML from 'prettier/esm/parser-html.mjs';
// import parserCSS from 'prettier/esm/parser-postcss.mjs';
// import parserGraphql from 'prettier/esm/parser-graphql.mjs';
import { message } from 'antd';
// import prettier from 'https://unpkg.com/prettier@2.3.0/esm/standalone.mjs';
// import parserBabel from 'https://unpkg.com/prettier@2.3.0/esm/parser-babel.mjs';
// import parserHTML from 'https://unpkg.com/prettier@2.3.0/esm/parser-html.mjs';

import { prettierFormat, transformFunc } from '@/utils';
import isFunction from 'lodash/isFunction';

/**
 * element-ui的前缀
 */
const elementUI = 'el-';

let renderData: any = {
  codeStr: '',
  template: '',
  imports: [],
  data: {},
  methods: [],
  lifecycles: [],
  styles: [],
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
    codeStr: '',
    template: '',
    imports: [],
    data: {},
    methods: [],
    lifecycles: [],
    styles: [],
  };
};

/**
 * 生成组件源码片段（默认）
 * @param schemaDSL
 * @param defaultProps
 * @returns
 */
const getComponentXML = (
  schemaDSL: any,
  defaultProps: any,
  newChildStr?: any,
) => {
  const { componentName, props, children } = schemaDSL;
  if (!componentName) return '';
  const elementUICompoent = elementUI + componentName.toLowerCase();
  const propsStr = getPropsStr(Object.assign(defaultProps, props));
  const eventStr = getEventStr(schemaDSL);
  const childrenStr = newChildStr ? newChildStr : children ? children : '';
  return `<${elementUICompoent} ${propsStr} ${eventStr}>${childrenStr}</${elementUICompoent}>`;
};

const generateTemplate = (schemaDSL: any, vModel?: any) => {
  const {
    componentName,
    props,
    children,
    options,
    dataKey,
    dataSource,
    lifeCycle,
    methods,
    imports,
  } = schemaDSL || {};
  let xml = '';
  switch (componentName) {
    case 'Page':
      renderData.data = dataSource || {};
      getLifeCycle(lifeCycle);
      getMethods(methods);
      getImports(imports);
      const childStr = (children || [])
        .map((item: any) => generateTemplate(item))
        .join('\n');
      xml = `<div class='main-container'>\n${childStr}\n</div>`;
      break;
    case 'Form':
      const formDataKey = dataKey || 'form';
      renderData.data[formDataKey] = {};

      const formItems = (children || [])
        .map((item: any) => {
          const { key, label, initValue } = item || {};
          const itemPropStr = key
            ? `label="${label}" prop="${key}"`
            : `label="${label}"`;
          const vmodel = key && formDataKey ? `${formDataKey}.${key}` : '';
          if (key && formDataKey) {
            // @ts-ignore
            renderData.data[formDataKey][key] =
              initValue !== undefined ? initValue : '';
          }
          const itemChildren = (item.children || [])
            .map((child: any) => generateTemplate(child, vmodel))
            .join('');
          return `<el-col v-bind="colProps">
          <el-form-item ${itemPropStr}>
            ${itemChildren}
          </el-form-item>
        </el-col>`;
        })
        .join('\n');

      xml = `<el-form ${getPropsStr(props)} :model="${formDataKey}">
        <el-row :gutter="20">
        ${formItems}
        </el-row>
      </el-form>`;
      break;
    case 'Select':
      const selectOptions = (options || [])
        .map((item: any) => {
          const { label, value } = item || {};
          return `<el-option label="${label}" value="${value}"></el-option>`;
        })
        .join('\n');
      const selectDefaultProps = vModel ? { 'v-model': vModel } : {};
      xml = getComponentXML(schemaDSL, selectDefaultProps, selectOptions);
      break;
    case 'RangePicker':
      const rangePickerEventStr = getEventStr(schemaDSL);
      const rangepickerDefaultProps: any = {
        type: 'datetimerange',
        'unlink-panels': true,
        'value-format': 'timestamp',
        'default-time': ['00:00:00', '23:59:59'],
        'range-separator': '至',
        'start-placeholder': '开始日期',
        'end-placeholder': '结束日期',
        style: 'width: 100%',
      };
      if (vModel) {
        rangepickerDefaultProps['v-model'] = vModel;
      }
      xml = `<el-date-picker ${getPropsStr(
        Object.assign(props, rangepickerDefaultProps),
      )} ${rangePickerEventStr}>
      </el-date-picker>`;
      break;
    case 'Cascader':
      const cascaderDefaultProps: any = {
        options: options || [],
        props: { multiple: true },
        'collapse-tags': true,
        clearable: true,
      };
      if (vModel) {
        cascaderDefaultProps['v-model'] = vModel;
      }
      xml = getComponentXML(schemaDSL, cascaderDefaultProps);
      break;
    case 'AutoComplete':
      const autoCompleteEventStr = getEventStr(schemaDSL, {
        onSearch: ':fetch-suggestions',
      });
      const autoCompleteDefaultProps: any = {
        clearable: true,
      };
      if (vModel) {
        autoCompleteDefaultProps['v-model'] = vModel;
      }
      xml = `<el-autocomplete ${getPropsStr(
        Object.assign(props, autoCompleteDefaultProps),
      )} ${autoCompleteEventStr}>
      </el-autocomplete>`;
      break;
    case 'Table':
      const listKey = dataKey || 'list';
      renderData.data[listKey] = [];
      const columns = (children || [])
        .map((item: any) => {
          const newProps = { ...item };
          if (item.key) {
            newProps['prop'] = item.key;
            delete newProps.key;
          }
          if (item.render) {
            delete newProps.render;
            const { funcBody } = transformFunc(item.render);
            return `<el-table-column ${getPropsStr(newProps)}>
            <template slot-scope="{{ row }}">${funcBody.replace(
              'return',
              '',
            )}</template>
            </el-table-column>`;
          } else {
            return `<el-table-column ${getPropsStr(
              newProps,
            )}></el-table-column>`;
          }
        })
        .join('\n');
      xml = `<el-table :data="${listKey}" border style="width: 100%">\n${columns}\n</el-table>\n`;
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
      xml = `<el-row class="pagination" type="flex" justify="end">
        <el-pagination ${getPropsStr(props)}
          layout="total, prev, pager, next, jumper"
          v-bind="pagination"
          ${paginationEventStr}
        >
        </el-pagination>
      </el-row>`;
      break;
    default:
      const defaultProps = vModel ? { 'v-model': vModel } : {};
      xml = getComponentXML(schemaDSL, defaultProps);
      break;
  }
  return xml + '\n';
};

const getLifeCycle = (item: object) => {
  Object.entries(item).forEach(([k, v]) => {
    // @ts-ignore
    const name = lifeCycleMap[k];
    if (name) {
      const { newFunc } = transformFunc(v, name);
      // @ts-ignore
      renderData.lifecycles.push(newFunc);
    }
  });
};

const getImports = (item: object) => {
  Object.entries(item).forEach(([k, v]) => {
    const importStr = `import ${k} from "${v}"`;
    // @ts-ignore
    renderData.imports.push(importStr);
  });
};

const getMethods = (item: object) => {
  Object.entries(item).forEach(([k, v]) => {
    const { newFunc } = transformFunc(v);
    // @ts-ignore
    renderData.methods.push(newFunc);
  });
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
        .main-container {
          width: 100%;
          height: 100%;
          background: #ffffff;
          box-sizing: border-box;
          font-family: PingFangSC-Regular;
          padding: 24px;
          .width-100 {
            width: 100%;
          }
          .pagination {
            margin-top: 24px;
          }
        }
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

const getSourceCode = (DSL: any) => {
  try {
    initData();
    renderData.template = generateTemplate(DSL);
    renderData.codeStr = generateVue();
    return renderData.codeStr;
  } catch (e) {
    console.error(e);
    message.error('生成源码异常');
  }
};

export { getSourceCode };
