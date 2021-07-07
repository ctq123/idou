/*
 * @Author: chengtianqing
 * @Date: 2021-06-14 01:33:29
 * @LastEditTime: 2021-06-27 02:49:10
 * @LastEditors: chengtianqing
 * @Description:
 */
import React, { Fragment, useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, Tooltip, message } from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FormOutlined,
  EditOutlined,
} from '@ant-design/icons';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import isEqual from 'lodash/isEqual';
import CodeDrawer from '../codeEditor/CodeDrawer';
// import CodeModal from '../codeEditor/CodeModal';
import OptionModal from './OptionModal';
import { getUid } from '@/utils';
import {
  FormComponents,
  TableComponents,
  ComponentsDSL,
} from '../../const/componentDSL';
import styles from './Setting.less';
interface IProps {
  VueTableRenderXML?: any;
  component?: any;
  handleCB?: any;
}

const { Option } = Select;
const colRenderObj: any = {
  renderTime: '时间',
  renderAmount: '金额',
  renderEnum: '状态',
  renderEllipsis: '超长文本',
  renderCustom: '自定义',
  renderOperate: '操作',
  renderDefault: '默认',
};

const defaultSelectOptions: any = { '1': '成功', '2': '失败' };

const Setting = (props: IProps) => {
  // console.log('props', props);
  const { componentName, children, uuid, type, dataKey } =
    props.component || {};
  const [visible, setVisible] = useState(false);
  const [codeType, setCodeType] = useState('component') as any;
  const [codeValue, setCodeValue] = useState('');
  const [codeKey, setCodeKey] = useState(-1);
  const [initValues, setInitValues] = useState({});
  const [modalProps, setModalProps] = useState({
    value: [] as any,
    visible: false,
    contentType: '',
  });
  const [form] = Form.useForm();
  useEffect(() => {
    const getInitialValue = () => {
      switch (componentName) {
        case 'Row':
        case 'Table':
          return (children || [])
            .map((item: any) => {
              if (item.key) {
                const obj: any = { ...item };
                obj['renderKey'] = item.render
                  ? 'renderCustom'
                  : item.renderKey || 'renderDefault';

                if (Array.isArray(item.children) && item.children.length) {
                  const name = item.children[0].componentName || '';
                  obj['type'] =
                    'du-' + name[0].toLowerCase() + name.substring(1);
                  obj['children'] = item.children;
                }
                if (componentName === 'Table') {
                  obj['objKey'] = 'row';
                  colRenderObj['renderOperate'] = '操作';
                } else {
                  obj['objKey'] = dataKey;
                  delete colRenderObj['renderOperate'];
                }
                return obj;
              }
              return null;
            })
            .filter(Boolean);
        case 'div':
        case 'CrumbBack':
          return Array.isArray(children)
            ? children
                .map((item: any, i: number) => {
                  if (typeof item.children === 'string') {
                    return {
                      oldIndex: i,
                      children: item.children,
                    };
                  }
                  return null;
                })
                .filter(Boolean)
            : [{ children: children }];
        case 'Form':
        default:
          let nodes = children;
          if (componentName !== 'Form') {
            nodes = [props.component];
          }
          // console.log("nodes", nodes)
          return (nodes || [])
            .map((item: any) => {
              if (item.key) {
                const obj: any = {
                  key: item.key,
                  label: item.label,
                };
                if (Array.isArray(item.children) && item.children.length) {
                  const name = item.children[0].componentName || '';
                  obj['type'] =
                    'du-' + name[0].toLowerCase() + name.substring(1);
                  obj['children'] = item.children;
                }
                return obj;
              }
              return null;
            })
            .filter(Boolean);
      }
    };
    const configs = getInitialValue();
    form.setFieldsValue({
      configs,
    });
    setInitValues(configs);
  }, [uuid]);

  const handleShowCode = (codeType: string, index: number = 0) => {
    console.log('handleShowCode', codeType);
    if (codeType === 'component') {
      if (index === -1) {
        const configs = form.getFieldValue('configs');
        if (!isEqual(initValues, configs)) {
          message.warning('内容已更改，请先提交再操作');
          return;
        }
        setCodeValue(props.component);
      } else {
        const configs = form.getFieldValue('configs');
        const { label, key, type, children: child } = configs[index];
        if (!type) return;
        const target = {
          ...children[index],
          label,
          key,
          children: child,
        };
        setCodeValue(target);
      }
    } else if (codeType === 'html') {
      // 自定义渲染函数
      const configs = form.getFieldValue('configs');
      const target = configs[index];
      const { renderKey, key, objKey } = target;
      let rkey = renderKey;
      let value = '';
      if (rkey === 'renderCustom' && target.render) {
        value = target.render;
      } else {
        if (!props.VueTableRenderXML[rkey]) rkey = 'renderDefault';
        value = props.VueTableRenderXML[rkey](key, objKey);
      }
      setCodeValue(value);
    }
    setCodeKey(index);
    setCodeType(codeType);
    setVisible(true);
  };

  const handleCodeCB = (obj: any) => {
    const { visible, code } = obj;
    let newCode = code;
    setVisible(visible);
    if (props.component && !isEmpty(code)) {
      if (codeKey > -1) {
        if (codeType === 'html') {
          children[codeKey].render = code;
          newCode = props.component;
        } else if (codeType === 'component') {
          // 改变原数据component.children
          children.splice(codeKey, 1, code);
          newCode = props.component;
        }
      }
      newCode['uuid'] = getUid(); // 更新uuid，让监听uuid变化的组件都能同步更新
      props.handleCB && props.handleCB(newCode);
    }
  };

  const handleModalCB = (obj: any) => {
    const { visible, list } = obj;
    console.log('list', list);
    setModalProps({
      visible: visible,
      value: {},
      contentType: '',
    });
    const configs = form.getFieldValue('configs');
    if (modalProps.contentType === 'changeOptions') {
      if (codeKey > -1) {
        configs[codeKey].children[0].options = (list || []).map(
          ({ key = '', label = '' }: any) => ({ value: key, label: label }),
        );
      }
    } else {
      const enumObj: any = {};
      (list || []).forEach(({ key = '', label = '' }: any) => {
        enumObj[key] = label;
      });
      if (codeKey > -1) {
        configs[codeKey].enumObj = enumObj;
        form.setFieldsValue(configs);
      }
    }
  };

  const handleTypeChange = (comType: any, i: number) => {
    console.log('handleTypeChange comType', comType);
    const configs = form.getFieldValue('configs');
    if (comType) {
      // @ts-ignore
      const obj = { ...ComponentsDSL[comType] };
      configs[i].children = [obj];
      if (['du-select', 'du-radioGroup'].includes(comType)) {
        setCodeKey(i);
        setModalProps({
          visible: true,
          // @ts-ignore
          value: []
            .concat(obj.options)
            .map(({ value, label }) => ({ key: value, label })),
          contentType: 'changeOptions',
        });
      }
    } else {
      configs[i].children = undefined;
    }
  };

  const handleRenderChange = (comType: any, i: number) => {
    console.log('handleRenderChange comType', comType);
    const configs = form.getFieldValue('configs');
    console.log('configs', configs);
    if (comType === 'renderEnum') {
      const value = configs[i].enumObj || defaultSelectOptions;
      setCodeKey(i);
      setModalProps({
        visible: true,
        value: Object.entries(value).map(([k, v]) => ({ key: k, label: v })),
        contentType: 'renderEnum',
      });
    }
  };

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
    const { configs } = values || {};
    if (configs) {
      const component = cloneDeep(props.component);
      switch (componentName) {
        case 'Row':
        case 'Table':
          let tableChild = [];
          if (configs.length) {
            tableChild = configs.map((item: any, i: number) => {
              const obj: any = { ...item };
              if (
                obj.render === undefined ||
                (item.renderKey !== 'renderCustom' && obj.render)
              ) {
                delete obj.render;
              }
              if (item.renderKey !== 'renderEnum' && obj.enumObj) {
                delete obj.enumObj;
              }
              if (obj.objKey) {
                delete obj.objKey;
              }
              if (componentName === 'Row') {
                if (obj.span === undefined) {
                  obj.span = 8;
                }
              }
              if (componentName === 'Table') {
                if (obj.minWidth === undefined) {
                  obj.minWidth = 100;
                }
              }
              return obj;
            });
          }
          component.children = tableChild;
          break;
        case 'Form':
          // 先剔除按钮
          const tIndex = component.children.findIndex((it: any) => !it.key);
          const optItem =
            tIndex > -1 ? component.children.splice(tIndex, 1) : [];

          let formChild = [];
          if (configs.length) {
            formChild = configs.map((item: any, i: number) => {
              const { key, label, children: child } = item;
              const obj: any = { key, label };
              if (child) {
                obj['children'] = child;
              }
              return obj;
            });
          }
          component.children = [].concat(formChild, optItem);
          break;
        case 'div':
        case 'CrumbBack':
          if (configs.length) {
            configs.forEach((item: any) => {
              if (item.oldIndex !== undefined) {
                component.children[item.oldIndex] = {
                  ...component.children[item.oldIndex],
                  children: item.children,
                };
              } else {
                component.children = item.children;
              }
            });
          }
          break;
        default:
          if (configs.length) {
            component['key'] = configs[0].key;
            component['label'] = configs[0].label;
            component['children'] = configs[0].children;
          }
          break;
      }
      component['uuid'] = getUid(); // 更新uuid，让监听uuid变化的组件都能同步更新
      props.handleCB && props.handleCB(component);
      message.success('更新成功！');
    }
  };

  const generateFormItem = (fields: any, remove: any, move: any, add: any) => {
    // console.log('fields', fields);
    const prefix = dataKey
      ? componentName === 'Table'
        ? `row.`
        : `${dataKey}.`
      : undefined;
    switch (componentName) {
      case 'Row':
      case 'Table':
        return (
          <>
            {fields.map((field: any, i: number) => (
              <div key={field.key} className={styles['list-item']}>
                <Space align="baseline">
                  <Form.Item
                    {...field}
                    style={{ width: 140 }}
                    name={[field.name, 'label']}
                    fieldKey={[field.fieldKey, 'label']}
                    rules={[{ required: true, message: '请输入label' }]}
                  >
                    <Input placeholder="label" allowClear />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'key']}
                    fieldKey={[field.fieldKey, 'key']}
                    rules={[{ required: true, message: '请输入key' }]}
                  >
                    <Input addonBefore={prefix} placeholder="key" allowClear />
                  </Form.Item>
                </Space>
                <Space align="baseline">
                  {type === 'editTable' ? (
                    <Form.Item
                      {...field}
                      name={[field.name, 'type']}
                      fieldKey={[field.fieldKey, 'type']}
                      rules={[{ required: false, message: '请选择渲染类型' }]}
                    >
                      <Select
                        style={{ width: 140 }}
                        placeholder="渲染类型"
                        allowClear
                        onChange={(val) => handleTypeChange(val, i)}
                      >
                        {TableComponents.map((item: any) => (
                          <Option key={item.key} value={item.key}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      {...field}
                      name={[field.name, 'renderKey']}
                      fieldKey={[field.fieldKey, 'renderKey']}
                      rules={[{ required: true, message: '请选择渲染类型' }]}
                    >
                      <Select
                        style={{ width: 140 }}
                        placeholder="渲染类型"
                        allowClear
                        onChange={(val) => handleRenderChange(val, i)}
                      >
                        {Object.entries(colRenderObj).map(([k, v]: any) => (
                          <Option key={k} value={k}>
                            {v}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                  <Form.Item>
                    <Button
                      type="link"
                      size="small"
                      icon={<ArrowUpOutlined />}
                      onClick={() => move(i, i - 1)}
                    />
                    <Button
                      type="link"
                      size="small"
                      icon={<ArrowDownOutlined />}
                      onClick={() => move(i, i + 1)}
                    />
                    <Button
                      type="link"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                    />
                    {type === 'editTable' ? null : (
                      <Tooltip title="自定义源码渲染">
                        <Button
                          type="link"
                          icon={<FormOutlined />}
                          onClick={() => handleShowCode('html', i)}
                        ></Button>
                      </Tooltip>
                    )}
                  </Form.Item>
                </Space>
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                style={{ width: '100%' }}
                icon={<PlusOutlined />}
              ></Button>
            </Form.Item>
          </>
        );
      case 'Form':
        return (
          <>
            {fields.map((field: any, i: number) => (
              <div key={field.key} className={styles['list-item']}>
                <Space align="baseline">
                  <Form.Item
                    {...field}
                    style={{ width: 140 }}
                    name={[field.name, 'label']}
                    fieldKey={[field.fieldKey, 'label']}
                    rules={[{ required: true, message: '请输入label' }]}
                  >
                    <Input placeholder="label" allowClear />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'key']}
                    fieldKey={[field.fieldKey, 'key']}
                    rules={[{ required: true, message: '请输入key' }]}
                  >
                    <Input addonBefore={prefix} placeholder="key" allowClear />
                  </Form.Item>
                </Space>
                <Space align="baseline">
                  <Form.Item
                    {...field}
                    name={[field.name, 'type']}
                    fieldKey={[field.fieldKey, 'type']}
                    rules={[{ required: true, message: '请选择类型' }]}
                  >
                    <Select
                      style={{ width: 140 }}
                      placeholder="类型"
                      allowClear
                      onChange={(val) => handleTypeChange(val, i)}
                    >
                      {FormComponents.map((item: any) => (
                        <Option key={item.key} value={item.key}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="link"
                      size="small"
                      icon={<ArrowUpOutlined />}
                      onClick={() => move(i, i - 1)}
                    />
                    <Button
                      type="link"
                      size="small"
                      icon={<ArrowDownOutlined />}
                      onClick={() => move(i, i + 1)}
                    />
                    <Button
                      type="link"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                    />
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleShowCode('component', i)}
                    ></Button>
                  </Form.Item>
                </Space>
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                style={{ width: '100%' }}
                icon={<PlusOutlined />}
              ></Button>
            </Form.Item>
          </>
        );
      case 'div':
      case 'CrumbBack':
        return (
          <>
            {fields.map((field: any, i: number) => (
              <Space key={field.key} align="baseline">
                <Form.Item
                  {...field}
                  name={[field.name, 'children']}
                  fieldKey={[field.fieldKey, 'children']}
                  rules={[{ required: true, message: '请输入文本' }]}
                >
                  <Input placeholder="文本" allowClear />
                </Form.Item>
              </Space>
            ))}
          </>
        );
      default:
        return (
          <>
            {fields.map((field: any, i: number) => (
              <Space key={field.key} align="baseline">
                <Form.Item
                  {...field}
                  style={{ width: 140 }}
                  name={[field.name, 'label']}
                  fieldKey={[field.fieldKey, 'label']}
                  rules={[{ required: true, message: '请输入label' }]}
                >
                  <Input placeholder="label" allowClear />
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, 'key']}
                  fieldKey={[field.fieldKey, 'key']}
                  rules={[{ required: true, message: '请输入key' }]}
                >
                  <Input addonBefore={prefix} placeholder="key" allowClear />
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.type !== curValues.type
                  }
                >
                  {() => (
                    <Form.Item
                      {...field}
                      name={[field.name, 'type']}
                      fieldKey={[field.fieldKey, 'type']}
                      rules={[{ required: true, message: '请选择类型' }]}
                    >
                      <Select
                        style={{ width: 140 }}
                        placeholder="类型"
                        allowClear
                        onChange={(val) => handleTypeChange(val, i)}
                      >
                        {FormComponents.map((item: any) => (
                          <Option key={item.key} value={item.key}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </Form.Item>
              </Space>
            ))}
          </>
        );
    }
  };

  return (
    <>
      <Form
        form={form}
        size="small"
        className={styles['setting-container']}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
      >
        <Form.List name="configs">
          {(fields, { add, remove, move }) => (
            <>{generateFormItem(fields, remove, move, add)}</>
          )}
        </Form.List>
        {props.component && (
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              type="primary"
              danger
              onClick={() => handleShowCode('component', -1)}
            >
              编辑
            </Button>
          </Form.Item>
        )}
      </Form>
      <CodeDrawer
        value={codeValue}
        visible={visible}
        type={codeType}
        handleCB={(val: any) => handleCodeCB(val)}
      />
      <OptionModal {...modalProps} handleCB={(v: any) => handleModalCB(v)} />
    </>
  );
};

// Setting.whyDidYouRender = {
//   logOnDifferentValues: true
// }

export default React.memo(Setting);
