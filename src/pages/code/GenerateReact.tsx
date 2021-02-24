import React, { PureComponent } from 'react';
import { Button, Drawer } from 'antd';
import { DSL } from './dsl';

interface IObject {
  [key: string]: any;
}

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
};

export default class GenerateReact extends PureComponent {
  state = {
    visible: false,
  };

  generateReact = () => {
    const reactCode = `
        import React from 'react'
        ${renderData.imports.join('\n')}

        export default class Index extends React.Component {
          state = ${JSON.stringify(renderData.data, null, 2)}
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
      parser: 'react',
      plugins: [parserHTML],
      printWidth: 80,
      singleQuote: true,
    });
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

    return xml + '\n';
  };

  handleGenerate = () => {
    this.initData();
    const schema = JSON.parse(DSLStr);
    console.log('schema', DSLStr);
    // renderData.template = this.generateTemplate(schema);
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
