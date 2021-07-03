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
    limitPopUpNumberFlag: {
      type: 'integer',
      format: 'int32',
      description: '是否限制弹窗次数',
      minimum: -128,
      maximum: 127,
    },
    platform: {
      type: 'integer',
      format: 'int32',
      description: '上线平台1-android 2-ios 3-android和ios',
    },
    popImageViewDto: {
      type: 'object',
      properties: [Object],
      title: '图片信息',
      $$ref: '#/definitions/图片信息',
    },
    popType: {
      type: 'integer',
      format: 'int32',
      description: '弹窗类型 1-网页2-图片',
    },
    popUpNumber: { type: 'integer', format: 'int32', description: '弹出次数' },
    populationChoose: {
      type: 'integer',
      format: 'int32',
      description: '人群选择(0-全量 1-人群)-459版本新增',
      minimum: -128,
      maximum: 127,
    },
    startTime: { type: 'string', format: 'date-time', description: '开始时间' },
  },
};

const editModalData = {
  title: '频道创建',
  method: 'POST',
  url: '/dynamic-channels/create',
  request: {
    code: { type: 'string', description: '频道code', mock: [Object] },
    name: { type: 'string', description: '频道名称', mock: [Object] },
    category: {
      type: 'number',
      description: '频道种类 1-单个 2-复合',
      mock: [Object],
    },
    titleLogo: { type: 'string', description: '频道标题图片', mock: [Object] },
    subtitleBidType: {
      type: 'number',
      description: '频道副标题绑定类型0-人工配置 1-绑定业务',
      mock: [Object],
    },
    subtitle: { type: 'string', description: '频道副标题内容', mock: [Object] },
    carouselType: {
      type: 'number',
      description: 'icon图轮播类型1-单图 2-- 3-轮播多图',
      mock: [Object],
    },
    covers: {
      type: 'array',
      description: 'icon图/封面图地址列表 ,String',
      items: [Object],
    },
    bubbleIcon: { type: 'string', description: '气泡图地址', mock: [Object] },
    bubbleIconAspectRatio: {
      type: 'number',
      description: '气泡图标宽高比 精确度小数点后2位',
      mock: [Object],
    },
    rely: {
      type: 'number',
      description: '是否业务依赖 0-无业务依赖 1-有业务依赖',
      mock: [Object],
    },
    type: {
      type: 'number',
      description: '支持平台，1-app 2-小程序 3-全部',
      mock: [Object],
    },
    editor: { type: 'number', description: '编辑者id', mock: [Object] },
    editorName: { type: 'string', description: '编辑者名称', mock: [Object] },
  },
  response: {},
};

module.exports = {
  listData,
  detailData,
  editModalData,
};
