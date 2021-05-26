/**
 * vue-组件源码片段
 */
export const VueXML = {
  Page: (childStr: any) => {
    return `<div class='page-container'>\n${childStr}\n</div>`;
  },
  Form: (attrStr: any, childStr: any) => {
    return `<el-form ${attrStr}>\n<el-row :gutter="20">\n${childStr}\n</el-row>\n</el-form>`;
  },
  FormItem: (attrStr: any, childStr: any) => {
    return `<el-col v-bind="colProps">\n<el-form-item ${attrStr}>\n${childStr}\n</el-form-item>\n</el-col>`;
  },
  TableColumn: (attrStr: any, childStr: any) => {
    return `<el-table-column ${attrStr}>\n<template slot-scope="{ row }">\n${childStr}\n</template>\n</el-table-column>`;
  },
  Default: (name: any, attrStr: any, childStr: any) => {
    return `<${name} ${attrStr}>\n${childStr}\n</${name}>`;
  },
};

/**
 * 样式-组件源码片段
 */
export const styleXML = {
  Page: () => {
    return `
     .page-container {
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
