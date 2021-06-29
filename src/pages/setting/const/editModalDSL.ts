/*
 * @Author: chengtianqing
 * @Date: 2021-06-29 01:19:08
 * @LastEditTime: 2021-06-30 02:07:10
 * @LastEditors: chengtianqing
 * @Description:
 */
const DSL = {
  componentName: 'Modal',
  type: 'editModal',
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
            className: 'df aic left',
          },
          isEdit: true,
          children: [
            {
              componentName: 'SPAN',
              componentType: 'native',
              props: {
                className: 'fs18 fw600',
              },
              children: 'XX编辑',
            },
          ],
        },
      ],
    },
    {
      componentName: 'SECTION',
      componentType: 'native',
      props: {},
      children: [
        {
          componentName: 'Form',
          props: {
            'label-width': '130px',
          },
          dataKey: 'form',
          children: [
            {
              label: '实际货号',
              key: 'actualArticleNumber',
              children: [
                {
                  componentName: 'Input',
                  props: {
                    placeholder: '请输入实际货号',
                    clearable: true,
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
                    placeholder: '请选择状态',
                    clearable: true,
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
                  props: {},
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
        className: 'df aic fe right',
      },
      isEdit: true,
      children: [
        {
          componentName: 'Button',
          props: {
            type: 'default',
          },
          children: '取消',
          onClick: `function handleCancel() {
            
          }`,
        },
        {
          componentName: 'Button',
          props: {
            type: 'primary',
            className: 'ml8',
          },
          children: '确定',
          onClick: `function handleSubmit() {
            
          }`,
        },
      ],
    },
  ],
  dataSource: {
    colProps: {
      span: 16,
    },
    form: {},
    loading: false,
    detailModalShow: false,
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
