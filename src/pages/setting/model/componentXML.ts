/**
 * vue-组件源码片段
 */
export const VueXML = {
  Page: (childStr: any) => {
    return `
    <div class='page-container'>
    ${childStr}
    </div>`;
  },
  Form: (attrStr: any, childStr: any) => {
    return `
    <!--搜索区域-->
    <div class="bc_fff bshadow pl24 pb6 pr24 pt24">
      <el-form ${attrStr}>
        <el-row :gutter="20">
          <flex-search>
            ${childStr}
          </flex-search>
        </el-row>
      </el-form>
    </div>`;
  },
  FormItem: (attrStr: any, childStr: any) => {
    return `
    <el-col v-bind="colProps">
      <el-form-item ${attrStr}>
      ${childStr}
      </el-form-item>
    </el-col>`;
  },
  TableColumn: (attrStr: any, childStr: any) => {
    return `
    <el-table-column ${attrStr}>
      <template slot-scope="{ row }">
      ${childStr}
      </template>
    </el-table-column>`;
  },
  Default: (name: any, attrStr: any, childStr: any) => {
    return `<${name} ${attrStr}>
    ${childStr}
    </${name}>`;
  },
};

/**
 * 样式-组件源码片段
 */
export const styleXML = {
  Page: () => {
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
  Modal: () => {
    return `
      .modal {
        padding: 0px;
      }
    `;
  },
};
