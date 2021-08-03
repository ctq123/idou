/**
 * vue-组件源码片段
 */
export const VueXML: any = {
  VueTemplate: (renderData: any) => {
    return `
    <template>
      ${renderData.template}
    </template>

    <script>
      ${renderData.imports.join(';\n')};

      export default {${
        renderData.componentProps.length
          ? '\nprops: {' + renderData.componentProps.join(',\n') + '},'
          : ''
      }
        data() {
          return ${JSON.stringify(renderData.data, null, 2)}
        },${
          renderData.computed.length
            ? '\ncomputed: {' + renderData.computed.join(',\n') + '},'
            : ''
        }${
      renderData.lifecycles.length
        ? renderData.lifecycles.join(',\n') + ','
        : ''
    }
        methods: {
          ${renderData.methods.join(',\n')}
        }
      }
    </script>

    <style lang="scss" scoped>
      ${renderData.styles.join('\n')}
    </style>
  `;
  },
  CrumbBack: (attrStr: any, childStr: any) => {
    return `
    <div class="go-back">
      <i class="el-icon-back" ${attrStr}></i>
      <span class="bread">${childStr}</span>
    </div>
    `;
  },
  StatusTag: (status: any, tagObj: any) => {
    return `<el-tag
      v-if="${tagObj}[${status}]"
      :type="(${tagObj}[${status}] || {}).tag"
    >
      {{ (${tagObj}[${status}] || {}).value }}
    </el-tag>
    `;
  },
  CreateDom: (name: any, attrStr: any, childStr: any) => {
    return `<${name} ${attrStr}>
    ${childStr}
    </${name}>`;
  },
};

/**
 * vue3-组件源码片段
 * https://vue3js.cn/docs/zh/style-guide/#%E7%BB%84%E4%BB%B6-%E5%AE%9E%E4%BE%8B%E7%9A%84%E9%80%89%E9%A1%B9%E9%A1%BA%E5%BA%8F%E6%8E%A8%E8%8D%90
 */
export const Vue3XML: any = {
  VueTemplate: (renderData: any) => {
    return `
    <template>
      ${renderData.template}
    </template>
    <script lang="ts">
    ${renderData.imports.join(';\n')};

    export default defineComponent({
      ${
        renderData.componentProps.length
          ? '\nprops: {' + renderData.componentProps.join(',\n') + '},'
          : ''
      }
      setup(props) {
        ${
          renderData.formRefs.length
            ? renderData.formRefs.join(';\n') + ';'
            : ''
        }
        ${renderData.useStates.join(';\n')};
        ${
          renderData.lifecycles.length
            ? renderData.lifecycles.join(';\n') + ';'
            : ''
        }
        ${renderData.methods.join(';\n')};

        return {
          ${renderData.exports.join(',\n')}
        }
      }
    })
    <script>

    <style lang="scss" scoped>
      ${renderData.styles.join('\n')}
    </style>
    `;
  },
  CrumbBack: (attrStr: any, childStr: any) => {
    return `
    <div class="go-back">
      <i class="a-icon-back" ${attrStr}></i>
      <span class="bread">${childStr}</span>
    </div>
    `;
  },
  StatusTag: (status: any, tagObj: any) => {
    return `<a-tag
      v-if="${tagObj}[${status}]"
      :type="(${tagObj}[${status}] || {}).tag"
    >
      {{ (${tagObj}[${status}] || {}).value }}
    </a-tag>
    `;
  },
  CreateDom: (name: any, attrStr: any, childStr: any) => {
    return `<${name} ${attrStr}>
    ${childStr}
    </${name}>`;
  },
};

/**
 * react-组件源码片段
 */
export const ReactXML: any = {
  ReactTemplate: (renderData: any) => {
    return `
    ${renderData.imports.join(';\n')};
    ${
      renderData.constOptions.length
        ? renderData.constOptions.join(';\n') + ';'
        : ''
    }
    const Index = (props) => {
      ${renderData.useStates.join(';\n')};
      ${renderData.formRefs.length ? renderData.formRefs.join(';\n') + ';' : ''}
      ${
        renderData.lifecycles.length
          ? renderData.lifecycles.join(';\n') + ';'
          : ''
      }
      ${renderData.methods.join(';\n')};

      return (
        ${renderData.template}
      )
    }
    `;
  },
  CrumbBack: (attrStr: any, childStr: any) => {
    return `
    <div class="go-back">
      <i class="el-icon-back" ${attrStr}></i>
      <span class="bread">${childStr}</span>
    </div>
    `;
  },
  StatusTag: (status: any, tagObj: any) => {
    return `<el-tag
      v-if="${tagObj}[${status}]"
      :type="(${tagObj}[${status}] || {}).tag"
    >
      {{ (${tagObj}[${status}] || {}).value }}
    </el-tag>
    `;
  },
  CreateDom: (name: any, attrStr: any, childStr: any) => {
    return `<${name} ${attrStr}>
    ${childStr}
    </${name}>`;
  },
};

