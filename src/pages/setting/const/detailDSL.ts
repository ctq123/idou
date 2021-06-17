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
            className: 'left',
          },
          children: [
            {
              componentName: 'SPAN',
              componentType: 'native',
              props: {
                className: 'fs18 fw600',
              },
              children: '预约单详情',
            },
            {
              componentName: 'StatusTag',
              props: {},
              dataKey: 'record.status',
              tagObj: 'statusObj',
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
                      label: '收件人手机号',
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
                  key: 'id',
                  label: '序号',
                  minWidth: 100,
                  renderKey: `renderDefault`,
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
    statusObj: {
      1: { value: '待提交', tag: 'warning' },
      2: { value: '审核中', tag: 'info' },
      3: { value: '已通过', tag: 'success' },
      4: { value: '已驳回', tag: 'danger' },
    },
    record: {},
    loading: false,
    title: 'XX详情',
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
