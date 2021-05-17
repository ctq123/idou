/**
 * 所有组件dsl片段
 * 用于生成源码
 */
const ComponentsDSL = {
  Input: {
    componentName: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
  Select: {
    componentName: 'Select',
    props: {
      placeholder: '请选择',
    },
    options: [
      { value: '0', label: '审批中' },
      { value: '1', label: '已通过' },
      { value: '2', label: '已驳回' },
    ],
  },
  RangePicker: {
    componentName: 'RangePicker',
    props: {
      placeholder: ['开始日期', '结束日期'],
    },
  },
  AutoComplete: {
    componentName: 'AutoComplete',
    props: {
      placeholder: '请输入',
    },
    options: [],
    onSearch: `function handleSearchText(searchText) {
      this.queryProductName(searchText);
      this.productNameOptions = []
    }`,
    onSelect: `function handleSelect(data) {
      this.productName = data;
    }`,
  },
  Button: {
    componentName: 'Button',
    props: {
      type: 'primary',
    },
    children: '确定',
    onClick: `function search() {

    }`,
  },
  Form: {
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
            props: {
              placeholder: '请输入',
            },
          },
        ],
      },
    ],
  },
  Table: {
    componentName: 'Table',
    props: {},
    dataKey: 'list',
    children: [
      {
        key: 'id',
        label: '序号',
        minWidth: 100,
      },
    ],
  },
  Pagination: {
    componentName: 'Pagination',
    props: {},
    onPageChange: `function handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.queryList();
    }`,
  },
};

/**
 * 组件名称，dsl片段
 * 用于显示
 */
const componentList = [
  { name: '输入框', componentDSL: ComponentsDSL['Input'] },
  { name: '选择器', componentDSL: ComponentsDSL['Select'] },
  { name: '日期范围', componentDSL: ComponentsDSL['RangePicker'] },
  { name: '自动完成', componentDSL: ComponentsDSL['AutoComplete'] },
  { name: '按钮', componentDSL: ComponentsDSL['Button'] },
  { name: '表单', componentDSL: ComponentsDSL['Form'] },
  { name: '表格', componentDSL: ComponentsDSL['Table'] },
  { name: '分页', componentDSL: ComponentsDSL['Pagination'] },
];

/**
 * form表单中的组件
 */
const FormComponentObj = {
  Input: ComponentsDSL['Input'],
  Select: ComponentsDSL['Select'],
  RangePicker: ComponentsDSL['RangePicker'],
  AutoComplete: ComponentsDSL['AutoComplete'],
};

export { componentList, ComponentsDSL, FormComponentObj };
