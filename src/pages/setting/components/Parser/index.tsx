import React from 'react';
import {
  Button,
  Input,
  Select,
  DatePicker,
  Form,
  Row,
  Col,
  Table,
  Pagination,
} from 'antd';

interface IObject {
  [key: string]: any;
}

interface IComponent {
  componentName: string;
  children?: IComponent[] | any;
  props?: IObject;
  [key: string]: any;
}

interface DSL {
  componentName: string;
  children: IComponent[];
  props?: IObject;
  dataSource?: IObject;
  lifeCycle?: IObject;
  methods?: IObject;
  imports?: IObject;
}

interface Iprops {
  dsl: DSL;
}

const generateComponent = (componentDSL: IComponent) => {
  const { componentName, children, props } = componentDSL;
  switch (componentName) {
    case 'Page':
      const childNodes = (children || []).map((item: any) =>
        generateComponent(item),
      );
      return <div>{childNodes}</div>;
    case 'Form':
      const formNodes = (children || []).map((item: any) => {
        const { key, label, initValue } = item || {};
        const itemProps = {
          name: key,
          label,
          initialValue: initValue,
        };
        const colProps = {
          xs: 24,
          sm: 12,
          lg: 8,
          xl: 8,
        };
        return (
          <Col {...colProps}>
            <Form.Item {...itemProps}>
              {(item.children || []).map((item: any) =>
                generateComponent(item),
              )}
            </Form.Item>
          </Col>
        );
      });
      return (
        <Form onFinish={() => {}} {...props}>
          <Row gutter={24}>{formNodes}</Row>
        </Form>
      );
    case 'Table':
      const columns = (children || []).map((item: any) => {
        return {
          ...item,
          title: item.label,
          dataIndex: item.key,
        };
      });
      return (
        <Table
          columns={columns}
          dataSource={[]}
          pagination={{
            current: 1,
            pageSize: 20,
            total: 0,
            showTotal: (s: any) => `共 ${s} 条`,
            showSizeChanger: false,
          }}
        ></Table>
      );
    case 'Button':
      return <Button {...props}>{children}</Button>;
    default:
      const ComponentName = componentName;
      return <ComponentName {...props}></ComponentName>;
  }
};

const Parser = (props: Iprops) => {
  return generateComponent(props.dsl);
};

export default Parser;
