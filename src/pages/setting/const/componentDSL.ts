/**
 * 组件DSL片段
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
    props: {},
  },
  Cascader: {
    componentName: 'Cascader',
    props: {
      placeholder: '请选择',
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

// /**
//  * element-ui的前缀
//  */
// const elementUI = 'el-'

// /**
//  * 组件-源码名称映射表
//  */
// const componentNameMap = Object.keys(ComponentsDSL).map((k: string) => {
//   let uiName = elementUI + k.toLowerCase()
//   if (['RangePicker'].includes(k)) {
//     uiName = 'el-date-picker'
//   }
//   return { uiName };
// });

/**
 * 注册的组件名称
 */
const componentNames = {
  Input: '输入框',
  Select: '选择器',
  RangePicker: '日期范围',
  Cascader: '级联选择',
  AutoComplete: '自动完成',
  Button: '按钮',
  Form: '表单',
  Table: '表格',
  Pagination: '分页',
};

/**
 * 注册的组件列表
 */
const componentList = Object.entries(componentNames).map(([k, v]) => {
  // @ts-ignore
  return { key: k, name: v, componentDSL: ComponentsDSL[k] };
});

/**
 * Form表单允许使用的组件
 */
const FormComponentObj = {
  Input: ComponentsDSL['Input'],
  Select: ComponentsDSL['Select'],
  RangePicker: ComponentsDSL['RangePicker'],
  Cascader: ComponentsDSL['Cascader'],
  AutoComplete: ComponentsDSL['AutoComplete'],
};

export { componentList, ComponentsDSL, FormComponentObj };
