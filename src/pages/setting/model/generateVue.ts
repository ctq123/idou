import prettier from 'prettier/esm/standalone.mjs';
import parserBabel from 'prettier/esm/parser-babel.mjs';
import parserHTML from 'prettier/esm/parser-html.mjs';
// import parserCSS from 'prettier/esm/parser-postcss.mjs';
// import parserGraphql from 'prettier/esm/parser-graphql.mjs';
import { message } from 'antd';
// import prettier from 'https://unpkg.com/prettier@2.3.0/esm/standalone.mjs';
// import parserBabel from 'https://unpkg.com/prettier@2.3.0/esm/parser-babel.mjs';
// import parserHTML from 'https://unpkg.com/prettier@2.3.0/esm/parser-html.mjs';

// import { deserialize, serialize } from '@/utils'

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
  const objStr = (obj: any) =>
    Object.entries(obj).reduce((pre, [k, v]) => {
      console.log('k, v', k, v);
      if (['Table'].includes(componentName)) {
        if (k === 'key') {
          // 需要转化
          k = 'prop';
        }
      }
      if (typeof v !== 'string') {
        return `${pre} :${k}="${JSON.stringify(v).replace(/\"/g, "'")}"`;
      } else {
        return `${pre} ${k}="${v}"`;
      }
    }, '');

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

      xml = `<el-form ${objStr(props)} :model="${formDataKey}">
        <el-row :gutter="20">
        ${formItems}
        </el-row>
      </el-form>`;
      break;
    case 'Input':
      const inputEventStr = getEventStr(schemaDSL);
      xml = `<el-input ${objStr(
        props,
      )} v-model="${vModel}" ${inputEventStr}></el-input>`;
      break;
    case 'Select':
      const selectEventStr = getEventStr(schemaDSL);
      const selectOptions = (options || []).map((item: any) => {
        const { label, value } = item || {};
        return `<el-option label="${label}" value="${value}"></el-option>`;
      });
      xml = `<el-select ${objStr(props)} v-model="${vModel}" ${selectEventStr}>
        ${selectOptions}
      </el-select>`;
      break;
    case 'RangePicker':
      const rangePickerEventStr = getEventStr(schemaDSL);
      const rangepickerDefaultProps = {
        type: 'datetimerange',
        'unlink-panels': true,
        'value-format': 'timestamp',
        'default-time': ['00:00:00', '23:59:59'],
        'range-separator': '至',
        'start-placeholder': '开始日期',
        'end-placeholder': '结束日期',
        style: 'width: 100%',
      };
      xml = `<el-date-picker ${objStr(
        Object.assign(props, rangepickerDefaultProps),
      )} v-model="${vModel}" ${rangePickerEventStr}>
      </el-date-picker>`;
      break;
    case 'Cascader':
      const cascaderEventStr = getEventStr(schemaDSL);
      const cascaderDefaultProps = {
        options: options || [],
        props: { multiple: true },
        'collapse-tags': true,
        clearable: true,
      };
      xml = `<el-cascader ${objStr(
        Object.assign(props, cascaderDefaultProps),
      )} v-model="${vModel}" ${cascaderEventStr}>
      </el-cascader>`;
      break;
    case 'AutoComplete':
      const autoCompleteEventStr = getEventStr(schemaDSL, {
        onSearch: ':fetch-suggestions',
      });
      const autoCompleteDefaultProps = {
        clearable: true,
      };
      xml = `<el-autocomplete ${objStr(
        Object.assign(props, autoCompleteDefaultProps),
      )} ${autoCompleteEventStr}>
      </el-autocomplete>`;
      break;
    case 'Button':
      const buttonEventStr = getEventStr(schemaDSL);
      xml = `<el-button ${objStr(
        props,
      )} ${buttonEventStr}>${children}</el-button>`;
      break;
    case 'Table':
      const listKey = dataKey || 'list';
      renderData.data[listKey] = [];
      const columns = (children || [])
        .map((item: any) => {
          return `<el-table-column ${objStr(item)}></el-table-column>`;
        })
        .join('\n');
      xml = `<el-table :data="${listKey}" border style="width: 100%">\n${columns}\n</el-table>\n`;
      break;
    case 'Pagination':
      const paginationEventStr = getEventStr(schemaDSL, {
        onPageChange: '@current-change',
      });
      xml = `<el-row class="pagination" type="flex" justify="end">
        <el-pagination ${objStr(props)}
          layout="total, prev, pager, next, jumper"
          v-bind="pagination"
          ${paginationEventStr}
        >
        </el-pagination>
      </el-row>`;
      break;
    default:
      xml = '';
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
    if (typeof v === 'string' && v.includes('function')) {
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

const transformFunc = (func: any, newFuncName = '') => {
  const funcStr = func.toString();
  const start = funcStr.indexOf('function ') + 9;
  const end = funcStr.indexOf('(');
  const funcName = funcStr.slice(start, end);
  let newFunc = funcStr.slice(start);
  if (newFuncName) {
    newFunc = newFunc.replace(funcName, newFuncName);
  }
  return { newFunc, newFuncName: newFuncName || funcName };
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
  return prettier.format(vueCode, {
    parser: 'vue',
    plugins: [parserHTML, parserBabel],
    printWidth: 80,
    singleQuote: true,
  });
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
