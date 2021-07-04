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
      .w90 {
        width: 90px;
      }
      .lh50 {
        line-height: 50px;
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
      .w-100 {
        width: 100%;
      }
      button {
        i {
          margin-right: 8px;
        }
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
      .pb24 {
        padding-bottom: 24px;
      }
      .pr24 {
        padding-right: 24px;
      }
      .pt24 {
        padding-top: 24px;
      }
      .pb12 {
        padding-bottom: 12px;
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
      .df {
        display: flex;
      }
      .jcsb {
        justify-content: space-between;
      }
      .aic {
        align-items: center;
      }
      .w-100 {
        width: 100%;
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
      box-sizing: border-box;
      background-color: #fff;
      padding: 16px 24px;
      border-radius: 5px;
      .left {
        min-width: 400px;
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
      .mt-8 {
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
      .ml8 {
        margin-left: 8px;
      }
      .w90 {
        width: 90px;
      }
      .w-100 {
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
      .fe {
        justify-content: flex-end;
      }
    }
    `;
  },
  detail: () => {
    return `
    .detail-container {
      box-sizing: border-box;
      background-color: #fff;
      padding: 16px 24px;
      border-radius: 5px;
      .left {
        min-width: 400px;
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
      .w-100 {
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
