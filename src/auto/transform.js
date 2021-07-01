/*
 * @Author: chengtianqing
 * @Date: 2021-06-12 16:43:10
 * @LastEditTime: 2021-06-14 04:35:28
 * @LastEditors: chengtianqing
 * @Description: 转换api数据，映射对应的编辑内容
 */
const isObject = require('lodash/isObject');
const get = require('lodash/get');

// const apiData = {
//   title: '商品列表',
//   method: 'POST',
//   url: '/cross/mhk/pageList',
//   request: {
//     applicationNo: { type: 'string', description: '预约单号', mock: [Object] },
//     status: { type: 'string', description: '预约单状态', mock: [Object] },
//     warehouseCode: { type: 'string', description: '收货地址', mock: [Object] },
//     createTimeStart: {
//       type: 'string',
//       description: '创建时间-查询起始时间',
//       mock: [Object],
//     },
//     createTimeEnd: {
//       type: 'string',
//       description: '创建时间-查询结束时间',
//       mock: [Object],
//     },
//     appointTimeStart: {
//       type: 'string',
//       description: '预约到货时间-查询起始时间',
//       mock: [Object],
//     },
//     appointTimeEnd: {
//       type: 'string',
//       description: '预约到货时间-查询结束时间',
//       mock: [Object],
//     },
//     userId: { type: 'number', description: '用户ID', mock: [Object] },
//     page: { type: 'number', description: '分页参数-第几页', mock: [Object] },
//     pageSize: { type: 'number', description: '分页参数-页数', mock: [Object] },
//   },
//   response: {
//     pageNum: { type: 'number', description: '当前页', mock: [Object] },
//     pageSize: { type: 'number', description: '分页大小', mock: [Object] },
//     total: { type: 'number', description: '总元素数', mock: [Object] },
//     pages: { type: 'number', description: '总页数', mock: [Object] },
//     contents: {
//       type: 'array',
//       description: '数据 ,T',
//       items: {
//         properties: {
//           applicationNo: {
//             type: 'string',
//             description: '预约单号',
//             mock: [Object],
//           },
//           status: { type: 'string', description: '预约单状态', mock: [Object] },
//           avgPrice: {
//             type: 'string',
//             description: '均价',
//             mock: [Object],
//           },
//           appointTime: {
//             type: 'string',
//             description: '预约到货时间',
//             mock: [Object],
//           },
//         },
//       },
//     },
//     extra: {
//       type: 'object',
//       description: '附加信息(该参数为map)',
//       properties: [Object],
//     },
//   },
// };

const apiData = {
  title: '获取弹窗详情',
  method: 'POST',
  url: '/admin-growth/pop/detail',
  request: { id: { type: 'integer', format: 'int64', description: '弹窗id' } },
  response: {
    endTime: { type: 'string', format: 'date-time', description: '结束时间' },
    grayValue: { type: 'integer', format: 'int32', description: '灰度值' },
    id: { type: 'integer', format: 'int64', description: '弹窗id' },
    limitPopUpNumberFlag: {
      type: 'integer',
      format: 'int32',
      description: '是否限制弹窗次数',
      minimum: -128,
      maximum: 127,
    },
    pageName: { type: 'string', description: '展示页面' },
    platform: {
      type: 'integer',
      format: 'int32',
      description: '上线平台1-android 2-ios 3-android和ios',
    },
    platformName: { type: 'string', description: '上线平台类型' },
    popImageViewDto: {
      type: 'object',
      properties: [Object],
      title: '图片信息',
      $$ref: '#/definitions/图片信息',
    },
    popName: { type: 'string', description: '弹窗名称' },
    popType: {
      type: 'integer',
      format: 'int32',
      description: '弹窗类型 1-网页2-图片',
    },
    popTypeName: { type: 'string', description: '弹窗类型名称' },
    popUpNumber: { type: 'integer', format: 'int32', description: '弹出次数' },
    popWebViewDto: {
      type: 'object',
      properties: [Object],
      title: '网页信息',
      $$ref: '#/definitions/网页信息',
    },
    populationChoose: {
      type: 'integer',
      format: 'int32',
      description: '人群选择(0-全量 1-人群)-459版本新增',
      minimum: -128,
      maximum: 127,
    },
    populationId: {
      type: 'integer',
      format: 'int64',
      description: '人群Id-459版本新增',
    },
    routeUrl: { type: 'string', description: 'routeUrl' },
    showPageUrl: { type: 'string', description: '展示页面url-459版本新增' },
    startTime: { type: 'string', format: 'date-time', description: '开始时间' },
  },
  componentType: 'detail',
};

