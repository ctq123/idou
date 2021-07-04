const DSL = {
  componentName: 'Modal',
  type: 'detail',
  props: {
    className: 'detail-container',
    size: 'large',
    'close-on-click-modal': false,
    // TODO
    ':visible.sync': 'detailModalShow',
  },
  children: [
    {
      componentName: 'div',
      componentType: 'native',
      props: {
        slot: 'title',
        className: 'df aic jcsb pr24',
      },
      children: [
        {
          componentName: 'div',
          componentType: 'native',
          props: {
            className: 'df aic left',
          },
          isEdit: true,
          children: [
            {
              componentName: 'span',
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
                statusObj: {
                  1: { value: '待提交', tag: 'warning' },
                  2: { value: '审核中', tag: 'info' },
                  3: { value: '已通过', tag: 'success' },
                  4: { value: '已驳回', tag: 'danger' },
                },
              },
              children: null,
            },
          ],
        },
      ],
    },
    {
      componentName: 'section',
      componentType: 'native',
      props: {},
      children: [
        {
          componentName: 'div',
          componentType: 'native',
          props: {
            className: 'info-list bb mb24 pb12',
          },
          isEdit: true,
          children: [
            {
              componentName: 'div',
              componentType: 'native',
              props: {
                className: 'mb12 fs16 fw700',
              },
              isEdit: true,
              children: '发货信息',
            },
            {
              componentName: 'Row',
              props: {
                gutter: 20,
              },
              dataKey: 'record',
              isEdit: true,
              children: [
                {
                  span: 8,
                  key: 'applicationNo',
                  label: '预约单号',
                  renderKey: `renderDefault`,
                },
                {
                  span: 8,
                  label: '预约数量',
                  key: 'appointNum',
                  render: `<span>0</span>`,
                },
                {
                  span: 8,
                  label: '退货地址',
                  key: 'sendAddress',
                  isEllipsis: true,
                  renderKey: `renderEllipsis`,
                },
                {
                  span: 8,
                  label: '发件人手机号',
                  key: 'senderMobile',
                  renderKey: `renderDefault`,
                },
                {
                  span: 8,
                  label: '物流商',
                  key: 'logisticsName',
                  renderKey: `renderDefault`,
                },
                {
                  span: 8,
                  label: '物流单号',
                  key: 'expressCode',
                  renderKey: `renderDefault`,
                },
                {
                  span: 8,
                  label: '物流状态',
                  key: 'expressStatus',
                  renderKey: `renderEnum`,
                  enumObj: {
                    0: '已揽件',
                    1: '运输中',
                    2: '派送中',
                    3: '已签收',
                  },
                },
                {
                  span: 8,
                  label: '预约到货时间',
                  key: 'appointTime',
                  renderKey: `renderTime`,
                },
              ],
            },
          ],
        },
        {
          componentName: 'div',
          componentType: 'native',
          props: {
            className: 'info-list bb mb24 pb12',
          },
          isEdit: true,
          children: [
            {
              componentName: 'div',
              componentType: 'native',
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
              isEdit: true,
              dataKey: 'record',
              children: [
                {
                  span: 8,
                  key: 'recipientName',
                  label: '收件人',
                  renderKey: `renderDefault`,
                },
                {
                  span: 16,
                  label: '收件人手机',
                  key: 'recipientPhone',
                  renderKey: `renderDefault`,
                },
                {
                  span: 24,
                  label: '收件地址',
                  key: 'warehouseAddress',
                  renderKey: `renderEllipsis`,
                },
              ],
            },
          ],
        },
        {
          componentName: 'div',
          componentType: 'native',
          props: {
            className: 'info-list bb mb24 pb12',
          },
          isEdit: true,
          children: [
            {
              componentName: 'div',
              componentType: 'native',
              props: {
                className: 'mb12 fs16 fw700',
              },
              children: '预约商品',
              isEdit: true,
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
  componentProps: {
    order: `{
      type: Object,
      default: () => ({}),
    }`,
    visible: `{
      type: Boolean,
      default: false,
    }`,
  },
  dataSource: {
    colProps: {
      xs: 24,
      sm: 12,
      lg: 8,
      xl: 8,
    },
    record: {},
    loading: false,
  },
  computed: {
    detailModalShow: `{
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      },
    }`,
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
