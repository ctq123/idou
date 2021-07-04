/**
 * 组件DSL片段
 * key: 只是用于标记它的唯一性，获取对应的dsl片段，并无其他作用
 * componentDSL是用于生成源码的dsl片段
 */
const componentList: any = [
  {
    key: 'du-input',
    name: '输入框',
    componentDSL: {
      componentName: 'Input',
      props: {
        placeholder: '请输入',
        clearable: true,
        className: 'w-100',
      },
    },
  },
  {
    key: 'du-inputNumber',
    name: '数字输入框',
    componentDSL: {
      componentName: 'InputNumber',
      props: {
        placeholder: '请输入',
        clearable: true,
        className: 'w-100',
      },
    },
  },
  {
    key: 'du-select',
    name: '选择器',
    componentDSL: {
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
  },
  {
    key: 'du-rangePicker',
    name: '日期范围',
    componentDSL: {
      componentName: 'RangePicker',
      props: {
        className: 'w-100',
      },
    },
  },
  {
    key: 'du-radioGroup',
    name: '单选框',
    componentDSL: {
      componentName: 'RadioGroup',
      props: {
        placeholder: '请选择',
        clearable: true,
        className: 'w-100',
      },
      options: [
        { value: '选项1', label: '选项1' },
        { value: '选项2', label: '选项2' },
      ],
    },
  },
  {
    key: 'du-cascader',
    name: '级联选择',
    componentDSL: {
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
  },
  {
    key: 'du-autoComplete',
    name: '自动完成',
    componentDSL: {
      componentName: 'AutoComplete',
      props: {
        placeholder: '请输入',
        clearable: true,
        className: 'w-100',
      },
      options: [],
      onSearch: `function handleSearchText(searchText) {}`,
      onSelect: `function handleSelect(data) {}`,
    },
  },
  {
    key: 'du-button',
    name: '按钮',
    componentDSL: {
      componentName: 'Button',
      props: {
        type: 'primary',
      },
      children: '确定',
      onClick: `function handleSearch() {}`,
    },
  },
  {
    key: 'du-form',
    name: '编辑表单',
    componentDSL: {
      componentName: 'Form',
      props: {
        'label-width': '130px',
      },
      dataKey: 'form',
      children: [
        {
          label: '名称',
          key: 'name',
          children: [
            {
              componentName: 'Input',
              props: {
                placeholder: '请输入',
                clearable: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    key: 'du-searchform',
    name: '搜索表单',
    componentDSL: {
      componentName: 'Form',
      props: {
        'label-width': '100px',
      },
      dataKey: 'form',
      type: 'search',
      children: [
        {
          label: '名称',
          key: 'name',
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
  },
  {
    key: 'du-table',
    name: '普通表格',
    componentDSL: {
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
      ],
    },
  },
  {
    key: 'du-editTable',
    name: '编辑表格',
    componentDSL: {
      componentName: 'Table',
      props: {
        size: 'small',
        border: true,
      },
      type: 'editTable',
      dataKey: 'dataList',
      onSelectionChange: `function handleSelectionChange(rows) {
        this.multipleSelection = rows
      }`,
      children: [
        {
          key: 'id',
          label: '序号',
          minWidth: 100,
        },
        {
          label: '名称',
          key: 'name',
          children: [
            {
              componentName: 'Input',
              props: {
                placeholder: '请输入名称',
                clearable: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    key: 'du-pagination',
    name: '分页',
    componentDSL: {
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
  },
  {
    key: 'du-crumbBack',
    name: '返回模块',
    componentDSL: {
      componentName: 'CrumbBack',
      props: {},
      isEdit: true,
      children: 'XX编辑',
      onClick: `function handleGoBack() {
        this.$router.go(-1);
      }`,
    },
  },
  {
    key: 'du-baseInfo',
    name: '基本信息模块',
    componentDSL: {
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
          children: 'XX信息',
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
              key: 'code',
              label: '单号',
              renderKey: `renderDefault`,
            },
            {
              span: 8,
              key: 'status',
              label: '状态',
              renderKey: `renderEnum`,
              enumObj: {
                1: '成功',
                2: '失败',
              },
            },
            {
              span: 8,
              key: 'address',
              label: '地址',
              renderKey: `renderEllipsis`,
            },
          ],
        },
      ],
    },
  },
];

/**
 * 根据限制获取对应的组件集合
 * @param childArr
 * @param arr
 * @returns
 */
const getValidComponents = (childArr = [], arr = []) => {
  return childArr
    .map((k) => arr.find((item: any) => item.key === k))
    .filter(Boolean);
};

const ComponentsDSL: any = {};
componentList.forEach((item: any) => {
  ComponentsDSL[item.key] = item.componentDSL;
});

/**
 * Form表单允许使用的组件
 */
const FormCompList: any = [
  'du-input',
  'du-inputNumber',
  'du-select',
  'du-radioGroup',
  'du-rangePicker',
  'du-cascader',
  'du-autoComplete',
];
const FormComponents = getValidComponents(FormCompList, componentList);

/**
 * Table表单允许使用的组件
 */
const TableCompList: any = ['du-input', 'du-select'];
const TableComponents = getValidComponents(TableCompList, componentList);

/**
 * 允许使用的组件
 */
const ModuleCompList: any = [
  'du-form',
  'du-searchform',
  'du-table',
  'du-editTable',
  'du-pagination',
  'du-crumbBack',
  'du-baseInfo',
];
const ModuleComponents = getValidComponents(ModuleCompList, componentList);

export {
  componentList,
  ComponentsDSL,
  FormComponents,
  TableComponents,
  ModuleComponents,
};
