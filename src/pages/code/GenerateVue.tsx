import React, { PureComponent } from 'react';
import { Button, Drawer } from 'antd';
import { DSL } from './dsl';

import prettier from "prettier/esm/standalone.mjs";
// import parserBabel from "prettier/esm/parser-babel.mjs";
import parserHTML from "prettier/esm/parser-html.mjs";

// prettier.format("const html = /* HTML */ `<DIV> </DIV>`", {
//   parser: "babel",
//   plugins: [parserBabel],
// });

const DSLStr = JSON.stringify(DSL, function (_, v) {
  if (typeof v === 'function') {
    return v.toString();
  }
  return v;
});

interface IObject {
  [key: string]: any;
}

let renderData = {
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
const commonFunc = ['onClick', 'onChange', 'onBlur', 'onFocus', 'onClear'];

class GenerateVue extends PureComponent {
  state = {
    visible: false,
  };

  generateTemplate = (schemaDSL: any, vModel?: any) => {
    const {
      componentName,
      props,
      children,
      dataKey,
      dataSource,
      lifeCycle,
      methods,
      imports,
    } = schemaDSL || {};
    const objStr = (obj: any) =>
      Object.entries(obj)
        .map(([k, v]) => {
          if (['Table'].includes(componentName)) {
            if (k === 'key') {
              // 需要转化
              k = 'prop';
            }
          }
          if (typeof v !== 'string') {
            return `:${k}="${v}"`;
          } else {
            return `${k}="${v}"`;
          }
        })
        .join(' ');

    let xml = '';
    switch (componentName) {
      case 'Page':
        renderData.data = dataSource || {}
        this.getLifeCycle(lifeCycle)
        this.getMethods(methods)
        this.getImports(imports)
        const childStr = (children || [])
          .map((item: any) => this.generateTemplate(item))
          .join('\n');
        xml = `<div class='main-container'>\n${childStr}\n</div>`;
        break;
      case 'Form':
        const formItems = (children || [])
          .map((item: any) => {
            const { key, label, initValue } = item || {};
            const itemPropStr = key
              ? `label="${label}" prop="${key}"`
              : `label="${label}"`;
            const vmodel = key && dataKey ? `${dataKey}.${key}` : '';
            if (key && dataKey) {
              // @ts-ignore
              renderData.data[dataKey][key] =
                initValue !== undefined ? initValue : '';
            }
            const itemChildren = (item.children || [])
              .map((child: any) => this.generateTemplate(child, vmodel))
              .join('');
            return `<el-col v-bind="colProps">
            <el-form-item ${itemPropStr}>
              ${itemChildren}
            </el-form-item>
          </el-col>`;
          })
          .join('\n');

        xml = `<el-form ${objStr(props)} :model="${dataKey}">
          <el-row :gutter="20">
          ${formItems}
          </el-row>
        </el-form>`;
        break;
      case 'Input':
        const inputEventStr = this.getEventStr(schemaDSL);
        xml = `<el-input ${objStr(
          props,
        )} v-model="${vModel}" ${inputEventStr}></el-input>`;
        break;
      case 'Button':
        const buttonEventStr = this.getEventStr(schemaDSL);
        xml = `<el-button ${objStr(
          props,
        )} ${buttonEventStr}>${children}</el-button>`;
        break;
      case 'Table':
        const columns = (children || [])
          .map((item: any) => {
            return `<el-table-column ${objStr(item)}></el-table-column>`;
          })
          .join('\n');
        xml = `<el-table :data="${dataKey}" border style="width: 100%">\n${columns}\n</el-table>\n`;
        break;
      case 'Pagination':
        const paginationEventStr = this.getEventStr(schemaDSL, {
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

  getLifeCycle = (item: object) => {
    Object.entries(item).forEach(([k, v]) => {
      // @ts-ignore
      const name = lifeCycleMap[k];
      if (name) {
        const { newFunc } = this.transformFunc(v, name);
        // @ts-ignore
        renderData.lifecycles.push(newFunc);
      }
    });
  };

  getImports = (item: object) => {
    Object.entries(item).forEach(([k, v]) => {
      const importStr = `import ${k} from ${v}`
      // @ts-ignore
      renderData.imports.push(importStr);
    });
  }

  getMethods = (item: object) => {
    Object.entries(item).forEach(([k, v]) => {
      const { newFunc } = this.transformFunc(v);
      // @ts-ignore
      renderData.methods.push(newFunc);
    });
  }

  getEventStr = (item: object, extraMap: IObject = {}) => {
    let funcStr = '';
    Object.entries(item).forEach(([k, v]) => {
      if (typeof v === 'string' && v.includes('function')) {
        const { newFunc, newFuncName } = this.transformFunc(v);
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

  transformFunc = (func: any, newFuncName = '') => {
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

  generateVue = () => {
    const vue = `
        <template>
          ${renderData.template}
        </template>

        <script>
          ${renderData.imports.join('\n')}

          export default {
            data() {
              return ${
                JSON.stringify(renderData.data, null, 2)
              }
            }
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
    return prettier.format(vue, {
      parser: "vue",
      plugins: [parserHTML],
      printWidth: 80,
      singleQuote: true
    })
  };

  handleGenerate = () => {
    this.initData();
    const schema = JSON.parse(DSLStr);
    console.log('schema', DSLStr);
    renderData.template = this.generateTemplate(schema);
    renderData.codeStr = this.generateVue();
    console.log('renderData', renderData);

    this.setState({ visible: true });
  };

  initData = () => {
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

  render() {
    return (
      <>
        <Button type="primary" onClick={() => this.handleGenerate()}>
          生成Vue文件
        </Button>
        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={() => this.setState({ visible: false })}
          width={800}
          visible={this.state.visible}
        >
          <pre>{renderData.codeStr}</pre>
        </Drawer>
      </>
    );
  }
}

export default GenerateVue;
