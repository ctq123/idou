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
  EllipsisText: (text: any) => {
    return `
    <span class="f1">
      <ellipsis-popover :content="${text}"></ellipsis-popover>
    </span>
    `;
  },
  ProductInfo: (productImg: any, productNo: any, productName: any) => {
    return `
    <div class="goods-info df aic">
      <div class="pro-img df aic oh bc_fff mr12">
        <el-popover
          placement="right"
          trigger="hover"
        >
          <div class="imgBox">
            <img :src="${productImg}" class="h200">
          </div>
          <img slot="reference" :src="${productImg}" class="aic">
        </el-popover>
      </div>
      <div>
        <div>
          <span>货号：</span><strong class="fw600">{{ ${productNo} }}</strong>
        </div>
        <ellipsis-popover class="f1" :content="${productName}"></ellipsis-popover>
      </div>
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
    .detail-container {
      box-sizing: border-box;
      .info-list {
        color: #2B2C3C;
        .title {
          color: #7F7F8E;
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
      .mt-8{
        margin-top: -8px;
      }
      .bb {
        border-bottom: solid 1px #f5f5f9;
      }
      .bb:last-child {
        border-bottom: none;
      }
      .fs18 {
        font-size: 18px;
      }
      .fs16 {
        font-size: 16px;
      }
      .fw600 {
        font-weight: 600;
      }
      .fw700 {
        font-weight: 700;
      }
      .f1 {
        flex: 1;
        min-width: 0;
      }
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
      .pb12 {
        padding-bottom: 12px;
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
      .mt12 {
        margin-top: 12px;
      }
      .mt24 {
        margin-top: 24px;
      }
      .mb24 {
        margin-bottom: 24px;
      }
      .mb12 {
        margin-bottom: 12px;
      }
      .mr12 {
        margin-right: 12px;
      }
      .w90 {
        width: 90px;
      }
      .w100 {
        width: 100%;
      }
      .h32 {
        height: 32px;
      }
      .lh1 {
        line-height: 1;
      }
      .tar {
        text-align: right;
      }
      .df {
        display: flex;
      }
      .jcsb {
        justify-content: space-between;
      }
      .aic {
        align-items: center;
      }
    }
    `;
  },
};
