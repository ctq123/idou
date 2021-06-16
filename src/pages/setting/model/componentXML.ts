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
  },
  TableColumn: (attrStr: any, childStr: any) => {
    return `
    <el-table-column ${attrStr}>
      <template slot-scope="{ row }">
      ${childStr}
      </template>
    </el-table-column>
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
  renderTime: (key: any) => {
    return `{{ row.${key} | formatTime }}`;
  },
  renderAmount: (key: any) => {
    return `<span>
    {{ row.${key} ? Number(row.${key}) / 100 : '-' }}
    </span>`;
  },
  renderOperate: () => {
    return `
    <el-button
      type="text"
      size="small"
      @click="handleView(row)"
    >
      查看
    </el-button>
    <el-button
      type="text"
      size="small"
      @click="handleEdit(row)"
    >
      编辑
    </el-button>       
    `;
  },
  renderDefault: (key: any) => {
    return `{{ row.${key} }}`;
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
      .bc_fff {
        background-color: #ffffff;
      }
      .bshadow {
        border-radius: 2px;
        box-shadow: 0px 2px 4px 0px #0000001a;
      }
      .pl24 {
        padding-left: 24px;
      }
      .pb6 {
        padding-bottom: 6px;
      }
      .pb24 {
        padding-bottom: 24px;
      }
      .pr24 {
        padding-right: 24px;
      }
      .pt24 {
        padding-top: 24px;
      }
      .mt24 {
        margin-top: 24px;
      }
      .w90 {
        width: 90px;
      }
      .h32 {
        height: 32px;
      }
      .tar {
        text-align: right;
      }
      .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .title {
        font-weight: 600;
        font-size: 16px;
        line-height: 50px;
      }
      button {
        i {
          margin-right: 8px;
        }
      }
    }
    `;
  },
  modal: () => {
    return `
      .modal {
        padding: 0px;
      }
    `;
  },
  edit: () => {
    return `
      .edit {
        padding: 0px;
      }
    `;
  },
  detail: () => {
    return `
      .modal {
        padding: 0px;
      }
    `;
  },
};
