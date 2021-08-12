const DSL = {
  componentName: 'div',
  componentType: 'native',
  type: 'list',
  props: {
    className: 'page-container',
  },
  children: [
    {
      componentName: 'div',
      componentType: 'native',
      props: {
        className: 'pl24 pb6 pr24 pt24 bgc-fff bshadow',
      },
      children: [
        {
          componentName: 'Form',
          props: {
            'label-width': '100px',
          },
          dataKey: 'form',
          type: 'search',
          children: [
            {
              label: '姓名',
              key: 'trueName',
              children: [
                {
                  componentName: 'Input',
                  props: {
                    placeholder: '请输入',
                    clearable: true,
                    className: 'w-100',
                  },
                },
              ],
            },
            {
              label: '状态',
              key: 'status',
              children: [
                {
                  componentName: 'Select',
                  props: {
                    placeholder: '请选择',
                    clearable: true,
                    className: 'w-100',
                  },
                  options: [
                    { value: '0', label: '审批中' },
                    { value: '1', label: '已通过' },
                    { value: '2', label: '已驳回' },
                  ],
                },
              ],
            },
            {
              label: '创建时间',
              key: 'createTime',
              children: [
                {
                  componentName: 'RangePicker',
                  props: {
                    className: 'w-100',
                  },
                },
              ],
            },
            {
              label: '商品类目',
              key: 'categoryIds',
              children: [
                {
                  componentName: 'Cascader',
                  props: {
                    placeholder: '请选择',
                    clearable: true,
                    className: 'w-100',
                  },
                  options: [
                    {
                      value: 1,
                      label: '鞋',
                      children: [
                        {
                          value: 100,
                          label: '运动鞋',
                          children: [
                            {
                              value: 200,
                              label: '篮球鞋',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              label: '商品名称',
              key: 'productName',
              children: [
                {
                  componentName: 'AutoComplete',
                  props: {
                    placeholder: '请输入',
                    clearable: true,
                    className: 'w-100',
                  },
                  options: [],
                  onSearch: `function handleSearchText(searchText) {
                    // this.queryProductName(searchText);
                    // this.productNameOptions = []
                  }`,
                  onSelect: `function handleSelect(data) {
                    // this.productName = data;
                  }`,
                },
              ],
            },
            {
              label: '',
              children: [
                {
                  componentName: 'Button',
                  props: {
                    type: 'default',
                  },
                  children: '重置',
                  onClick: `function handleReset() {
                    this.pagination.currentPage = 1;
                    this.form = {};
                    this.queryList();
                  }`,
                },
                {
                  componentName: 'Button',
                  props: {
                    type: 'primary',
                  },
                  children: '查询',
                  onClick: `function handleSearch() {
                    this.pagination.currentPage = 1;
                    this.queryList();
                  }`,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      componentName: 'div',
      componentType: 'native',
      props: {
        className: 'pl24 pr24 pb24 mt24 bgc-fff bshadow',
      },
      children: [
        {
          componentName: 'div',
          componentType: 'native',
          props: {
            className: 'df aic jcsb lh50',
          },
          isEdit: true,
          children: [
            {
              componentName: 'div',
              componentType: 'native',
              props: {
                className: 'mb12 fs16 fw700',
              },
              children: '商品管理列表',
            },
            {
              componentName: 'div',
              componentType: 'native',
              props: {
                className: 'df aic',
              },
              children: [
                {
                  componentName: 'Button',
                  props: {
                    type: 'text',
                  },
                  children: [
                    {
                      componentName: 'i',
                      componentType: 'native',
                      props: {
                        className: 'el-extra-icon-export',
                      },
                    },
                    {
                      componentName: 'span',
                      componentType: 'native',
                      props: {},
                      children: '导出结果',
                    },
                  ],
                  onClick: 'function handleExport() {}',
                },
                {
                  componentName: 'Divider',
                  props: {
                    direction: 'vertical',
                  },
                },
                {
                  componentName: 'Button',
                  props: {
                    type: 'text',
                  },
                  children: [
                    {
                      componentName: 'i',
                      componentType: 'native',
                      props: {
                        className: 'el-extra-icon-import',
                      },
                    },
                    {
                      componentName: 'span',
                      componentType: 'native',
                      props: {},
                      children: '批量导入',
                    },
                  ],
                  onClick: 'function handleUpload() {}',
                },
                {
                  componentName: 'Divider',
                  props: {
                    direction: 'vertical',
                  },
                },
                {
                  componentName: 'Button',
                  props: {
                    type: 'text',
                  },
                  children: [
                    {
                      componentName: 'i',
                      componentType: 'native',
                      props: {
                        className: 'el-icon-download',
                      },
                    },
                    {
                      componentName: 'span',
                      componentType: 'native',
                      props: {},
                      children: '下载模版',
                    },
                  ],
                  onClick: 'function downloadTemplate() {}',
                },
                {
                  componentName: 'Divider',
                  props: {
                    direction: 'vertical',
                  },
                },
                {
                  componentName: 'Button',
                  props: {
                    type: 'primary',
                  },
                  onClick: 'function handleCreate() {}',
                  children: [
                    {
                      componentName: 'i',
                      componentType: 'native',
                      props: {
                        className: 'el-icon-plus',
                      },
                    },
                    {
                      componentName: 'span',
                      componentType: 'native',
                      props: {},
                      children: '新增',
                    },
                  ],
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
              renderKey: `renderDefault`,
            },
            {
              key: 'orderNo',
              label: '订单号',
              minWidth: 120,
              renderKey: `renderDefault`,
            },
            {
              key: 'trueName',
              label: '姓名',
              minWidth: 100,
              renderKey: `renderDefault`,
            },
            {
              key: 'amount',
              label: '订单金额',
              minWidth: 100,
              renderKey: `renderAmount`,
            },
            {
              key: 'status',
              label: '校验状态',
              minWidth: 100,
              renderKey: `renderDefault`,
            },
            {
              key: 'createTime',
              label: '创建时间',
              minWidth: 180,
              renderKey: 'renderTime',
            },
            {
              key: 'action',
              label: '操作',
              minWidth: 100,
              fixed: 'right',
              renderKey: `renderOperate`,
              children: [
                {
                  componentName: 'div',
                  componentType: 'native',
                  props: {},
                  children: [
                    {
                      componentName: 'Button',
                      props: {
                        type: 'text',
                      },
                      children: '查看',
                      onClick: `function handleView(row) {}`,
                    },
                    {
                      componentName: 'Divider',
                      props: {
                        direction: 'vertical',
                      },
                    },
                    {
                      componentName: 'Button',
                      props: {
                        type: 'text',
                      },
                      children: '编辑',
                      onClick: `function handleEdit(row) {}`,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          componentName: 'div',
          componentType: 'native',
          props: {},
          isEdit: true,
          children: [
            {
              componentName: 'Pagination',
              props: {
                className: 'mt24 tar',
              },
              dataKey: 'pagination',
              onPageChange: `function handleCurrentChange(val) {
                this.pagination.currentPage = val;
                this.queryList();
              }`,
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
  },
  lifeCycle: {
    mounted: `function mounted() {
      this.queryList();
    }`,
  },
  methods: {
    queryList: `async function queryList() {
      const params = Object.assign({}, this.form, {
        pageSize: this.pagination.pageSize,
        page: this.pagination.currentPage,
      })
      deleteEmptyParam(params)
      const res = await API.queryList(params)
      if (res.code === 200 && res.data) {
        this.list = res.data.list
        this.pagination.total = res.data.total
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
    queryList: `function queryList(params) {
      return UmiRequest.request({
        method: 'POST',
        url: '/api/v1/h5/oversea/backend/product/productList',
        data: params
      })
    }`,
  },
};

export { DSL };
