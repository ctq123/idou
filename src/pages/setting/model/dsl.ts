const DSL = {
  componentName: 'Page',
  props: {},
  children: [
    {
      componentName: 'Form',
      props: {
        'label-width': 80,
      },
      dataKey: 'form',
      children: [
        {
          label: '姓名',
          key: 'trueName',
          initValue: 'Jack',
          children: [
            {
              componentName: 'Input',
              props: {},
            },
          ],
        },
        {
          label: '身份证',
          key: 'buyerIdCardNo',
          children: [
            {
              componentName: 'Input',
              props: {},
            },
          ],
        },
        {
          label: '订单号',
          key: 'orderNo',
          children: [
            {
              componentName: 'Input',
              props: {},
            },
          ],
        },
        {
          label: '',
          children: [
            {
              componentName: 'Button',
              props: {
                type: 'primary',
                htmlType: 'submit',
              },
              children: '搜索',
              onClick: `function search() {
                this.pagination.currentPage = 1;
                this.queryList();
              }`,
            },
            {
              componentName: 'Button',
              props: {},
              children: '重置',
              onClick: `function reset() {
                this.pagination.currentPage = 1;
                this.form = {};
                this.queryList();
              }`,
            },
          ],
        },
      ],
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
        },
        {
          key: 'orderNo',
          label: '订单号',
        },
        {
          key: 'trueName',
          label: '姓名',
        },
        {
          key: 'buyerIdCardNo',
          label: '身份证号',
        },
        {
          key: 'amount',
          label: '订单金额',
        },
        {
          key: 'status',
          label: '校验状态',
        },
        {
          key: 'createTime',
          label: '创建时间',
        },
        {
          key: 'modifyTime',
          label: '修改时间',
        },
      ],
    },
    {
      componentName: 'Pagination',
      props: {},
      onPageChange: `function handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.queryList();
      }`,
    },
  ],
  dataSource: {
    colProps: {
      xs: 24,
      sm: 12,
      lg: 8,
      xl: 8,
    },
    pagination: {
      currentPage: 1,
      pageSize: 20,
      total: 0,
    },
  },
  lifeCycle: {
    componentDidMount: `function componentDidMount() {
      this.queryList();
    }`,
  },
  methods: {
    queryList: `function queryList() {
      const params = Object.assign({}, this.form, {
        pageSize: this.pagination.pageSize,
        page: this.pagination.currentPage,
      })
      deleteEmptyParam(params)
      UmiRequest.request({
        url: '/api/v1/h5/oversea/backend/getLimitOrder',
        params,
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.rows
          this.pagination.total = Number(res.data.total)
        }
      })
    }`,
  },
  imports: {
    '{ deleteEmptyParam }': '@/utils',
    UmiRequest: '@du/umi-request',
  },
};

export { DSL };
