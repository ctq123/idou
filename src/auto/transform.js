/*
 * @Author: chengtianqing
 * @Date: 2021-06-12 16:43:10
 * @LastEditTime: 2021-07-03 01:12:00
 * @LastEditors: chengtianqing
 * @Description: 转换api数据，映射对应的编辑内容
 */
const isObject = require('lodash/isObject');
const get = require('lodash/get');

// const listData = {
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

// 类型
const typeEnum = {
  default: 'default',
  number: 'number',
  price: 'price',
  enum: 'enum',
  date: 'date',
};

/**
 * 判断类型
 * @param {*} item
 * @returns
 */
const checkFiledType = (item) => {
  let label = '';
  let fileType = 'default';
  let enumObj = {};
  if (item.title) {
    label = 'object-' + item.title;
  } else {
    label = item.description || 'null';
    let arr = label.match(/\d/g);
    if (arr && arr.length > 1) {
      // 包含多个枚举值
      // 查找第一个位置
      let arr1 = label.match(/\d/);
      let str1 = label.substr(0, arr1.index);
      let str2 = label.substr(arr1.index);
      str2
        .split(' ')
        .filter(Boolean)
        .forEach((item) => {
          const [k, v] = item.split(/[-:]/);
          enumObj[k] = v;
        });
      label = str1 ? str1.replace(/[\s-,，（\(]/g, '') : '--';
      fileType = typeEnum['enum'];
    } else if (['状态', '类型'].some((s) => label.indexOf(s) > -1)) {
      fileType = typeEnum['enum'];
    } else if (['时间', '日期'].some((s) => label.indexOf(s) > -1)) {
      fileType = typeEnum['date'];
    } else if (['次数', '数量', '小数'].some((s) => label.indexOf(s) > -1)) {
      fileType = typeEnum['number'];
    } else if (['款', '价', '金额'].some((s) => label.indexOf(s) > -1)) {
      fileType = typeEnum['price'];
    }
    label = label.split(/[\s\-\(，,]/)[0];
  }
  return { label, fileType, enumObj };
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
        ['新增', '创建', '编辑', '更新'].some(
          (s) => (title || '').indexOf(s) > -1,
        )
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
              const typeObj = {
                default: '输入框',
                number: '数字输入框',
                price: '数字输入框',
                enum: '选择器',
                date: '日期范围',
              };
              const obj = checkFiledType(v);
              obj['componentType'] = typeObj[obj.fileType] || '输入框';
              if (obj.componentType === '日期范围') {
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
            const typeObj = {
              default: '默认',
              price: '金额',
              enum: '状态',
              date: '时间',
            };
            const obj = checkFiledType(v);
            obj.componentType = typeObj[obj.fileType] || '默认';
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
            const typeObj = {
              default: '默认',
              price: '金额',
              enum: '状态',
              date: '时间',
            };
            const obj = checkFiledType(v);
            obj.componentType = typeObj[obj.fileType] || '默认';
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
            const typeObj = {
              default: '输入框',
              number: '数字输入框',
              price: '数字输入框',
              enum: '选择器',
              date: '日期范围',
            };
            const obj = checkFiledType(v);
            obj['componentType'] = typeObj[obj.fileType] || '输入框';
            if (obj.componentType === '日期范围') {
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
};
