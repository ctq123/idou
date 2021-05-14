import React, { useEffect } from 'react';
import { Form, Input, Button, Space, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import cloneDeep from 'lodash/cloneDeep';
import { v1 } from 'uuid';

interface IProps {
  component?: any;
  handleCB?: any;
}

const { Option } = Select;

const components: any = {
  Form: ['Input', 'Select'],
};

const Setting = (props: IProps) => {
  console.log('props', props);
  const { componentName, children, uuid } = props.component || {};
  const [form] = Form.useForm();
  useEffect(() => {
    const getInitialValue = () => {
      switch (componentName) {
        case 'Table':
          return (children || [])
            .map((item: any) => {
              if (item.key) {
                return { key: item.key, label: item.label };
              }
              return null;
            })
            .filter(Boolean);
        case 'Form':
        default:
          let nodes = children;
          if (componentName !== 'Form') {
            nodes = [props.component];
          }
          return (nodes || [])
            .map((item: any) => {
              if (item.key) {
                return {
                  key: item.key,
                  label: item.label,
                  type: item?.children[0]?.componentName,
                };
              }
              return null;
            })
            .filter(Boolean);
      }
    };
    form.setFieldsValue({
      configs: getInitialValue(),
    });
  }, [uuid]);

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
    const { configs } = values || {};
    if (configs) {
      const component = cloneDeep(props.component);
      switch (componentName) {
        case 'Table':
          let tableChild = [];
          if (configs.length) {
            // const optItem = component.children
            tableChild = configs.map((item: any, i: number) => {
              return { uuid: v1(), key: item.key, label: item.label };
            });
          }
          component.children = tableChild;
          break;
        case 'Form':
          const tIndex = component.children.findIndex((it: any) => !it.key);
          const optItem =
            tIndex > -1 ? component.children.splice(tIndex, 1) : [];
          let formChild = [];
          if (configs.length) {
            formChild = configs.map((item: any, i: number) => {
              return {
                uuid: v1(),
                key: item.key,
                label: item.label,
                children: [{ componentName: item.type, props: {}, uuid: v1() }],
              };
            });
          }
          component.children = [].concat(formChild, optItem);
          break;
        default:
          if (configs.length) {
            component['key'] = configs[0].key;
            component['label'] = configs[0].label;
            component['children'][0]['componentName'] = configs[0].type;
          }
          break;
      }
      props.handleCB && props.handleCB(component);
    }
  };

  const generateFormItem = (field: any) => {
    switch (componentName) {
      case 'Table':
        return (
          <>
            <Form.Item
              {...field}
              name={[field.name, 'label']}
              fieldKey={[field.fieldKey, 'label']}
              rules={[{ required: true, message: '请输入label' }]}
            >
              <Input placeholder="label" />
            </Form.Item>

            <Form.Item
              {...field}
              name={[field.name, 'key']}
              fieldKey={[field.fieldKey, 'key']}
              rules={[{ required: true, message: '请输入key' }]}
            >
              <Input placeholder="key" />
            </Form.Item>
          </>
        );
      case 'Form':
      default:
        return (
          <>
            <Form.Item
              {...field}
              name={[field.name, 'label']}
              fieldKey={[field.fieldKey, 'label']}
              rules={[{ required: true, message: '请输入label' }]}
            >
              <Input placeholder="label" />
            </Form.Item>

            <Form.Item
              {...field}
              name={[field.name, 'key']}
              fieldKey={[field.fieldKey, 'key']}
              rules={[{ required: true, message: '请输入key' }]}
            >
              <Input placeholder="key" />
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
                  <Select style={{ width: 130 }} placeholder="类型">
                    {(components['Form'] || []).map((item: any) => (
                      <Option key={item} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Form.Item>
          </>
        );
    }
  };

  return (
    <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish}>
      <Form.List name="configs">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space key={field.key} align="baseline">
                {generateFormItem(field)}
                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              ></Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Setting;
