import React from 'react';
import { Form, Input, Button, Space, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface IProps {
  component?: any;
}

const { Option } = Select;

const components: any = {
  Form: ['Input', 'Select'],
};

const Setting = (props: IProps) => {
  const { componentName = 'Form', children } = props.component || {};
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  return (
    <Form
      form={form}
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.List name="configs">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space key={field.key} align="baseline">
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
                        {(components[componentName] || []).map((item: any) => (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                添加
              </Button>
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
