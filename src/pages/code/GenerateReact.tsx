// @ts-nocheck
import React, { PureComponent } from 'react';
import { Button, Drawer } from 'antd';
import { DSL } from './dsl';

import prettier from 'prettier/esm/standalone.mjs';
import parserBabel from "prettier/esm/parser-babel.mjs";
import parserHTML from 'prettier/esm/parser-html.mjs';

const DSLStr = JSON.stringify(DSL, function (_, v) {
  if (typeof v === 'function') {
    return v.toString();
  }
  return v;
});

let renderData = {
  codeStr: '',
  template: '',
  imports: [],
  data: {},
  methods: [],
  lifecycles: [],
  styles: [],
  antdComponentMap: {},
  formRefs: [],
};

let submitName = 'submit'
export default class GenerateReact extends PureComponent {
  state = {
    visible: false,
  };

  generateReact = () => {
    const antdComs = Object.keys(renderData.antdComponentMap)
    if (antdComs && antdComs.length) {
      renderData.imports.unshift(`import { ${antdComs.join(', ')} } from 'antd'`)
    }
    if (renderData.formRefs.length) {
      renderData.imports.unshift(`import { FormInstance } from 'antd/lib/form'`)
    }

    const reactCode = `
        import React from 'react'
        ${renderData.imports.join('\n')}

        export default class Index extends React.Component {
          state = ${JSON.stringify(renderData.data, null, 2)}
          ${renderData.formRefs.join('\n')}
          ${renderData.lifecycles.join('\n')}
          ${renderData.methods.join('\n')}

          render() {
            return (
              ${renderData.template}
            )
          }
        }
      `;
    return prettier.format(reactCode, {
      parser: 'babel-ts',
      plugins: [parserBabel],
      printWidth: 80,
      singleQuote: true,
    });
  };

  generateTemplate = (schemaDSL: any) => {
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
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');

    let xml = '';
    switch(componentName) {
      case 'Page':
        renderData.data = dataSource || {};
        if (dataSource.pagination['currentPage']) {
          renderData.data['pagination']['current'] = dataSource.pagination['currentPage']
          delete renderData.data.pagination.currentPage
        }
        this.getLifeCycle(lifeCycle);
        this.getMethods(methods);
        this.getImports(imports);
        const childStr = (children || [])
          .map((item: any) => this.generateTemplate(item))
          .join('\n');
        xml = `<div class='main-container'>\n${childStr}\n</div>`;
        break
      case 'Form':
        this.pushComponent('Form')
        this.pushComponent('Row')
        this.pushComponent('Col')
        const formDataKey = dataKey || 'form'
        renderData.data[formDataKey] = {}
        const formRef = `formRef${renderData.antdComponentMap[componentName]}`
        renderData.formRefs.push(`${formRef} = React.createRef<FormInstance>()\n`)
        
        const initialValues = {}

        const formItems = (children || [])
          .map((item: any) => {
            const { key, label, initValue } = item || {};
            const itemPropStr = key
              ? `label="${label}" name="${key}"`
              : `label="${label}"`;
            if (key) {
              // @ts-ignore
              renderData.data[formDataKey][key] = ''
              if (initValue !== undefined) {
                renderData.data[formDataKey][key] = initValue
                initialValues[key] = initValue
              }
            }
            const itemChildren = (item.children || [])
              .map((child: any) => this.generateTemplate(child))
              .join('');
            return `<Col {...this.state.colProps}>
            <Form.Item ${itemPropStr}>
              ${itemChildren}
            </Form.Item>
          </Col>`;
          })
          .join('\n');

        xml = `
        <Form 
          labelCol={{ span: 8 }} 
          wrapperCol={{ span: 16 }} 
          ref={this.${formRef}}
          onFinish={this.${submitName}.bind(this)}
        >
          <Row gutter={24}>
            ${formItems}
          </Row>
        </Form>`
        break
      case 'Table':
        this.pushComponent(componentName)
        const listKey = dataKey || 'list'
        renderData.data[listKey] = []
        const columns = (children || []).map((item: any) => {
          return {
            ...item,
            title: item.label,
            dataIndex: item.key
          }
        })
        renderData.data['columns'] = columns

        xml = `
        <Table
          columns={this.state.columns}
          dataSource={this.state.${listKey}}
          onChange={this.handleTableChange.bind(this)}
          pagination={
            {
              ...this.state.pagination,
              showTotal: (s: any) => \`共 \${s} 条\`,
              showSizeChanger: false
            }
          }
        >
        </Table>
        `;
        break;
      case 'Pagination':
        this.getEventStr(schemaDSL, {
          onPageChange: 'handleTableChange',
        })
        break;
      case 'Button':
        this.pushComponent(componentName)
        const buttonEventStr = this.getEventStr(schemaDSL);
        xml = `<Button ${objStr(props)} ${buttonEventStr}>${children}</Button>`;
        break;
      case 'Input':
        this.pushComponent(componentName)
        const commonEventStr = this.getEventStr(schemaDSL);
        xml = `<${componentName} ${objStr(props)} ${commonEventStr} />`;
        break;
      default:
        xml = ''
    }

    return xml + '\n';
  };

  pushComponent = (componentName='') => {
    if (!renderData.antdComponentMap[componentName]) {
      renderData.antdComponentMap[componentName] = 1
    } else {
      renderData.antdComponentMap[componentName]++
    }
  }

  getLifeCycle = (item: object) => {
    Object.entries(item).forEach(([_, v]) => {
      const { newFunc } = this.transformFunc(v);
        // @ts-ignore
      renderData.lifecycles.push(newFunc);
    });
  };

  getMethods = (item: object) => {
    Object.entries(item).forEach(([_, v]) => {
      const { newFunc } = this.transformFunc(v);
      // @ts-ignore
      renderData.methods.push(newFunc);
    });
  };

  getImports = (item: object) => {
    Object.entries(item).forEach(([k, v]) => {
      const importStr = `import ${k} from "${v}"`;
      // @ts-ignore
      renderData.imports.push(importStr);
    });
  };

  getEventStr = (item: object, extraMap?: IObject = {}) => {
    let funcStr = '';
    Object.entries(item).forEach(([k, v]) => {
      if (typeof v === 'string' && v.includes('function')) {
        const { newFunc, newFuncName, args } = this.transformFunc(v, extraMap[k]);
        if (k === 'onClick' && item?.componentName === 'Button' && item?.props?.htmlType === 'submit') {// 需要将事件绑定到Form上
          submitName = newFuncName
        } else {
          funcStr = funcStr ? `${funcStr} ` : funcStr;
          funcStr += args ? `${k}="this.${newFuncName}.bind(this, ${args})"` : `${k}="this.${newFuncName}.bind(this)"`;
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
    const end2 = funcStr.indexOf(')');
    const funcName = funcStr.slice(start, end);
    const args = funcStr.slice(end+1, end2);
    let newFunc = funcStr.slice(start);
    if (newFuncName) {
      newFunc = newFunc.replace(funcName, newFuncName);
    }
    return { newFunc, newFuncName: newFuncName || funcName, args };
  };

  handleGenerate = () => {
    this.initData();
    const schema = JSON.parse(DSLStr);
    console.log('schema', DSLStr);
    renderData.template = this.generateTemplate(schema);
    renderData.codeStr = this.generateReact();
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
      antdComponentMap: {},
      formRefs: [],
    };
  };

  render() {
    return (
      <>
        <Button type="primary" onClick={() => this.handleGenerate()}>
          生成React文件
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
