import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface IProps {
  value: any;
  visible: boolean;
  title?: string;
  handleCB?: any;
}

const CodeModal = (props: IProps) => {
  const { handleCB, title = '选项设置', value = [], visible } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        configs: value,
      });
    }
  }, [visible]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values: any) => {
        // console.log("values", values)
        const { configs } = values || {};
        handleHideCB(configs);
      })
      .catch(() => {});
  };

  const handleHideCB = (configs = null) => {
    if (!configs) {
      configs = form.getFieldValue('configs');
    }
    const list = (configs || []).filter(Boolean);
    handleCB && handleCB({ visible: false, list });
  };

  return (
    <Modal
      title={title}
      visible={props.visible}
      onCancel={() => handleHideCB()}
      onOk={() => handleSave()}
      footer={[
        // <Button key="back" onClick={() => handleClear()}>
        //   清空
        // </Button>,
        <Button key="back" onClick={() => handleHideCB()}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => handleSave()}>
          确定
        </Button>,
      ]}
    >
      <Form form={form} size="small" name="option_modal_form">
        <Form.List name="configs">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field: any, i: number) => (
                <div key={field.key}>
                  <Space align="baseline">
                    <Form.Item
                      {...field}
                      name={[field.name, 'key']}
                      fieldKey={[field.fieldKey, 'key']}
                      defaultValue={i + 1}
                      rules={[{ required: true, message: '请输入值' }]}
                    >
                      <Input placeholder="值" allowClear />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'label']}
                      fieldKey={[field.fieldKey, 'label']}
                      rules={[{ required: true, message: '请输入名称' }]}
                    >
                      <Input placeholder="名称" allowClear />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="link"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      />
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
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default CodeModal;
