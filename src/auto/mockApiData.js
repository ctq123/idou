const listData = {
  title: '预约单列表',
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
    contents: {
      type: 'array',
      description: '数据 ,T',
      items: {
        properties: {
          applicationNo: {
            type: 'string',
            description: '预约单号',
            mock: [Object],
          },
          status: { type: 'string', description: '预约单状态', mock: [Object] },
          avgPrice: {
            type: 'string',
            description: '均价',
            mock: [Object],
          },
          appointTime: {
            type: 'string',
            description: '预约到货时间',
            mock: [Object],
          },
        },
      },
    },
    extra: {
      type: 'object',
      description: '附加信息(该参数为map)',
      properties: [Object],
    },
  },
};

const detailData = {
  title: '弹窗详情',
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

module.exports = {
  listData,
  detailData,
};
