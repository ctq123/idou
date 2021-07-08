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
    size: 'medium',
    // TODO
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
                className: 'fs18 fw600 mr8',
              },
              children: 'XX编辑',
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
          componentName: 'Form',
          props: {
            'label-width': '130px',
          },
          dataKey: 'form',
          children: [
            {
              label: '类型',
              key: 'productType',
              rules: [{ required: true, message: '请选择类型' }],
              children: [
                {
                  componentName: 'RadioGroup',
                  props: {
                    placeholder: '请选择',
                    clearable: true,
                    className: 'w-100',
                  },
                  // type: 'button',
                  options: [
                    { value: '进口', label: '进口' },
                    { value: '非进口', label: '非进口' },
                  ],
                },
              ],
            },
            {
              label: '名称',
              key: 'name',
              rules: [
                { required: true, message: '请输入名称' },
                { max: 10, message: '长度最大10个字符' },
              ],
              children: [
                {
                  componentName: 'Input',
                  props: {
                    placeholder: '请输入名称',
                    clearable: true,
                    className: 'w-100',
                  },
                },
              ],
            },
            {
              label: '数量',
              key: 'amount',
              children: [
                {
                  componentName: 'InputNumber',
                  props: {
                    placeholder: '请输入数量',
                    className: 'w-100',
                    ':style': "{width: '100%'}",
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
              label: '预约时间',
              key: 'limitTime',
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
              label: '联系人',
              key: 'contactName',
              children: [
                {
                  componentName: 'Input',
                  props: {
                    placeholder: '请输入联系人',
                    clearable: true,
                    className: 'w-100',
                  },
                },
              ],
            },
            {
              label: '手机号',
              key: 'phone',
              children: [
                {
                  componentName: 'Input',
                  props: {
                    placeholder: '请输入手机号',
                    clearable: true,
                    className: 'w-100',
                  },
                },
              ],
            },
            {
              label: '联系地址',
              key: 'address',
              children: [
                {
                  componentName: 'Input',
                  props: {
                    placeholder: '请输入联系地址',
                    clearable: true,
                    className: 'w-100',
                  },
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
        slot: 'footer',
        className: 'df aic jcfe right',
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
            this.detailModalShow=false
          }`,
        },
        {
          componentName: 'Button',
          props: {
            type: 'primary',
            className: 'ml8',
          },
          children: '确定',
          onClick: `async function handleSubmit() {
            const valid = await this.$refs['form'].validate()
            if (!valid) {
              return
            }
            const params = { ...this.form }
            deleteEmptyParam(params)
            await API.updateRecord(params, this)
          }`,
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
      span: 16,
    },
    form: {},
    loading: false,
    submitLoading: false,
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
  methods: {
    getRecordDetail: `async function getRecordDetail() {
      const params = { id: this.recordId }
      const { code, data } = await API.getRecordDetail(params)
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
    updateRecord: `function updateRecord(params, vm) {
      return UmiRequest.request({
        method: 'POST',
        url: '/api/v1/h5/oversea/backend/product/update',
        data: params,
        vm,
        loading: 'submitLoading'
      })
    }`,
    getRecordDetail: `function getRecordDetail(params) {
      return UmiRequest.request({
        method: 'POST',
        url: '/api/v1/h5/oversea/backend/product/detail',
        data: params,
      })
    }`,
  },
};

export { DSL };
