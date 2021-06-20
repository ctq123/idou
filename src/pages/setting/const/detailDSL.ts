const DSL = {
  componentName: 'Modal',
  type: 'detail',
  props: {
    className: 'detail-container',
    size: 'large',
  },
  dataKey: 'detailModalShow',
  children: [
    {
      componentName: 'DIV',
      props: {
        slot: 'title',
        className: 'df aic jcsb pr24',
      },
      children: [
        {
          componentName: 'DIV',
          props: {
            className: 'left df aic',
          },
          isEdit: true,
          children: [
            {
              componentName: 'SPAN',
              componentType: 'native',
              props: {
                className: 'fs18 fw600',
              },
              children: 'XX详情',
            },
            {
              componentName: 'StatusTag',
              props: {
                statusKey: 'record.status',
              },
              dataKey: 'StatusObj',
              children: null,
            },
          ],
        },
        {
          componentName: 'DIV',
          props: {
            className: 'right',
          },
          children: null,
        },
      ],
    },
    {
      componentName: 'SECTION',
      componentType: 'native',
      props: {},
      children: [
        {
          componentName: 'DIV',
          props: {
            className: 'info-list bb mb24 pb12',
          },
          isEdit: true,
          children: [
            {
              componentName: 'DIV',
              props: {
                className: 'mb12 fs16 fw700',
              },
              children: '发货信息',
            },
            {
              componentName: 'Row',
              props: {
                gutter: 20,
              },
              children: [
                {
                  componentName: 'Col',
                  props: {
                    span: 8,
                  },
                  dataKey: 'record',
                  children: [
                    {
                      label: '预约单号',
                      key: 'applicationNo',
                    },
                  ],
                },
                {
                  componentName: 'Col',
                  props: {
                    span: 8,
                  },
                  dataKey: 'record',
                  children: [
                    {
                      label: '预约数量',
                      key: 'appointNum',
                    },
                  ],
                },
                {
                  componentName: 'Col',
                  props: {
                    span: 8,
                    className: 'f1',
                  },
                  dataKey: 'record',
                  children: [
                    {
                      label: '退货地址',
                      key: 'SendAddress',
                      isEllipsis: true,
                    },
                  ],
                },
                {
                  componentName: 'Col',
                  props: {
                    span: 8,
                  },
                  dataKey: 'record',
                  children: [
                    {
                      label: '发件人手机号',
                      key: 'senderMobile',
                    },
                  ],
                },
                {
                  componentName: 'Col',
                  props: {
                    span: 8,
                  },
                  dataKey: 'record',
                  children: [
                    {
                      label: '物流商',
                      key: 'logisticsName',
                    },
                  ],
                },
                {
                  componentName: 'Col',
                  props: {
                    span: 8,
                  },
                  dataKey: 'record',
                  children: [
                    {
                      label: '物流单号',
                      key: 'expressCode',
                    },
                  ],
                },
                {
                  componentName: 'Col',
                  props: {
                    span: 8,
                  },
                  dataKey: 'record',
                  children: [
                    {
                      label: '预约到货时间',
                      key: 'appointTime',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          componentName: 'DIV',
          props: {
            className: 'info-list bb mb24 pb12',
          },
          // isEdit: true,
          children: [
            {
              componentName: 'DIV',
              props: {
                className: 'mb12 fs16 fw700',
              },
              isEdit: true,
              children: '收件方信息',
            },
            {
              componentName: 'Row',
              props: {
                gutter: 20,
              },
              children: [
                {
                  componentName: 'Col',
                  props: {
                    span: 8,
                  },
                  dataKey: 'record',
                  children: [
                    {
                      label: '收件人',
                      key: 'recipientName',
                    },
                  ],
                },
                {
                  componentName: 'Col',
                  props: {
                    span: 16,
                  },
                  dataKey: 'record',
                  children: [
                    {
                      label: '收件人手机',
                      key: 'recipientPhone',
                    },
                  ],
                },
                {
                  componentName: 'Col',
                  props: {
                    span: 24,
                    className: 'f1',
                  },
                  dataKey: 'record',
                  children: [
                    {
                      label: '收件地址',
                      key: 'warehouseAddress',
                      isEllipsis: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          componentName: 'DIV',
          props: {
            className: 'info-list bb mb24 pb12',
          },
          isEdit: true,
          children: [
            {
              componentName: 'DIV',
              props: {
                className: 'mb12 fs16 fw700',
              },
              children: '预约商品',
            },
            {
              componentName: 'Table',
              props: {},
              dataKey: 'list',
              children: [
                {
                  key: 'info',
                  label: '商品信息',
                  minWidth: 250,
                  render: `<div class="goods-info df aic">
                  <div class="pro-img df aic oh bc_fff mr12">
                    <el-popover
                      placement="right"
                      trigger="hover"
                    >
                      <div class="imgBox">
                        <img :src="row.productImg" class="h200">
                      </div>
                      <img slot="reference" :src="row.productImg" class="aic">
                    </el-popover>
                  </div>
                  <div>
                    <div>
                      <span>货号：</span><strong class="fw600">{{ row.productNo }}</strong>
                    </div>
                    <ellipsis-popover class="f1" :content="row.productName"></ellipsis-popover>
                  </div>
                </div>`,
                },
                {
                  key: 'orderNo',
                  label: '订单号',
                  renderKey: `renderDefault`,
                },
                {
                  key: 'trueName',
                  label: '姓名',
                  renderKey: `renderDefault`,
                },
                {
                  key: 'amount',
                  label: '订单金额',
                  renderKey: `renderAmount`,
                },
                {
                  key: 'status',
                  label: '校验状态',
                  renderKey: `renderDefault`,
                },
                {
                  key: 'createTime',
                  label: '创建时间',
                  renderKey: 'renderTime',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  dataSource: {
    colProps: {
      xs: 24,
      sm: 12,
      lg: 8,
      xl: 8,
    },
    record: {},
    StatusObj: {
      1: { value: '待提交', tag: 'warning' },
      2: { value: '审核中', tag: 'info' },
      3: { value: '已通过', tag: 'success' },
      4: { value: '已驳回', tag: 'danger' },
    },
    loading: false,
    detailModalShow: false,
  },
  lifeCycle: {
    componentDidMount: `function componentDidMount() {
      this.getRecordDetail();
    }`,
  },
  methods: {
    getRecordDetail: `async function getRecordDetail() {
      const params = { id: this.recordId }
      const { code, data } = await API.getRecordDetail(params, this)
      if (code === 200 && data) {
        this.record = data
      }
    }`,
  },
  imports: {
    '{ deleteEmptyParam }': '@/utils',
    '* as API': './api',
  },
  apis: {
    imports: {
      UmiRequest: '@du/umi-request',
    },
    getRecordDetail: `function getRecordDetail(params) {
      return UmiRequest.request({
        method: 'POST',
        url: '/api/v1/h5/oversea/backend/product/detail',
        data: params,
        vm,
        loading: 'loading'
      })
    }`,
  },
};

export { DSL };
