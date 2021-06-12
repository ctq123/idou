/*
 * @Author: chengtianqing
 * @Date: 2021-06-12 16:43:10
 * @LastEditTime: 2021-06-12 16:54:51
 * @LastEditors: chengtianqing
 * @Description: 转换api数据，映射对应的编辑内容
 */

const apiData = {
  title: '商品列表',
  method: 'POST',
  url: '/cross/mhk/pageList',
  request: {
    applicationNo: { type: 'string', description: '预约单号', mock: [Object] },
    status: { type: 'string', description: '预约单状态', mock: [Object] },
    warehouseCode: { type: 'string', description: '收货地址', mock: [Object] },
    createTimeStart: {
      type: 'string',
      description: '创建时间-查询起始时间',
      mock: [Object],
    },
    createTimeEnd: {
      type: 'string',
      description: '创建时间-查询结束时间',
      mock: [Object],
    },
    appointTimeStart: {
      type: 'string',
      description: '预约到货时间-查询起始时间',
      mock: [Object],
    },
    appointTimeEnd: {
      type: 'string',
      description: '预约到货时间-查询结束时间',
      mock: [Object],
    },
    userId: { type: 'number', description: '用户ID', mock: [Object] },
    page: { type: 'number', description: '分页参数-第几页', mock: [Object] },
    pageSize: { type: 'number', description: '分页参数-页数', mock: [Object] },
  },
  response: {
    pageNum: { type: 'number', description: '当前页', mock: [Object] },
    pageSize: { type: 'number', description: '分页大小', mock: [Object] },
    total: { type: 'number', description: '总元素数', mock: [Object] },
    pages: { type: 'number', description: '总页数', mock: [Object] },
    contents: { type: 'array', description: '数据 ,T', items: [Object] },
    extra: {
      type: 'object',
      description: '附加信息(该参数为map)',
      properties: [Object],
    },
  },
};
async function SearchForm() {}

module.exports = {
  SearchForm,
};