/**
 * 转换data
 * @param {*} apiData
 * @returns
 */
function transData(apiData, userInput = '') {
  if (isObject(apiData)) {
    const { request, response, title } = apiData;

    if (userInput) {
      // 用户输入值，指定页面
      const pageTypeObj = {
        管理列表: 'list',
        弹窗详情: 'detail',
        弹窗编辑: 'editModal',
        编辑页面: 'edit',
      };
      apiData.componentType = pageTypeObj[userInput];
    }

    if (!apiData.componentType) {
      // 用户没有指定
      // 先根据接口名称判断页面类型
      if ((title || '').indexOf('列表') > -1) {
        apiData.componentType = 'list';
      } else if ((title || '').indexOf('详情') > -1) {
        apiData.componentType = 'detail';
      } else if (
        ['新增', '编辑', '更新'].some((s) => (title || '').indexOf(s) > -1)
      ) {
        apiData.componentType = 'editModal';
      } else {
        apiData.componentType = '';
      }
      // 根据返回结构进一步判断
      if (!apiData.componentType && isObject(response)) {
        // 判断是否为列表类型页面
        if (
          response.total ||
          (response.contents && response.contents.type === 'array') ||
          (response.list && response.list.type === 'array') ||
          (response.rows && response.rows.type === 'array')
        ) {
          apiData.componentType = 'list';
        }
      }
    }

    // 再根据页面类型进行数据处理
    if (apiData.componentType === 'list') {
      // 列表类型
      // 转换搜索组件数据类型
      if (isObject(request)) {
        const form = {};
        const search = {
          form: {},
          pageKey: '',
          pageSizeKey: '',
        };
        Object.entries(request).forEach(([k, v]) => {
          if (['page', 'pageNum'].some((s) => k === s)) {
            search.pageKey = k;
          } else if (['pageSize'].some((s) => k === s)) {
            search.pageSizeKey = k;
          } else {
            if (isObject(v)) {
              const obj = { ...v };
              const { description = '' } = obj;
              if (['状态', '类型'].some((s) => description.indexOf(s) > -1)) {
                obj.componentType = '选择器';
              } else if (
                ['时间', '日期'].some((s) => description.indexOf(s) > -1)
              ) {
                obj.componentType = '日期范围';
              } else {
                obj.componentType = '输入框';
              }
              if (obj.componentType === '日期范围') {
                let newDesc = description;
                if (/Start$|End$/i.test(k)) {
                  k = k.replace(/Start$/i, '');
                  k = k.replace(/End$/i, '');
                } else if (/^start|^end/i.test(k)) {
                  k = k.replace(/^start/i, '');
                  k = k.replace(/^end/i, '');
                } else if (/^lt|^gt/i.test(k)) {
                  k = k.replace(/^lt/i, '');
                  k = k.replace(/^gt/i, '');
                }
                newDesc = newDesc.split('-')[0];
                newDesc = newDesc.replace('起始', '');
                newDesc = newDesc.replace('开始', '');
                newDesc = newDesc.replace('结束', '');
                obj.description = newDesc;
              }
              form[k] = obj;
            }
          }
        });
        search.form = form;
        apiData.search = search;
      }

      // 转换表格数据类型
      if (isObject(response)) {
        const { contents = {}, rows = {}, list = {} } = response;
        const temp = Object.assign(contents, rows, list);
        const columnsObj = get(temp, 'items.properties');
        const col = {};
        Object.entries(columnsObj).forEach(([k, v]) => {
          if (isObject(v)) {
            const obj = { ...v };
            const { description = '' } = obj;
            if (
              ['金额', '价', '付款'].some((s) => description.indexOf(s) > -1)
            ) {
              obj.componentType = '金额';
            } else if (
              ['时间', '日期'].some((s) => description.indexOf(s) > -1)
            ) {
              obj.componentType = '时间';
            } else {
              obj.componentType = '默认';
            }
            col[k] = obj;
          } else {
            col[k] = v;
          }
        });
        apiData.columnsObj = col;
      }
    } else if (apiData.componentType === 'detail') {
      // 详情类型
      // 转换显示数据类型
      if (isObject(response)) {
        const recordObj = {};
        Object.entries(response).forEach(([k, v]) => {
          if (isObject(v)) {
            const obj = { ...v };
            const { description = '' } = obj;
            if (
              ['金额', '价', '付款'].some((s) => description.indexOf(s) > -1)
            ) {
              obj.componentType = '金额';
            } else if (
              ['时间', '日期'].some((s) => description.indexOf(s) > -1)
            ) {
              obj.componentType = '时间';
            } else if (['(', ')'].every((s) => description.indexOf(s) > -1)) {
              const startIndex = description.indexOf('(');
              const endIndex = description.indexOf(')');
              const s = obj.description.substr(startIndex + 1, endIndex);
              const arr = s.split(' ');
              const keyVal = {};
              arr.filter(Boolean).forEach((item) => {
                const [k, v] = item.split('-');
                keyVal[k] = v;
              });
              obj.description = obj.description.substr(0, startIndex);
              obj.keyValueObj = keyVal;
              obj.componentType = '状态';
            } else {
              obj.componentType = '默认';
            }
            recordObj[k] = obj;
          } else {
            recordObj[k] = v;
          }
        });
        apiData.recordObj = recordObj;
      }
    } else if (['editModal', 'edit'].includes(apiData.componentType)) {
      // 转换数据类型
      if (isObject(request)) {
        const form = {};
        Object.entries(request).forEach(([k, v]) => {
          if (isObject(v)) {
            const obj = { ...v };
            const { description = '' } = obj;
            if (['(', ')'].every((s) => description.indexOf(s) > -1)) {
              const startIndex = description.indexOf('(');
              const endIndex = description.indexOf(')');
              const s = obj.description.substr(startIndex + 1, endIndex);
              const arr = s.split(' ');
              const keyVal = {};
              arr.filter(Boolean).forEach((item) => {
                const [k, v] = item.split('-');
                keyVal[k] = v;
              });
              obj.description = obj.description.substr(0, startIndex);
              obj.keyValueObj = keyVal;
              obj.componentType = '选择器';
            } else if (
              ['售价', '价', '金额', '次数', '数量', '付款', '百分比'].some(
                (s) => description.indexOf(s) > -1,
              )
            ) {
              obj.componentType = '数字输入框';
            } else if (
              ['时间', '日期'].some((s) => description.indexOf(s) > -1)
            ) {
              obj.componentType = '日期范围';
            } else {
              obj.componentType = '输入框';
            }
            if (obj.componentType === '日期范围') {
              let newDesc = description;
              if (/Start$|End$/i.test(k)) {
                k = k.replace(/Start$/i, '');
                k = k.replace(/End$/i, '');
              } else if (/^start|^end/i.test(k)) {
                k = k.replace(/^start/i, '');
                k = k.replace(/^end/i, '');
              } else if (/^lt|^gt/i.test(k)) {
                k = k.replace(/^lt/i, '');
                k = k.replace(/^gt/i, '');
              }
              newDesc = newDesc.split('-')[0];
              newDesc = newDesc.replace('起始', '');
              newDesc = newDesc.replace('开始', '');
              newDesc = newDesc.replace('结束', '');
              obj.description = newDesc;
            }
            form[k] = obj;
          }
        });
        apiData.formObj = form;
      }
    }
  }
  return apiData;
}

module.exports = {
  transData,
  mockApiData: apiData,
};