/**
 * 表格渲染函数-源码片段
 */
export const VueTableRenderXML: any = {
  renderTime: (key: string, obj = 'row') => {
    return `{{ ${obj}.${key} | formatTime }}`;
  },
  renderAmount: (key: string, obj = 'row') => {
    return `{{ ${obj}.${key} ? Number(${obj}.${key}) / 100 : '-' }}`;
  },
  renderOperate: (key: string, obj = 'row') => {
    return `
    <el-button
      type="text"
      size="small"
      @click="handleView(${obj})"
    >
      查看
    </el-button>
    <el-button
      type="text"
      size="small"
      @click="handleEdit(${obj})"
    >
      编辑
    </el-button>       
    `;
  },
  renderEllipsis: (key: string, obj = 'row') => {
    return `<ellipsis-popover class="f1" :content="${obj}.${key}"></ellipsis-popover>`;
  },
  renderEnum: (key: string, obj = 'row') => {
    return `{{ ${key}Obj && ${key}Obj[${obj}.${key}] || '-' }}`;
  },
  renderDefault: (key: string, obj = 'row') => {
    return `{{ ${obj}.${key} }}`;
  },
};

/**
 * 样式-组件源码片段
 */
export const styleXML: any = {
  list: () => {
    return `
    .page-container {
      box-sizing: border-box;
      font-family: PingFangSC-Regular;
      .bshadow {
        border-radius: 2px;
        box-shadow: 0px 2px 4px 0px #0000001a;
      }
      .f1 {
        flex: 1;
        min-width: 0;
      }
      .lh50 {
        line-height: 50px;
      }
      .tar {
        text-align: right;
      }
    }
    `;
  },
  edit: () => {
    return `
    .edit-container {
      .go-back {
        display: flex;
        align-items: center;
        i {
          font-size: 22px;
          cursor: pointer;
        }
        i:hover {
          color: #01c2c3;
        }
        .bread {
          font-size: 14px;
          margin-left: 8px;
        }
      }
      .footer-block {
        position: sticky;
        bottom: 0px;
        height: 64px;
        padding: 0 24px;
        background-color: #ffffff;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10;
        .footer-con {
          height: 64px;
          line-height: 64px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
      .edit-content {
        min-height: calc(100vh - 204px);
      }
      .bb {
        border-bottom: solid 1px #f5f5f9;
      }
      .bb:last-child {
        border-bottom: none;
      }
      .f1 {
        flex: 1;
        min-width: 0;
      }
      .bshadow {
        border-radius: 2px;
        box-shadow: 0px 2px 4px 0px #0000001a;
      }
      .info-list {
        color: #2b2c3c;
        .title,
        span {
          color: #7f7f8e;
        }
        .el-col {
          padding: 12px 0;
        }
      }
      .el-form {
        .el-col {
          padding: 0px;
        }
      }
    }
    `;
  },
  editModal: () => {
    return `
    .detail-container {
      .info-list {
        color: #2b2c3c;
        .title,
        span {
          color: #7f7f8e;
        }
        .el-col {
          padding: 12px 0;
        }
      }
      .mt-8 {
        margin-top: -8px;
      }
      .bb {
        border-bottom: solid 1px #f5f5f9;
      }
      .bb:last-child {
        border-bottom: none;
      }
      .f1 {
        flex: 1;
        min-width: 0;
      }
      .bshadow {
        border-radius: 2px;
        box-shadow: 0px 2px 4px 0px #0000001a;
      }
      .lh1 {
        line-height: 1;
      }
      .tar {
        text-align: right;
      }
    }
    `;
  },
  detail: () => {
    return `
    .detail-container {
      .info-list {
        color: #2b2c3c;
        .title,
        span {
          color: #7f7f8e;
        }
        .el-col {
          padding: 12px 0;
        }
      }
      .pro-img {
        width: 60px;
        height: 60px;
        img {
          width: 100%;
          vertical-align: middle;
        }
      }
      .mt-8 {
        margin-top: -8px;
      }
      .bb {
        border-bottom: solid 1px #f5f5f9;
      }
      .bb:last-child {
        border-bottom: none;
      }
      .f1 {
        flex: 1;
        min-width: 0;
      }
      .bshadow {
        border-radius: 2px;
        box-shadow: 0px 2px 4px 0px #0000001a;
      }
      .lh1 {
        line-height: 1;
      }
    }
    `;
  },
};
